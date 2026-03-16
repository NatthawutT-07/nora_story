import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertCircle, Eye } from 'lucide-react';
import { db, storage } from '../../firebase';
import { doc, getDoc, serverTimestamp, increment, runTransaction } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { CheckoutProvider, useCheckout } from './CheckoutContext';
import { BuyerInfoStep, TemplateStep, DetailsStep, ImagesStep, PaymentStep, SuccessStep } from './steps';
import LivePreviewModal from './LivePreviewModal';

// Generate random 15-character alphanumeric ID for story URLs
const generateRandomId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 15; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Generate unique story ID (checks for duplicates in Firestore)
const generateUniqueStoryId = async () => {
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
        const newId = generateRandomId();
        const docRef = doc(db, 'orders', newId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return newId;
        }

        attempts++;
    }

    return generateRandomId() + Date.now().toString(36).slice(-3);
};

const CheckoutContent = () => {
    const {
        tier,
        step,
        setStep,
        formData,
        selectedTemplate,
        slipFile,
        contentFiles,
        loading,
        setLoading,
        error,
        setError,
        handleClose,
        needsDetailFields,
        needsTimelineFields,
        getStepLabels,
        getProgressStep,
        getMaxImages,
        isDomainAvailable,
        qrExpired,
        selectedColorTheme
    } = useCheckout();

    const [showExitWarning, setShowExitWarning] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const isSubmittingRef = useRef(false);

    // เช็คความครบถ้วนของขั้นตอนที่ 3 (ไม่รวมเพลง เพราะมีค่าเริ่มต้นเป็นไม่มีเพลง)
    const isStep3Valid = () => {
        if (step !== 3) return true; // ถ้าไม่ใช่ step 3 ถือว่าผ่านไปแล้วหรือยังไม่ถึง
        
        if (needsDetailFields) {
            if (!formData.pin || formData.pin.length !== 4) return false;
            if (!formData.targetName?.trim()) return false;
            if (!formData.message?.trim() || formData.message.length > 100) return false;
        }
        
        if (needsTimelineFields) {
            if (!formData.finaleMessage?.trim()) return false;
        }
        
        return true;
    };

    const attemptClose = () => {
        // Only warn if they've made progress (past step 1) and haven't finished (not step 6)
        // Feel free to adjust the condition
        if (step > 1 && step < 6) {
            setShowExitWarning(true);
        } else {
            handleClose();
        }
    };

    const handleNextStep = () => {
        setError('');

        if (step === 1) {
            // Validate template selection first
            if (!selectedTemplate) {
                setError('กรุณาเลือกธีม');
                return;
            }
            setStep(2);
        } else if (step === 2) {
            // Validate buyer info
            if (!formData.buyerName.trim()) {
                setError('กรุณากรอกชื่อผู้สั่งซื้อ');
                return;
            }
            if (!formData.buyerEmail.trim() || !formData.buyerEmail.includes('@')) {
                setError('กรุณากรอก Email ที่ถูกต้อง');
                return;
            }
            if (!formData.buyerPhone.trim() || formData.buyerPhone.length < 9) {
                setError('กรุณากรอกเบอร์โทรศัพท์');
                return;
            }

            // Check Special Link logic
            if (tier?.wantSpecialLink || tier?.wantCustomLink) {
                if (!formData.customDomain?.trim()) {
                    setError('กรุณาระบุชื่อลิงก์ที่ต้องการ');
                    return;
                }
                if (formData.customDomain.length < 8) {
                    setError('ชื่อลิงก์ต้องมีอย่างน้อย 8 ตัวอักษร');
                    return;
                }
                if (isDomainAvailable !== true) {
                    setError('กรุณาตรวจสอบความว่างของชื่อลิงก์ก่อนทำรายการถัดไป');
                    return;
                }
            }

            setStep(3); // Go to details
        } else if (step === 3) {
            // Validate template details (T1-1 and T2)
            if (needsDetailFields) {
                if (!formData.pin || formData.pin.length !== 4) {
                    setError('กรุณาใส่ PIN 4 หลัก');
                    return;
                }
                if (!formData.targetName.trim()) {
                    setError('กรุณากรอกชื่อคนรับ');
                    return;
                }
                if (!formData.message.trim()) {
                    setError('กรุณากรอกข้อความ');
                    return;
                }
                const maxMsg = 100;
                if (formData.message.length > maxMsg) {
                    setError(`ข้อความต้องไม่เกิน ${maxMsg} ตัวอักษร`);
                    return;
                }
            }
            // Tier 3: Validate timeline fields
            if (needsTimelineFields) {
                // Timelines 1-5 are optional
                if (!formData.finaleMessage?.trim()) {
                    setError('กรุณากรอกข้อความสุดท้าย (ช่อง 5)');
                    return;
                }
            }
            
            // Skip image step if no images needed
            const maxImages = getMaxImages();
            if (maxImages === 0) {
                setStep(5); // Skip to payment
            } else {
                setStep(4); // Go to images
            }
        } else if (step === 4) {
            const maxImages = getMaxImages();
            if (maxImages > 0) {
                const uploadedCount = contentFiles.filter(Boolean).length;
                if (uploadedCount < maxImages) {
                    setError(`กรุณาอัปโหลดรูปภาพให้ครบทั้งหมด ${maxImages} รูป`);
                    return;
                }
            }
            setStep(5); // Go to payment
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmittingRef.current) return;
        if (!slipFile) {
            setError('กรุณาแนบสลิปโอนเงิน');
            return;
        }

        isSubmittingRef.current = true;
        setLoading(true);
        setError('');

        try {
            // 1. Generate unique Story ID or use Custom Domain
            let storyId;
            if (tier?.wantSpecialLink || tier?.wantCustomLink) {
                storyId = formData.customDomain;
            } else {
                storyId = await generateUniqueStoryId();
            }

            // 2 & 3. Upload Slip and Content Images Concurrently
            const slipExt = slipFile.name.split('.').pop();
            const slipName = `${storyId}_${Date.now()}_slip.${slipExt}`;
            const slipRef = ref(storage, `slips/${slipName}`);

            // Compress slip image
            const slipCompressionOptions = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1200,
                useWebWorker: true
            };

            const uploadSlipPromise = async () => {
                const compressedSlipFile = await imageCompression(slipFile, slipCompressionOptions);
                await uploadBytes(slipRef, compressedSlipFile);
                return await getDownloadURL(slipRef);
            };

            const maxUploads = getMaxImages() || contentFiles.length;
            let contentUrls = Array(maxUploads).fill(null);
            const contentUploadPromises = [];

            if (contentFiles.length > 0 || maxUploads > 0) {
                // Compression options for content images
                const contentCompressionOptions = {
                    maxSizeMB: 2, // Allow slightly larger file size for content to preserve quality
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    initialQuality: 0.85
                };

                for (let i = 0; i < maxUploads; i++) {
                    const file = contentFiles[i];
                    if (file) {
                        const uploadPromise = async () => {
                            try {
                                const compressedFile = await imageCompression(file, contentCompressionOptions);
                                const refName = `uploads/${storyId}/${i}_${file.name}`;
                                const imgRef = ref(storage, refName);
                                await uploadBytes(imgRef, compressedFile);
                                const url = await getDownloadURL(imgRef);
                                return { index: i, url };
                            } catch (error) {
                                console.error(`Error compressing/uploading image ${i}:`, error);
                                // Fallback to original file if compression fails
                                const refName = `uploads/${storyId}/${i}_${file.name}`;
                                const imgRef = ref(storage, refName);
                                await uploadBytes(imgRef, file);
                                const url = await getDownloadURL(imgRef);
                                return { index: i, url };
                            }
                        };
                        contentUploadPromises.push(uploadPromise());
                    }
                }
            }

            // Wait for both slip and content images to upload concurrently
            const [slipUrl, uploadResults] = await Promise.all([
                uploadSlipPromise(),
                Promise.all(contentUploadPromises)
            ]);

            if (uploadResults && uploadResults.length > 0) {
                // Place uploaded URLs into their original indices, leaving nulls for empty slots
                uploadResults.forEach(result => {
                    contentUrls[result.index] = result.url;
                });
            }

            // 4. Save Order via Transaction to prevent overwrites
            const orderRef = doc(db, 'orders', storyId);

            await runTransaction(db, async (transaction) => {
                const orderDoc = await transaction.get(orderRef);
                if (orderDoc.exists()) {
                    throw new Error('�����ԧ����١����¡������� ��س����������¡���ա���駴��ª����ԧ�����');
                }

                transaction.set(orderRef, {
                    tier_id: tier.id,
                    tier_name: tier.name,
                    price: tier.price,

                    // Buyer info
                    buyer_name: formData.buyerName,
                    buyer_email: formData.buyerEmail,
                    buyer_phone: formData.buyerPhone,

                    // Tier 1 Template 1 specific
                    pin_code: needsDetailFields ? formData.pin : null,
                    target_name: needsDetailFields ? formData.targetName : null,
                    sign_off: needsDetailFields ? formData.signOff : null,
                    message: needsDetailFields ? formData.message : null,

                    // Tier 3: Timeline data
                    timelines: needsTimelineFields ? formData.timelines : null,
                    finale_message: needsTimelineFields ? formData.finaleMessage : null,
                    finale_sign_off: needsTimelineFields ? formData.finaleSignOff : null,

                    // Special Link / Custom Domain
                    custom_domain: (tier?.wantSpecialLink || tier?.wantCustomLink) ? formData.customDomain : null,
                    want_special_link: !!tier?.wantSpecialLink,
                    want_custom_link: !!tier?.wantCustomLink,
                    link_type: tier?.wantSpecialLink ? 'special' : (tier?.wantCustomLink ? 'custom' : 'random'),

                    selected_template_id: selectedTemplate,
                    template_id: null,
                    slip_url: slipUrl,
                    content_images: contentUrls,
                    music_url: formData.musicUrl || null,
                    color_theme_id: selectedColorTheme?.id || null,
                    status: 'pending',
                    created_at: serverTimestamp(),
                    platform: 'web',
                    story_url: tier?.wantSpecialLink ? `https://${storyId}.norastory.com` : `https://norastory.com/${storyId}`,

                    // Edit tracking
                    text_edits_used: 0,
                    image_edits_used: 0,
                    text_edit_payment_status: null,
                    text_edit_payment_slip_url: null,
                    text_edit_payment_price: null,
                    image_edit_payment_status: null,
                    image_edit_payment_slip_url: null,
                    image_edit_payment_price: null,
                });
            });

            // 5. Update Global User Counter
            try {
                const statsRef = doc(db, 'stats', 'users');
                await runTransaction(db, async (transaction) => {
                    const statDoc = await transaction.get(statsRef);
                    if (!statDoc.exists()) {
                        transaction.set(statsRef, { count: 1 });
                    } else {
                        const newCount = (statDoc.data().count || 0) + 1;
                        transaction.update(statsRef, { count: newCount });
                    }
                });
            } catch (statErr) {
                console.error("Error updating user stats (non-critical):", statErr);
            }

            // 6. Notify Admin via LINE (Google Apps Script Proxy)
            try {
                const gasUrl = import.meta.env.VITE_LINE_NOTIFY_GAS_URL;
                if (gasUrl) {
                    const notifyMessage = `🔔 มีออเดอร์ใหม่เข้า!\nOrder ID: ${storyId}\nแพ็คเกจ: ${tier.name}\nราคา: ${tier.price} บาท\nชื่อผู้ซื้อ: ${formData.buyerName}\nอีเมล: ${formData.buyerEmail}`;
                    fetch(gasUrl, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: notifyMessage })
                    }).catch(e => console.error("LINE Notify Proxy error:", e));
                }
            } catch (err) {
                console.error("Failed to notify LINE admin.", err);
            }

            setStep(6); // Success

        } catch (err) {
            console.error("Error creating order:", err);
            setError('เกิดข้อผิดพลาด: ' + err.message);
        } finally {
            setLoading(false);
            isSubmittingRef.current = false;
        }
    };

    const stepLabels = getStepLabels();


    return (
        <>
            <AnimatePresence>
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={showExitWarning ? undefined : attemptClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white w-full max-w-lg md:max-w-xl min-h-[60vh] max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col"
                    >
                        <button onClick={attemptClose} className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition-colors z-20 bg-white shadow-sm">
                            <X size={20} className="text-gray-500" />
                        </button>

                        {/* Progress Steps (Fixed Header) */}
                        {step < 6 && (
                            <div className="px-4 sm:px-8 pt-8 pb-2 bg-white z-10 pr-12 sm:pr-8">
                                <div className="flex items-center justify-center gap-0">
                                    {stepLabels.map((label, idx) => {
                                        const stepNum = idx + 1;
                                        const isActive = getProgressStep() === stepNum;
                                        const isCompleted = getProgressStep() > stepNum;
                                        return (
                                            <div key={idx} className="flex items-center">
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all duration-300 ${isCompleted ? 'bg-[#1A3C40] text-white' :
                                                        isActive ? 'bg-[#1A3C40] text-white ring-4 ring-[#1A3C40]/10' :
                                                            'bg-gray-100 text-gray-400'
                                                        }`}>
                                                        {isCompleted ? '✓' : stepNum}
                                                    </div>
                                                    <span className={`text-[10px] mt-1.5 whitespace-nowrap ${isActive || isCompleted ? 'text-[#1A3C40] font-medium' : 'text-gray-300'}`}>
                                                        {label}
                                                    </span>
                                                </div>
                                                {idx < stepLabels.length - 1 && (
                                                    <div className={`w-5 sm:w-12 h-[2px] mx-0.5 sm:mx-1 mb-5 transition-colors duration-300 ${getProgressStep() > stepNum ? 'bg-[#1A3C40]' : 'bg-gray-200'
                                                        }`} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Scrollable Content Body */}
                        <div className={`flex-1 overflow-y-auto p-5 sm:p-6 md:p-8 pt-2 md:pt-4 flex flex-col ${step === 6 ? 'justify-center' : 'justify-start'}`}>
                            {/* Success State */}
                            {step === 6 ? (
                                <SuccessStep />
                            ) : (
                                <>
                                    <div className={`text-center ${step === 5 ? 'mb-1' : 'mb-2'}`}>
                                        <h3 className="text-xl font-playfair font-bold text-[#1A3C40] mb-0.5">
                                            {step === 1 ? 'เลือกธีม' :
                                                step === 2 ? 'ข้อมูลผู้สั่งซื้อ' :
                                                    step === 3 ? 'รายละเอียดธีม' :
                                                        step === 4 ? 'อัปโหลดรูปภาพ' : 'ชำระเงิน'}
                                        </h3>
                                        {step === 5 ? (
                                            <div className="mt-1">
                                                <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-0.5">{tier.name}</p>
                                                <p className="text-3xl font-extrabold text-[#1A3C40]">
                                                    ฿{tier.price}<span className="text-base font-normal text-gray-400">.-</span>
                                                </p>
                                                <div className="w-16 h-[2px] bg-[#1A3C40]/10 mx-auto mt-2 rounded-full" />
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 text-xs">{tier.name} — ฿{tier.price}</p>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        {step === 1 && <TemplateStep />}
                                        {step === 2 && <BuyerInfoStep />}
                                        {step === 3 && <DetailsStep />}
                                        {step === 4 && <ImagesStep />}
                                        {step === 5 && <PaymentStep />}

                                        {/* Live Preview Button — visible on step 3+ (after details/images filled) */}
                                        {(step === 3 || step === 4) && selectedTemplate && (
                                            <button
                                                onClick={() => setShowPreviewModal(true)}
                                                disabled={step === 3 && !isStep3Valid()}
                                                className={`w-full py-3 rounded-xl border border-dashed text-sm flex items-center justify-center gap-2 transition-all ${
                                                    step === 3 && !isStep3Valid() 
                                                        ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-[#E8A08A]/10 to-[#1A3C40]/10 border-[#1A3C40]/20 text-[#1A3C40] font-medium hover:from-[#E8A08A]/20 hover:to-[#1A3C40]/20'
                                                }`}
                                            >
                                                <Eye size={16} />
                                                ดูตัวอย่างก่อนจ่ายเงิน
                                            </button>
                                        )}

                                        {error && <div className="text-red-500 text-xs bg-red-50 p-3 rounded-lg flex items-center gap-2"><AlertCircle size={16} />{error}</div>}

                                        <div className="flex gap-3 mt-6 pb-2">
                                            {step > 1 && (
                                                <button
                                                    onClick={() => {
                                                        // Skip image step when going back if no images needed
                                                        if (step === 5 && getMaxImages() === 0) {
                                                            setStep(3);
                                                        } else {
                                                            setStep(step - 1);
                                                        }
                                                    }}
                                                    className="flex-1 py-3.5 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors"
                                                >
                                                    ย้อนกลับ
                                                </button>
                                            )}
                                            {step < 5 ? (
                                                <button onClick={handleNextStep} className="flex-1 py-3.5 rounded-xl bg-[#1A3C40] text-white font-medium hover:bg-[#1A3C40]/90 transition-all shadow-lg">ถัดไป</button>
                                            ) : (
                                                <button
                                                    onClick={handleSubmit}
                                                    disabled={loading || qrExpired}
                                                    className={`flex-1 py-3.5 rounded-xl ${qrExpired ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#1A3C40] hover:bg-[#1A3C40]/90'} text-white font-medium transition-all shadow-lg flex items-center justify-center gap-2`}
                                                >
                                                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'ยืนยันการชำระเงิน'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Exit Warning Popup (Modal inside Modal) */}
                        <AnimatePresence>
                            {showExitWarning && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-white/80 backdrop-blur-md"
                                >
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0, y: 10 }}
                                        animate={{ scale: 1, opacity: 1, y: 0 }}
                                        exit={{ scale: 0.9, opacity: 0, y: 10 }}
                                        className="bg-white border border-[#1A3C40]/10 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center"
                                    >
                                        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <AlertCircle size={32} />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#1A3C40] mb-2 font-playfair">
                                            ยกเลิกการทำรายการ?
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                            หากคุณปิดหน้าต่างนี้ ข้อมูลที่คุณกรอกไว้และรูปภาพที่อัปโหลดจะสูญหายทั้งหมด คุณต้องการยกเลิกใช่หรือไม่?
                                        </p>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setShowExitWarning(false)}
                                                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                                            >
                                                กลับไปทำต่อ
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowExitWarning(false);
                                                    handleClose();
                                                }}
                                                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors shadow-md shadow-red-500/20"
                                            >
                                                ยืนยันยกเลิก
                                            </button>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </AnimatePresence>

            {/* Live Preview Fullscreen Modal */}
            <LivePreviewModal
                isOpen={showPreviewModal}
                onClose={() => setShowPreviewModal(false)}
                formData={formData}
                selectedTemplate={selectedTemplate}
                contentFiles={contentFiles}
                selectedColorTheme={selectedColorTheme}
            />
        </>
    );
};

const CheckoutModal = ({ isOpen, onClose, tier }) => {
    if (!isOpen || !tier) return null;

    return (
        <CheckoutProvider tier={tier} onClose={onClose}>
            <CheckoutContent />
        </CheckoutProvider>
    );
};

export default CheckoutModal;

import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { db, storage } from '../../firebase';
import { doc, setDoc, getDoc, serverTimestamp, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { CheckoutProvider, useCheckout } from './CheckoutContext';
import { BuyerInfoStep, TemplateStep, DetailsStep, ImagesStep, PaymentStep, SuccessStep } from './steps';

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
        qrExpired
    } = useCheckout();

    const handleNextStep = () => {
        setError('');

        if (step === 1) {
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
                if (formData.customDomain.length < 5) {
                    setError('ชื่อลิงก์ต้องมีอย่างน้อย 5 ตัวอักษร');
                    return;
                }
                if (isDomainAvailable !== true) {
                    setError('กรุณาตรวจสอบความว่างของชื่อลิงก์ก่อนทำรายการถัดไป');
                    return;
                }
            }

            setStep(2);
        } else if (step === 2) {
            // Validate template selection
            if (!selectedTemplate) {
                setError('กรุณาเลือกธีม');
                return;
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
            setStep(4); // Go to images
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
        if (!slipFile) {
            setError('กรุณาแนบสลิปโอนเงิน');
            return;
        }

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

            // 2. Upload Slip
            const slipExt = slipFile.name.split('.').pop();
            const slipName = `${storyId}_${Date.now()}_slip.${slipExt}`;
            const slipRef = ref(storage, `slips/${slipName}`);
            await uploadBytes(slipRef, slipFile);
            const slipUrl = await getDownloadURL(slipRef);

            // 3. Upload Content Images (if any)
            const contentUrls = [];
            // Use maxImages from our utility if possible, or just use contentFiles length but we need to respect indices.
            // For Tier 3, we want to preserve indices 0-9 even if some are null
            const maxUploads = getMaxImages() || contentFiles.length;

            if (contentFiles.length > 0 || maxUploads > 0) {
                // Iterate up to maxUploads to ensure we capture all slots
                for (let i = 0; i < maxUploads; i++) {
                    const file = contentFiles[i];
                    if (file) {
                        const refName = `uploads/${storyId}/${i}_${file.name}`;
                        const imgRef = ref(storage, refName);
                        await uploadBytes(imgRef, file);
                        const url = await getDownloadURL(imgRef);
                        contentUrls.push(url);
                    } else {
                        // Push null to preserve index position for templates (like Tier 3) that rely on specific slots
                        contentUrls.push(null);
                    }
                }
            }

            // 4. Save Order
            const orderRef = doc(db, 'orders', storyId);

            await setDoc(orderRef, {
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

            // 4. Update Global User Counter
            try {
                const statsRef = doc(db, 'stats', 'users');
                await setDoc(statsRef, { count: increment(1) }, { merge: true });
            } catch (statErr) {
                console.error("Error updating user stats (non-critical):", statErr);
            }

            setStep(6); // Success

        } catch (err) {
            console.error("Error creating order:", err);
            setError('เกิดข้อผิดพลาด: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const stepLabels = getStepLabels();


    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white w-full max-w-lg min-h-[60vh] max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col"
                >
                    <button onClick={handleClose} className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition-colors z-20 bg-white shadow-sm">
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
                    <div className={`flex-1 overflow-y-auto p-6 md:p-6 pt-2 flex flex-col ${step === 6 ? 'justify-center' : 'justify-start'}`}>
                        {/* Success State */}
                        {step === 6 ? (
                            <SuccessStep />
                        ) : (
                            <>
                                <div className="text-center mb-2">
                                    <h3 className="text-xl font-playfair font-bold text-[#1A3C40] mb-0.5">
                                        {step === 1 ? 'ข้อมูลผู้สั่งซื้อ' :
                                            step === 2 ? 'เลือกธีม' :
                                                step === 3 ? 'รายละเอียดธีม' :
                                                    step === 4 ? 'อัปโหลดรูปภาพ' : 'ชำระเงิน'}
                                    </h3>
                                    <p className="text-gray-400 text-xs">{tier.name} — ฿{tier.price}</p>
                                </div>

                                <div className="space-y-4">
                                    {step === 1 && <BuyerInfoStep />}
                                    {step === 2 && <TemplateStep />}
                                    {step === 3 && <DetailsStep />}
                                    {step === 4 && <ImagesStep />}
                                    {step === 5 && <PaymentStep />}

                                    {error && <div className="text-red-500 text-xs bg-red-50 p-3 rounded-lg flex items-center gap-2"><AlertCircle size={16} />{error}</div>}

                                    <div className="flex gap-3 mt-6 pb-2">
                                        {step > 1 && (
                                            <button
                                                onClick={() => setStep(step - 1)}
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
                </motion.div>
            </div>
        </AnimatePresence>
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

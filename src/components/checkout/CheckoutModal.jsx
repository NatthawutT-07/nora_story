import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertCircle, Eye } from 'lucide-react';
import { db, storage } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { CheckoutProvider, useCheckout } from './CheckoutContext';
import { BuyerInfoStep, TemplateStep, DetailsStep, ImagesStep, PaymentStep, SuccessStep } from './steps';
import LivePreviewModal from './LivePreviewModal';
import { createOrder } from '../../api/functions';

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
        selectedColorTheme,
        paymentSessionActive,
        preGeneratedOrderId,
        setPreGeneratedOrderId,
        isChatTemplate,
    } = useCheckout();

    const [showExitWarning, setShowExitWarning] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const isSubmittingRef = useRef(false);

    const isStep1Valid = () => !!selectedTemplate;
    const isStep2Valid = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9+-\s]{9,15}$/;
        
        const basicInfoValid = formData.buyerName.trim().length >= 1 && 
                             emailRegex.test(formData.buyerEmail) && 
                             phoneRegex.test(formData.buyerPhone.replace(/[-\s]/g, ''));
        
        if (!basicInfoValid) return false;

        // Check Custom Link logic
        if (tier?.wantSpecialLink || tier?.wantCustomLink) {
            if (!formData.customDomain?.trim() || formData.customDomain.length < 8) return false;
            if (isDomainAvailable !== true) return false;
        }

        return true;
    };

    const isStep3Valid = () => {
        if (isChatTemplate) {
            if (!formData.targetName?.trim() || formData.targetName.length > 15) return false;
            if (!formData.shortMessage?.trim() || formData.shortMessage.length > 50) return false;
            if (!formData.customMessage?.trim() || formData.customMessage.length > 200) return false;
        }

        if (needsDetailFields) {
            if (!formData.pin || formData.pin.length !== 4) return false;
            if (!formData.targetName?.trim() || formData.targetName.trim().length < 1) return false;
            if (!formData.message?.trim() || formData.message.length > 100) return false;
        }

        if (needsTimelineFields) {
            if (!formData.finaleMessage?.trim()) return false;
        }

        return true;
    };

    const isStep4Valid = () => {
        const maxImages = getMaxImages();
        if (maxImages === 0) return true;
        const uploadedCount = contentFiles.filter(Boolean).length;
        return uploadedCount >= maxImages;
    };

    const canGoNext = () => {
        if (step === 1) return isStep1Valid();
        if (step === 2) return isStep2Valid();
        if (step === 3) return isStep3Valid();
        if (step === 4) return isStep4Valid();
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

            // Generate or set Order ID before moving to step 3
            // If they have a custom domain, use it as the ID. Otherwise, generate a random one.
            const generateIdIfNeeded = async () => {
                const isCustom = tier?.wantSpecialLink || tier?.wantCustomLink;
                
                if (isCustom) {
                    // Always update if it's a custom domain (in case they changed it)
                    return formData.customDomain;
                }
                
                // For random orders, only generate once to avoid path mismatch if they go back/forth
                if (preGeneratedOrderId && !preGeneratedOrderId.includes(formData.customDomain)) {
                    // Check if the current ID looks like a random one (not the custom domain)
                    // If we already have a random ID, just keep it.
                    return preGeneratedOrderId;
                }

                return await generateUniqueStoryId();
            };

            setLoading(true);
            generateIdIfNeeded().then(id => {
                setPreGeneratedOrderId(id);
                setLoading(false);
                setStep(3);
            }).catch(err => {
                console.error("Error generating order ID:", err);
                setError('เกิดข้อผิดพลาดในการสร้างรหัสคำสั่งซื้อ');
                setLoading(false);
            });
            return;
        } else if (step === 3) {
            // Validate template details
            if (isChatTemplate) {
                if (!formData.targetName?.trim()) {
                    setError('กรุณากรอกชื่อคู่สนทนา');
                    return;
                }
                if (!formData.shortMessage?.trim()) {
                    setError('กรุณากรอกข้อความแรกที่ทักทาย');
                    return;
                }
                if (!formData.customMessage?.trim()) {
                    setError('กรุณากรอกข้อความบอกรักส่วนที่ 2');
                    return;
                }
            }

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
            // 1. Upload Slip Image
            let slipUrl = '';
            if (slipFile) {
                const folder = preGeneratedOrderId || formData.buyerPhone || 'anonymous';
                const slipExt = slipFile.name.split('.').pop();
                const slipName = `slip_${preGeneratedOrderId}_${Date.now()}.${slipExt}`;
                const slipRef = ref(storage, `slips/${folder}/${slipName}`);

                const slipCompressionOptions = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1200,
                    useWebWorker: true
                };

                const compressedSlipFile = await imageCompression(slipFile, slipCompressionOptions);
                await uploadBytes(slipRef, compressedSlipFile);
                slipUrl = await getDownloadURL(slipRef);
            }

            // 2. Upload Content Images (if any)
            const maxUploads = getMaxImages() || contentFiles.length;
            let contentUrls = Array(maxUploads).fill(null);
            if ((contentFiles.length > 0 || maxUploads > 0)) {
                const contentCompressionOptions = {
                    maxSizeMB: 2,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    initialQuality: 0.85
                };

                const contentUploadPromises = [];
                for (let i = 0; i < maxUploads; i++) {
                    const file = contentFiles[i];
                    if (file) {
                        const uploadPromise = async () => {
                            try {
                                const folder = formData.customDomain || formData.buyerPhone || 'temp_group';
                                const compressedFile = await imageCompression(file, contentCompressionOptions);
                                const refName = `uploads/${folder}/${Date.now()}_${i}_${file.name}`;
                                const imgRef = ref(storage, refName);
                                await uploadBytes(imgRef, compressedFile);
                                const url = await getDownloadURL(imgRef);
                                return { index: i, url };
                            } catch (error) {
                                console.error(`Error compressing/uploading image ${i}:`, error);
                                const folder = formData.customDomain || formData.buyerPhone || 'temp_group';
                                const refName = `uploads/${folder}/${Date.now()}_${i}_${file.name}`;
                                const imgRef = ref(storage, refName);
                                await uploadBytes(imgRef, file);
                                const url = await getDownloadURL(imgRef);
                                return { index: i, url };
                            }
                        };
                        contentUploadPromises.push(uploadPromise());
                    }
                }

                if (contentUploadPromises.length > 0) {
                    const uploadResults = await Promise.all(contentUploadPromises);
                    uploadResults.forEach(res => {
                        contentUrls[res.index] = res.url;
                    });
                }
            }

            // 3. Prepare order data for Cloud Function
            const orderData = {
                orderId: preGeneratedOrderId, // Send pre-generated ID
                tierId: tier.id,
                tierName: tier.name,
                price: tier.price,
                buyerName: formData.buyerName,
                buyerEmail: formData.buyerEmail,
                buyerPhone: formData.buyerPhone,
                needsDetailFields,
                needsChatFields: isChatTemplate,
                pin: formData.pin,
                targetName: formData.targetName,
                signOff: formData.signOff,
                message: formData.message,
                shortMessage: formData.shortMessage,
                customMessage: formData.customMessage,
                needsTimelineFields,
                timelines: formData.timelines,
                finaleMessage: formData.finaleMessage,
                finaleSignOff: formData.finaleSignOff,
                wantSpecialLink: tier?.wantSpecialLink,
                wantCustomLink: tier?.wantCustomLink,
                customDomain: formData.customDomain,
                selectedTemplate,
                slipUrl,
                contentImages: contentUrls, // Added here
                musicUrl: formData.musicUrl,
                colorThemeId: selectedColorTheme?.id,
                platform: 'web'
            };

            // 4. Call Cloud Function to create order
            const result = await createOrder(orderData);

            if (!result.success) {
                throw new Error(result.error || 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ');
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
                                                className={`w-full py-3 rounded-xl border border-dashed text-sm flex items-center justify-center gap-2 transition-all ${step === 3 && !isStep3Valid()
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
                                            {step > 1 && step !== 5 && (
                                                <button
                                                    onClick={() => {
                                                        if (step === 5 && getMaxImages() === 0) {
                                                            setStep(3);
                                                        } else {
                                                            setStep(step - 1);
                                                        }
                                                    }}
                                                    disabled={step === 5 && paymentSessionActive}
                                                    className={`flex-1 py-3.5 rounded-xl font-medium transition-colors ${step === 5 && paymentSessionActive
                                                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    ย้อนกลับ
                                                </button>
                                            )}
                                            {step < 5 && (
                                                 <button
                                                     onClick={handleNextStep}
                                                     disabled={!canGoNext() || loading}
                                                     className={`flex-1 py-3.5 rounded-xl font-medium transition-all shadow-lg ${!canGoNext() || loading
                                                         ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                                         : 'bg-[#1A3C40] text-white hover:bg-[#1A3C40]/90'
                                                         }`}
                                                 >
                                                     {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'ถัดไป'}
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
                                            ยกเลิกการทำรายการ
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                            หากคุณปิดหน้าต่างนี้ ข้อมูลที่คุณกรอกไว้และรูปภาพที่อัปโหลดจะสูญหายทั้งหมด คุณต้องการยกเลิกใช่หรือไม่
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

import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { db, storage } from '../../firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { CheckoutProvider, useCheckout } from './CheckoutContext';
import { BuyerInfoStep, TemplateStep, ImagesStep, PaymentStep, SuccessStep } from './steps';

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
        isTier1Template1,
        getTotalSteps,
        getStepLabels,
        getProgressStep
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
            setStep(2);
        } else if (step === 2) {
            // Validate template selection
            if (!selectedTemplate) {
                setError('กรุณาเลือกธีม');
                return;
            }

            // Tier 1 Template 1 specific validation
            if (isTier1Template1) {
                if (!formData.pin || formData.pin.length !== 4) {
                    setError('กรุณาใส่ PIN 4 หลัก');
                    return;
                }
                if (!formData.targetName.trim()) {
                    setError('กรุณากรอกชื่อคนรับ');
                    return;
                }
                if (!formData.message.trim()) {
                    setError('กรุณากรอกข้อความหลัก');
                    return;
                }
                if (formData.message.length > 400) {
                    setError('ข้อความต้องไม่เกิน 400 ตัวอักษร');
                    return;
                }
            }

            // Tier 1 Logic
            if (tier.id === 1) {
                // If it's t1-2 or t1-3, go to Step 3 (Images)
                if (selectedTemplate === 't1-2' || selectedTemplate === 't1-3') {
                    setStep(3);
                } else {
                    // t1-1 skips image step
                    setStep(4);
                }
            } else {
                setStep(3); // Go to images
            }
        } else if (step === 3) {
            setStep(4); // Go to payment
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
            // 1. Upload Slip
            const slipExt = slipFile.name.split('.').pop();
            const slipName = `${Date.now()}_slip.${slipExt}`;
            const slipRef = ref(storage, `slips/${slipName}`);
            await uploadBytes(slipRef, slipFile);
            const slipUrl = await getDownloadURL(slipRef);

            // 2. Upload Content Images (if any)
            const contentUrls = [];
            if (contentFiles.length > 0) {
                const orderIdTmp = Date.now().toString();
                for (let i = 0; i < contentFiles.length; i++) {
                    const file = contentFiles[i];
                    const refName = `uploads/${orderIdTmp}/${i}_${file.name}`;
                    const imgRef = ref(storage, refName);
                    await uploadBytes(imgRef, file);
                    const url = await getDownloadURL(imgRef);
                    contentUrls.push(url);
                }
            }

            // 3. Generate unique Story ID and Save Order
            const storyId = await generateUniqueStoryId();
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
                pin_code: isTier1Template1 ? formData.pin : null,
                target_name: isTier1Template1 ? formData.targetName : null,
                sign_off: isTier1Template1 ? formData.signOff : null,
                message: formData.message,

                // Tier 4
                custom_domain: tier.id === 4 ? formData.customDomain : null,

                selected_template_id: selectedTemplate,
                template_id: null,
                slip_url: slipUrl,
                content_images: contentUrls,
                status: 'pending',
                created_at: serverTimestamp(),
                platform: 'web',
                story_url: `https://norastory.com/${storyId}`
            });

            setStep(5); // Success

        } catch (err) {
            console.error("Error creating order:", err);
            setError('เกิดข้อผิดพลาด: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const stepLabels = getStepLabels();
    const totalSteps = getTotalSteps();

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
                    className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col"
                >
                    <button onClick={handleClose} className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition-colors z-20 bg-white shadow-sm">
                        <X size={20} className="text-gray-500" />
                    </button>

                    {/* Progress Bar (Fixed Header) */}
                    {step < 5 && (
                        <div className="px-8 pt-14 pb-4 bg-white z-10">
                            <div className="flex justify-between items-center mb-2">
                                {stepLabels.map((label, idx) => (
                                    <span
                                        key={idx}
                                        className={`text-xs font-bold ${getProgressStep() >= idx + 1 ? 'text-[#1A3C40]' : 'text-gray-300'}`}
                                    >
                                        {label}
                                    </span>
                                ))}
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-[#E8A08A]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(getProgressStep() / totalSteps) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Scrollable Content Body */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 pt-2">
                        {/* Success State */}
                        {step === 5 ? (
                            <SuccessStep />
                        ) : (
                            <>
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-playfair font-bold text-[#1A3C40] mb-1">
                                        {step === 1 ? 'ข้อมูลผู้สั่งซื้อ' :
                                            step === 2 ? 'เลือกธีม' :
                                                step === 3 ? 'อัปโหลดรูปภาพ' : 'ชำระเงิน'}
                                    </h3>
                                    <p className="text-gray-500 text-sm">แพ็คเกจ: <span className="text-[#E8A08A] font-medium">{tier.name}</span></p>
                                </div>

                                <div className="space-y-4">
                                    {step === 1 && <BuyerInfoStep />}
                                    {step === 2 && <TemplateStep />}
                                    {step === 3 && <ImagesStep />}
                                    {step === 4 && <PaymentStep />}

                                    {error && <div className="text-red-500 text-xs bg-red-50 p-3 rounded-lg flex items-center gap-2"><AlertCircle size={16} />{error}</div>}

                                    <div className="flex gap-3 mt-6 pb-2">
                                        {step > 1 && (
                                            <button
                                                onClick={() => {
                                                    // Handle back button for Tier 1
                                                    if (isTier1Template1 && step === 4) {
                                                        setStep(2);
                                                    } else {
                                                        setStep(step - 1);
                                                    }
                                                }}
                                                className="flex-1 py-3.5 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors"
                                            >
                                                ย้อนกลับ
                                            </button>
                                        )}
                                        {step < 4 ? (
                                            <button onClick={handleNextStep} className="flex-1 py-3.5 rounded-xl bg-[#1A3C40] text-white font-medium hover:bg-[#1A3C40]/90 transition-all shadow-lg">ถัดไป</button>
                                        ) : (
                                            <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3.5 rounded-xl bg-[#1A3C40] text-white font-medium hover:bg-[#1A3C40]/90 transition-all shadow-lg flex items-center justify-center gap-2">
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

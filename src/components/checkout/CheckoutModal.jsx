import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle, Copy, Loader2, AlertCircle, Heart, Info } from 'lucide-react';
import TemplateSelector from '../TemplateSelector';
import { useState } from 'react';
import { db, storage } from '../../firebase';
import { collection, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

const CheckoutModal = ({ isOpen, onClose, tier }) => {
    // Steps: 1=Buyer Info, 2=Template Selection (+inline fields for Tier1), 3=Images (Tier 2-4 only), 4=Payment, 5=Success
    const [step, setStep] = useState(1);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [slipFile, setSlipFile] = useState(null);
    const [slipPreview, setSlipPreview] = useState(null);
    const [contentFiles, setContentFiles] = useState([]);
    const [contentPreviews, setContentPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPreview, setShowPreview] = useState(null); // 'pin' | 'targetName' | 'signOff' | 'message'

    // Form State
    const [formData, setFormData] = useState({
        // Step 1: Buyer Info
        buyerName: '',
        buyerEmail: '',
        buyerPhone: '',

        // Tier 1 Template 1 specific fields (shown in Step 2)
        pin: '', // ลูกค้ากรอกเอง
        targetName: '', // ชื่อคนรับ - จะไปแทนที่ "คุณ" ใน "คุณรักเค้าไหม?"
        signOff: '', // ลงท้ายว่า... (For You)
        message: '', // ข้อความหลัก (max 400)

        // Tier 4
        customDomain: '',
    });

    // Check if current selection is Tier1 Template 1
    const isTier1Template1 = tier?.id === 1 && selectedTemplate === 't1-1';

    // Tier Constraints
    const getMaxImages = () => {
        if (!tier) return 0;
        if (tier.id === 1) return 0; // Tier 1 = no images
        if (tier.id === 2) return 5;
        if (tier.id === 3) return 10;
        if (tier.id === 4) return 30;
        return 0;
    };

    const handleClose = () => {
        setStep(1);
        setSlipFile(null);
        setSlipPreview(null);
        setContentFiles([]);
        setContentPreviews([]);
        setLoading(false);
        setError('');
        setFormData({
            buyerName: '', buyerEmail: '', buyerPhone: '',
            pin: '', targetName: '', signOff: '', message: '',
            customDomain: ''
        });
        setSelectedTemplate(null);
        onClose();
    };

    // Handle Content Images Selection
    const handleContentFilesChange = (e) => {
        const files = Array.from(e.target.files);
        const max = getMaxImages();

        if (files.length + contentFiles.length > max) {
            setError(`อัปโหลดได้สูงสุด ${max} รูปเท่านั้น`);
            return;
        }

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setContentFiles([...contentFiles, ...files]);
        setContentPreviews([...contentPreviews, ...newPreviews]);
        setError('');
    };

    const removeContentImage = (index) => {
        const newFiles = [...contentFiles];
        const newPreviews = [...contentPreviews];
        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);
        setContentFiles(newFiles);
        setContentPreviews(newPreviews);
    };

    // Handle Slip Selection
    const handleSlipChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('ไฟล์ขนาดใหญ่เกินไป (Max 5MB)');
                return;
            }
            setSlipFile(selectedFile);
            setError('');
            const reader = new FileReader();
            reader.onloadend = () => setSlipPreview(reader.result);
            reader.readAsDataURL(selectedFile);
        }
    };

    // Calculate total steps based on tier
    const getTotalSteps = () => {
        if (tier?.id === 1) return 3; // Buyer -> Template -> Payment (no images)
        return 4; // Buyer -> Template -> Images -> Payment
    };

    // Get step labels for progress bar
    const getStepLabels = () => {
        if (tier?.id === 1) {
            return ['ข้อมูลผู้ซื้อ', 'เลือกธีม', 'ชำระเงิน'];
        }
        return ['ข้อมูลผู้ซื้อ', 'เลือกธีม', 'รูปภาพ', 'ชำระเงิน'];
    };

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

            // Tier 1 skips image step
            if (tier.id === 1) {
                setStep(4); // Go to payment
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
                target_name: isTier1Template1 ? formData.targetName : null, // ชื่อคนรับ
                sign_off: isTier1Template1 ? formData.signOff : null, // ลงท้าย
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

    if (!isOpen || !tier) return null;

    const stepLabels = getStepLabels();
    const totalSteps = getTotalSteps();

    // Map current step to progress (for Tier 1, step 4 = payment = 3rd step visually)
    const getProgressStep = () => {
        if (tier.id === 1 && step === 4) return 3;
        return step;
    };

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
                    className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col"
                >
                    <button onClick={handleClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-20 bg-white shadow-sm">
                        <X size={20} className="text-gray-500" />
                    </button>

                    {/* Progress Bar */}
                    {step < 5 && (
                        <div className="px-8 pt-8 pb-4">
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

                    <div className="p-6 md:p-8 pt-2">
                        {/* Success State */}
                        {step === 5 ? (
                            <div className="text-center flex flex-col items-center justify-center min-h-[300px]">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle size={40} />
                                </motion.div>
                                <h3 className="text-2xl font-playfair font-bold text-[#1A3C40] mb-2">ได้รับข้อมูลเรียบร้อย!</h3>
                                <p className="text-gray-500 mb-2">ทางเราจะรีบตรวจสอบและจัดทำหน้าเว็บไซต์ให้ภายใน 24 ชม.</p>
                                <p className="text-sm text-[#E8A08A] mb-6">ลิงก์จะถูกส่งไปที่: {formData.buyerEmail}</p>
                                <button onClick={handleClose} className="bg-[#1A3C40] text-white px-8 py-3 rounded-xl hover:bg-[#1A3C40]/90 transition-colors">
                                    ปิดหน้าต่าง
                                </button>
                            </div>
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
                                    {/* Step 1: Buyer Info */}
                                    {step === 1 && (
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">ชื่อผู้สั่งซื้อ</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50"
                                                        placeholder="ชื่อของคุณ"
                                                        value={formData.buyerName}
                                                        onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Email (สำหรับรับลิงก์)</label>
                                                    <input
                                                        type="email"
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50"
                                                        placeholder="your@email.com"
                                                        value={formData.buyerEmail}
                                                        onChange={(e) => setFormData({ ...formData, buyerEmail: e.target.value })}
                                                    />
                                                    <p className="text-xs text-gray-400 mt-1">* ลิงก์สินค้าจะถูกส่งไปที่อีเมลนี้</p>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                                                    <input
                                                        type="tel"
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50"
                                                        placeholder="0812345678"
                                                        value={formData.buyerPhone}
                                                        onChange={(e) => setFormData({ ...formData, buyerPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                                    />
                                                </div>

                                                {tier.id === 4 && (
                                                    <div>
                                                        <label className="block text-xs font-medium text-[#1A3C40] mb-1">ชื่อโดเมนที่ต้องการ</label>
                                                        <div className="flex items-center">
                                                            <input
                                                                type="text"
                                                                className="w-full px-4 py-3 rounded-l-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-white"
                                                                placeholder="yourname"
                                                                value={formData.customDomain}
                                                                onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                                                            />
                                                            <span className="bg-gray-100 border border-l-0 border-gray-200 px-4 py-3 rounded-r-xl text-gray-500 text-sm">.norastory.com</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 2: Template Selection + Tier1 Inline Fields */}
                                    {step === 2 && (
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                            <TemplateSelector
                                                tierId={tier.id}
                                                selectedTemplate={selectedTemplate}
                                                onSelect={setSelectedTemplate}
                                            />

                                            {/* Tier 1 Template 1 Specific Fields - Show when template is selected */}
                                            {isTier1Template1 && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="mt-6 pt-6 border-t border-gray-100 space-y-4"
                                                >
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <Heart size={18} className="text-pink-500" />
                                                        <span className="text-sm font-medium text-[#1A3C40]">ตั้งค่าข้อความพิเศษ</span>
                                                    </div>

                                                    {/* PIN */}
                                                    <div className="relative">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <label className="block text-xs font-medium text-gray-700">🔐 รหัส PIN 4 หลัก</label>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.stopPropagation(); setShowPreview(showPreview === 'pin' ? null : 'pin'); }}
                                                                className={`p-1 rounded-full transition-colors ${showPreview === 'pin' ? 'bg-rose-100 text-rose-500' : 'text-gray-400 hover:text-rose-500 hover:bg-rose-50'}`}
                                                            >
                                                                <Info size={14} />
                                                            </button>
                                                        </div>
                                                        <AnimatePresence>
                                                            {showPreview === 'pin' && (
                                                                <>
                                                                    <div className="fixed inset-0 z-40" onClick={() => setShowPreview(null)} />
                                                                    <motion.div
                                                                        initial={{ opacity: 0, scale: 0.9, y: -5 }}
                                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                        exit={{ opacity: 0, scale: 0.9, y: -5 }}
                                                                        className="absolute right-0 top-6 z-50 w-56 p-3 bg-white rounded-xl shadow-xl border border-rose-200"
                                                                    >
                                                                        <div className="absolute -top-2 right-3 w-3 h-3 bg-white border-l border-t border-rose-200 rotate-45" />
                                                                        <div className="flex gap-3 items-center">
                                                                            <div className="text-3xl">🔐</div>
                                                                            <div>
                                                                                <p className="text-xs font-medium text-rose-700">หน้าล็อก PIN</p>
                                                                                <p className="text-[10px] text-gray-500">ผู้รับต้องกรอก PIN นี้ก่อนเปิดดูข้อความ</p>
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                </>
                                                            )}
                                                        </AnimatePresence>
                                                        <input
                                                            type="text"
                                                            maxLength={4}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50 text-center text-2xl tracking-[0.5em] font-mono"
                                                            placeholder="1234"
                                                            value={formData.pin}
                                                            onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                                        />
                                                        <p className="text-xs text-gray-400 mt-1">* ผู้รับต้องกรอกรหัสนี้เพื่อเปิดดูข้อความ</p>
                                                    </div>

                                                    {/* Target Name */}
                                                    <div className="relative">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <label className="block text-xs font-medium text-gray-700">💕 ชื่อคนรับ</label>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.stopPropagation(); setShowPreview(showPreview === 'targetName' ? null : 'targetName'); }}
                                                                className={`p-1 rounded-full transition-colors ${showPreview === 'targetName' ? 'bg-pink-100 text-pink-500' : 'text-gray-400 hover:text-pink-500 hover:bg-pink-50'}`}
                                                            >
                                                                <Info size={14} />
                                                            </button>
                                                        </div>
                                                        <AnimatePresence>
                                                            {showPreview === 'targetName' && (
                                                                <>
                                                                    <div className="fixed inset-0 z-40" onClick={() => setShowPreview(null)} />
                                                                    <motion.div
                                                                        initial={{ opacity: 0, scale: 0.9, y: -5 }}
                                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                        exit={{ opacity: 0, scale: 0.9, y: -5 }}
                                                                        className="absolute right-0 top-6 z-50 w-64 p-3 bg-white rounded-xl shadow-xl border border-pink-200"
                                                                    >
                                                                        <div className="absolute -top-2 right-3 w-3 h-3 bg-white border-l border-t border-pink-200 rotate-45" />
                                                                        <p className="text-center text-lg font-serif text-pink-700 mb-1">
                                                                            "{formData.targetName || 'ชื่อ'}รักเค้าไหม? 💕"
                                                                        </p>
                                                                        <p className="text-[10px] text-gray-500 text-center">คำถามนี้จะแสดงหลังกรอก PIN ถูกต้อง</p>
                                                                    </motion.div>
                                                                </>
                                                            )}
                                                        </AnimatePresence>
                                                        <input
                                                            type="text"
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50"
                                                            placeholder="ชื่อแฟน, ที่รัก, หวานใจ"
                                                            value={formData.targetName}
                                                            onChange={(e) => setFormData({ ...formData, targetName: e.target.value })}
                                                        />
                                                        <p className="text-xs text-gray-400 mt-1">* จะแสดงเป็น "{formData.targetName || 'ชื่อ'}รักเค้าไหม? 💕"</p>
                                                    </div>

                                                    {/* Sign Off */}
                                                    <div className="relative">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <label className="block text-xs font-medium text-gray-700">✨ ลงท้ายว่า... (For {formData.targetName || 'You'})</label>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.stopPropagation(); setShowPreview(showPreview === 'signOff' ? null : 'signOff'); }}
                                                                className={`p-1 rounded-full transition-colors ${showPreview === 'signOff' ? 'bg-amber-100 text-amber-500' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'}`}
                                                            >
                                                                <Info size={14} />
                                                            </button>
                                                        </div>
                                                        <AnimatePresence>
                                                            {showPreview === 'signOff' && (
                                                                <>
                                                                    <div className="fixed inset-0 z-40" onClick={() => setShowPreview(null)} />
                                                                    <motion.div
                                                                        initial={{ opacity: 0, scale: 0.9, y: -5 }}
                                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                        exit={{ opacity: 0, scale: 0.9, y: -5 }}
                                                                        className="absolute right-0 top-6 z-50 w-56 p-3 bg-white rounded-xl shadow-xl border border-amber-200"
                                                                    >
                                                                        <div className="absolute -top-2 right-3 w-3 h-3 bg-white border-l border-t border-amber-200 rotate-45" />
                                                                        <p className="text-[10px] text-amber-600 mb-2 text-center">ส่วนท้ายของข้อความ</p>
                                                                        <div className="bg-amber-50 rounded-lg p-2 text-center">
                                                                            <p className="text-xs text-gray-500">For {formData.targetName || 'You'}</p>
                                                                            <p className="text-sm font-medium text-gray-800">{formData.signOff || 'รักเธอเสมอ'}</p>
                                                                        </div>
                                                                    </motion.div>
                                                                </>
                                                            )}
                                                        </AnimatePresence>
                                                        <input
                                                            type="text"
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50"
                                                            placeholder="รักเธอเสมอ, คนที่รักเธอที่สุด"
                                                            value={formData.signOff}
                                                            onChange={(e) => setFormData({ ...formData, signOff: e.target.value })}
                                                        />
                                                    </div>

                                                    {/* Main Message */}
                                                    <div className="relative">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <label className="block text-xs font-medium text-gray-700">
                                                                💌 ข้อความหลัก
                                                                <span className={`ml-2 ${formData.message.length > 400 ? 'text-red-500' : 'text-gray-400'}`}>
                                                                    ({formData.message.length}/400)
                                                                </span>
                                                            </label>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.stopPropagation(); setShowPreview(showPreview === 'message' ? null : 'message'); }}
                                                                className={`p-1 rounded-full transition-colors ${showPreview === 'message' ? 'bg-purple-100 text-purple-500' : 'text-gray-400 hover:text-purple-500 hover:bg-purple-50'}`}
                                                            >
                                                                <Info size={14} />
                                                            </button>
                                                        </div>
                                                        <AnimatePresence>
                                                            {showPreview === 'message' && (
                                                                <>
                                                                    <div className="fixed inset-0 z-40" onClick={() => setShowPreview(null)} />
                                                                    <motion.div
                                                                        initial={{ opacity: 0, scale: 0.9, y: -5 }}
                                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                        exit={{ opacity: 0, scale: 0.9, y: -5 }}
                                                                        className="absolute right-0 top-6 z-50 w-64 p-3 bg-white rounded-xl shadow-xl border border-purple-200"
                                                                    >
                                                                        <div className="absolute -top-2 right-3 w-3 h-3 bg-white border-l border-t border-purple-200 rotate-45" />
                                                                        <p className="text-[10px] text-purple-600 mb-2 text-center">ข้อความกลางหน้า (หลังกด "รัก")</p>
                                                                        <div className="bg-purple-50 rounded-lg p-2">
                                                                            <p className="text-xs text-gray-700 leading-relaxed line-clamp-3">
                                                                                {formData.message || 'ข้อความของคุณจะแสดงที่นี่...'}
                                                                            </p>
                                                                        </div>
                                                                    </motion.div>
                                                                </>
                                                            )}
                                                        </AnimatePresence>
                                                        <textarea
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50 h-32 resize-none"
                                                            placeholder="ข้อความที่อยากบอกคนรับ..."
                                                            value={formData.message}
                                                            onChange={(e) => setFormData({ ...formData, message: e.target.value.slice(0, 400) })}
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    )}

                                    {/* Step 3: Images (Tier 2-4 only) */}
                                    {step === 3 && (
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                            <div className="text-center mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                                <p className="text-sm text-blue-800">แพ็คเกจนี้อัปโหลดได้สูงสุด <span className="font-bold">{getMaxImages()}</span> รูป</p>
                                            </div>

                                            <div className="grid grid-cols-3 gap-2 mb-4">
                                                {contentPreviews.map((src, idx) => (
                                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                                                        <img src={src} className="w-full h-full object-cover" />
                                                        <button onClick={() => removeContentImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                                {contentFiles.length < getMaxImages() && (
                                                    <label className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#E8A08A] hover:bg-[#E8A08A]/5 transition-colors">
                                                        <Upload className="w-6 h-6 text-gray-400" />
                                                        <span className="text-xs text-gray-400 mt-1">เพิ่มรูป</span>
                                                        <input type="file" multiple accept="image/*" onChange={handleContentFilesChange} className="hidden" />
                                                    </label>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 4: Payment */}
                                    {step === 4 && (
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                            <div className="bg-[#1A3C40]/5 rounded-xl p-5 mb-6 border border-[#1A3C40]/10 text-center">
                                                <p className="text-sm text-[#4E6E81] font-medium mb-2">ยอดชำระเงิน</p>
                                                <p className="text-4xl font-bold text-[#1A3C40] mb-4">{tier.price}.-</p>
                                                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm max-w-xs mx-auto">
                                                    <span className="text-lg font-mono text-[#1A3C40] font-bold">123-4-56789-0</span>
                                                    <button onClick={() => navigator.clipboard.writeText('1234567890')} className="text-[#E8A08A] text-sm"><Copy size={16} /></button>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-2">KBank: นาย ณัฐวุฒิ</p>
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-xs font-medium text-gray-700 mb-2">แนบสลิปโอนเงิน</label>
                                                <label className={`w-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${slipPreview ? 'border-[#E8A08A] bg-[#E8A08A]/5' : 'border-gray-200 hover:border-[#E8A08A]/50'}`}>
                                                    {slipPreview ? (
                                                        <div className="h-32 rounded-lg overflow-hidden"><img src={slipPreview} className="h-full object-contain" /></div>
                                                    ) : (
                                                        <div className="text-center text-gray-400"><Upload className="w-6 h-6 mx-auto mb-2 opacity-50" /><span className="text-xs">คลิกเพื่ออัปโหลดสลิป</span></div>
                                                    )}
                                                    <input type="file" accept="image/*" onChange={handleSlipChange} className="hidden" />
                                                </label>
                                            </div>
                                        </motion.div>
                                    )}

                                    {error && <div className="text-red-500 text-xs bg-red-50 p-3 rounded-lg flex items-center gap-2"><AlertCircle size={16} />{error}</div>}

                                    <div className="flex gap-3 mt-6">
                                        {step > 1 && (
                                            <button
                                                onClick={() => {
                                                    // Handle back button for Tier 1 (skips step 3)
                                                    if (tier.id === 1 && step === 4) {
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

export default CheckoutModal;

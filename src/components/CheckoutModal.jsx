import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle, Copy, Loader2, AlertCircle } from 'lucide-react';
import TemplateSelector from './TemplateSelector';
import { useState } from 'react';
import { db, storage } from '../firebase';
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
            return newId; // ID is unique, use it
        }

        attempts++;
        console.log(`ID collision detected (${newId}), generating new ID... Attempt ${attempts}`);
    }

    // Fallback: add timestamp suffix to ensure uniqueness
    return generateRandomId() + Date.now().toString(36).slice(-3);
};

const CheckoutModal = ({ isOpen, onClose, tier }) => {
    const [step, setStep] = useState(1); // 1: Info, 2: Template, 3: Content (Images), 4: Payment, 5: Success
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [slipFile, setSlipFile] = useState(null);
    const [slipPreview, setSlipPreview] = useState(null);
    const [contentFiles, setContentFiles] = useState([]);
    const [contentPreviews, setContentPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        message: '',
        customDomain: '', // For Tier 4
    });

    // Tier Constraints
    const getMaxImages = () => {
        if (!tier) return 0;
        if (tier.id === 1) return 1;
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
        setFormData({ name: '', contact: '', message: '', customDomain: '' });
        setSelectedTemplate(null);
        onClose();
    };

    // Handle Content Images Selection
    const handleContentFilesChange = (e) => {
        const files = Array.from(e.target.files);
        const max = getMaxImages();

        if (files.length + contentFiles.length > max) {
            setError(`อัปโหลดได้สูงสุด ${max} รูปเท่านั้นครับ`);
            return;
        }

        // Generate Previews
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

    const handleNextStep = () => {
        if (step === 1) {
            if (!formData.name || !formData.contact) {
                setError('กรุณากรอกข้อมูลให้ครบถ้วน');
                return;
            }
            if (tier.id === 4 && !formData.customDomain) {
                setError('กรุณาระบุชื่อโดเมนที่ต้องการ');
                return;
            }
            setStep(2); // Go to Template Selection
        } else if (step === 2) {
            if (!selectedTemplate) {
                setError('กรุณาเลือกธีมที่ชอบ');
                return;
            }
            setStep(3); // Go to Images
        } else if (step === 3) {
            setStep(4); // Go to Payment
        }
        setError('');
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
                const orderIdTmp = Date.now().toString(); // Use timestamp as temp group ID
                for (let i = 0; i < contentFiles.length; i++) {
                    const file = contentFiles[i];
                    const refName = `uploads/${orderIdTmp}/${i}_${file.name}`;
                    const imgRef = ref(storage, refName);
                    await uploadBytes(imgRef, file);
                    const url = await getDownloadURL(imgRef);
                    contentUrls.push(url);
                }
            }

            // 3. Generate unique Story ID (checks for duplicates) and Save Order
            const storyId = await generateUniqueStoryId();
            const orderRef = doc(db, 'orders', storyId);

            await setDoc(orderRef, {
                tier_id: tier.id,
                tier_name: tier.name,
                price: tier.price,
                customer_name: formData.name,
                customer_contact: formData.contact,
                message: formData.message,
                custom_domain: tier.id === 4 ? formData.customDomain : null,
                selected_template_id: selectedTemplate, // Customer's choice
                template_id: null, // Admin will finalize this
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
            setError('เกิดข้อผิดพลาดในการส่งข้อมูล: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !tier) return null;

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
                                <span className={`text-xs font-bold ${step >= 1 ? 'text-[#1A3C40]' : 'text-gray-300'}`}>ข้อมูล</span>
                                <span className={`text-xs font-bold ${step >= 2 ? 'text-[#1A3C40]' : 'text-gray-300'}`}>ธีม</span>
                                <span className={`text-xs font-bold ${step >= 3 ? 'text-[#1A3C40]' : 'text-gray-300'}`}>รูปภาพ</span>
                                <span className={`text-xs font-bold ${step >= 4 ? 'text-[#1A3C40]' : 'text-gray-300'}`}>ชำระเงิน</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-[#E8A08A]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(step / 4) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="p-6 md:p-8 pt-2">
                        {step === 5 ? (
                            <div className="text-center flex flex-col items-center justify-center min-h-[300px]">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle size={40} />
                                </motion.div>
                                <h3 className="text-2xl font-playfair font-bold text-[#1A3C40] mb-2">ได้รับข้อมูลเรียบร้อย!</h3>
                                <p className="text-gray-500 mb-6">ทางเราจะรีบดำเนินการตรวจสอบและจัดทำหน้าเว็บไซต์ให้ภายใน 24 ชม. ครับ</p>
                                <button onClick={handleClose} className="bg-[#1A3C40] text-white px-8 py-3 rounded-xl hover:bg-[#1A3C40]/90 transition-colors">
                                    ปิดหน้าต่าง
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-playfair font-bold text-[#1A3C40] mb-1">
                                        {step === 1 ? 'ข้อมูลเบื้องต้น' : step === 2 ? 'เลือกธีม' : step === 3 ? 'อัปโหลดรูปภาพ' : 'ชำระเงิน'}
                                    </h3>
                                    <p className="text-gray-500 text-sm">แพ็คเกจ: <span className="text-[#E8A08A] font-medium">{tier.name}</span></p>
                                </div>

                                <div className="space-y-4">
                                    {/* Step 1: Info */}
                                    {step === 1 && (
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">ชื่อของคุณ</label>
                                                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50" placeholder="ชื่อที่ใช้เรียก" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Line ID (สำหรับส่งงาน)</label>
                                                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50" placeholder="@lineid" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} />
                                                </div>
                                                {tier.id === 4 && (
                                                    <div>
                                                        <label className="block text-xs font-medium text-[#1A3C40] mb-1">ชื่อโดเมนที่ต้องการ</label>
                                                        <div className="flex items-center">
                                                            <input type="text" className="w-full px-4 py-3 rounded-l-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-white" placeholder="yourname" value={formData.customDomain} onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })} />
                                                            <span className="bg-gray-100 border border-l-0 border-gray-200 px-4 py-3 rounded-r-xl text-gray-500 text-sm">.norastory.com</span>
                                                        </div>
                                                    </div>
                                                )}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">ข้อความในเว็บ</label>
                                                    <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50 h-24 resize-none" placeholder="ข้อความที่อยากบอก..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 2: Template Selection */}
                                    {step === 2 && (
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                            <TemplateSelector
                                                tierId={tier.id}
                                                selectedTemplate={selectedTemplate}
                                                onSelect={setSelectedTemplate}
                                            />
                                        </motion.div>
                                    )}

                                    {/* Step 3: Images */}
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
                                            <button onClick={() => setStep(step - 1)} className="flex-1 py-3.5 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors">ย้อนกลับ</button>
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

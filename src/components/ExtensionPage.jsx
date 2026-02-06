import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, Upload, Clock, CreditCard, ChevronLeft, AlertCircle } from 'lucide-react';

const EXTENSION_PACKAGES = [
    { days: 7, price: 49, label: '7 วัน' },
    { days: 30, price: 149, label: '30 วัน', recommended: true },
    { days: 90, price: 299, label: '3 เดือน' },
];

const ExtensionPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPackage, setSelectedPackage] = useState(EXTENSION_PACKAGES[1]);
    const [slipFile, setSlipFile] = useState(null);
    const [slipPreview, setSlipPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const docRef = doc(db, 'orders', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setOrder({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setError('ไม่พบออเดอร์นี้ในระบบ');
                }
            } catch (err) {
                console.error(err);
                setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handleSlipChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('ไฟล์ขนาดใหญ่เกินไป (Max 5MB)');
                return;
            }
            setSlipFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setSlipPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!slipFile) {
            alert('กรุณาแนบสลิปโอนเงิน');
            return;
        }

        setIsSubmitting(true);
        try {
            // Upload Slip specifically to extension_slips folder
            const timestamp = Date.now();
            const slipRef = ref(storage, `extension_slips/${id}/${timestamp}_ext_${selectedPackage.days}d.jpg`);
            await uploadBytes(slipRef, slipFile);
            const slipUrl = await getDownloadURL(slipRef);

            // Update Order
            const orderRef = doc(db, 'orders', id);
            await updateDoc(orderRef, {
                extension_status: 'pending',
                extension_slip_url: slipUrl,
                extension_requested_days: selectedPackage.days,
                extension_requested_price: selectedPackage.price,
                extension_requested_at: serverTimestamp()
            });

            setIsSuccess(true);
        } catch (err) {
            console.error(err);
            alert('เกิดข้อผิดพลาด กรุณาลองใหม่');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#E8A08A]" /></div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl"
                >
                    <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1A3C40] mb-2">แจ้งชำระเงินเรียบร้อย!</h2>
                    <p className="text-gray-500 mb-6">
                        เราได้รับคำขอต่ออายุ {selectedPackage.label} แล้ว<br />
                        ทีมงานจะตรวจสอบและอัปเดตวันหมดอายุให้ภายใน 24 ชม. ครับ
                    </p>
                    <button
                        onClick={() => window.location.href = `https://norastory.com/${id}`}
                        className="w-full bg-[#1A3C40] text-white py-3 rounded-xl hover:bg-[#1A3C40]/90 transition-all"
                    >
                        กลับไปที่หน้าเว็บไซต์ของคุณ
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-gray-600 mb-6 transition-colors">
                    <ChevronLeft size={20} /> ย้อนกลับ
                </button>

                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-playfair font-bold text-[#1A3C40] mb-2">ต่ออายุเว็บไซต์</h1>
                    <p className="text-gray-500">สำหรับออเดอร์: <span className="font-mono text-[#E8A08A]">{id}</span></p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Status & Packages */}
                    <div className="space-y-8">
                        {/* Current Status Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-[#1A3C40] mb-4 flex items-center gap-2">
                                <Clock size={20} className="text-[#E8A08A]" /> สถานะปัจจุบัน
                            </h3>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-500 text-sm">วันหมดอายุ</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${!order.expires_at ? 'bg-gray-100 text-gray-500' :
                                        new Date(order.expires_at.seconds * 1000) < new Date() ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                                    }`}>
                                    {!order.expires_at ? 'ไม่มีวันหมดอายุ' :
                                        new Date(order.expires_at.seconds * 1000) < new Date() ? 'หมดอายุแล้ว' : 'ใช้งานได้ปกติ'}
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-[#1A3C40]">
                                {order.expires_at
                                    ? new Date(order.expires_at.seconds * 1000).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })
                                    : '-'}
                            </div>
                        </div>

                        {/* Package Selection */}
                        <div>
                            <h3 className="text-lg font-bold text-[#1A3C40] mb-4">เลือกแพ็คเกจต่ออายุ</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {EXTENSION_PACKAGES.map((pkg) => (
                                    <div
                                        key={pkg.days}
                                        onClick={() => setSelectedPackage(pkg)}
                                        className={`cursor-pointer rounded-xl p-4 border-2 transition-all relative flex justify-between items-center ${selectedPackage.days === pkg.days
                                                ? 'border-[#E8A08A] bg-[#E8A08A]/5 shadow-md'
                                                : 'border-gray-100 bg-white hover:border-gray-200'
                                            }`}
                                    >
                                        {pkg.recommended && (
                                            <span className="absolute -top-3 left-4 bg-[#1A3C40] text-white text-[10px] px-2 py-0.5 rounded-full">
                                                แนะนำ
                                            </span>
                                        )}
                                        <span className="font-bold text-[#1A3C40]">{pkg.label}</span>
                                        <span className="font-medium text-[#E8A08A]">{pkg.price} บาท</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Payment */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit sticky top-6">
                        <h3 className="text-lg font-bold text-[#1A3C40] mb-4 flex items-center gap-2">
                            <CreditCard size={20} className="text-[#E8A08A]" /> ชำระเงิน
                        </h3>

                        {/* QR Code Placeholder */}
                        <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center mb-6 text-center border border-gray-100">
                            <div className="w-40 h-40 bg-white p-2 rounded-lg shadow-sm mb-4">
                                {/* Replace with actual QR Code image */}
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PlaceholderPromptPay" alt="QR Code" className="w-full h-full object-contain" />
                            </div>
                            <p className="text-[#1A3C40] font-bold">ธนาคารกสิกรไทย</p>
                            <p className="text-gray-500 text-sm mb-2">123-4-56789-0 (NoraStory)</p>
                            <div className="bg-[#1A3C40] text-white px-4 py-2 rounded-lg w-full">
                                <span className="text-sm opacity-80 block">ยอดชำระ</span>
                                <span className="text-xl font-bold">{selectedPackage.price} บาท</span>
                            </div>
                        </div>

                        {/* Slip Upload */}
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative cursor-pointer mb-6 h-40 flex items-center justify-center">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleSlipChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {slipPreview ? (
                                <div className="relative w-full h-full">
                                    <img src={slipPreview} alt="Slip" className="w-full h-full object-contain rounded-lg" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                                        <span className="text-white text-sm font-medium">เปลี่ยนรูป</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-gray-400">
                                    <Upload size={24} />
                                    <span className="text-sm">อัปโหลดสลิป</span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !slipFile}
                            className={`w-full py-3 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${isSubmitting || !slipFile
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#E8A08A] text-[#1A3C40] hover:bg-[#d89279] shadow-lg hover:shadow-xl hover:-translate-y-1'
                                }`}
                        >
                            {isSubmitting ? (
                                <><Loader2 className="animate-spin" /> กำลังส่ง...</>
                            ) : (
                                'ยืนยันการต่ออายุ'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExtensionPage;

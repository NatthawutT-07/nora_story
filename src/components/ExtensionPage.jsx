import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, Upload, Clock, CreditCard, ChevronLeft, AlertCircle, Timer, Globe, Sparkles } from 'lucide-react';

// Extension packages — same as pricing page tiers
// Extension packages by Tier
const EXTENSION_PACKAGES_BY_TIER = {
    // Tier 1: Basic Memory
    1: [
        { days: 3, price: 59, label: '3 วัน', perDay: '~20฿/วัน' },
        { days: 7, price: 119, label: '7 วัน', recommended: true, perDay: '~17฿/วัน' },
        { days: 15, price: 199, label: '15 วัน', perDay: '~13฿/วัน' },
    ],
    // Tier 2: Standard Love
    2: [
        { days: 7, price: 99, label: '7 วัน', perDay: '~14฿/วัน' },
        { days: 15, price: 179, label: '15 วัน', recommended: true, perDay: '~12฿/วัน' },
        { days: 30, price: 299, label: '30 วัน', perDay: '~10฿/วัน' },
    ],
    // Tier 3: Premium Valentine
    3: [
        { days: 15, price: 199, label: '15 วัน', perDay: '~13฿/วัน' },
        { days: 30, price: 349, label: '30 วัน', recommended: true, perDay: '~12฿/วัน' },
        { days: 60, price: 599, label: '60 วัน', perDay: '~10฿/วัน' },
    ],
    // Tier 4: Archive (Lifetime)
    4: [
        { days: 30, price: 499, label: '30 วัน', perDay: '~16฿/วัน' },
        { days: 60, price: 799, label: '60 วัน', perDay: '~13฿/วัน' },
        { days: 90, price: 999, label: '90 วัน', recommended: true, perDay: '~11฿/วัน' },
        { days: 180, price: 1490, label: '180 วัน', perDay: '~8฿/วัน' },
    ],
};

const TIER_NAMES = {
    1: 'Trial',
    2: 'Standard',
    3: 'Premium',
};

// Live Countdown Component
const Countdown = ({ expiresAt }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

    useEffect(() => {
        if (!expiresAt) return;

        const expiryDate = new Date(expiresAt.seconds * 1000);

        const tick = () => {
            const now = new Date();
            const diffMs = expiryDate - now;

            if (diffMs <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
                return;
            }

            setTimeLeft({
                days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diffMs % (1000 * 60)) / 1000),
                expired: false,
            });
        };

        tick(); // initial
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [expiresAt]);

    if (!expiresAt) {
        return <p className="text-gray-400 text-sm">ไม่มีข้อมูลวันหมดอายุ</p>;
    }

    if (timeLeft.expired) {
        return (
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium border border-red-200">
                    <AlertCircle size={16} />
                    เว็บไซต์หมดอายุแล้ว
                </div>
            </div>
        );
    }

    const units = [
        { value: timeLeft.days, label: 'วัน' },
        { value: timeLeft.hours, label: 'ชม.' },
        { value: timeLeft.minutes, label: 'นาที' },
        { value: timeLeft.seconds, label: 'วินาที' },
    ];

    const isUrgent = timeLeft.days <= 3;

    return (
        <div className="flex items-center justify-center gap-2 sm:gap-3">
            {units.map((unit, i) => (
                <div key={unit.label} className="flex items-center gap-2 sm:gap-3">
                    <div className="flex flex-col items-center">
                        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold transition-colors ${isUrgent
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : 'bg-[#1A3C40]/5 text-[#1A3C40] border border-[#1A3C40]/10'
                            }`}>
                            {String(unit.value).padStart(2, '0')}
                        </div>
                        <span className="text-[10px] sm:text-xs text-gray-400 mt-1 font-medium">{unit.label}</span>
                    </div>
                    {i < units.length - 1 && (
                        <span className={`text-lg font-bold mb-4 ${isUrgent ? 'text-red-300' : 'text-gray-300'}`}>:</span>
                    )}
                </div>
            ))}
        </div>
    );
};

const ExtensionPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [slipFile, setSlipFile] = useState(null);
    const [slipPreview, setSlipPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [wantSubdomain, setWantSubdomain] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const docRef = doc(db, 'orders', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setOrder({ id: docSnap.id, ...docSnap.data() });
                    // Set default selected package based on tier
                    const tierId = docSnap.data().tier_id || 1;
                    const packages = EXTENSION_PACKAGES_BY_TIER[tierId] || EXTENSION_PACKAGES_BY_TIER[1];
                    const recommended = packages.find(p => p.recommended) || packages[0];
                    setSelectedPackage(recommended);
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
            const timestamp = Date.now();
            const slipRef = ref(storage, `extension_slips/${id}/${timestamp}_ext_${selectedPackage.days}d.jpg`);
            await uploadBytes(slipRef, slipFile);
            const slipUrl = await getDownloadURL(slipRef);

            const orderRef = doc(db, 'orders', id);
            const totalPrice = selectedPackage.price + (wantSubdomain ? 999 : 0);
            await updateDoc(orderRef, {
                extension_status: 'pending',
                extension_slip_url: slipUrl,
                extension_requested_days: selectedPackage.days,
                extension_requested_price: totalPrice,
                extension_requested_subdomain: wantSubdomain,
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

    // --- Loading & Error ---
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F5F0] to-white">
            <Loader2 className="animate-spin text-[#E8A08A]" size={32} />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#F5F5F0] to-white p-6 text-center">
            <AlertCircle size={48} className="text-red-400 mb-4" />
            <p className="text-red-500 text-lg font-medium">{error}</p>
            <button onClick={() => navigate('/')} className="mt-6 text-sm text-gray-400 hover:text-gray-600 underline">กลับหน้าหลัก</button>
        </div>
    );

    // --- Success ---
    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#F5F5F0] to-white flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-xl"
                >
                    <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#1A3C40] mb-2">แจ้งชำระเงินเรียบร้อย!</h2>
                    <p className="text-gray-500 text-sm sm:text-base mb-6">
                        เราได้รับคำขอต่ออายุ {selectedPackage.label} แล้ว<br />
                        ทีมงานจะตรวจสอบและอัปเดตวันหมดอายุให้ภายใน 24 ชม. ครับ
                    </p>
                    <button
                        onClick={() => window.location.href = `https://norastory.com/${id}`}
                        className="w-full bg-[#1A3C40] text-white py-3 rounded-xl hover:bg-[#1A3C40]/90 transition-all text-sm sm:text-base font-medium"
                    >
                        กลับไปที่หน้าเว็บไซต์ของคุณ
                    </button>
                </motion.div>
            </div>
        );
    }

    // Derive packages based on tier
    const tierId = order?.tier_id || 1;
    const packages = EXTENSION_PACKAGES_BY_TIER[tierId] || EXTENSION_PACKAGES_BY_TIER[1];
    const tierName = TIER_NAMES[tierId] || `Tier ${tierId}`;

    // If selectedPackage is not set yet, use recommended
    if (!selectedPackage && packages.length > 0) {
        const recommended = packages.find(p => p.recommended) || packages[0];
        // This is a render-time fallback; the useEffect above should handle it
    }

    // --- Main Page ---
    const expiryDate = order.expires_at ? new Date(order.expires_at.seconds * 1000) : null;
    const isExpired = expiryDate ? expiryDate < new Date() : false;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F5F5F0] to-white">
            {/* Header */}
            <div className="bg-[#1A3C40] text-white px-4 py-3 sm:py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-white/70 hover:text-white transition-colors text-sm">
                        <ChevronLeft size={18} /> ย้อนกลับ
                    </button>
                    <h1 className="font-playfair text-base sm:text-lg">Nora Story</h1>
                    <div className="w-20"></div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
                {/* Title */}
                <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-[#1A3C40] mb-1">ต่ออายุเว็บไซต์</h2>
                    <p className="text-gray-400 text-xs sm:text-sm">
                        แพ็คเกจ: <span className="font-medium text-[#E8A08A]">{tierName}</span>
                        {' · '}
                        <span className="font-mono">{id}</span>
                    </p>
                </div>

                {/* Countdown Section */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 mb-6 sm:mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Timer size={18} className="text-[#E8A08A]" />
                        <h3 className="text-sm sm:text-base font-bold text-[#1A3C40]">
                            {isExpired ? 'เว็บไซต์หมดอายุแล้ว' : 'เวลาที่เหลือ'}
                        </h3>
                    </div>
                    <Countdown expiresAt={order.expires_at} />
                    {expiryDate && (
                        <p className="text-center text-xs text-gray-400 mt-3">
                            หมดอายุ: {expiryDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
                            {' · '}
                            {expiryDate.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    )}
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                    {/* Left: Package Selection */}
                    <div className="space-y-5 sm:space-y-6">
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-[#1A3C40] mb-3 sm:mb-4">เลือกแพ็คเกจต่ออายุ</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {packages.map((pkg) => (
                                    <div
                                        key={pkg.days}
                                        onClick={() => setSelectedPackage(pkg)}
                                        className={`cursor-pointer rounded-xl p-4 border-2 transition-all relative flex justify-between items-center ${selectedPackage?.days === pkg.days
                                            ? 'border-[#E8A08A] bg-[#E8A08A]/5 shadow-md'
                                            : 'border-gray-100 bg-white hover:border-gray-200'
                                            }`}
                                    >
                                        {pkg.recommended && (
                                            <span className="absolute -top-3 left-4 bg-[#1A3C40] text-white text-[10px] px-2 py-0.5 rounded-full">
                                                แนะนำ
                                            </span>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[#1A3C40]">{pkg.label}</span>
                                            <span className="text-xs text-gray-400">{pkg.tierName || pkg.perDay}</span>
                                        </div>
                                        <span className="font-bold text-[#E8A08A] text-lg">{pkg.price} ฿</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Subdomain Upsell */}
                        <div
                            onClick={() => setWantSubdomain(!wantSubdomain)}
                            className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${wantSubdomain
                                ? 'border-purple-400 bg-purple-50 shadow-md'
                                : 'border-gray-100 bg-white hover:border-purple-200'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${wantSubdomain ? 'bg-purple-500 border-purple-500' : 'border-gray-300'
                                    }`}>
                                    {wantSubdomain && <CheckCircle size={14} className="text-white" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Globe size={16} className="text-purple-500" />
                                        <span className="font-bold text-[#1A3C40] text-sm">Special Link</span>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600 border border-red-200 animate-pulse">
                                            <Sparkles size={10} /> จำนวนจำกัด
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">ได้ลิงก์ <span className="font-mono text-purple-600">ชื่อคุณ.norastory.com</span> แทนลิงก์ปกติ</p>
                                </div>
                                <span className="font-bold text-purple-500 text-lg flex-shrink-0">999 ฿</span>
                            </div>
                        </div>

                        {/* New Expiry Preview */}
                        {expiryDate && selectedPackage && (
                            <div className="bg-[#1A3C40]/5 rounded-xl p-4 border border-[#1A3C40]/10">
                                <p className="text-xs text-gray-500 mb-1">วันหมดอายุใหม่หลังต่ออายุ</p>
                                <p className="font-bold text-[#1A3C40]">
                                    {(() => {
                                        const base = isExpired ? new Date() : expiryDate;
                                        const newDate = new Date(base);
                                        newDate.setDate(newDate.getDate() + selectedPackage.days);
                                        return newDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
                                    })()}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right: Payment */}
                    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 h-fit md:sticky md:top-6">
                        <h3 className="text-base sm:text-lg font-bold text-[#1A3C40] mb-4 flex items-center gap-2">
                            <CreditCard size={20} className="text-[#E8A08A]" /> ชำระเงิน
                        </h3>

                        {/* QR Code */}
                        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center mb-4 sm:mb-6 text-center border border-gray-100">
                            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white p-2 rounded-lg shadow-sm mb-3 sm:mb-4">
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PlaceholderPromptPay" alt="QR Code" className="w-full h-full object-contain" />
                            </div>
                            <p className="text-[#1A3C40] font-bold text-sm sm:text-base">ธนาคารกสิกรไทย</p>
                            <p className="text-gray-500 text-xs sm:text-sm mb-2">123-4-56789-0 (Nora Story)</p>
                            <div className="bg-[#1A3C40] text-white px-4 py-2 rounded-lg w-full">
                                <span className="text-xs sm:text-sm opacity-80 block">ยอดชำระ</span>
                                <span className="text-lg sm:text-xl font-bold">{(selectedPackage?.price || 0) + (wantSubdomain ? 999 : 0)} บาท</span>
                                {wantSubdomain && (
                                    <span className="text-[10px] opacity-60 block mt-0.5">({selectedPackage?.price}฿ + Subdomain 999฿)</span>
                                )}
                            </div>
                        </div>

                        {/* Slip Upload */}
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 sm:p-6 text-center hover:bg-gray-50 transition-colors relative cursor-pointer mb-4 sm:mb-6 h-32 sm:h-40 flex items-center justify-center">
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
                                    <span className="text-xs sm:text-sm">อัปโหลดสลิปโอนเงิน</span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !slipFile}
                            className={`w-full py-3 rounded-xl font-bold text-base sm:text-lg transition-all flex items-center justify-center gap-2 ${isSubmitting || !slipFile
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-[#E8A08A] text-[#1A3C40] hover:bg-[#d89279] shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                                }`}
                        >
                            {isSubmitting ? (
                                <><Loader2 className="animate-spin" size={20} /> กำลังส่ง...</>
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

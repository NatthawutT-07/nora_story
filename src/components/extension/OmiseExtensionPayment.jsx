import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Check, Banknote, ShieldCheck } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import generatePayload from 'promptpay-qr';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { storage } from '../../firebase';

const MODE = {
    SLIP: 'slip',
    SUCCESS: 'success',
};

/**
 * OmiseExtensionPayment
 * Reusable payment modal for extension / text edit / image edit flows.
 * Simplified to ONLY support manual slip transfer (PromptPay QR).
 */
const OmiseExtensionPayment = ({
    isOpen,
    onClose,
    onSuccess,
    onSlipSubmitted,
    price,
    label,
    paymentType,
    orderId,
    packageDays,
    editType,
}) => {
    const [mode, setMode] = useState(MODE.SLIP);
    const [slipFile, setSlipFile] = useState(null);
    const [slipPreview, setSlipPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fileError, setFileError] = useState('');
    const [slipTimeLeft, setSlipTimeLeft] = useState(900); // 15 minutes
    const [qrExpired, setQrExpired] = useState(false);

    const promptpayId = import.meta.env.VITE_PROMPTPAY_ID || '';
    const amount = price || 0;

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // Load or create session when modal opens
    useEffect(() => {
        if (isOpen && orderId && paymentType) {
            const sessionKey = `pay_session_${orderId}_${paymentType}`;
            const savedSession = localStorage.getItem(sessionKey);
            const now = Date.now();

            if (savedSession) {
                try {
                    const session = JSON.parse(savedSession);
                    // Check if session is for the same price and still valid (within 900s)
                    const elapsed = (now - session.startTime) / 1000;
                    if (session.price === price && elapsed < 900) {
                        setSlipTimeLeft(Math.floor(900 - elapsed));
                        setQrExpired(false);
                    } else if (session.price === price && elapsed >= 900) {
                        setSlipTimeLeft(0);
                        setQrExpired(true);
                    } else {
                        // Different price or something else, start new session
                        const newSession = { startTime: now, price, label };
                        localStorage.setItem(sessionKey, JSON.stringify(newSession));
                        setSlipTimeLeft(900);
                        setQrExpired(false);
                    }
                } catch (e) {
                    // Fallback if parse fails
                    const newSession = { startTime: now, price, label };
                    localStorage.setItem(sessionKey, JSON.stringify(newSession));
                    setSlipTimeLeft(900);
                    setQrExpired(false);
                }
            } else {
                // No session, create one
                const newSession = { startTime: now, price, label };
                localStorage.setItem(sessionKey, JSON.stringify(newSession));
                setSlipTimeLeft(900);
                setQrExpired(false);
            }
        }
    }, [isOpen, orderId, paymentType, price, label]);

    // Reset non-persistent state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSlipFile(null);
            setSlipPreview(null);
            setLoading(false);
            setError('');
            setFileError('');
        }
    }, [isOpen]);

    // Countdown timer for QR
    useEffect(() => {
        if (!isOpen || qrExpired || mode !== MODE.SLIP) return;
        const t = setInterval(() => {
            setSlipTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(t);
                    setQrExpired(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [isOpen, qrExpired, mode]);

    const handleSlipChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setSlipFile(null);
            setFileError('');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setFileError('ไฟล์ใหญ่เกิน 5MB');
            setSlipFile(null);
            e.target.value = null;
            return;
        }
        setFileError('');
        setSlipFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setSlipPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSlipSubmit = async () => {
        if (!slipFile) {
            setFileError('กรุณาแนบสลิปโอนเงิน');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const ext = slipFile.name.split('.').pop();
            const sRef = storageRef(storage, `extension_slips/${orderId}/${Date.now()}_slip.${ext}`);
            const compressed = await imageCompression(slipFile, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1200,
                useWebWorker: true
            });
            await uploadBytes(sRef, compressed);
            const slipUrl = await getDownloadURL(sRef);

            if (onSlipSubmitted) {
                await onSlipSubmitted(slipUrl);
                // Clear session on success
                const sessionKey = `pay_session_${orderId}_${paymentType}`;
                localStorage.removeItem(sessionKey);
            }
            // If the parent component doesn't close the modal immediately, show success
            // But usually onSlipSubmitted closes it.
        } catch (err) {
            setError('เกิดข้อผิดพลาด: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
                    onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose?.(); }}
                >
                    <motion.div
                        initial={{ y: 60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 60, opacity: 0 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <div>
                                <p className="font-bold text-[#1A3C40] text-sm">ชำระเงิน</p>
                                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-[#1A3C40] text-white px-3 py-1.5 rounded-lg text-center">
                                    <span className="text-sm font-bold">{price.toLocaleString()} ฿</span>
                                </div>
                                {!loading && (
                                    <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                                        <X size={18} className="text-gray-400" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-5 space-y-4 max-h-[85vh] overflow-y-auto">

                            {/* Error Banner */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-3">
                                    {error}
                                </div>
                            )}

                            {/* ─── MODE: SLIP ─── */}
                            <div className="space-y-4">
                                <div className={`rounded-2xl border ${qrExpired ? 'border-red-200 bg-red-50/30' : 'border-gray-200 bg-white'} overflow-hidden transition-colors`}>
                                    <div className="px-4 py-4 flex flex-col items-center justify-center border-b border-gray-100 bg-gray-50/50">
                                        {qrExpired ? (
                                            <div className="h-44 w-full bg-red-50/50 rounded-xl flex flex-col items-center justify-center text-red-500 text-sm p-4 text-center border border-dashed border-red-200">
                                                <span className="font-semibold mb-1">QR Code หมดอายุแล้ว</span>
                                                <span className="text-xs text-red-400">กรุณาปิดหน้าต่างนี้และเริ่มทำรายการใหม่</span>
                                            </div>
                                        ) : amount > 0 ? (
                                            <>
                                                <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm relative mb-3">
                                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#113566] text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap z-10">
                                                        สแกนเพื่อโอนเงิน
                                                    </div>
                                                    <QRCodeCanvas
                                                        value={generatePayload(promptpayId, { amount })}
                                                        size={160}
                                                        level="M"
                                                        includeMargin={true}
                                                        className="rounded-lg"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1.5 text-rose-500 font-[monospace] px-3 py-1.5 bg-rose-50/90 rounded-xl border border-rose-100/50 text-sm font-semibold">
                                                        <span>⏳</span>
                                                        <span>{formatTime(slipTimeLeft)}</span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="h-44 w-44 bg-white rounded-xl flex items-center justify-center text-gray-400 text-xs border border-dashed border-gray-200">
                                                ไม่พบยอดชำระ
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-4 py-3 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wide">ช่องทางชำระเงิน</p>
                                                <p className="text-sm font-semibold text-gray-700">พร้อมเพย์ (PromptPay)</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wide">ชื่อบัญชี</p>
                                                <p className="text-sm font-medium text-gray-700">นาย ณัฐวุฒิ ตังกุลานุพันธ์</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {!qrExpired && (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-2">แนบสลิปโอนเงิน</label>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleSlipChange}
                                                    className="block w-full text-sm text-gray-600 border border-gray-200 rounded-xl p-2 cursor-pointer bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 transition-all"
                                                />
                                            </div>
                                            {fileError && <p className="text-red-500 text-[11px] mt-1.5">{fileError}</p>}
                                        </div>

                                        {slipPreview && (
                                            <div className="relative w-24 h-32 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                                                <img src={slipPreview} alt="Slip preview" className="w-full h-full object-cover" />
                                                <button
                                                    onClick={() => { setSlipFile(null); setSlipPreview(null); }}
                                                    className="absolute top-1 right-1 p-1 bg-black/40 rounded-full text-white hover:bg-black/60 transition-colors"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        )}

                                        <button
                                            onClick={handleSlipSubmit}
                                            disabled={loading || !slipFile}
                                            className={`w-full py-3.5 rounded-xl ${!slipFile || loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#1A3C40] hover:bg-[#1A3C40]/90'} text-white font-medium transition-all shadow-lg flex items-center justify-center gap-2`}
                                        >
                                            {loading ? (
                                                <div className="flex flex-col items-center py-1">
                                                    <Loader2 className="animate-spin mb-1" size={18} />
                                                    <span className="text-[10px] font-bold">กำลังบันทึกข้อมูล ห้ามปิดหน้านี้เด็ดขาด</span>
                                                </div>
                                            ) : (
                                                <>ยืนยันการชำระเงิน (แนบสลิป)</>
                                            )}
                                        </button>

                                        <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
                                            <ShieldCheck size={12} />
                                            <span>ตรวจสอบสลิปและรับสิทธิ์ภายในไม่กี่นาที</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OmiseExtensionPayment;

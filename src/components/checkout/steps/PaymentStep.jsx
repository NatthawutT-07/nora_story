import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Copy, Loader2, Check } from 'lucide-react';
import { useCheckout } from '../CheckoutContext';
import { useState, useEffect } from 'react';
import { storage } from '../../../firebase';
import { ref, getDownloadURL, listAll } from 'firebase/storage';

const PaymentStep = () => {
    const { tier, slipPreview, setSlipFile, setSlipPreview, setError } = useCheckout();
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [loadingQr, setLoadingQr] = useState(true);
    const [qrError, setQrError] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchQrCode = async () => {
            try {
                setLoadingQr(true);
                const listRef = ref(storage, 'data_image_web');
                const res = await listAll(listRef);

                if (res.items.length > 0) {
                    const qrFile = res.items.find(item => item.name.toLowerCase().includes('qr')) || res.items[0];
                    const url = await getDownloadURL(qrFile);
                    setQrCodeUrl(url);
                } else {
                    setQrError("No files found in data_image_web");
                }
            } catch (err) {
                console.error("Error fetching QR code:", err);
                setQrError(err.message);
                try {
                    const qrRef = ref(storage, 'data_image_web/qr_code.jpg');
                    const url = await getDownloadURL(qrRef);
                    setQrCodeUrl(url);
                    setQrError(null);
                } catch (fallbackErr) {
                    console.error("Fallback failed:", fallbackErr);
                }
            } finally {
                setLoadingQr(false);
            }
        };
        fetchQrCode();
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText('0301311230');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

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

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            {/* Amount */}
            <div className="text-center py-2">
                <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5">ยอดชำระ</p>
                <p className="text-3xl font-bold text-[#1A3C40]">
                    ฿{tier?.price}<span className="text-base font-normal text-gray-400">.-</span>
                </p>
            </div>

            {/* Payment Details Card */}
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                {/* QR Code Section */}
                <div className="p-4 flex justify-center border-b border-gray-100">
                    {loadingQr ? (
                        <div className="h-44 w-44 bg-gray-50 rounded-xl flex items-center justify-center">
                            <Loader2 className="animate-spin text-gray-300" size={24} />
                        </div>
                    ) : qrCodeUrl ? (
                        <div className="w-44 bg-white p-2 rounded-xl border border-gray-100">
                            <img src={qrCodeUrl} alt="QR Code Payment" className="w-full h-full object-contain rounded-lg" />
                        </div>
                    ) : (
                        <div className="h-44 w-44 bg-gray-50 rounded-xl flex flex-col items-center justify-center text-gray-400 text-xs p-4 text-center border border-dashed border-gray-200">
                            <span>ไม่พบ QR Code</span>
                            {qrError && <span className="text-[10px] text-red-400 mt-1">{qrError}</span>}
                        </div>
                    )}
                </div>

                {/* Bank Info Section */}
                <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide">ธนาคาร</p>
                            <p className="text-sm font-semibold text-gray-700">กสิกรไทย (KBank)</p>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-[#00A950] flex items-center justify-center text-white text-[10px] font-bold">
                            K+
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">เลขที่บัญชี</p>
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-mono font-bold text-gray-800 tracking-wider">
                                030-1-31123-0
                            </span>
                            <button
                                onClick={handleCopy}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${copied
                                        ? 'bg-[#1A3C40] text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <AnimatePresence mode="wait">
                                    {copied ? (
                                        <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1">
                                            <Check size={12} /> คัดลอกแล้ว
                                        </motion.span>
                                    ) : (
                                        <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1">
                                            <Copy size={12} /> คัดลอก
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">ชื่อบัญชี</p>
                        <p className="text-sm font-medium text-gray-700">นาย ณัฐวุฒิ ตังกุลานุพันธ์</p>
                    </div>
                </div>
            </div>

            {/* Slip Upload */}
            <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                    แนบสลิปโอนเงิน
                </label>
                <label className={`w-full flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-5 cursor-pointer transition-all duration-200 ${slipPreview ? 'border-[#1A3C40] bg-[#1A3C40]/5' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                    {slipPreview ? (
                        <div className="h-32 rounded-lg overflow-hidden">
                            <img src={slipPreview} className="h-full object-contain" alt="slip" />
                        </div>
                    ) : (
                        <div className="text-center text-gray-400">
                            <Upload className="w-6 h-6 mx-auto mb-2 opacity-40" />
                            <span className="text-xs font-medium">คลิกเพื่ออัปโหลดสลิป</span>
                            <p className="text-[10px] text-gray-300 mt-1">รองรับไฟล์ภาพ (สูงสุด 5MB)</p>
                        </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleSlipChange} className="hidden" />
                </label>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
                <span>🔒</span>
                <span>ชำระเงินปลอดภัย · ได้รับลิงก์ภายใน 24 ชม.</span>
            </div>
        </motion.div>
    );
};

export default PaymentStep;

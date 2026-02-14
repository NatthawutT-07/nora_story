import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Copy, Loader2, Check, QrCode, Building2 } from 'lucide-react';
import { useCheckout } from '../CheckoutContext';
import { useState, useEffect } from 'react';
import { storage } from '../../../firebase';
import { ref, getDownloadURL, listAll } from 'firebase/storage';

const KBANK_GREEN = '#00A950';
const KBANK_DARK = '#006B33';

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
            {/* Price Header */}
            <div className="text-center py-3">
                <p className="text-xs text-gray-400 font-medium tracking-wide uppercase mb-1">ยอดชำระเงิน</p>
                <p className="text-4xl font-bold text-[#1A3C40]">
                    ฿{tier?.price}<span className="text-lg font-normal text-gray-400">.-</span>
                </p>
            </div>

            {/* QR Code Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border-2 border-[#00A950]/20 bg-gradient-to-b from-[#00A950]/5 to-white p-4"
            >
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: KBANK_GREEN }}>
                        <QrCode size={14} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">สแกน QR Code</span>
                </div>

                <div className="flex justify-center">
                    {loadingQr ? (
                        <div className="h-48 w-48 bg-white rounded-xl border border-gray-100 flex items-center justify-center shadow-inner">
                            <Loader2 className="animate-spin" style={{ color: KBANK_GREEN }} size={28} />
                        </div>
                    ) : qrCodeUrl ? (
                        <div className="w-48 bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                            <img src={qrCodeUrl} alt="QR Code Payment" className="w-full h-full object-contain rounded-lg" />
                        </div>
                    ) : (
                        <div className="h-48 w-48 bg-gray-50 rounded-xl flex flex-col items-center justify-center text-gray-400 text-xs p-4 text-center border border-dashed border-gray-200">
                            <QrCode size={28} className="mb-2 opacity-40" />
                            <span>ไม่พบ QR Code</span>
                            {qrError && <span className="text-[10px] text-red-400 mt-1">{qrError}</span>}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* OR Divider */}
            <div className="flex items-center gap-3 px-2">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                <span className="text-xs font-medium text-gray-400 bg-white px-2">หรือ</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            </div>

            {/* Bank Transfer Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border-2 border-[#00A950]/20 bg-gradient-to-b from-[#00A950]/5 to-white p-4"
            >
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: KBANK_GREEN }}>
                        <Building2 size={14} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">โอนเงินผ่านบัญชีธนาคาร</span>
                </div>

                {/* Bank Info */}
                <div className="bg-white rounded-xl border border-gray-100 p-3.5 shadow-sm space-y-3">
                    {/* Bank Name */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ background: `linear-gradient(135deg, ${KBANK_GREEN}, ${KBANK_DARK})` }}>
                            K+
                        </div>
                        <div>
                            <p className="text-sm font-semibold" style={{ color: KBANK_GREEN }}>ธนาคารกสิกรไทย</p>
                            <p className="text-[11px] text-gray-400">KBank - Kasikornbank</p>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Account Number */}
                    <div>
                        <p className="text-[10px] text-gray-400 font-medium mb-1 tracking-wide uppercase">เลขที่บัญชี</p>
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-mono font-bold tracking-wider" style={{ color: KBANK_DARK }}>
                                030-1-31123-0
                            </span>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                                style={{
                                    background: copied ? KBANK_GREEN : `${KBANK_GREEN}15`,
                                    color: copied ? 'white' : KBANK_GREEN
                                }}
                            >
                                <AnimatePresence mode="wait">
                                    {copied ? (
                                        <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1">
                                            <Check size={13} />
                                            <span>คัดลอกแล้ว!</span>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1">
                                            <Copy size={13} />
                                            <span>คัดลอก</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Account Name */}
                    <div>
                        <p className="text-[10px] text-gray-400 font-medium mb-0.5 tracking-wide uppercase">ชื่อบัญชี</p>
                        <p className="text-sm font-medium text-gray-700">นาย ณัฐวุฒิ ตังกุลานุพันธ์</p>
                    </div>
                </div>
            </motion.div>

            {/* Slip Upload */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <label className="block text-xs font-medium text-gray-700 mb-2">
                    📎 แนบสลิปโอนเงิน
                </label>
                <label className={`w-full flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-5 cursor-pointer transition-all duration-200 ${slipPreview ? 'border-[#00A950] bg-[#00A950]/5' : 'border-gray-200 hover:border-[#00A950]/40 hover:bg-[#00A950]/[0.02]'}`}>
                    {slipPreview ? (
                        <div className="h-32 rounded-lg overflow-hidden">
                            <img src={slipPreview} className="h-full object-contain" alt="slip" />
                        </div>
                    ) : (
                        <div className="text-center text-gray-400">
                            <Upload className="w-7 h-7 mx-auto mb-2 opacity-40" />
                            <span className="text-xs font-medium">คลิกเพื่ออัปโหลดสลิป</span>
                            <p className="text-[10px] text-gray-300 mt-1">รองรับไฟล์ภาพ (สูงสุด 5MB)</p>
                        </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleSlipChange} className="hidden" />
                </label>
            </motion.div>
        </motion.div>
    );
};

export default PaymentStep;

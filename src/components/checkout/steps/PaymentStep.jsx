import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader2, Check } from 'lucide-react';
import { useCheckout } from '../CheckoutContext';
import { useState, useEffect } from 'react';
import generatePayload from 'promptpay-qr';
import { QRCodeSVG } from 'qrcode.react';

const PaymentStep = () => {
    const { tier, setSlipFile, setSlipPreview, setError, qrExpired, setQrExpired } = useCheckout();
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [loadingQr, setLoadingQr] = useState(true);
    const [qrError, setQrError] = useState(null);
    const [fileError, setFileError] = useState('');
    const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

    const promptpayId = '0948701182'; // Merchant PromptPay number
    const amount = tier?.price ? parseFloat(tier.price.replace(/,/g, '')) : 0;

    useEffect(() => {
        if (amount > 0) {
            const payload = generatePayload(promptpayId, { amount });
            setQrCodeUrl(payload); // We use qrCodeUrl to store the payload string now
            setLoadingQr(false);
        } else {
            setQrError('ไม่พบยอดชำระ');
            setLoadingQr(false);
        }
    }, [amount]);

    useEffect(() => {
        if (qrExpired) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setQrExpired(true);
                    setSlipFile(null);
                    setSlipPreview(null);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [qrExpired, setQrExpired, setSlipFile, setSlipPreview]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };



    const handleSlipChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                setFileError('ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 5MB) กรุณาอัปโหลดใหม่');
                setSlipFile(null);
                setError('');
                e.target.value = null;
                return;
            }
            setFileError('');
            setSlipFile(selectedFile);
            setError('');
            const reader = new FileReader();
            reader.onloadend = () => setSlipPreview(reader.result);
            reader.readAsDataURL(selectedFile);
        } else {
            setSlipFile(null);
            setFileError('');
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
            <div className={`rounded-2xl border ${qrExpired ? 'border-red-200 bg-red-50/30' : 'border-gray-200 bg-white'} overflow-hidden transition-colors`}>
                <div className="p-5 flex flex-col items-center justify-center border-b border-gray-100 bg-gray-50/50">
                    {qrExpired ? (
                        <div className="h-44 w-full bg-red-50/50 rounded-xl flex flex-col items-center justify-center text-red-500 text-sm p-4 text-center border border-dashed border-red-200">
                            <span className="font-semibold mb-1">QR Code หมดอายุแล้ว</span>
                            <span className="text-xs text-red-400">กรุณาปิดหน้าต่างนี้และเริ่มทำรายการใหม่อีกครั้ง</span>
                        </div>
                    ) : loadingQr ? (
                        <div className="h-44 w-44 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                            <Loader2 className="animate-spin text-gray-300" size={24} />
                        </div>
                    ) : qrCodeUrl ? (
                        <>
                            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm relative mb-4">
                                {/* Decorative elements for PromptPay QR */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#113566] text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap z-10">
                                    สแกนจ่ายด้วยแอปธนาคาร
                                </div>
                                <QRCodeSVG
                                    value={qrCodeUrl}
                                    size={180}
                                    level="M"
                                    includeMargin={true}
                                    className="rounded-lg"
                                />
                            </div>
                            <div className="flex items-center gap-1.5 text-rose-500 font-mono text-sm bg-rose-50 px-3 py-1 rounded-full font-medium">
                                <span>⏳</span>
                                <span>{formatTime(timeLeft)}</span>
                            </div>
                        </>
                    ) : (
                        <div className="h-44 w-44 bg-white rounded-xl flex flex-col items-center justify-center text-gray-400 text-xs p-4 text-center border border-dashed border-gray-200 shadow-sm">
                            <span>ไม่สามารถสร้าง QR Code ได้</span>
                            {qrError && <span className="text-[10px] text-red-400 mt-1">{qrError}</span>}
                        </div>
                    )}
                </div>

                {/* Bank Info Section */}
                <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide">ช่องทางชำระเงิน</p>
                            <p className="text-sm font-semibold text-gray-700">พร้อมเพย์ (PromptPay)</p>
                        </div>
                        <div className="flex bg-[#113566] rounded-md p-1.5 items-center gap-1.5">
                            <span className="text-[10px] font-bold text-white px-1">PromptPay</span>
                            <div className="bg-white rounded-[4px] px-1.5 py-0.5 flex flex-col items-center justify-center h-full">
                                <span className="text-[7px] font-extrabold text-[#113566] leading-none mb-[1px]">พร้อมเพย์</span>
                                <span className="text-[6px] font-bold text-[#113566] leading-none">PromptPay</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-px bg-gray-100" />

                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">ชื่อบัญชี</p>
                        <p className="text-sm font-medium text-gray-700">นาย ณัฐวุฒิ ตังกุลานุพันธ์</p>
                    </div>
                </div>
            </div>

            {!qrExpired && (
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                        แนบสลิปโอนเงิน
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleSlipChange}
                        className="block w-full text-sm text-gray-600 border border-gray-200 rounded-lg p-1.5 cursor-pointer bg-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border file:border-gray-200 file:text-xs file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                    />
                    {fileError && (
                        <p className="text-red-500 text-[11px] mt-1.5">{fileError}</p>
                    )}
                </div>
            )}

            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
                <span>🔒</span>
                <span>ชำระเงินปลอดภัย · ลิงก์จะถูกส่งไปยังอีเมลที่คุณระบุหลังจากผ่านการตรวจสอบ</span>
            </div>
        </motion.div >
    );
};

export default PaymentStep;

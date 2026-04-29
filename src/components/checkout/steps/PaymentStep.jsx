import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { QRCodeCanvas } from 'qrcode.react';
import generatePayload from 'promptpay-qr';
import { compressImage } from '../../../utils/imageUtils';
import { useCheckout } from '../CheckoutContext';
import { createOrder } from '../../../api/functions';
import { storage } from '../../../firebase';
import logo from '../../../assets/logo.png';

const PaymentStep = () => {
    const {
        tier,
        formData,
        selectedTemplate,
        selectedColorTheme,
        contentFiles,
        slipFile,
        setSlipFile,
        slipPreview,
        setSlipPreview,
        getMaxImages,
        setLoading,
        loading,
        setError,
        setStep,
        setStoryId,
        qrExpired,
        setQrExpired,
        preGeneratedOrderId,
    } = useCheckout();

    const [imageUrls, setImageUrls] = useState(null);
    const [fileError, setFileError] = useState('');
    const [slipTimeLeft, setSlipTimeLeft] = useState(900); // 15 minutes
    const imageUploadPromiseRef = useRef(null);
    const [processedLogo, setProcessedLogo] = useState(null);

    const amount = tier?.price ? parseFloat(String(tier.price).replace(/,/g, '')) : 0;
    const promptpayId = import.meta.env.VITE_PROMPTPAY_ID || '';

    // ============================================
    // Init Logo & Background Upload
    // ============================================
    useEffect(() => {
        const img = new Image();
        img.src = logo;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.arc(100, 100, 100, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.save();
            ctx.beginPath();
            ctx.arc(100, 100, 96, 0, Math.PI * 2);
            ctx.clip();
            const minSide = Math.min(img.width, img.height);
            const sourceX = (img.width - minSide) / 2;
            const sourceY = (img.height - minSide) / 2;
            ctx.drawImage(img, sourceX, sourceY, minSide, minSide, 0, 0, 200, 200);
            ctx.restore();
            setProcessedLogo(canvas.toDataURL());
        };

        // เริ่มอัปโหลดรูปภาพใน Background ทันที
        if (getMaxImages() > 0 && contentFiles && contentFiles.filter(Boolean).length > 0) {
            imageUploadPromiseRef.current = uploadImages();
            imageUploadPromiseRef.current.then(urls => {
                setImageUrls(urls);
            });
        }
    }, []);

    // ============================================
    // Image Upload (background)
    // ============================================
    const uploadImages = async () => {
        const maxUploads = getMaxImages() || 0;
        if (maxUploads === 0 || !contentFiles || contentFiles.filter(Boolean).length === 0) {
            return [];
        }

        const results = Array(maxUploads).fill(null);
        await Promise.all(
            Array.from({ length: maxUploads }, (_, i) => {
                const file = contentFiles[i];
                if (!file) return Promise.resolve();
                return (async () => {
                    try {
                        const folder = preGeneratedOrderId || formData.buyerPhone || 'anonymous';
                        const compressed = await compressImage(file);
                        const imgRef = storageRef(storage, `uploads/${folder}/${Date.now()}_${i}_${file.name}`);
                        await uploadBytes(imgRef, compressed);
                        results[i] = await getDownloadURL(imgRef);
                    } catch (err) {
                        console.error('Upload failed for file', i, err);
                        const folder = preGeneratedOrderId || formData.buyerPhone || 'anonymous';
                        const imgRef = storageRef(storage, `uploads/${folder}/error_${Date.now()}_${i}_${file.name}`);
                        await uploadBytes(imgRef, file);
                        results[i] = await getDownloadURL(imgRef);
                    }
                })();
            })
        );
        return results;
    };

    // ============================================
    // Countdown Timer
    // ============================================
    useEffect(() => {
        if (qrExpired) return;
        const t = setInterval(() => {
            setSlipTimeLeft(prev => {
                if (prev <= 1) { clearInterval(t); setQrExpired(true); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [qrExpired, setQrExpired]);

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // ============================================
    // Submit Handler
    // ============================================
    const handleSlipSubmit = async () => {
        if (!slipFile) { setFileError('กรุณาแนบสลิปโอนเงิน'); return; }
        setLoading(true);
        setError('');
        try {
            const folder = preGeneratedOrderId || formData.buyerPhone || 'anonymous';
            const slipExt = slipFile.name.split('.').pop();
            const slipName = `slip_${folder}_${Date.now()}.${slipExt}`;
            const sRef = storageRef(storage, `slips/${folder}/${slipName}`);
            const compressed = await compressImage(slipFile, { maxSizeMB: 1, maxWidthOrHeight: 1200 });
            await uploadBytes(sRef, compressed);
            const slipUrl = await getDownloadURL(sRef);

            const maxUploads = getMaxImages() || 0;
            let contentUrls = Array(maxUploads).fill(null);
            if (maxUploads > 0) {
                if (imageUrls) {
                    contentUrls = imageUrls;
                } else if (imageUploadPromiseRef.current) {
                    contentUrls = await imageUploadPromiseRef.current;
                } else {
                    contentUrls = await uploadImages();
                }
            }

            const result = await createOrder({
                orderId: preGeneratedOrderId,
                tierId: tier.id,
                tierName: tier.name,
                price: tier.price,
                buyerName: formData.buyerName,
                buyerEmail: formData.buyerEmail,
                buyerPhone: formData.buyerPhone,
                selectedTemplate,
                // Send all form data — backend uses template config to decide what to save
                pin: formData.pin,
                targetName: formData.targetName,
                signOff: formData.signOff,
                message: formData.message,
                shortMessage: formData.shortMessage,
                customMessage: formData.customMessage,
                timelines: formData.timelines,
                finaleMessage: formData.finaleMessage,
                finaleSignOff: formData.finaleSignOff,
                wantSpecialLink: tier?.wantSpecialLink,
                wantCustomLink: tier?.wantCustomLink,
                customDomain: formData.customDomain,
                slipUrl,
                contentImages: contentUrls,
                musicUrl: formData.musicUrl || null,
                colorThemeId: selectedColorTheme?.id || null,
                platform: 'web',
            });
            if (!result.success) throw new Error(result.error || 'เกิดข้อผิดพลาด');
            setStoryId(result.orderId);
            setStep(6);
        } catch (err) {
            setError('เกิดข้อผิดพลาด: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSlipChange = (e) => {
        const file = e.target.files[0];
        if (!file) { setSlipFile(null); setFileError(''); return; }
        if (file.size > 5 * 1024 * 1024) {
            setFileError('ไฟล์ใหญ่เกิน 5MB'); setSlipFile(null); e.target.value = null; return;
        }
        setFileError('');
        setSlipFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setSlipPreview(reader.result);
        reader.readAsDataURL(file);
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
            <div className={`rounded-2xl border ${qrExpired ? 'border-red-200 bg-red-50/30' : 'border-gray-200 bg-white'} overflow-hidden transition-colors`}>
                <div className="px-4 py-3 flex flex-col items-center justify-center border-b border-gray-100 bg-gray-50/50">
                    {qrExpired ? (
                        <div className="h-44 w-full bg-red-50/50 rounded-xl flex flex-col items-center justify-center text-red-500 text-sm p-4 text-center border border-dashed border-red-200">
                            <span className="font-semibold mb-1">QR Code หมดอายุแล้ว</span>
                            <span className="text-xs text-red-400">กรุณาปิดหน้าต่างนี้และเริ่มทำรายการใหม่</span>
                        </div>
                    ) : amount > 0 ? (
                        <>
                            <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm relative mb-2">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#113566] text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap z-10">
                                    สแกนเพื่อโอนเงิน
                                </div>
                                <QRCodeCanvas
                                    value={generatePayload(promptpayId, { amount })}
                                    size={160}
                                    level="H"
                                    includeMargin={true}
                                    className="rounded-lg"
                                    imageSettings={{
                                        src: processedLogo || logo,
                                        x: undefined,
                                        y: undefined,
                                        height: 42,
                                        width: 42,
                                        excavate: false,
                                    }}
                                />
                            </div>
                            <div className="flex items-center gap-2 mt-1">
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
                    <label className="block text-xs font-medium text-gray-600 mb-2">แนบสลิปโอนเงิน</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleSlipChange}
                        className="block w-full text-sm text-gray-600 border border-gray-200 rounded-xl p-2 cursor-pointer bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 transition-all"
                    />
                    {fileError && <p className="text-red-500 text-[11px] mt-1.5">{fileError}</p>}
                </div>
            )}

            {!qrExpired && (
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
                    ) : 'ยืนยันการชำระเงิน (แนบสลิป)'}
                </button>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
                <span>🔒</span>
                <span>ลิงก์จะถูกส่งไปยังอีเมลหลังจากตรวจสอบสลิปแล้ว</span>
            </div>
        </motion.div>
    );
};

export default PaymentStep;

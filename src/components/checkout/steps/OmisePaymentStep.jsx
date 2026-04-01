import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CreditCard, Upload, RefreshCw, Check, ChevronDown, ShieldCheck } from 'lucide-react';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import generatePayload from 'promptpay-qr';
import { QRCodeCanvas } from 'qrcode.react';
import { useCheckout } from '../CheckoutContext';
import usePaymentSession from '../../../hooks/usePaymentSession';
import { createPaymentSession, createCardCharge, submitOrderWithPayment } from '../../../api/payment';
import { createOrder } from '../../../api/functions';
import { storage } from '../../../firebase';

const MODE = {
    SELECT: 'select',
    STARTING: 'starting',
    PROMPTPAY: 'promptpay',
    CARD: 'card',
    SUBMITTING: 'submitting',
    SLIP: 'slip',
};

const OmisePaymentStep = () => {
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
        needsDetailFields,
        needsTimelineFields,
        getMaxImages,
        setLoading,
        loading,
        setError,
        error,
        setStep,
        setStoryId,
        qrExpired,
        setQrExpired,
    } = useCheckout();

    const [mode, setMode] = useState(MODE.SELECT);
    const [sessionId, setSessionId] = useState(null);
    const [expiresAt, setExpiresAt] = useState(null);
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [localError, setLocalError] = useState('');
    const [imageUrls, setImageUrls] = useState(null);
    const [fileError, setFileError] = useState('');
    const [slipTimeLeft, setSlipTimeLeft] = useState(900);
    const isSubmitCalledRef = useRef(false);
    const imageUploadPromiseRef = useRef(null);

    const { status, secondsLeft, isExpired, isPaid } = usePaymentSession(sessionId, expiresAt);

    const amount = tier?.price ? parseFloat(String(tier.price).replace(/,/g, '')) : 0;
    const promptpayId = import.meta.env.VITE_PROMPTPAY_ID || '';

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // ============================================
    // Image Upload (background)
    // ============================================
    const uploadImages = async () => {
        const maxUploads = getMaxImages() || 0;
        if (maxUploads === 0 || !contentFiles || contentFiles.filter(Boolean).length === 0) {
            return [];
        }
        const opts = { maxSizeMB: 2, maxWidthOrHeight: 1920, useWebWorker: true, initialQuality: 0.85 };
        const results = Array(maxUploads).fill(null);
        await Promise.all(
            Array.from({ length: maxUploads }, (_, i) => {
                const file = contentFiles[i];
                if (!file) return Promise.resolve();
                return (async () => {
                    try {
                        const compressed = await imageCompression(file, opts);
                        const imgRef = storageRef(storage, `temp_${Date.now()}_${i}_${file.name}`);
                        await uploadBytes(imgRef, compressed);
                        results[i] = await getDownloadURL(imgRef);
                    } catch {
                        const imgRef = storageRef(storage, `temp_${Date.now()}_${i}_${file.name}`);
                        await uploadBytes(imgRef, file);
                        results[i] = await getDownloadURL(imgRef);
                    }
                })();
            })
        );
        return results;
    };

    // ============================================
    // Start Session Helpers
    // ============================================
    const startSession = async (paymentMethod) => {
        setLocalError('');
        setMode(MODE.STARTING);
        try {
            const result = await createPaymentSession({
                tierId: tier.id,
                tierName: tier.name,
                price: tier.price,
                paymentMethod,
            });
            if (!result.success) throw new Error(result.error);
            setSessionId(result.sessionId);
            setExpiresAt(result.expiresAt);
            if (paymentMethod === 'promptpay') setQrCodeUrl(result.qrCodeUrl);
            setMode(paymentMethod === 'promptpay' ? MODE.PROMPTPAY : MODE.CARD);
            imageUploadPromiseRef.current = uploadImages();
            imageUploadPromiseRef.current.then(urls => setImageUrls(urls));
        } catch (err) {
            setLocalError(err.message || 'ไม่สามารถสร้างรายการชำระเงินได้ กรุณาลองใหม่');
            setMode(MODE.SELECT);
        }
    };

    // ============================================
    // Card Payment via Omise.js
    // ============================================
    const handleOmiseCardOpen = () => {
        if (!window.OmiseCard) {
            setLocalError('Omise.js ยังโหลดไม่สมบูรณ์ กรุณารีเฟรชหน้าแล้วลองใหม่');
            return;
        }
        const publicKey = import.meta.env.VITE_OMISE_PUBLIC_KEY;
        if (!publicKey) {
            setLocalError('ยังไม่ได้ตั้งค่า Omise Public Key');
            return;
        }
        window.OmiseCard.configure({ publicKey });
        window.OmiseCard.open({
            amount: Math.round(amount * 100),
            currency: 'thb',
            frameLabel: `NoraStory — ฿${tier.price}`,
            submitLabel: 'ชำระเงิน',
            onCreateTokenSuccess: async (nonce) => {
                setLocalError('');
                setMode(MODE.STARTING);
                try {
                    const result = await createCardCharge({ sessionId, omiseToken: nonce.id });
                    if (!result.success) throw new Error(result.error);
                    setMode(MODE.CARD);
                } catch (err) {
                    setLocalError(err.message || 'ชำระเงินไม่สำเร็จ กรุณาลองใหม่');
                    setMode(MODE.CARD);
                }
            },
            onFormClosed: () => {},
        });
    };

    // ============================================
    // Auto-submit when paid
    // ============================================
    useEffect(() => {
        if (!isPaid || isSubmitCalledRef.current || !sessionId) return;
        isSubmitCalledRef.current = true;
        setMode(MODE.SUBMITTING);

        const doSubmit = async () => {
            setError('');
            try {
                let finalImageUrls = imageUrls;
                if (finalImageUrls === null && getMaxImages() > 0) {
                    finalImageUrls = await (imageUploadPromiseRef.current || uploadImages());
                }
                const result = await submitOrderWithPayment({
                    sessionId,
                    tierId: tier.id,
                    tierName: tier.name,
                    price: tier.price,
                    buyerName: formData.buyerName,
                    buyerEmail: formData.buyerEmail,
                    buyerPhone: formData.buyerPhone,
                    needsDetailFields,
                    pin: formData.pin,
                    targetName: formData.targetName,
                    signOff: formData.signOff,
                    message: formData.message,
                    needsTimelineFields,
                    timelines: formData.timelines,
                    finaleMessage: formData.finaleMessage,
                    finaleSignOff: formData.finaleSignOff,
                    wantSpecialLink: tier?.wantSpecialLink,
                    wantCustomLink: tier?.wantCustomLink,
                    customDomain: formData.customDomain,
                    selectedTemplate,
                    slipUrl: '',
                    contentImages: finalImageUrls || [],
                    musicUrl: formData.musicUrl || null,
                    colorThemeId: selectedColorTheme?.id || null,
                    platform: 'web',
                });
                if (!result.success) throw new Error(result.error);
                setStoryId(result.orderId);
                setStep(6);
            } catch (err) {
                setError('เกิดข้อผิดพลาด: ' + err.message);
                isSubmitCalledRef.current = false;
                setMode(isPaid ? MODE.SUBMITTING : MODE.SELECT);
            }
        };
        doSubmit();
    }, [isPaid]);

    // ============================================
    // Expired state sync
    // ============================================
    useEffect(() => {
        if (isExpired && (mode === MODE.PROMPTPAY || mode === MODE.CARD)) {
            setMode(MODE.SELECT);
            setLocalError('หมดเวลาชำระเงิน (10 นาที) กรุณาเริ่มรายการใหม่');
        }
    }, [isExpired, mode]);

    // ============================================
    // Slip fallback countdown
    // ============================================
    useEffect(() => {
        if (mode !== MODE.SLIP || qrExpired) return;
        const t = setInterval(() => {
            setSlipTimeLeft(prev => {
                if (prev <= 1) { clearInterval(t); setQrExpired(true); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [mode, qrExpired, setQrExpired]);

    const handleReset = () => {
        setSessionId(null);
        setExpiresAt(null);
        setQrCodeUrl(null);
        setLocalError('');
        setImageUrls(null);
        imageUploadPromiseRef.current = null;
        isSubmitCalledRef.current = false;
        setMode(MODE.SELECT);
    };

    // ============================================
    // Slip fallback submit
    // ============================================
    const handleSlipSubmit = async () => {
        if (!slipFile) { setFileError('กรุณาแนบสลิปโอนเงิน'); return; }
        setLoading(true);
        setError('');
        try {
            const slipExt = slipFile.name.split('.').pop();
            const sRef = storageRef(storage, `slips/temp_${Date.now()}_slip.${slipExt}`);
            const compressed = await imageCompression(slipFile, { maxSizeMB: 1, maxWidthOrHeight: 1200, useWebWorker: true });
            await uploadBytes(sRef, compressed);
            const slipUrl = await getDownloadURL(sRef);

            const maxUploads = getMaxImages() || 0;
            let contentUrls = Array(maxUploads).fill(null);
            if (maxUploads > 0) contentUrls = await uploadImages();

            const result = await createOrder({
                tierId: tier.id,
                tierName: tier.name,
                price: tier.price,
                buyerName: formData.buyerName,
                buyerEmail: formData.buyerEmail,
                buyerPhone: formData.buyerPhone,
                needsDetailFields,
                pin: formData.pin,
                targetName: formData.targetName,
                signOff: formData.signOff,
                message: formData.message,
                needsTimelineFields,
                timelines: formData.timelines,
                finaleMessage: formData.finaleMessage,
                finaleSignOff: formData.finaleSignOff,
                wantSpecialLink: tier?.wantSpecialLink,
                wantCustomLink: tier?.wantCustomLink,
                customDomain: formData.customDomain,
                selectedTemplate,
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

    // ============================================
    // Render
    // ============================================
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">

            {/* Error Banner */}
            <AnimatePresence>
                {localError && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-3 flex items-start gap-2"
                    >
                        <span className="mt-0.5">⚠️</span>
                        <span>{localError}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── MODE: SELECT ─── */}
            {mode === MODE.SELECT && (
                <div className="space-y-3">
                    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide">ยอดชำระ</p>
                            <p className="text-2xl font-extrabold text-[#1A3C40]">฿{tier?.price}<span className="text-sm font-normal text-gray-400">.-</span></p>
                        </div>
                        <div className="p-4 space-y-2.5">
                            <p className="text-xs font-medium text-gray-500 mb-1">เลือกช่องทางชำระเงิน</p>

                            {/* PromptPay */}
                            <button
                                onClick={() => startSession('promptpay')}
                                className="w-full flex items-center gap-3 p-3.5 rounded-xl border-2 border-[#1A3C40]/20 hover:border-[#1A3C40]/60 hover:bg-[#1A3C40]/5 transition-all text-left group"
                            >
                                <div className="w-9 h-9 bg-[#113566] rounded-lg flex items-center justify-center shrink-0">
                                    <span className="text-white text-[10px] font-extrabold leading-tight text-center">PP</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-[#1A3C40]">พร้อมเพย์ (PromptPay)</p>
                                    <p className="text-[11px] text-gray-400">สแกน QR Code จ่ายทันที</p>
                                </div>
                                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">แนะนำ</span>
                            </button>

                            {/* Credit/Debit Card */}
                            <button
                                onClick={() => startSession('card')}
                                className="w-full flex items-center gap-3 p-3.5 rounded-xl border-2 border-gray-200 hover:border-[#1A3C40]/60 hover:bg-[#1A3C40]/5 transition-all text-left"
                            >
                                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                                    <CreditCard size={18} className="text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-[#1A3C40]">บัตรเครดิต / เดบิต</p>
                                    <p className="text-[11px] text-gray-400">Visa, Mastercard ผ่าน Omise</p>
                                </div>
                            </button>

                            {/* Slip Fallback Toggle */}
                            <button
                                onClick={() => setMode(MODE.SLIP)}
                                className="w-full flex items-center gap-2 text-[11px] text-gray-400 hover:text-gray-600 transition-colors py-1 justify-center"
                            >
                                <ChevronDown size={13} />
                                ชำระด้วยการโอนเงินแล้วแนบสลิปเอง
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
                        <ShieldCheck size={12} />
                        <span>ชำระเงินปลอดภัยผ่าน Omise · ข้อมูลบัตรถูกเข้ารหัส</span>
                    </div>
                </div>
            )}

            {/* ─── MODE: STARTING ─── */}
            {mode === MODE.STARTING && (
                <div className="rounded-2xl border border-gray-200 bg-white p-8 flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-[#1A3C40]" size={28} />
                    <p className="text-sm text-gray-500">กำลังสร้างรายการชำระเงิน...</p>
                </div>
            )}

            {/* ─── MODE: PROMPTPAY ─── */}
            {mode === MODE.PROMPTPAY && (
                <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                    <div className="px-4 py-2 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <p className="text-xs font-semibold text-[#1A3C40]">พร้อมเพย์ (PromptPay)</p>
                        {secondsLeft > 0 && (
                            <div className="flex items-center gap-1.5 text-rose-500 font-[monospace] bg-rose-50 px-3 py-1 rounded-full border border-rose-100/50 text-xs font-semibold">
                                <span>⏳</span>
                                <span>{formatTime(secondsLeft)}</span>
                            </div>
                        )}
                    </div>
                    <div className="p-4 flex flex-col items-center gap-3">
                        {qrCodeUrl ? (
                            <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                                <img src={qrCodeUrl} alt="PromptPay QR" className="w-44 h-44 object-contain rounded-lg" />
                            </div>
                        ) : (
                            <div className="w-44 h-44 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center">
                                <Loader2 className="animate-spin text-gray-300" size={20} />
                            </div>
                        )}
                        <p className="text-xs text-gray-500 text-center">สแกน QR Code ด้วยแอปธนาคาร<br />แล้วระบบจะบันทึกคำสั่งซื้ออัตโนมัติ</p>
                        <p className="text-lg font-extrabold text-[#1A3C40]">฿{tier?.price}</p>
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <RefreshCw size={11} />
                            เปลี่ยนช่องทางชำระ
                        </button>
                    </div>
                </div>
            )}

            {/* ─── MODE: CARD ─── */}
            {mode === MODE.CARD && (
                <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                    <div className="px-4 py-2 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <p className="text-xs font-semibold text-[#1A3C40]">บัตรเครดิต / เดบิต</p>
                        {secondsLeft > 0 && (
                            <div className="flex items-center gap-1.5 text-rose-500 font-[monospace] bg-rose-50 px-3 py-1 rounded-full border border-rose-100/50 text-xs font-semibold">
                                <span>⏳</span>
                                <span>{formatTime(secondsLeft)}</span>
                            </div>
                        )}
                    </div>
                    <div className="p-4 flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-[#1A3C40]/5 rounded-2xl flex items-center justify-center">
                            <CreditCard size={28} className="text-[#1A3C40]" />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-extrabold text-[#1A3C40]">฿{tier?.price}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Visa / Mastercard ผ่าน Omise</p>
                        </div>
                        <button
                            onClick={handleOmiseCardOpen}
                            className="w-full py-3 rounded-xl bg-[#1A3C40] text-white font-semibold text-sm hover:bg-[#1A3C40]/90 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            <CreditCard size={16} />
                            กรอกข้อมูลบัตรและชำระเงิน
                        </button>
                        <p className="text-[10px] text-gray-400 text-center">ข้อมูลบัตรถูกส่งตรงไปยัง Omise อย่างปลอดภัย<br />ไม่ผ่านระบบของเรา</p>
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <RefreshCw size={11} />
                            เปลี่ยนช่องทางชำระ
                        </button>
                    </div>
                </div>
            )}

            {/* ─── MODE: SUBMITTING ─── */}
            {mode === MODE.SUBMITTING && (
                <div className="rounded-2xl border border-green-200 bg-green-50/30 p-8 flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                        <Check size={26} className="text-green-600" />
                    </div>
                    <p className="text-sm font-semibold text-green-700">ชำระเงินสำเร็จ!</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Loader2 className="animate-spin" size={14} />
                        กำลังบันทึกคำสั่งซื้อ...
                    </div>
                </div>
            )}

            {/* ─── MODE: SLIP ─── */}
            {mode === MODE.SLIP && (
                <div className="space-y-3">
                    <button
                        onClick={() => { setMode(MODE.SELECT); setFileError(''); }}
                        className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <RefreshCw size={11} />
                        กลับไปเลือกช่องทางชำระด้วย Omise
                    </button>

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
                                            level="M"
                                            includeMargin={true}
                                            className="rounded-lg"
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
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wide">ช่องทางชำระเงิน</p>
                                <p className="text-sm font-semibold text-gray-700">พร้อมเพย์ (PromptPay)</p>
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

                    {/* Slip submit button (self-contained) */}
                    {!qrExpired && (
                        <button
                            onClick={handleSlipSubmit}
                            disabled={loading || !slipFile}
                            className={`w-full py-3.5 rounded-xl ${!slipFile || loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#1A3C40] hover:bg-[#1A3C40]/90'} text-white font-medium transition-all shadow-lg flex items-center justify-center gap-2`}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'ยืนยันการชำระเงิน (แนบสลิป)'}
                        </button>
                    )}

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
                        <span>🔒</span>
                        <span>ลิงก์จะถูกส่งไปยังอีเมลหลังจากตรวจสอบสลิปแล้ว</span>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default OmisePaymentStep;

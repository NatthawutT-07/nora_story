import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CreditCard, CheckCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import generatePayload from 'promptpay-qr';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { storage } from '../../firebase';
import usePaymentSession from '../../hooks/usePaymentSession';
import {
    createPaymentSession,
    createCardCharge,
    submitExtensionWithPayment,
    submitEditPaymentWithOmise,
} from '../../api/payment';

const MODE = {
    SELECT: 'select',
    STARTING: 'starting',
    PROMPTPAY: 'promptpay',
    CARD: 'card',
    SUBMITTING: 'submitting',
    SUCCESS: 'success',
    SLIP: 'slip',
};

/**
 * OmiseExtensionPayment
 * Reusable Omise payment modal for extension / text edit / image edit flows.
 *
 * Props:
 *   isOpen         - boolean
 *   onClose        - () => void
 *   onSuccess      - (result) => void  — called after auto-approval
 *   onSlipSubmitted- (slipUrl) => void — called after slip upload (old manual flow)
 *   price          - number (THB)
 *   label          - string  e.g. "ต่ออายุ 30 วัน"
 *   paymentType    - 'extension' | 'textEdit' | 'imageEdit'
 *   orderId        - string
 *   packageDays    - number (extension only)
 *   editType       - 'text' | 'image' (edit only)
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
    const [mode, setMode] = useState(MODE.SELECT);
    const [sessionId, setSessionId] = useState(null);
    const [expiresAt, setExpiresAt] = useState(null);
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [qrPayload, setQrPayload] = useState(null);
    const [chargeId, setChargeId] = useState(null);
    const [localError, setLocalError] = useState('');
    const [cardForm, setCardForm] = useState({ name: '', number: '', expMonth: '', expYear: '', cvc: '' });
    const [cardProcessing, setCardProcessing] = useState(false);
    const [manualChecking, setManualChecking] = useState(false);
    const [slipFile, setSlipFile] = useState(null);
    const [slipUploading, setSlipUploading] = useState(false);
    const [successData, setSuccessData] = useState(null);

    const isSubmitCalledRef = useRef(false);
    const isStartingRef = useRef(false);
    const manualCheckTimeoutRef = useRef(null);

    const { secondsLeft, isExpired, isPaid } = usePaymentSession(sessionId, expiresAt);

    const promptpayId = import.meta.env.VITE_PROMPTPAY_ID || '';

    // Compute the best QR value to render
    const qrValue = qrCodeUrl || qrPayload
        || (promptpayId && price ? generatePayload(promptpayId, { amount: price }) : null);

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // Reset all state when modal closes
    useEffect(() => {
        if (!isOpen) {
            if (manualCheckTimeoutRef.current) {
                clearTimeout(manualCheckTimeoutRef.current);
                manualCheckTimeoutRef.current = null;
            }
            setMode(MODE.SELECT);
            setSessionId(null);
            setExpiresAt(null);
            setQrCodeUrl(null);
            setQrPayload(null);
            setChargeId(null);
            setLocalError('');
            setCardForm({ name: '', number: '', expMonth: '', expYear: '', cvc: '' });
            setCardProcessing(false);
            setManualChecking(false);
            setSlipFile(null);
            setSuccessData(null);
            isSubmitCalledRef.current = false;
            isStartingRef.current = false;
        }
    }, [isOpen]);

    // ============================================
    // Start Payment Session
    // ============================================
    const startSession = async (paymentMethod) => {
        if (isStartingRef.current) return;
        isStartingRef.current = true;
        setLocalError('');
        setMode(MODE.STARTING);
        try {
            const result = await createPaymentSession({
                tierId: `ext_${paymentType}`,
                tierName: label,
                price,
                paymentMethod,
            });
            if (!result.success) throw new Error(result.error);
            setSessionId(result.sessionId);
            setExpiresAt(result.expiresAt);
            if (paymentMethod === 'promptpay') {
                setQrCodeUrl(result.qrCodeUrl || null);
                setQrPayload(result.qrPayload || null);
                setChargeId(result.chargeId || null);
            }
            setMode(paymentMethod === 'promptpay' ? MODE.PROMPTPAY : MODE.CARD);
        } catch (err) {
            setLocalError(err.message || 'ไม่สามารถสร้างรายการชำระเงินได้ กรุณาลองใหม่');
            setMode(MODE.SELECT);
        } finally {
            isStartingRef.current = false;
        }
    };

    // ============================================
    // Auto-approve action (called after isPaid)
    // ============================================
    const doAutoApprove = async (sid) => {
        setMode(MODE.SUBMITTING);
        try {
            let result;
            if (paymentType === 'extension') {
                result = await submitExtensionWithPayment({ sessionId: sid, orderId, packageDays });
            } else {
                result = await submitEditPaymentWithOmise({
                    sessionId: sid,
                    orderId,
                    editType: paymentType === 'textEdit' ? 'text' : 'image',
                });
            }
            if (!result.success) throw new Error(result.error);
            setSuccessData(result);
            setMode(MODE.SUCCESS);
            onSuccess && onSuccess(result);
        } catch (err) {
            const msg = err.message || '';
            if (msg.includes('ดำเนินการไปแล้ว')) {
                setSuccessData({});
                setMode(MODE.SUCCESS);
                onSuccess && onSuccess({});
            } else if (msg.includes('ยังไม่สำเร็จ') || msg.includes('FAILED_PRECONDITION') || msg.includes('failed-precondition')) {
                setLocalError('ยังไม่พบการชำระเงิน กรุณาสแกน QR แล้วกดปุ่มอีกครั้งหลังชำระเงินแล้ว');
                isSubmitCalledRef.current = false;
                setMode(MODE.PROMPTPAY);
            } else {
                setLocalError('เกิดข้อผิดพลาด: ' + msg);
                isSubmitCalledRef.current = false;
                setMode(sessionId ? MODE.PROMPTPAY : MODE.SELECT);
            }
        }
    };

    // ============================================
    // Watch isPaid — auto-approve when confirmed by webhook
    // ============================================
    useEffect(() => {
        if (!isPaid || isSubmitCalledRef.current || !sessionId) return;
        isSubmitCalledRef.current = true;
        if (manualCheckTimeoutRef.current) {
            clearTimeout(manualCheckTimeoutRef.current);
            manualCheckTimeoutRef.current = null;
        }
        setManualChecking(false);
        doAutoApprove(sessionId);
    }, [isPaid]);

    // ============================================
    // Session expired — back to SELECT
    // ============================================
    useEffect(() => {
        if (isExpired && (mode === MODE.PROMPTPAY || mode === MODE.CARD)) {
            if (manualCheckTimeoutRef.current) {
                clearTimeout(manualCheckTimeoutRef.current);
                manualCheckTimeoutRef.current = null;
            }
            setManualChecking(false);
            setMode(MODE.SELECT);
            setSessionId(null);
            setExpiresAt(null);
            setQrCodeUrl(null);
            setQrPayload(null);
            setChargeId(null);
            isSubmitCalledRef.current = false;
            setLocalError('หมดเวลาชำระเงิน (10 นาที) กรุณาเริ่มรายการใหม่');
        }
    }, [isExpired]);

    // ============================================
    // Manual check — enter waiting state, let isPaid watcher handle the rest
    // ============================================
    const handleManualCheck = () => {
        if (!sessionId || manualChecking || isSubmitCalledRef.current) return;
        setManualChecking(true);
        setLocalError('');
        // Auto-cancel waiting after 2 minutes if no confirmation received
        manualCheckTimeoutRef.current = setTimeout(() => {
            setManualChecking(false);
            setLocalError('ยังไม่ได้รับการยืนยัน กรุณาตรวจสอบสลิปหรือลองใหม่อีกครั้ง');
        }, 120000);
    };

    // ============================================
    // Card Payment via Omise.js
    // ============================================
    const handleCardSubmit = async () => {
        if (cardProcessing) return;
        if (!cardForm.number || !cardForm.name || !cardForm.expMonth || !cardForm.expYear || !cardForm.cvc) {
            setLocalError('กรุณากรอกข้อมูลบัตรให้ครบถ้วน');
            return;
        }
        if (!window.Omise) {
            setLocalError('Omise.js ยังโหลดไม่สมบูรณ์ กรุณารีเฟรชหน้าแล้วลองใหม่');
            return;
        }
        const publicKey = import.meta.env.VITE_OMISE_PUBLIC_KEY;
        if (!publicKey) {
            setLocalError('ยังไม่ได้ตั้งค่า Omise Public Key');
            return;
        }

        setCardProcessing(true);
        setLocalError('');
        window.Omise.setPublicKey(publicKey);

        window.Omise.createToken('card', {
            name: cardForm.name,
            number: cardForm.number.replace(/\s/g, ''),
            expiration_month: parseInt(cardForm.expMonth),
            expiration_year: parseInt(cardForm.expYear.length === 2 ? `20${cardForm.expYear}` : cardForm.expYear),
            security_code: cardForm.cvc,
        }, async (statusCode, response) => {
            if (statusCode !== 200 || response.object === 'error') {
                setLocalError(response.message || 'ข้อมูลบัตรไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่');
                setCardProcessing(false);
                return;
            }
            const omiseToken = response.id;
            try {
                const result = await createCardCharge({ sessionId, omiseToken });
                if (!result.success) throw new Error(result.error);
            } catch (err) {
                if (!isSubmitCalledRef.current) {
                    setLocalError(err.message || 'ชำระเงินไม่สำเร็จ กรุณาลองใหม่');
                }
            } finally {
                setCardProcessing(false);
            }
        });
    };

    // ============================================
    // Slip Fallback
    // ============================================
    const handleSlipSubmit = async () => {
        if (!slipFile) { setLocalError('กรุณาแนบสลิปโอนเงิน'); return; }
        setSlipUploading(true);
        setLocalError('');
        try {
            const ext = slipFile.name.split('.').pop();
            const sRef = storageRef(storage, `extension_slips/${orderId}/${Date.now()}_slip.${ext}`);
            const compressed = await imageCompression(slipFile, { maxSizeMB: 1, maxWidthOrHeight: 1200, useWebWorker: true });
            await uploadBytes(sRef, compressed);
            const slipUrl = await getDownloadURL(sRef);
            onSlipSubmitted && onSlipSubmitted(slipUrl);
            onClose && onClose();
        } catch (err) {
            setLocalError('เกิดข้อผิดพลาดในการอัปโหลดสลิป: ' + err.message);
        } finally {
            setSlipUploading(false);
        }
    };

    const handleReset = () => {
        if (manualCheckTimeoutRef.current) {
            clearTimeout(manualCheckTimeoutRef.current);
            manualCheckTimeoutRef.current = null;
        }
        setSessionId(null);
        setExpiresAt(null);
        setQrCodeUrl(null);
        setQrPayload(null);
        setChargeId(null);
        setLocalError('');
        setManualChecking(false);
        isSubmitCalledRef.current = false;
        isStartingRef.current = false;
        setCardForm({ name: '', number: '', expMonth: '', expYear: '', cvc: '' });
        setMode(MODE.SELECT);
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
                    onClick={(e) => { if (e.target === e.currentTarget && mode !== MODE.SUBMITTING) onClose?.(); }}
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
                                {mode !== MODE.SUBMITTING && mode !== MODE.SUCCESS && (
                                    <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                                        <X size={18} className="text-gray-400" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-5 space-y-3 max-h-[80vh] overflow-y-auto">

                            {/* Error Banner */}
                            <AnimatePresence>
                                {localError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-3"
                                    >
                                        {localError}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ─── SELECT ─── */}
                            {mode === MODE.SELECT && (
                                <div className="space-y-2.5">
                                    <p className="text-xs font-medium text-gray-500">เลือกช่องทางชำระเงิน</p>

                                    <button
                                        onClick={() => startSession('promptpay')}
                                        className="w-full flex items-center gap-3 p-3.5 rounded-xl border-2 border-[#1A3C40]/20 hover:border-[#1A3C40]/60 hover:bg-[#1A3C40]/5 transition-all text-left"
                                    >
                                        <div className="w-9 h-9 bg-[#113566] rounded-lg flex items-center justify-center shrink-0">
                                            <span className="text-white text-[10px] font-extrabold">PP</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-[#1A3C40]">พร้อมเพย์ (PromptPay)</p>
                                            <p className="text-[11px] text-gray-400">สแกน QR Code จ่ายทันที</p>
                                        </div>
                                        <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full shrink-0">แนะนำ</span>
                                    </button>

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

                                    <button
                                        onClick={() => { setMode(MODE.SLIP); setLocalError(''); }}
                                        className="w-full flex items-center gap-2 text-[11px] text-gray-400 hover:text-gray-600 transition-colors py-1 justify-center"
                                    >
                                        โอนเงินแล้วแนบสลิปเอง (รอทีมงานตรวจสอบ)
                                    </button>

                                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
                                        <ShieldCheck size={12} />
                                        <span>ชำระเงินปลอดภัยผ่าน Omise · ข้อมูลบัตรถูกเข้ารหัส</span>
                                    </div>
                                </div>
                            )}

                            {/* ─── STARTING ─── */}
                            {mode === MODE.STARTING && (
                                <div className="flex flex-col items-center gap-3 py-8">
                                    <Loader2 className="animate-spin text-[#1A3C40]" size={28} />
                                    <p className="text-sm text-gray-500">กำลังสร้างรายการชำระเงิน...</p>
                                </div>
                            )}

                            {/* ─── PROMPTPAY ─── */}
                            {mode === MODE.PROMPTPAY && (
                                <div className="space-y-3">
                                    <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 flex items-center justify-between">
                                        <p className="text-xs font-semibold text-[#1A3C40]">พร้อมเพย์ (PromptPay)</p>
                                        {secondsLeft > 0 && (
                                            <div className="flex items-center gap-1 text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full text-xs font-semibold font-[monospace]">
                                                <span>⏳</span>
                                                <span>{formatTime(secondsLeft)}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-center gap-3">
                                        {qrValue && !qrValue.startsWith('data:') && !qrValue.startsWith('http') ? (
                                            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm relative">
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#113566] text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap z-10">
                                                    สแกนเพื่อชำระเงิน
                                                </div>
                                                <QRCodeCanvas value={qrValue} size={168} level="M" includeMargin={true} />
                                            </div>
                                        ) : qrValue ? (
                                            <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                                                <img src={qrValue} alt="PromptPay QR" className="w-44 h-44 object-contain rounded-lg" />
                                            </div>
                                        ) : (
                                            <div className="w-44 h-44 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center">
                                                <Loader2 className="animate-spin text-gray-300" size={20} />
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-500 text-center">
                                            สแกน QR Code ด้วยแอปธนาคาร<br />
                                            ระบบจะอนุมัติอัตโนมัติทันทีหลังชำระสำเร็จ
                                        </p>
                                    </div>

                                    {manualChecking ? (
                                        <div className="w-full flex flex-col items-center gap-2 py-3 rounded-xl bg-[#1A3C40]/10 border border-[#1A3C40]/20">
                                            <div className="flex items-center gap-2 text-[#1A3C40] font-semibold text-sm">
                                                <Loader2 className="animate-spin" size={16} />
                                                กำลังรอการยืนยันจากระบบ...
                                            </div>
                                            <p className="text-[11px] text-gray-500 text-center">
                                                กรุณาอย่าปิดหน้าต่างนี้
                                            </p>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleManualCheck}
                                            className="w-full py-3 rounded-xl bg-[#1A3C40] text-white font-semibold text-sm hover:bg-[#1A3C40]/90 transition-all shadow"
                                        >
                                            ชำระเงินแล้ว
                                        </button>
                                    )}

                                    {!manualChecking && (
                                        <button
                                            onClick={handleReset}
                                            className="w-full flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-600 transition-colors justify-center"
                                        >
                                            <RefreshCw size={11} /> เปลี่ยนช่องทางชำระ
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* ─── CARD ─── */}
                            {mode === MODE.CARD && (
                                <div className="space-y-3">
                                    <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 flex items-center justify-between">
                                        <p className="text-xs font-semibold text-[#1A3C40]">บัตรเครดิต / เดบิต</p>
                                        {secondsLeft > 0 && (
                                            <div className="flex items-center gap-1 text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full text-xs font-semibold font-[monospace]">
                                                <span>⏳</span>
                                                <span>{formatTime(secondsLeft)}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-medium text-gray-500 mb-1">หมายเลขบัตร</label>
                                        <input
                                            type="text" inputMode="numeric" placeholder="0000 0000 0000 0000" maxLength={19}
                                            value={cardForm.number}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
                                                setCardForm(p => ({ ...p, number: v }));
                                            }}
                                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C40]/20 focus:border-[#1A3C40]/40 transition-all font-[monospace] tracking-wider"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-medium text-gray-500 mb-1">ชื่อบนบัตร</label>
                                        <input
                                            type="text" placeholder=""
                                            value={cardForm.name}
                                            onChange={(e) => setCardForm(p => ({ ...p, name: e.target.value.toUpperCase() }))}
                                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C40]/20 focus:border-[#1A3C40]/40 transition-all uppercase"
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <label className="block text-[11px] font-medium text-gray-500 mb-1">เดือน/ปี</label>
                                            <input
                                                type="text" inputMode="numeric" placeholder="MM/YY" maxLength={5}
                                                value={cardForm.expMonth ? (cardForm.expMonth.length === 2 ? `${cardForm.expMonth}/${cardForm.expYear}` : cardForm.expMonth) : ''}
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    if (v === cardForm.expMonth && cardForm.expYear === '') {
                                                        setCardForm(p => ({ ...p, expMonth: p.expMonth.slice(0, 1) }));
                                                        return;
                                                    }
                                                    const clean = v.replace(/\D/g, '').slice(0, 4);
                                                    setCardForm(p => ({ ...p, expMonth: clean.slice(0, 2), expYear: clean.slice(2, 4) }));
                                                }}
                                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#1A3C40]/20 focus:border-[#1A3C40]/40 transition-all font-[monospace]"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-[11px] font-medium text-gray-500 mb-1">CVV</label>
                                            <input
                                                type="password" inputMode="numeric" placeholder="•••" maxLength={4}
                                                value={cardForm.cvc}
                                                onChange={(e) => setCardForm(p => ({ ...p, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#1A3C40]/20 focus:border-[#1A3C40]/40 transition-all font-[monospace]"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCardSubmit}
                                        disabled={cardProcessing || !cardForm.number || !cardForm.name || !cardForm.expMonth || !cardForm.expYear || !cardForm.cvc}
                                        className="w-full py-3 rounded-xl bg-[#1A3C40] text-white font-semibold text-sm hover:bg-[#1A3C40]/90 transition-all shadow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {cardProcessing ? (
                                            <><Loader2 className="animate-spin" size={16} /> กำลังชำระเงิน...</>
                                        ) : (
                                            <><CreditCard size={16} /> ชำระเงิน ฿{price.toLocaleString()}</>
                                        )}
                                    </button>

                                    <p className="text-[10px] text-gray-400 text-center">
                                        ข้อมูลบัตรถูกส่งตรงไปยัง Omise อย่างปลอดภัย ไม่ผ่านระบบของเรา
                                    </p>

                                    <button
                                        onClick={handleReset}
                                        className="w-full flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-600 transition-colors justify-center"
                                    >
                                        <RefreshCw size={11} /> เปลี่ยนช่องทางชำระ
                                    </button>
                                </div>
                            )}

                            {/* ─── SUBMITTING ─── */}
                            {mode === MODE.SUBMITTING && (
                                <div className="flex flex-col items-center gap-4 py-8">
                                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                        <CheckCircle size={32} className="text-green-500" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-green-700">ชำระเงินสำเร็จ!</p>
                                        <p className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
                                            <Loader2 size={12} className="animate-spin" />
                                            กำลังอัปเดต...
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* ─── SUCCESS ─── */}
                            {mode === MODE.SUCCESS && (
                                <div className="flex flex-col items-center gap-4 py-6">
                                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                                        <CheckCircle size={40} className="text-green-500" />
                                    </div>
                                    <div className="text-center space-y-1">
                                        <p className="font-bold text-[#1A3C40] text-lg">สำเร็จ!</p>
                                        <p className="text-sm text-gray-500">{label}</p>
                                        {paymentType === 'extension' && successData?.newExpiry && (
                                            <p className="text-xs text-green-600 font-medium mt-1">
                                                วันหมดอายุใหม่:{' '}
                                                {new Date(successData.newExpiry).toLocaleDateString('th-TH', {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                            </p>
                                        )}
                                        {(paymentType === 'textEdit' || paymentType === 'imageEdit') && (
                                            <p className="text-xs text-green-600 font-medium mt-1">
                                                สิทธิ์แก้ไขถูกเปิดใช้งานแล้ว กรุณารีเฟรชหน้า
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="px-8 py-2.5 bg-[#1A3C40] text-white rounded-xl text-sm font-medium hover:bg-[#1A3C40]/90 transition-all"
                                    >
                                        ปิด
                                    </button>
                                </div>
                            )}

                            {/* ─── SLIP FALLBACK ─── */}
                            {mode === MODE.SLIP && (
                                <div className="space-y-4">
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                                        <p className="text-xs text-amber-700 font-medium">⚠️ การแนบสลิปต้องรอทีมงานตรวจสอบ (ไม่อัตโนมัติ)</p>
                                        <p className="text-[11px] text-amber-600 mt-0.5">แนะนำให้ใช้ PromptPay เพื่อรับสิทธิ์ทันที</p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-2">แนบสลิปโอนเงิน ({price} ฿)</label>
                                        <input
                                            type="file" accept="image/*"
                                            onChange={(e) => setSlipFile(e.target.files?.[0] || null)}
                                            className="block w-full text-sm text-gray-600 border border-gray-200 rounded-lg p-1.5 cursor-pointer bg-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border file:border-gray-200 file:text-xs file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                                        />
                                    </div>

                                    <button
                                        onClick={handleSlipSubmit}
                                        disabled={slipUploading || !slipFile}
                                        className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${slipUploading || !slipFile ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#E8A08A] text-[#1A3C40] hover:bg-[#d89279]'}`}
                                    >
                                        {slipUploading ? <><Loader2 size={14} className="animate-spin" /> กำลังส่ง...</> : 'ส่งสลิป (รอตรวจสอบ)'}
                                    </button>

                                    <button
                                        onClick={() => { setMode(MODE.SELECT); setLocalError(''); }}
                                        className="w-full flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-600 transition-colors justify-center"
                                    >
                                        <RefreshCw size={11} /> กลับไปเลือกช่องทางชำระเงิน
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OmiseExtensionPayment;

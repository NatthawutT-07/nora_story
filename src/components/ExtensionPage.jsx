import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp, deleteField, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, Upload, Clock, CreditCard, ChevronLeft, AlertCircle, Timer, Globe, Sparkles, Copy, Check, Pencil, Image, X, FileText } from 'lucide-react';
import { TIERS } from '../data/tierData';
import generatePayload from 'promptpay-qr';
import { QRCodeSVG } from 'qrcode.react';
import ExtendTab from './extension/ExtendTab';
import EditTab from './extension/EditTab';
import HistoryTab from './extension/HistoryTab';

// Build extension packages from tierData.js so pricing stays in sync
const EXTENSION_PACKAGES_BY_TIER = {};
TIERS.forEach(tier => {
    const tierId = parseInt(tier.id);
    if (tier.extensionTiers && tier.extensionTiers.length > 0) {
        EXTENSION_PACKAGES_BY_TIER[tierId] = tier.extensionTiers.map(ext => ({
            days: ext.days,
            price: ext.price,
            label: `${ext.days} วัน`,
            perDay: `~${Math.round(ext.price / ext.days)}฿/วัน`,
            recommended: ext.popular || false,
            best: ext.best || false,
        }));
    }
});

const TIER_NAMES = {};
TIERS.forEach(tier => {
    TIER_NAMES[parseInt(tier.id)] = tier.name;
});

// Edit config per tier
const EDIT_CONFIG = {
    1: { freeTextEdits: 1, freeImageEdits: 0, paidTextPrice: 29, paidImagePrice: 0 },
    2: { freeTextEdits: 1, freeImageEdits: 1, paidTextPrice: 29, paidImagePrice: 49 },
    3: { freeTextEdits: 3, freeImageEdits: 1, paidTextPrice: 29, paidImagePrice: 79 },
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
    const [customDomain1, setCustomDomain1] = useState('');
    const [customDomain2, setCustomDomain2] = useState('');
    const [copied, setCopied] = useState(false);
    const [qrPayload, setQrPayload] = useState(null);
    const promptpayId = '0948701182';
    const [activeTab, setActiveTab] = useState('extend'); // 'extend' | 'editText' | 'editImage' | 'history'

    // Edit states
    const [editTextMode, setEditTextMode] = useState(false);
    const [editImageMode, setEditImageMode] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [editImageFiles, setEditImageFiles] = useState([]);
    const [editSlipFile, setEditSlipFile] = useState(null);
    const [editPayType, setEditPayType] = useState(null); // 'text' | 'image'
    const [editSubmitting, setEditSubmitting] = useState(false);

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
            const updates = {
                extension_status: 'pending',
                extension_slip_url: slipUrl,
                extension_requested_days: selectedPackage.days,
                extension_requested_price: totalPrice,
                extension_requested_subdomain: wantSubdomain,
                extension_requested_at: serverTimestamp(),
                extension_approved_at: deleteField(),
                extension_rejected_at: deleteField(),
                payment_slips_history: arrayUnion({
                    url: slipUrl,
                    type: 'extension',
                    amount: totalPrice,
                    requested_at: new Date().toISOString()
                })
            };

            if (wantSubdomain) {
                updates.custom_domain_choice_1 = customDomain1;
                updates.custom_domain_choice_2 = customDomain2;
            }

            await updateDoc(orderRef, updates);

            setIsSuccess(true);
        } catch (err) {
            console.error(err);
            alert('เกิดข้อผิดพลาด กรุณาลองใหม่');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Edit Handlers ---
    const tierId = order ? (parseInt(order.tier_id) || 1) : 1;
    const editConfig = EDIT_CONFIG[tierId] || EDIT_CONFIG[1];

    const textEditsUsed = order?.text_edits_used || 0;
    const imageEditsUsed = order?.image_edits_used || 0;
    const textEditsRemaining = Math.max(0, editConfig.freeTextEdits - textEditsUsed);
    const imageEditsRemaining = Math.max(0, editConfig.freeImageEdits - imageEditsUsed);
    const canFreeEditText = textEditsRemaining > 0;
    const canFreeEditImage = imageEditsRemaining > 0;
    const textPaymentPending = order?.text_edit_payment_status === 'pending';
    const imagePaymentPending = order?.image_edit_payment_status === 'pending';

    const openTextEditForm = () => {
        // Pre-fill form with current order data
        if (tierId === 3) {
            setEditFormData({
                timelines: order?.timelines || [],
                finaleMessage: order?.finale_message || '',
                finaleSignOff: order?.finale_sign_off || '',
            });
        } else {
            setEditFormData({
                pin: order?.pin_code || '',
                message: order?.message || '',
                targetName: order?.target_name || '',
                signOff: order?.sign_off || '',
            });
        }
        setEditTextMode(true);
        setEditImageMode(false);
        setEditPayType(null);
    };

    const openImageEditForm = () => {
        setEditImageFiles([]);
        setEditImageMode(true);
        setEditTextMode(false);
        setEditPayType(null);
    };

    const handleSaveTextEdit = async () => {
        setEditSubmitting(true);
        try {
            const orderRef = doc(db, 'orders', id);
            const updates = { text_edits_used: (order?.text_edits_used || 0) + 1 };

            if (tierId === 3) {
                updates.timelines = editFormData.timelines;
                updates.finale_message = editFormData.finaleMessage;
                updates.finale_sign_off = editFormData.finaleSignOff;
            } else {
                updates.pin_code = editFormData.pin;
                updates.message = editFormData.message;
                updates.target_name = editFormData.targetName;
                updates.sign_off = editFormData.signOff;
            }

            await updateDoc(orderRef, updates);
            setOrder(prev => ({ ...prev, ...updates }));
            setEditTextMode(false);
            alert('แก้ไขข้อความเรียบร้อยแล้ว!');
        } catch (err) {
            console.error(err);
            alert('เกิดข้อผิดพลาด กรุณาลองใหม่');
        } finally {
            setEditSubmitting(false);
        }
    };

    const handleSaveImageEdit = async () => {
        if (editImageFiles.length === 0) {
            alert('กรุณาเลือกรูปภาพ');
            return;
        }
        setEditSubmitting(true);
        try {
            const newUrls = [];
            for (const file of editImageFiles) {
                const timestamp = Date.now();
                const imgRef = ref(storage, `edit_images/${id}/${timestamp}_${file.name}`);
                await uploadBytes(imgRef, file);
                const url = await getDownloadURL(imgRef);
                newUrls.push(url);
            }

            const orderRef = doc(db, 'orders', id);
            const updates = {
                image_edits_used: (order?.image_edits_used || 0) + 1,
                content_images: newUrls,
            };
            await updateDoc(orderRef, updates);
            setOrder(prev => ({ ...prev, ...updates }));
            setEditImageMode(false);
            setEditImageFiles([]);
            alert('แก้ไขรูปภาพเรียบร้อยแล้ว!');
        } catch (err) {
            console.error(err);
            alert('เกิดข้อผิดพลาด กรุณาลองใหม่');
        } finally {
            setEditSubmitting(false);
        }
    };

    const handleEditPayment = async () => {
        if (!editSlipFile) {
            alert('กรุณาแนบสลิปโอนเงิน');
            return;
        }
        setEditSubmitting(true);
        try {
            const timestamp = Date.now();
            const slipRef = ref(storage, `edit_slips/${id}/${timestamp}_edit_${editPayType}.jpg`);
            await uploadBytes(slipRef, editSlipFile);
            const slipUrl = await getDownloadURL(slipRef);

            const price = editPayType === 'text' ? editConfig.paidTextPrice : editConfig.paidImagePrice;
            const orderRef = doc(db, 'orders', id);
            await updateDoc(orderRef, {
                [`${editPayType}_edit_payment_status`]: 'pending',
                [`${editPayType}_edit_payment_slip_url`]: slipUrl,
                [`${editPayType}_edit_payment_price`]: price,
                [`${editPayType}_edit_payment_requested_at`]: serverTimestamp(),
                [`${editPayType}_edit_payment_approved_at`]: deleteField(),
                [`${editPayType}_edit_payment_rejected_at`]: deleteField(),
                payment_slips_history: arrayUnion({
                    url: slipUrl,
                    type: editPayType,
                    amount: price,
                    requested_at: new Date().toISOString()
                })
            });
            setOrder(prev => {
                const next = {
                    ...prev,
                    [`${editPayType}_edit_payment_status`]: 'pending',
                    [`${editPayType}_edit_payment_slip_url`]: slipUrl,
                    [`${editPayType}_edit_payment_price`]: price,
                    [`${editPayType}_edit_payment_requested_at`]: new Date()
                };
                delete next[`${editPayType}_edit_payment_approved_at`];
                delete next[`${editPayType}_edit_payment_rejected_at`];
                return next;
            });
            setEditSlipFile(null);
            setEditPayType(null);
        } catch (err) {
            console.error(err);
            alert('เกิดข้อผิดพลาด กรุณาลองใหม่');
        } finally {
            setEditSubmitting(false);
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
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-[#1A3C40] mb-1">จัดการเว็บไซต์</h2>
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

                {/* Tab Selector */}
                <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-1">
                    {[
                        { id: 'extend', label: 'ต่ออายุ', icon: <Clock size={16} /> },
                        { id: 'editText', label: 'แก้ไขข้อความ', icon: <Pencil size={16} /> },
                        ...(editConfig.freeImageEdits > 0 ? [{ id: 'editImage', label: 'แก้ไขรูปภาพ', icon: <Image size={16} /> }] : []),
                        { id: 'history', label: 'ประวัติ', icon: <FileText size={16} /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${activeTab === tab.id
                                ? 'bg-[#1A3C40] text-white shadow-md'
                                : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* === TAB: ต่ออายุ === */}
                {activeTab === 'extend' && (
                    <ExtendTab
                        packages={packages}
                        selectedPackage={selectedPackage}
                        setSelectedPackage={setSelectedPackage}
                        wantSubdomain={wantSubdomain}
                        setWantSubdomain={setWantSubdomain}
                        customDomain1={customDomain1}
                        setCustomDomain1={setCustomDomain1}
                        customDomain2={customDomain2}
                        setCustomDomain2={setCustomDomain2}
                        order={order}
                        expiryDate={expiryDate}
                        isExpired={isExpired}
                        promptpayId={promptpayId}
                        handleSlipChange={handleSlipChange}
                        slipFile={slipFile}
                        isSubmitting={isSubmitting}
                        handleSubmit={handleSubmit}
                    />
                )}

                {/* === TAB: แก้ไขข้อความ และ รูปภาพ === */}
                {(activeTab === 'editText' || activeTab === 'editImage') && (
                    <EditTab
                        activeTab={activeTab}
                        order={order}
                        tierId={tierId}
                        editConfig={editConfig}

                        canFreeEditText={canFreeEditText}
                        textEditsUsed={textEditsUsed}
                        textEditsRemaining={textEditsRemaining}
                        editTextMode={editTextMode}
                        setEditTextMode={setEditTextMode}
                        openTextEditForm={openTextEditForm}
                        editFormData={editFormData}
                        setEditFormData={setEditFormData}
                        handleSaveTextEdit={handleSaveTextEdit}

                        canFreeEditImage={canFreeEditImage}
                        imageEditsUsed={imageEditsUsed}
                        imageEditsRemaining={imageEditsRemaining}
                        editImageMode={editImageMode}
                        setEditImageMode={setEditImageMode}
                        openImageEditForm={openImageEditForm}
                        editImageFiles={editImageFiles}
                        setEditImageFiles={setEditImageFiles}
                        handleSaveImageEdit={handleSaveImageEdit}

                        textPaymentPending={textPaymentPending}
                        imagePaymentPending={imagePaymentPending}
                        editPayType={editPayType}
                        setEditPayType={setEditPayType}
                        editSlipFile={editSlipFile}
                        setEditSlipFile={setEditSlipFile}
                        editSubmitting={editSubmitting}
                        handleEditPayment={handleEditPayment}
                        promptpayId={promptpayId}
                    />
                )}

                {/* === TAB: ประวัติ === */}
                {activeTab === 'history' && (
                    <HistoryTab order={order} />
                )}
            </div>
        </div>
    );
};

export default ExtensionPage;

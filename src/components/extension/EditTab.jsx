import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CreditCard, Pencil, Image as ImageIcon, X, CheckCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import generatePayload from 'promptpay-qr';

const EditTab = ({
    activeTab,
    order,
    tierId,
    editConfig,

    // Text Edit
    canFreeEditText,
    textEditsUsed,
    textEditsRemaining,
    editTextMode,
    setEditTextMode,
    openTextEditForm,
    editFormData,
    setEditFormData,
    handleSaveTextEdit,

    // Image Edit
    canFreeEditImage,
    imageEditsUsed,
    imageEditsRemaining,
    editImageMode,
    setEditImageMode,
    openImageEditForm,
    editImageFiles,
    setEditImageFiles,
    handleSaveImageEdit,

    // Payment Form
    textPaymentPending,
    imagePaymentPending,
    editPayType,
    setEditPayType,
    editSlipFile,
    setEditSlipFile,
    editSubmitting,
    handleEditPayment,
    promptpayId
}) => {
    return (
        <div>
            {/* === Text Edit Section === */}
            {activeTab === 'editText' && (
                <div>
                    {/* Status */}
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Pencil size={16} className="text-[#1A3C40]" />
                                <span className="font-bold text-sm text-[#1A3C40]">แก้ไขข้อความ</span>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${canFreeEditText ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                ใช้ไป {textEditsUsed}/{editConfig?.freeTextEdits} ครั้ง
                            </span>
                        </div>
                    </div>

                    {/* Payment Pending Banner */}
                    {textPaymentPending && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 flex items-center gap-3">
                            <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-green-700">ส่งคำพิจารณาเรียบร้อยแล้ว ({order?.text_edit_payment_price}฿)</p>
                                <p className="text-xs text-green-600/70 mt-0.5">ทีมงานจะตรวจสอบภายใน 24 ชม. หลังอนุมัติจะสามารถแก้ไขได้</p>
                            </div>
                        </div>
                    )}

                    {/* Free edit: show form button */}
                    {canFreeEditText && !editTextMode && !textPaymentPending && (
                        <button onClick={openTextEditForm} className="w-full py-3 rounded-xl bg-[#1A3C40] text-white text-sm font-medium hover:bg-[#1A3C40]/90 transition-all flex items-center justify-center gap-2 mb-4">
                            <Pencil size={14} /> แก้ไขข้อความ (เหลือ {textEditsRemaining} ครั้ง)
                        </button>
                    )}

                    {/* No free edits: show payment button */}
                    {!canFreeEditText && !textPaymentPending && (
                        <button
                            onClick={() => { setEditPayType('text'); setEditSlipFile(null); }}
                            className="w-full py-3 rounded-xl bg-[#E8A08A] text-[#1A3C40] text-sm font-medium hover:bg-[#d89279] transition-all flex items-center justify-center gap-2 mb-4"
                        >
                            <CreditCard size={14} /> ชำระเงิน {editConfig?.paidTextPrice}฿ เพื่อแก้ไข
                        </button>
                    )}

                    {/* Text Edit Form */}
                    <AnimatePresence>
                        {editTextMode && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm mb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-bold text-[#1A3C40] text-sm">แก้ไขข้อความ</h4>
                                        <button onClick={() => setEditTextMode(false)} className="p-1 rounded-full hover:bg-gray-100">
                                            <X size={16} className="text-gray-400" />
                                        </button>
                                    </div>

                                    {tierId === 3 ? (
                                        /* Tier 3: Timeline fields */
                                        <div className="space-y-4">
                                            {(editFormData.timelines || []).map((tl, idx) => (
                                                <div key={idx} className="space-y-2">
                                                    <label className="text-xs font-medium text-gray-500">Timeline {idx + 1}</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#1A3C40]/20"
                                                        placeholder="หัวข้อ"
                                                        value={tl.label || ''}
                                                        onChange={(e) => {
                                                            const updated = [...editFormData.timelines];
                                                            updated[idx] = { ...updated[idx], label: e.target.value };
                                                            setEditFormData(prev => ({ ...prev, timelines: updated }));
                                                        }}
                                                    />
                                                    <textarea
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#1A3C40]/20 resize-none"
                                                        rows={2}
                                                        placeholder="รายละเอียด"
                                                        value={tl.desc || ''}
                                                        onChange={(e) => {
                                                            const updated = [...editFormData.timelines];
                                                            updated[idx] = { ...updated[idx], desc: e.target.value };
                                                            setEditFormData(prev => ({ ...prev, timelines: updated }));
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                            <div>
                                                <label className="text-xs font-medium text-gray-500">ข้อความ Finale</label>
                                                <textarea
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#1A3C40]/20 resize-none mt-1"
                                                    rows={2}
                                                    value={editFormData.finaleMessage || ''}
                                                    onChange={(e) => setEditFormData(prev => ({ ...prev, finaleMessage: e.target.value }))}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500">ลงชื่อ Finale</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#1A3C40]/20 mt-1"
                                                    value={editFormData.finaleSignOff || ''}
                                                    onChange={(e) => setEditFormData(prev => ({ ...prev, finaleSignOff: e.target.value }))}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        /* Tier 1/2: Detail fields */
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs font-medium text-gray-500">รหัสล็อก (PIN)</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#1A3C40]/20 mt-1 font-mono tracking-widest"
                                                    maxLength={4}
                                                    value={editFormData.pin || ''}
                                                    onChange={(e) => setEditFormData(prev => ({ ...prev, pin: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500">ชื่อคนรับ</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#1A3C40]/20 mt-1"
                                                    value={editFormData.targetName || ''}
                                                    onChange={(e) => setEditFormData(prev => ({ ...prev, targetName: e.target.value }))}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500">ข้อความ</label>
                                                <textarea
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#1A3C40]/20 resize-none mt-1"
                                                    rows={3}
                                                    value={editFormData.message || ''}
                                                    onChange={(e) => setEditFormData(prev => ({ ...prev, message: e.target.value }))}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500">ลงชื่อ</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#1A3C40]/20 mt-1"
                                                    value={editFormData.signOff || ''}
                                                    onChange={(e) => setEditFormData(prev => ({ ...prev, signOff: e.target.value }))}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleSaveTextEdit}
                                        disabled={editSubmitting}
                                        className="w-full mt-4 py-2.5 rounded-lg bg-[#1A3C40] text-white text-sm font-medium hover:bg-[#1A3C40]/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {editSubmitting ? <><Loader2 size={14} className="animate-spin" /> กำลังบันทึก...</> : 'บันทึกการแก้ไข'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* === Image Edit Section === */}
            {activeTab === 'editImage' && editConfig?.freeImageEdits > 0 && (
                <div>
                    {/* Status */}
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ImageIcon size={16} className="text-[#1A3C40]" />
                                <span className="font-bold text-sm text-[#1A3C40]">แก้ไขรูปภาพ</span>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${canFreeEditImage ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                ใช้ไป {imageEditsUsed}/{editConfig.freeImageEdits} ครั้ง
                            </span>
                        </div>
                    </div>

                    {/* Payment Pending Banner */}
                    {imagePaymentPending && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 flex items-center gap-3">
                            <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-green-700">ส่งคำพิจารณาเรียบร้อยแล้ว ({order?.image_edit_payment_price}฿)</p>
                                <p className="text-xs text-green-600/70 mt-0.5">ทีมงานจะตรวจสอบภายใน 24 ชม. หลังอนุมัติจะสามารถแก้ไขได้</p>
                            </div>
                        </div>
                    )}

                    {/* Free edit: show form */}
                    {canFreeEditImage && !editImageMode && !imagePaymentPending && (
                        <button onClick={openImageEditForm} className="w-full py-3 rounded-xl bg-[#1A3C40] text-white text-sm font-medium hover:bg-[#1A3C40]/90 transition-all flex items-center justify-center gap-2 mb-4">
                            <ImageIcon size={14} /> แก้ไขรูปภาพ (เหลือ {imageEditsRemaining} ครั้ง)
                        </button>
                    )}

                    {/* No free edits: show payment */}
                    {!canFreeEditImage && !imagePaymentPending && (
                        <button
                            onClick={() => { setEditPayType('image'); setEditSlipFile(null); }}
                            className="w-full py-3 rounded-xl bg-[#E8A08A] text-[#1A3C40] text-sm font-medium hover:bg-[#d89279] transition-all flex items-center justify-center gap-2 mb-4"
                        >
                            <CreditCard size={14} /> ชำระเงิน {editConfig.paidImagePrice}฿ เพื่อแก้ไข
                        </button>
                    )}

                    {/* Image Edit Form */}
                    <AnimatePresence>
                        {editImageMode && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm mb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-bold text-[#1A3C40] text-sm">แก้ไขรูปภาพ</h4>
                                        <button onClick={() => setEditImageMode(false)} className="p-1 rounded-full hover:bg-gray-100">
                                            <X size={16} className="text-gray-400" />
                                        </button>
                                    </div>

                                    {/* Current images */}
                                    {order?.content_images && order.content_images.filter(Boolean).length > 0 && (
                                        <div className="mb-3">
                                            <p className="text-xs text-gray-400 mb-2">รูปภาพปัจจุบัน ({order.content_images.filter(Boolean).length} รูป)</p>
                                            <div className="flex gap-2 flex-wrap">
                                                {order.content_images.filter(Boolean).map((url, i) => (
                                                    <img key={i} src={url} alt={`img-${i}`} className="w-14 h-14 rounded-lg object-cover border border-gray-200" />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-xs font-medium text-gray-500 mb-1 block">อัปโหลดรูปภาพใหม่</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => setEditImageFiles(Array.from(e.target.files || []))}
                                            className="block w-full text-sm text-gray-600 border border-gray-200 rounded-lg p-1.5 cursor-pointer bg-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border file:border-gray-200 file:text-xs file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                                        />
                                        {editImageFiles && editImageFiles.length > 0 && (
                                            <p className="text-[11px] text-green-600 mt-1">เลือกแล้ว {editImageFiles.length} ไฟล์</p>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleSaveImageEdit}
                                        disabled={editSubmitting || !editImageFiles || editImageFiles.length === 0}
                                        className="w-full mt-4 py-2.5 rounded-lg bg-[#1A3C40] text-white text-sm font-medium hover:bg-[#1A3C40]/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {editSubmitting ? <><Loader2 size={14} className="animate-spin" /> กำลังอัปโหลด...</> : 'บันทึกรูปภาพใหม่'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* === Paid Edit Payment Form (shared across both edit tabs) === */}
            <AnimatePresence>
                {editPayType && !(editPayType === 'text' ? textPaymentPending : imagePaymentPending) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm mb-4 mt-4">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-[#1A3C40] text-sm">
                                    ชำระเงินเพื่อแก้ไข{editPayType === 'text' ? 'ข้อความ' : 'รูปภาพ'}
                                </h4>
                                <button onClick={() => setEditPayType(null)} className="p-1 rounded-full hover:bg-gray-100">
                                    <X size={16} className="text-gray-400" />
                                </button>
                            </div>

                            {/* QR Code */}
                            <div className="flex flex-col items-center mb-4">
                                {(() => {
                                    const price = editPayType === 'text' ? editConfig.paidTextPrice : editConfig.paidImagePrice;
                                    const payload = generatePayload(promptpayId, { amount: price });
                                    return (
                                        <>
                                            <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm relative mb-3">
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#113566] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap z-10">
                                                    สแกนจ่าย
                                                </div>
                                                <QRCodeSVG value={payload} size={140} level="M" includeMargin={true} />
                                            </div>
                                            <div className="bg-[#1A3C40] text-white px-4 py-2 rounded-lg text-center w-full mb-3">
                                                <span className="text-xs opacity-80 block">ยอดชำระ</span>
                                                <span className="text-lg font-bold">{price} บาท</span>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>

                            <div className="mb-4">
                                <label className="block text-xs font-medium text-gray-600 mb-2">แนบสลิปโอนเงิน</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setEditSlipFile(e.target.files?.[0] || null)}
                                    className="block w-full text-sm text-gray-600 border border-gray-200 rounded-lg p-1.5 cursor-pointer bg-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border file:border-gray-200 file:text-xs file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                                />
                            </div>

                            <button
                                onClick={handleEditPayment}
                                disabled={editSubmitting || !editSlipFile}
                                className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${editSubmitting || !editSlipFile ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#E8A08A] text-[#1A3C40] hover:bg-[#d89279]'}`}
                            >
                                {editSubmitting ? <><Loader2 size={14} className="animate-spin" /> กำลังส่ง...</> : 'ยืนยันการชำระเงิน'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EditTab;

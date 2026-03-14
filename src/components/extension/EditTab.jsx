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
                                            {/* First 3 timelines are editable */}
                                            {(editFormData.timelines || []).slice(0, 3).map((tl, idx) => (
                                                <div key={idx} className="p-2 sm:p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2 sm:gap-3">
                                                    <span className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 rounded-full bg-[#1A3C40] text-white text-xs sm:text-sm flex items-center justify-center font-bold">{idx + 1}</span>
                                                    <label className="text-[10px] sm:text-xs font-medium text-gray-600 whitespace-nowrap shrink-0">ช่วงเวลา :</label>
                                                    <div className="flex gap-1.5 sm:gap-2 flex-1 min-w-0">
                                                        <input
                                                            type="text"
                                                            inputMode="numeric"
                                                            pattern="[0-9]*"
                                                            maxLength={10}
                                                            className="flex-1 w-full px-2 py-1.5 sm:py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#1A3C40]/20 focus:border-[#1A3C40]/40 bg-white outline-none transition-all text-xs sm:text-sm min-w-0"
                                                            placeholder=""
                                                            value={(tl.label || '').split(' ')[0] || ''}
                                                            onChange={(e) => {
                                                                const numVal = e.target.value.replace(/[^0-9]/g, '');
                                                                const unitVal = (tl.label || ' Day').split(' ').slice(1).join(' ') || 'Day';
                                                                const combined = numVal.trim() ? `${numVal.trim()} ${unitVal}` : '';
                                                                
                                                                const updated = [...editFormData.timelines];
                                                                updated[idx] = { ...updated[idx], label: combined };
                                                                setEditFormData(prev => ({ ...prev, timelines: updated }));
                                                            }}
                                                        />
                                                        <select
                                                            className="px-1 py-1.5 sm:px-2 sm:py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#1A3C40]/20 focus:border-[#1A3C40]/40 bg-white outline-none transition-all text-[10px] sm:text-sm w-[60px] sm:w-[80px] shrink-0"
                                                            value={(tl.label || ' Day').split(' ').slice(1).join(' ') || 'Day'}
                                                            onChange={(e) => {
                                                                const numVal = (tl.label || '').split(' ')[0] || '';
                                                                const unitVal = e.target.value;
                                                                const combined = numVal.trim() ? `${numVal.trim()} ${unitVal}` : '';
                                                                
                                                                const updated = [...editFormData.timelines];
                                                                updated[idx] = { ...updated[idx], label: combined };
                                                                setEditFormData(prev => ({ ...prev, timelines: updated }));
                                                            }}
                                                        >
                                                            {['Day', 'Month', 'Year', 'วัน', 'เดือน', 'ปี'].map((u) => <option key={u} value={u}>{u}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* 4th timeline is fixed */}
                                            <div className="p-2 sm:p-3 bg-gray-100/60 rounded-xl border border-gray-200/50 flex items-center gap-2 sm:gap-3 opacity-80">
                                                <span className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 rounded-full bg-gray-400 text-white text-xs sm:text-sm flex items-center justify-center font-bold">4</span>
                                                <div className="flex-1 flex items-center gap-2 min-w-0">
                                                    <input
                                                        type="text"
                                                        disabled
                                                        className="flex-1 w-full px-2 py-1.5 sm:py-2 rounded-lg border border-gray-200 bg-gray-100/50 text-gray-400 text-xs sm:text-sm cursor-not-allowed min-w-0"
                                                        value="Memories"
                                                    />
                                                </div>
                                                <span className="shrink-0 flex items-center gap-1 text-[10px] sm:text-xs text-gray-400">
                                                    (ค่าเริ่มต้น)
                                                </span>
                                            </div>

                                            {/* Finale Section */}
                                            <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-200 space-y-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center font-bold">5</span>
                                                    <span className="text-xs font-medium text-rose-500">✨ การ์ดข้อความ</span>
                                                </div>

                                                <div>
                                                    <label className="text-[10px] sm:text-xs font-medium text-gray-600 mb-1 flex justify-between">
                                                        <span>ขึ้นต้น</span>
                                                        <span className={`${(editFormData.timelines?.[4]?.label?.length || 0) > 20 ? 'text-red-500' : 'text-gray-400'}`}>({editFormData.timelines?.[4]?.label?.length || 0}/20)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        maxLength={20}
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-rose-400/20 focus:border-rose-400/40 bg-white/80 transition-all"
                                                        placeholder="To Infinity"
                                                        value={editFormData.timelines?.[4]?.label || ''}
                                                        onChange={(e) => {
                                                            const updated = [...(editFormData.timelines || [])];
                                                            // Ensure array has enough elements
                                                            while (updated.length <= 4) {
                                                                updated.push({ label: '', desc: '' });
                                                            }
                                                            updated[4] = { ...updated[4], label: e.target.value.slice(0, 20) };
                                                            setEditFormData(prev => ({ ...prev, timelines: updated }));
                                                        }}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-[10px] sm:text-xs font-medium text-gray-600 mb-1 flex justify-between">
                                                        <span>ข้อความถึงคนพิเศษ</span>
                                                        <span className={`${(editFormData.finaleMessage?.length || 0) > 100 ? 'text-red-500' : 'text-gray-400'}`}>({editFormData.finaleMessage?.length || 0}/100)</span>
                                                    </label>
                                                    <textarea
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-rose-400/20 focus:border-rose-400/40 transition-all resize-none bg-white/80 h-24"
                                                        maxLength={100}
                                                        placeholder=""
                                                        value={editFormData.finaleMessage || ''}
                                                        onChange={(e) => setEditFormData(prev => ({ ...prev, finaleMessage: e.target.value.slice(0, 100) }))}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-[10px] sm:text-xs font-medium text-gray-600 mb-1 flex justify-between">
                                                        <span>คำลงท้าย</span>
                                                        <span className={`${(editFormData.finaleSignOff?.length || 0) > 20 ? 'text-red-500' : 'text-gray-400'}`}>({editFormData.finaleSignOff?.length || 0}/20)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        maxLength={20}
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-rose-400/20 focus:border-rose-400/40 transition-all bg-white/80"
                                                        placeholder=""
                                                        value={editFormData.finaleSignOff || ''}
                                                        onChange={(e) => setEditFormData(prev => ({ ...prev, finaleSignOff: e.target.value.slice(0, 20) }))}
                                                    />
                                                </div>
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

                                    {/* Current images or Local Previews */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-xs text-gray-500 font-medium">รูปภาพที่จะใช้</p>
                                            <p className="text-[10px] text-gray-400">
                                                {editImageFiles?.length || 0} / {tierId === 3 ? 10 : 5} รูป
                                            </p>
                                        </div>
                                        <div className="flex gap-3 flex-wrap">
                                            {editImageFiles && editImageFiles.length > 0 && (
                                                editImageFiles.map((item, i) => {
                                                    const isFile = typeof item !== 'string';
                                                    const previewUrl = isFile ? URL.createObjectURL(item) : item;
                                                    
                                                    return (
                                                        <div key={i} className="relative group">
                                                            <img 
                                                                src={previewUrl} 
                                                                alt={`preview-${i}`} 
                                                                className="w-16 h-16 rounded-xl object-cover border-2 border-[#1A3C40]/20 shadow-sm" 
                                                                onLoad={() => {
                                                                    if (isFile) URL.revokeObjectURL(previewUrl);
                                                                }}
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    const newFiles = [...editImageFiles];
                                                                    newFiles.splice(i, 1);
                                                                    setEditImageFiles(newFiles);
                                                                }}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 hover:scale-110 transition-all z-10"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </div>
                                                    )
                                                })
                                            )}

                                            {/* Upload placeholder box */}
                                            {(!editImageFiles || editImageFiles.length < (tierId === 3 ? 10 : 5)) && (
                                                <label className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative group">
                                                    <ImageIcon size={16} className="text-gray-400 mb-1 group-hover:text-[#1A3C40] transition-colors" />
                                                    <span className="text-[9px] text-gray-400 group-hover:text-[#1A3C40] transition-colors">เลือกรูป</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={(e) => {
                                                            if (e.target.files && e.target.files.length > 0) {
                                                                const maxLimit = tierId === 3 ? 10 : 5;
                                                                const currentCount = editImageFiles?.length || 0;
                                                                const availableSlots = maxLimit - currentCount;
                                                                
                                                                const newFiles = Array.from(e.target.files).slice(0, availableSlots);
                                                                setEditImageFiles(prev => [...(prev || []), ...newFiles]);
                                                            }
                                                            // Reset input so same file can be selected again if needed
                                                            e.target.value = null;
                                                        }}
                                                        className="hidden"
                                                    />
                                                </label>
                                            )}
                                            
                                            {(!editImageFiles || editImageFiles.length === 0) && (
                                                <div className="text-xs text-gray-400 p-3 w-full text-center mt-2">
                                                    ยังไม่มีรูปภาพ กรุณาเพิ่มรูปภาพใหม่
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSaveImageEdit}
                                        disabled={editSubmitting || !editImageFiles || editImageFiles.length === 0}
                                        className="w-full mt-5 py-3 rounded-xl bg-[#1A3C40] text-white text-sm font-medium hover:bg-[#1A3C40]/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#1A3C40]/20"
                                    >
                                        {editSubmitting ? <><Loader2 size={16} className="animate-spin" /> กำลังอัปโหลด...</> : 'ยืนยันการแก้ไขรูปภาพ'}
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
                                                    สแกนเพื่อชำระเงิน
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

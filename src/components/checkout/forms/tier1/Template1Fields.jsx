import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import { useCheckout } from '../../CheckoutContext';

const Template1Fields = () => {
    const { formData, updateFormData, showPreview, setShowPreview } = useCheckout();

    return (
        <div className="space-y-4">
            {/* PIN */}
            <div className="relative">
                <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-gray-700">🔐 รหัส PIN 4 หลัก</label>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setShowPreview(showPreview === 'pin' ? null : 'pin'); }}
                        className={`p-1 rounded-full transition-colors ${showPreview === 'pin' ? 'bg-rose-100 text-rose-500' : 'text-gray-400 hover:text-rose-500 hover:bg-rose-50'}`}
                    >
                        <Info size={14} />
                    </button>
                </div>
                <AnimatePresence>
                    {showPreview === 'pin' && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowPreview(null)} />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: -5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -5 }}
                                className="absolute right-0 top-6 z-50 w-56 p-3 bg-white rounded-xl shadow-xl border border-rose-200"
                            >
                                <div className="absolute -top-2 right-3 w-3 h-3 bg-white border-l border-t border-rose-200 rotate-45" />
                                <div className="flex gap-3 items-center">
                                    <div className="text-3xl">🔐</div>
                                    <div>
                                        <p className="text-xs font-medium text-rose-700">หน้าล็อก PIN</p>
                                        <p className="text-[10px] text-gray-500">ผู้รับต้องกรอก PIN นี้ก่อนเปิดดูข้อความ</p>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
                <input
                    type="text"
                    maxLength={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50 text-center text-2xl tracking-[0.5em] font-mono"
                    placeholder="1234"
                    value={formData.pin}
                    onChange={(e) => updateFormData({ pin: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                />
                <p className="text-xs text-gray-400 mt-1">* ผู้รับต้องกรอกรหัสนี้เพื่อเปิดดูข้อความ</p>
            </div>

            {/* Target Name */}
            <div className="relative">
                <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-gray-700">💕 ชื่อคนรับ</label>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setShowPreview(showPreview === 'targetName' ? null : 'targetName'); }}
                        className={`p-1 rounded-full transition-colors ${showPreview === 'targetName' ? 'bg-pink-100 text-pink-500' : 'text-gray-400 hover:text-pink-500 hover:bg-pink-50'}`}
                    >
                        <Info size={14} />
                    </button>
                </div>
                <AnimatePresence>
                    {showPreview === 'targetName' && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowPreview(null)} />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: -5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -5 }}
                                className="absolute right-0 top-6 z-50 w-64 p-3 bg-white rounded-xl shadow-xl border border-pink-200"
                            >
                                <div className="absolute -top-2 right-3 w-3 h-3 bg-white border-l border-t border-pink-200 rotate-45" />
                                <p className="text-center text-lg font-serif text-pink-700 mb-1">
                                    "{formData.targetName || 'ชื่อ'}รักเค้าไหม? 💕"
                                </p>
                                <p className="text-[10px] text-gray-500 text-center">คำถามนี้จะแสดงหลังกรอก PIN ถูกต้อง</p>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
                <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50"
                    placeholder="ชื่อแฟน, ที่รัก, หวานใจ"
                    value={formData.targetName}
                    onChange={(e) => updateFormData({ targetName: e.target.value })}
                />
                <p className="text-xs text-gray-400 mt-1">* จะแสดงเป็น "{formData.targetName || 'ชื่อ'}รักเค้าไหม? 💕"</p>
            </div>

            {/* Sign Off */}
            <div className="relative">
                <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-gray-700">✨ ลงท้ายว่า... (For {formData.targetName || 'You'})</label>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setShowPreview(showPreview === 'signOff' ? null : 'signOff'); }}
                        className={`p-1 rounded-full transition-colors ${showPreview === 'signOff' ? 'bg-amber-100 text-amber-500' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'}`}
                    >
                        <Info size={14} />
                    </button>
                </div>
                <AnimatePresence>
                    {showPreview === 'signOff' && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowPreview(null)} />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: -5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -5 }}
                                className="absolute right-0 top-6 z-50 w-56 p-3 bg-white rounded-xl shadow-xl border border-amber-200"
                            >
                                <div className="absolute -top-2 right-3 w-3 h-3 bg-white border-l border-t border-amber-200 rotate-45" />
                                <p className="text-[10px] text-amber-600 mb-2 text-center">ส่วนท้ายของข้อความ</p>
                                <div className="bg-amber-50 rounded-lg p-2 text-center">
                                    <p className="text-xs text-gray-500">For {formData.targetName || 'You'}</p>
                                    <p className="text-sm font-medium text-gray-800">{formData.signOff || 'รักเธอเสมอ'}</p>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
                <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50"
                    placeholder="รักเธอเสมอ, คนที่รักเธอที่สุด"
                    value={formData.signOff}
                    onChange={(e) => updateFormData({ signOff: e.target.value })}
                />
            </div>

            {/* Main Message */}
            <div className="relative">
                <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-gray-700">
                        💌 ข้อความหลัก
                        <span className={`ml-2 ${formData.message.length > 400 ? 'text-red-500' : 'text-gray-400'}`}>
                            ({formData.message.length}/400)
                        </span>
                    </label>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setShowPreview(showPreview === 'message' ? null : 'message'); }}
                        className={`p-1 rounded-full transition-colors ${showPreview === 'message' ? 'bg-purple-100 text-purple-500' : 'text-gray-400 hover:text-purple-500 hover:bg-purple-50'}`}
                    >
                        <Info size={14} />
                    </button>
                </div>
                <AnimatePresence>
                    {showPreview === 'message' && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowPreview(null)} />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: -5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -5 }}
                                className="absolute right-0 top-6 z-50 w-64 p-3 bg-white rounded-xl shadow-xl border border-purple-200"
                            >
                                <div className="absolute -top-2 right-3 w-3 h-3 bg-white border-l border-t border-purple-200 rotate-45" />
                                <p className="text-[10px] text-purple-600 mb-2 text-center">ข้อความกลางหน้า (หลังกด "รัก")</p>
                                <div className="bg-purple-50 rounded-lg p-2">
                                    <p className="text-xs text-gray-700 leading-relaxed line-clamp-3">
                                        {formData.message || 'ข้อความของคุณจะแสดงที่นี่...'}
                                    </p>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
                <textarea
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50 h-32 resize-none"
                    placeholder="ข้อความที่อยากบอกคนรับ..."
                    value={formData.message}
                    onChange={(e) => updateFormData({ message: e.target.value.slice(0, 400) })}
                />
            </div>
        </div>
    );
};

export default Template1Fields;

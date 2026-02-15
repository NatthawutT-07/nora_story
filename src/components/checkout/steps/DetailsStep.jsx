import { motion } from 'framer-motion';
import { useCheckout } from '../CheckoutContext';

const DetailsStep = () => {
    const { tier, selectedTemplate, formData, updateFormData, needsDetailFields, needsTimelineFields } = useCheckout();

    // T1-1 and T2 templates: PIN, Target Name, Message, Sign Off
    if (needsDetailFields) {
        const maxMessage = 100;

        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="space-y-4">
                    {/* PIN */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">
                            รหัสปลดล็อก (PIN 4 หลัก)
                        </label>
                        <input
                            type="text"
                            maxLength={4}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1A3C40]/20 focus:border-[#1A3C40]/40 bg-gray-50/50 outline-none transition-all text-center text-2xl tracking-[0.5em] font-mono"
                            placeholder="1234"
                            value={formData.pin}
                            onChange={(e) => updateFormData({ pin: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                        />
                        <p className="text-[11px] text-gray-400 mt-1">ผู้รับต้องกรอกรหัสนี้เพื่อเปิดดูข้อความ</p>
                    </div>

                    {/* Target Name */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">
                            FOR YOU — ชื่อคนรับ
                            <span className={`ml-2 ${formData.targetName.length > 15 ? 'text-red-500' : 'text-gray-400'}`}>
                                ({formData.targetName.length}/15)
                            </span>
                        </label>
                        <input
                            type="text"
                            maxLength={15}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1A3C40]/20 focus:border-[#1A3C40]/40 bg-gray-50/50 outline-none transition-all text-sm"
                            placeholder="ชื่อแฟน, ที่รัก, หวานใจ"
                            value={formData.targetName}
                            onChange={(e) => updateFormData({ targetName: e.target.value.slice(0, 15) })}
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">
                            ข้อความถึงคนพิเศษ
                            <span className={`ml-2 ${formData.message.length > maxMessage ? 'text-red-500' : 'text-gray-400'}`}>
                                ({formData.message.length}/{maxMessage})
                            </span>
                        </label>
                        <textarea
                            maxLength={maxMessage}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1A3C40]/20 focus:border-[#1A3C40]/40 bg-gray-50/50 outline-none transition-all text-sm h-28 resize-none"
                            placeholder="ข้อความที่อยากบอกคนรับ..."
                            value={formData.message}
                            onChange={(e) => updateFormData({ message: e.target.value.slice(0, maxMessage) })}
                        />
                    </div>

                    {/* Sign Off */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">
                            คำลงท้าย
                            <span className={`ml-2 ${formData.signOff.length > 20 ? 'text-red-500' : 'text-gray-400'}`}>
                                ({formData.signOff.length}/20)
                            </span>
                        </label>
                        <input
                            type="text"
                            maxLength={20}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1A3C40]/20 focus:border-[#1A3C40]/40 bg-gray-50/50 outline-none transition-all text-sm"
                            placeholder="รักเธอเสมอ"
                            value={formData.signOff}
                            onChange={(e) => updateFormData({ signOff: e.target.value.slice(0, 20) })}
                        />
                        <p className="text-[11px] text-gray-400 mt-1">แทนที่คำว่า "รักเธอเสมอ" ตรงท้ายข้อความ</p>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Default: placeholder for other templates that don't have details yet
    // Tier 3: Timeline fields (5 slots)
    if (needsTimelineFields) {
        const updateTimeline = (index, field, value) => {
            const newTimelines = [...formData.timelines];
            newTimelines[index] = { ...newTimelines[index], [field]: value };
            updateFormData({ timelines: newTimelines });
        };

        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="space-y-4">
                    <p className="text-xs text-gray-500 mb-2">กรอกรายละเอียด Timeline 5 ช่อง — ช่อง 1-4 ใส่ช่วงเวลา + คำอธิบาย, ช่อง 5 ใส่ข้อความสุดท้าย</p>

                    {/* Timeline Slots 1-4 */}
                    {formData.timelines.slice(0, 4).map((tl, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-6 h-6 rounded-full bg-[#1A3C40] text-white text-xs flex items-center justify-center font-bold">{idx + 1}</span>
                                <span className="text-xs font-medium text-gray-500">Timeline {idx + 1}</span>
                            </div>
                            <div>
                                <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1">
                                    <span>ช่วงเวลา (เช่น 1 Year)</span>
                                    <span className={`${tl.label.length > 15 ? 'text-red-500' : 'text-gray-400'}`}>({tl.label.length}/15)</span>
                                </label>
                                <input
                                    type="text"
                                    maxLength={15}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#1A3C40]/20 focus:border-[#1A3C40]/40 bg-white outline-none transition-all text-sm"
                                    placeholder="เช่น 1 Year, 2 Year"
                                    value={tl.label}
                                    onChange={(e) => updateTimeline(idx, 'label', e.target.value.slice(0, 15))}
                                />
                            </div>
                            <div>
                                <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1">
                                    <span>คำอธิบายสั้น</span>
                                    <span className={`${tl.desc.length > 20 ? 'text-red-500' : 'text-gray-400'}`}>({tl.desc.length}/20)</span>
                                </label>
                                <input
                                    type="text"
                                    maxLength={20}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#1A3C40]/20 focus:border-[#1A3C40]/40 bg-white outline-none transition-all text-sm"
                                    placeholder="เช่น จุดเริ่มต้นของเรา"
                                    value={tl.desc}
                                    onChange={(e) => updateTimeline(idx, 'desc', e.target.value.slice(0, 20))}
                                />
                            </div>
                        </div>
                    ))}

                    {/* Timeline Slot 5: Finale (To Infinity) */}
                    <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-200 space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center font-bold">5</span>
                            <span className="text-xs font-medium text-rose-500">To Infinity ✨ (ข้อความสุดท้าย)</span>
                        </div>
                        <div>
                            <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1">
                                <span>ข้อความถึงคนพิเศษ</span>
                                <span className={`${(formData.finaleMessage?.length || 0) > 100 ? 'text-red-500' : 'text-gray-400'}`}>({formData.finaleMessage?.length || 0}/100)</span>
                            </label>
                            <textarea
                                maxLength={100}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-rose-400/20 focus:border-rose-400/40 bg-white outline-none transition-all text-sm h-24 resize-none"
                                placeholder="ข้อความที่อยากบอกคนรับ..."
                                value={formData.finaleMessage}
                                onChange={(e) => updateFormData({ finaleMessage: e.target.value.slice(0, 100) })}
                            />
                        </div>
                        <div>
                            <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1">
                                <span>คำลงท้าย (แทนคำว่า "รักเสมอ")</span>
                                <span className={`${(formData.finaleSignOff?.length || 0) > 20 ? 'text-red-500' : 'text-gray-400'}`}>({formData.finaleSignOff?.length || 0}/20)</span>
                            </label>
                            <input
                                type="text"
                                maxLength={20}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-rose-400/20 focus:border-rose-400/40 bg-white outline-none transition-all text-sm"
                                placeholder="รักเธอเสมอ"
                                value={formData.finaleSignOff}
                                onChange={(e) => updateFormData({ finaleSignOff: e.target.value.slice(0, 20) })}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Default: placeholder for other templates
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="text-center py-8 text-gray-400">
                <p className="text-sm">ธีมนี้ยังไม่มีรายละเอียดเพิ่มเติม</p>
                <p className="text-xs mt-1">กดถัดไปเพื่อดำเนินการต่อ</p>
            </div>
        </motion.div>
    );
};

export default DetailsStep;

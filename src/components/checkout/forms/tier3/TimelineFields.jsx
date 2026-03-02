import { motion } from 'framer-motion';
import { useCheckout } from '../../CheckoutContext';

const TimelineFields = () => {
    const { formData, updateFormData } = useCheckout();

    const updateTimeline = (index, field, value) => {
        const newTimelines = [...formData.timelines];
        newTimelines[index] = { ...newTimelines[index], [field]: value };
        updateFormData({ timelines: newTimelines });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-600">Tier 3</span>
                <span className="text-xs text-gray-400">Timeline Template</span>
            </div>

            <p className="text-xs text-gray-500 mb-2">กรอกรายละเอียด Timeline 6 ช่อง — ช่อง 1-5 ใส่ช่วงเวลา + คำอธิบาย, ช่อง 6 ใส่ข้อความสุดท้าย</p>

            {/* Timeline Slots 1-5 */}
            {[0, 1, 2, 3, 4].map((i) => {
                const tl = formData.timelines[i] || { label: '', desc: '' };
                return (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-6 h-6 rounded-full bg-[#1A3C40] text-white text-xs flex items-center justify-center font-bold">{i + 1}</span>
                            <span className="text-xs font-medium text-gray-500">Timeline {i + 1}</span>
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
                                onChange={(e) => updateTimeline(i, 'label', e.target.value.slice(0, 15))}
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
                                onChange={(e) => updateTimeline(i, 'desc', e.target.value.slice(0, 20))}
                            />
                        </div>
                    </div>
                );
            })}

            {/* Timeline Slot 6: Finale (To Infinity) */}
            <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-200 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center font-bold">6</span>
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
    );
};

export default TimelineFields;

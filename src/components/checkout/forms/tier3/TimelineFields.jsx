import { motion } from 'framer-motion';
import { useCheckout } from '../../CheckoutContext';
import { Lock } from 'lucide-react';

const UNIT_OPTIONS = ['Day', 'Month', 'Year', 'วัน', 'เดือน', 'ปี'];

const TimelineFields = () => {
    const { formData, updateFormData } = useCheckout();

    const updateTimeline = (index, field, value) => {
        const newTimelines = [...formData.timelines];
        newTimelines[index] = { ...newTimelines[index], [field]: value };
        updateFormData({ timelines: newTimelines });
    };

    const parseLabelParts = (label) => {
        if (!label) return { num: '', unit: 'Day' };
        const parts = label.trim().split(' ');
        return { num: parts[0] || '', unit: parts.slice(1).join(' ') || 'Day' };
    };

    const updateLabelParts = (index, numVal, unitVal) => {
        const combined = numVal.trim() ? `${numVal.trim()} ${unitVal}` : '';
        updateTimeline(index, 'label', combined);
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-600">Tier 3</span>
                <span className="text-xs text-gray-400">Timeline Template</span>
            </div>

            <p className="text-xs text-gray-500 mb-2">กรอกรายละเอียด Timeline — ช่อง 1-3 ใส่ช่วงเวลา , ช่อง 4 เป็นค่าตั้งต้น, ช่อง 5 ใส่ข้อความสุดท้าย</p>

            {/* Timeline Slots 1-3: Editable */}
            {[0, 1, 2].map((i) => {
                const tl = formData.timelines[i] || { label: '', desc: '' };
                const { num, unit } = parseLabelParts(tl.label);
                return (
                    <div key={i} className="p-2 sm:p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2 sm:gap-3">
                        <span className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 rounded-full bg-[#1A3C40] text-white text-xs sm:text-sm flex items-center justify-center font-bold">{i + 1}</span>
                        <label className="text-[10px] sm:text-xs font-medium text-gray-600 whitespace-nowrap shrink-0">ช่วงเวลา :</label>
                        <div className="flex gap-1.5 sm:gap-2 flex-1 min-w-0">
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={10}
                                className="flex-1 w-full px-2 py-1.5 sm:py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#1A3C40]/20 focus:border-[#1A3C40]/40 bg-white outline-none transition-all text-xs sm:text-sm min-w-0"
                                placeholder=""
                                value={num}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                    updateLabelParts(i, val, unit);
                                }}
                            />
                            <select
                                className="px-1 py-1.5 sm:px-2 sm:py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#1A3C40]/20 focus:border-[#1A3C40]/40 bg-white outline-none transition-all text-[10px] sm:text-sm w-[60px] sm:w-[80px] shrink-0"
                                value={unit}
                                onChange={(e) => updateLabelParts(i, num, e.target.value)}
                            >
                                {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>
                    </div>
                );
            })}

            {/* Timeline Slot 4: Fixed Default (Read-only) */}
            {[3].map((i) => {
                const fixedLabels = { 3: 'Memories' };
                return (
                    <div key={i} className="p-2 sm:p-3 bg-gray-100/60 rounded-xl border border-gray-200/50 flex items-center gap-2 sm:gap-3 opacity-80">
                        <span className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 rounded-full bg-gray-400 text-white text-xs sm:text-sm flex items-center justify-center font-bold">{i + 1}</span>
                        <div className="flex-1 flex items-center gap-2 min-w-0">
                            <input
                                type="text"
                                disabled
                                className="flex-1 w-full px-2 py-1.5 sm:py-2 rounded-lg border border-gray-200 bg-gray-100/50 text-gray-400 text-xs sm:text-sm cursor-not-allowed min-w-0"
                                value={fixedLabels[i]}
                            />
                        </div>
                        <span className="shrink-0 flex items-center gap-1 text-[10px] sm:text-xs text-gray-400">
                            <Lock size={10} />
                            ค่าตั้งต้น
                        </span>
                    </div>
                );
            })}

            {/* Timeline 5: Finale (To Infinity) — 3 editable fields */}
            <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-200 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center font-bold">5</span>
                    <span className="text-xs font-medium text-rose-500">✨ การ์ดข้อความ</span>
                </div>

                {/* Field 1: To Infinity label */}
                <div>
                    <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1">
                        <span>ขึ้นต้น</span>
                        <span className={`${(formData.timelines[4]?.label?.length || 0) > 20 ? 'text-red-500' : 'text-gray-400'}`}>({formData.timelines[4]?.label?.length || 0}/20)</span>
                    </label>
                    <input
                        type="text"
                        maxLength={20}
                        className="w-full px-3 py-2 sm:py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-rose-400/20 focus:border-rose-400/40 bg-white outline-none transition-all text-sm"
                        placeholder=""
                        value={formData.timelines[4]?.label || ''}
                        onChange={(e) => updateTimeline(4, 'label', e.target.value.slice(0, 20))}
                    />
                </div>

                {/* Field 2: เนื้อเรื่อง (Message) */}
                <div>
                    <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1">
                        <span>ข้อความถึงคนพิเศษ</span>
                        <span className={`${(formData.finaleMessage?.length || 0) > 100 ? 'text-red-500' : 'text-gray-400'}`}>({formData.finaleMessage?.length || 0}/100)</span>
                    </label>
                    <textarea
                        maxLength={100}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-rose-400/20 focus:border-rose-400/40 bg-white outline-none transition-all text-sm h-24 resize-none"
                        placeholder=""
                        value={formData.finaleMessage}
                        onChange={(e) => updateFormData({ finaleMessage: e.target.value.slice(0, 100) })}
                    />
                </div>

                {/* Field 3: คำลงท้าย (Sign-off) */}
                <div>
                    <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1">
                        <span>คำลงท้าย</span>
                        <span className={`${(formData.finaleSignOff?.length || 0) > 20 ? 'text-red-500' : 'text-gray-400'}`}>({formData.finaleSignOff?.length || 0}/20)</span>
                    </label>
                    <input
                        type="text"
                        maxLength={20}
                        className="w-full px-3 py-2 sm:py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-rose-400/20 focus:border-rose-400/40 bg-white outline-none transition-all text-sm"
                        placeholder=""
                        value={formData.finaleSignOff}
                        onChange={(e) => updateFormData({ finaleSignOff: e.target.value.slice(0, 20) })}
                    />
                </div>
            </div>
        </div>
    );
};

export default TimelineFields;

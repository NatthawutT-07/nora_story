import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

// Template preview data
const TEMPLATE_PREVIEWS = {
    1: [
        { id: 't1-1', number: '01', name: 'Love Card', preview: '', description: 'ข้อความลับพร้อม PIN' },
        { id: 't1-2', number: '02', name: 'Ordination', preview: '', description: 'การ์ดงานบวช', disabled: true },
        { id: 't1-3', number: '03', name: 'Wedding', preview: '', description: 'การ์ดงานแต่ง', disabled: true },
    ],
    2: [
        { id: 't2-1', number: '01', name: 'Standard Love', preview: '', description: 'อนิเมชั่นพื้นฐาน' },
        { id: 't2-2', number: '02', name: 'Golden Merit', preview: '', description: 'งานบวชพรีเมียม', disabled: true },
        { id: 't2-3', number: '03', name: 'Love Gallery', preview: '', description: 'แกลเลอรี่ความทรงจำ', disabled: true },
    ],
    3: [
        { id: 't3-1', number: '01', name: 'Luxury Gold', preview: '', description: 'หรูหราอลังการ' },
        { id: 't3-2', number: '02', name: 'Crystal Clear', preview: '', description: 'เพชรพราว', disabled: true },
        { id: 't3-3', number: '03', name: 'The Wedding Day', preview: '', description: 'ไทม์ไลน์งานแต่ง', disabled: true },
    ],
    4: [
        { id: 't4-1', number: '01', name: 'Eternal Love', preview: '', description: 'ความรักนิรันดร์', disabled: true },
        // { id: 't4-2', number: '02', name: 'Paradise', preview: '', description: 'สวรรค์บนดิน', disabled: true },
        // { id: 't4-3', number: '03', name: 'Infinity', preview: '', description: 'ไม่มีวันจบ', disabled: true },
    ],
};

const TemplateSelector = ({ tierId, selectedTemplate, onSelect }) => {
    const templates = TEMPLATE_PREVIEWS[tierId] || TEMPLATE_PREVIEWS[1];
    const isSingleTemplate = templates.length === 1;

    // Single Template UI (Tier 1)
    if (isSingleTemplate) {
        const template = templates[0];
        const isSelected = selectedTemplate === template.id;

        return (
            <div className="w-full">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <motion.div
                        onClick={() => onSelect(template.id)}
                        whileTap={{ scale: 0.98 }}
                        className={`relative cursor-pointer rounded-2xl p-6 transition-all ${isSelected
                            ? 'bg-gray-50 ring-2 ring-[#1A3C40] shadow-sm'
                            : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                    >
                        {isSelected && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-3 right-3 bg-[#1A3C40] text-white rounded-full p-1.5"
                            >
                                <Check size={14} />
                            </motion.div>
                        )}

                        <div className="flex flex-col items-center gap-1">
                            {/* Number Badge */}
                            <div className={`text-xs font-mono mb-1 px-2 py-0.5 rounded-full ${isSelected ? 'bg-[#1A3C40]/10 text-[#1A3C40]' : 'bg-gray-100 text-gray-400'}`}>
                                {template.number}
                            </div>

                            {/* <div className="text-5xl">{template.preview}</div> */}
                            <div>
                                <h4 className="text-xl font-serif text-[#1A3C40] mb-1">{template.name}</h4>
                                <p className="text-sm text-gray-400">{template.description}</p>
                            </div>
                        </div>

                        {!isSelected && (
                            <p className="text-[11px] text-gray-400 mt-3">คลิกเพื่อเลือก</p>
                        )}
                    </motion.div>

                    <AnimatePresence>
                        {isSelected && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mt-3 py-2 text-xs text-[#1A3C40] font-medium flex items-center justify-center gap-1.5"
                            >
                                <Check size={14} /> เลือกธีมนี้แล้ว
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        );
    }

    // Multiple Templates UI (Tier 2-4) — Clean Grid
    return (
        <div className="w-full">
            <div className="grid grid-cols-3 gap-3">
                {templates.map((template) => {
                    const isSelected = selectedTemplate === template.id;
                    const isDisabled = template.disabled;
                    return (
                        <motion.div
                            key={template.id}
                            whileTap={isDisabled ? {} : { scale: 0.95 }}
                            onClick={() => !isDisabled && onSelect(template.id)}
                            className={`relative rounded-xl p-4 text-center transition-all ${isDisabled
                                ? 'bg-gray-100 opacity-50 cursor-not-allowed'
                                : isSelected
                                    ? 'bg-gray-50 ring-2 ring-[#1A3C40] shadow-sm cursor-pointer'
                                    : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
                                }`}
                        >
                            {isDisabled && (
                                <div className="absolute top-1.5 right-1.5 bg-gray-400 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                                    เร็วๆนี้
                                </div>
                            )}
                            {isSelected && !isDisabled && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1.5 -right-1.5 bg-[#1A3C40] text-white rounded-full p-1"
                                >
                                    <Check size={10} />
                                </motion.div>
                            )}
                            {/* <div className={`text-3xl mb-2 ${isDisabled ? 'grayscale' : ''}`}>{template.preview}</div> */}

                            {/* Number Badge */}
                            <div className={`absolute top-2 left-2 text-[10px] font-mono px-1.5 py-0.5 rounded ${isDisabled ? 'bg-gray-200 text-gray-400' :
                                isSelected ? 'bg-[#1A3C40] text-white' : 'bg-gray-200/50 text-gray-400'
                                }`}>
                                {template.number}
                            </div>

                            <div className="mt-4">
                                <p className={`text-sm font-medium leading-tight ${isDisabled ? 'text-gray-400' : isSelected ? 'text-[#1A3C40]' : 'text-gray-600'}`}>
                                    {template.name}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-1">{template.description}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <AnimatePresence>
                {selectedTemplate && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-3 py-2 text-xs text-[#1A3C40] font-medium flex items-center justify-center gap-1.5"
                    >
                        <Check size={14} />
                        เลือก: <span className="font-semibold">{templates.find(t => t.id === selectedTemplate)?.name}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TemplateSelector;

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

// Template preview data
const TEMPLATE_PREVIEWS = {
    1: [
        { id: 't1-1', name: 'Love Card 💕', preview: '💕', description: 'ข้อความลับพร้อม PIN' },
        { id: 't1-2', name: 'Ordination', preview: '🪷', description: 'การ์ดงานบวช', disabled: true },
        { id: 't1-3', name: 'Wedding', preview: '💍', description: 'การ์ดงานแต่ง', disabled: true },
    ],
    2: [
        { id: 't2-1', name: 'Standard Love', preview: '💌', description: 'อนิเมชั่นพื้นฐาน' },
        { id: 't2-2', name: 'Golden Merit', preview: '✨', description: 'งานบวชพรีเมียม', disabled: true },
        { id: 't2-3', name: 'Rose Wedding', preview: '🌹', description: 'งานแต่งพรีเมียม', disabled: true },
    ],
    3: [
        { id: 't3-1', name: 'Luxury Gold', preview: '👑', description: 'หรูหราอลังการ' },
        { id: 't3-2', name: 'Crystal Clear', preview: '💎', description: 'เพชรพราว', disabled: true },
        { id: 't3-3', name: 'Velvet Night', preview: '🌌', description: 'ราตรีสุดโรแมนติก', disabled: true },
    ],
    4: [
        { id: 't4-1', name: 'Eternal Love', preview: '💕', description: 'ความรักนิรันดร์', disabled: true },
        // { id: 't4-2', name: 'Paradise', preview: '🏝️', description: 'สวรรค์บนดิน', disabled: true },
        // { id: 't4-3', name: 'Infinity', preview: '♾️', description: 'ไม่มีวันจบ', disabled: true },
    ],
};

const TemplateSelector = ({ tierId, selectedTemplate, onSelect }) => {
    const templates = TEMPLATE_PREVIEWS[tierId] || TEMPLATE_PREVIEWS[1];
    const [currentIndex, setCurrentIndex] = useState(0);

    const isSingleTemplate = templates.length === 1;

    const handlePrev = () => {
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : templates.length - 1));
    };

    const handleNext = () => {
        setCurrentIndex(prev => (prev < templates.length - 1 ? prev + 1 : 0));
    };

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

                        <div className="flex flex-col items-center gap-3">
                            <div className="text-5xl">{template.preview}</div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-0.5">{template.name}</h4>
                                <p className="text-xs text-gray-500">{template.description}</p>
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
                            <div className={`text-3xl mb-2 ${isDisabled ? 'grayscale' : ''}`}>{template.preview}</div>
                            <p className={`text-[11px] leading-tight ${isDisabled ? 'text-gray-400' : isSelected ? 'text-[#1A3C40] font-medium' : 'text-gray-500'}`}>
                                {template.name}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{template.description}</p>
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

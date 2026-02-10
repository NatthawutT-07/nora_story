import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, Heart, Sparkles } from 'lucide-react';

// Template preview data
const TEMPLATE_PREVIEWS = {
    1: [
        { id: 't1-1', name: 'Love Lock 💕', preview: '🔐', description: 'ข้อความลับพร้อม PIN' },
        { id: 't1-2', name: 'Ordination 🙏', preview: '🪷', description: 'การ์ดงานบวช' },
        { id: 't1-3', name: 'Wedding 💍', preview: '👰', description: 'การ์ดงานแต่ง' },
    ],
    2: [
        { id: 't2-1', name: 'Standard Love', preview: '💌', description: 'อนิเมชั่นพื้นฐาน' },
        { id: 't2-2', name: 'Golden Merit', preview: '✨', description: 'งานบวชพรีเมียม' },
        { id: 't2-3', name: 'Rose Wedding', preview: '🌹', description: 'งานแต่งพรีเมียม' },

    ],
    3: [
        { id: 't3-1', name: 'Luxury Gold', preview: '👑', description: 'หรูหราอลังการ' },
        { id: 't3-2', name: 'Crystal Clear', preview: '💎', description: 'เพชรพราว' },
        { id: 't3-3', name: 'Velvet Night', preview: '🌌', description: 'ราตรีสุดโรแมนติก' },
    ],
    4: [
        { id: 't4-1', name: 'Eternal Love', preview: '💕', description: 'ความรักนิรันดร์' },
        { id: 't4-2', name: 'Paradise', preview: '🏝️', description: 'สวรรค์บนดิน' },
        { id: 't4-3', name: 'Infinity', preview: '♾️', description: 'ไม่มีวันจบ' },
    ],
};

const TemplateSelector = ({ tierId, selectedTemplate, onSelect }) => {
    const templates = TEMPLATE_PREVIEWS[tierId] || TEMPLATE_PREVIEWS[1];
    const [currentIndex, setCurrentIndex] = useState(0);

    // For single template (Tier 1), auto-select and show special UI
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    {/* Special Tier 1 Card */}
                    <motion.div
                        onClick={() => onSelect(template.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative cursor-pointer rounded-2xl p-6 transition-all ${isSelected
                            ? 'bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 ring-2 ring-rose-400 shadow-xl'
                            : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-rose-50 hover:to-pink-50'
                            }`}
                    >
                        {/* Selected Badge */}
                        {isSelected && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-3 right-3 bg-rose-500 text-white rounded-full p-1.5 shadow-lg"
                            >
                                <Check size={16} />
                            </motion.div>
                        )}

                        {/* Template Preview */}
                        <div className="flex flex-col items-center gap-4">
                            <motion.div
                                animate={isSelected ? {
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0]
                                } : {}}
                                transition={{ duration: 0.5 }}
                                className="text-6xl"
                            >
                                {template.preview}
                            </motion.div>

                            <div>
                                <h4 className="text-xl font-semibold text-gray-800 mb-1">
                                    {template.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                    {template.description}
                                </p>
                            </div>

                            {/* Features List */}
                            <div className="flex flex-wrap justify-center gap-2 mt-2">
                                <span className="px-3 py-1 bg-white/70 rounded-full text-xs text-gray-600 flex items-center gap-1">
                                    <Heart size={12} className="text-rose-500" /> คำถามสุดน่ารัก
                                </span>
                                <span className="px-3 py-1 bg-white/70 rounded-full text-xs text-gray-600 flex items-center gap-1">
                                    🔐 รหัส PIN ปลอดภัย
                                </span>
                                <span className="px-3 py-1 bg-white/70 rounded-full text-xs text-gray-600 flex items-center gap-1">
                                    <Sparkles size={12} className="text-amber-500" /> Confetti สุดอลัง
                                </span>
                            </div>
                        </div>

                        {/* Click to Select Hint */}
                        {!isSelected && (
                            <p className="text-xs text-gray-400 mt-4">คลิกเพื่อเลือก</p>
                        )}
                    </motion.div>

                    {/* Selected Confirmation */}
                    <AnimatePresence>
                        {isSelected && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl"
                            >
                                <p className="text-sm text-green-700 flex items-center justify-center gap-2">
                                    <Check size={16} /> เลือกธีมนี้แล้ว
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        );
    }

    // Multiple Templates UI (Tier 2-4) with Carousel
    return (
        <div className="w-full">


            {/* Carousel */}
            <div className="relative px-8">
                {/* Navigation Arrows */}
                <button
                    onClick={handlePrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
                >
                    <ChevronLeft size={18} className="text-gray-600" />
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
                >
                    <ChevronRight size={18} className="text-gray-600" />
                </button>

                {/* Template Cards */}
                <div className="overflow-hidden rounded-xl">
                    <motion.div
                        className="flex gap-3"
                        animate={{ x: -currentIndex * 108 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        {templates.map((template) => (
                            <motion.div
                                key={template.id}
                                className="flex-shrink-0 w-[100px] cursor-pointer"
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onSelect(template.id)}
                            >
                                <div
                                    className={`relative aspect-square rounded-xl flex items-center justify-center text-3xl transition-all ${selectedTemplate === template.id
                                        ? 'bg-gradient-to-br from-rose-200 to-pink-200 ring-2 ring-rose-400 shadow-lg'
                                        : 'bg-gradient-to-br from-gray-100 to-gray-50 hover:from-rose-50 hover:to-pink-50'
                                        }`}
                                >
                                    {template.preview}
                                    {selectedTemplate === template.id && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-1 shadow-md"
                                        >
                                            <Check size={10} />
                                        </motion.div>
                                    )}
                                </div>
                                <p className={`text-[10px] text-center mt-1.5 leading-tight ${selectedTemplate === template.id
                                    ? 'text-rose-600 font-medium'
                                    : 'text-gray-500'
                                    }`}>
                                    {template.name}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-1 mt-3">
                    {templates.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${currentIndex === idx
                                ? 'bg-rose-400 w-4'
                                : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Selected Info */}
            <AnimatePresence>
                {selectedTemplate && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-center"
                    >
                        <p className="text-sm text-rose-700 flex items-center justify-center gap-2">
                            <Check size={14} />
                            เลือก: <span className="font-semibold">{templates.find(t => t.id === selectedTemplate)?.name}</span>
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TemplateSelector;

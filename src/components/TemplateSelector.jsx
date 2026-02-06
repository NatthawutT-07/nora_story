import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

// Template preview data - thumbnails and names for each template
const TEMPLATE_PREVIEWS = {
    1: [
        { id: 't1-1', name: 'Sunrise Glow', preview: '🌅' },
        { id: 't1-2', name: 'Moonlight', preview: '🌙' },
        { id: 't1-3', name: 'Cherry Blossom', preview: '🌸' },
        { id: 't1-4', name: 'Ocean Breeze', preview: '🌊' },
        { id: 't1-5', name: 'Golden Hour', preview: '✨' },
        { id: 't1-6', name: 'Starry Night', preview: '⭐' },
        { id: 't1-7', name: 'Rose Garden', preview: '🌹' },
    ],
    2: [
        { id: 't2-1', name: 'Love Letter', preview: '💌' },
        { id: 't2-2', name: 'Vintage Romance', preview: '📷' },
        { id: 't2-3', name: 'Neon Love', preview: '💜' },
        { id: 't2-4', name: 'Eternal Flame', preview: '🔥' },
        { id: 't2-5', name: 'Spring Garden', preview: '🌷' },
        { id: 't2-6', name: 'Winter Snow', preview: '❄️' },
    ],
    3: [
        { id: 't3-1', name: 'Luxury Gold', preview: '👑' },
        { id: 't3-2', name: 'Crystal Clear', preview: '💎' },
        { id: 't3-3', name: 'Velvet Night', preview: '🌌' },
        { id: 't3-4', name: 'Rose Petal', preview: '🥀' },
        { id: 't3-5', name: 'Aurora', preview: '🌈' },
        { id: 't3-6', name: 'Twilight', preview: '🌆' },
    ],
    4: [
        { id: 't4-1', name: 'Eternal Love', preview: '💕' },
        { id: 't4-2', name: 'Paradise', preview: '🏝️' },
        { id: 't4-3', name: 'Infinity', preview: '♾️' },
        { id: 't4-4', name: 'Royal', preview: '🏰' },
        { id: 't4-5', name: 'Timeless', preview: '⏳' },
        { id: 't4-6', name: 'Forever', preview: '💍' },
    ],
};

/**
 * TemplateSelector - Allows customers to preview and select a template during checkout
 * @param {number} tierId - The tier of the selected package (1-4)
 * @param {string} selectedTemplate - Currently selected template ID
 * @param {function} onSelect - Callback when template is selected
 */
const TemplateSelector = ({ tierId, selectedTemplate, onSelect }) => {
    const templates = TEMPLATE_PREVIEWS[tierId] || TEMPLATE_PREVIEWS[1];
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : templates.length - 1));
    };

    const handleNext = () => {
        setCurrentIndex(prev => (prev < templates.length - 1 ? prev + 1 : 0));
    };

    return (
        <div className="w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                เลือกธีมที่ชอบ
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
                เลือกรูปแบบเบื้องต้น ทีมงานจะจัดทำให้ตามความต้องการของคุณ
            </p>

            {/* Carousel */}
            <div className="relative">
                {/* Navigation Arrows */}
                <button
                    onClick={handlePrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
                >
                    <ChevronLeft size={20} className="text-gray-600" />
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
                >
                    <ChevronRight size={20} className="text-gray-600" />
                </button>

                {/* Template Cards */}
                <div className="overflow-hidden">
                    <motion.div
                        className="flex gap-4"
                        animate={{ x: -currentIndex * 140 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        {templates.map((template) => (
                            <motion.div
                                key={template.id}
                                className={`flex-shrink-0 w-32 cursor-pointer`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onSelect(template.id)}
                            >
                                <div
                                    className={`relative aspect-[3/4] rounded-xl flex items-center justify-center text-4xl transition-all ${selectedTemplate === template.id
                                            ? 'bg-gradient-to-br from-[#E8A08A]/20 to-[#E8A08A]/40 ring-2 ring-[#E8A08A] shadow-lg'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                >
                                    {template.preview}
                                    {selectedTemplate === template.id && (
                                        <div className="absolute top-2 right-2 bg-[#E8A08A] text-white rounded-full p-1">
                                            <Check size={12} />
                                        </div>
                                    )}
                                </div>
                                <p className={`text-xs text-center mt-2 ${selectedTemplate === template.id ? 'text-[#E8A08A] font-medium' : 'text-gray-500'
                                    }`}>
                                    {template.name}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Selected Info */}
            {selectedTemplate && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-[#E8A08A]/10 rounded-xl text-center"
                >
                    <p className="text-sm text-[#1A3C40]">
                        คุณเลือก: <span className="font-semibold">{templates.find(t => t.id === selectedTemplate)?.name}</span>
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export default TemplateSelector;

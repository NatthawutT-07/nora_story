import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Eye } from 'lucide-react';
import ColorPicker from './ColorPicker';
import { useCheckout } from './CheckoutContext';

// Import templates for inline preview
import Tier1Template1 from '../templates/tier1/Tier1Template1';
import Tier1Template2 from '../templates/tier1/Tier1Template2';

import Tier2Template1 from '../templates/tier2/Tier2Template1';
import Tier3Template1 from '../templates/tier3/Tier3Template1';

// Template preview data
const TEMPLATE_PREVIEWS = {
    1: [
        { id: 't1-1', number: '01', name: 'Love Card', preview: '', description: 'ข้อความลับพร้อม PIN' },

        { id: 't1-2', number: '02', name: 'Chat View', preview: '', description: 'แชทจำลอง' },
        { id: 't1-3', number: '03', name: 'Soon', preview: '', description: '', disabled: true },
    ],
    2: [
        { id: 't2-1', number: '01', name: 'Standard Love', preview: '', description: 'อนิเมชั่นอัพเกรด' },
        { id: 't2-2', number: '02', name: 'Soon', preview: '', description: '', disabled: true },
        { id: 't2-3', number: '03', name: 'Soon', preview: '', description: '', disabled: true },
    ],
    3: [
        { id: 't3-1', number: '01', name: 'Premium Story', preview: '', description: 'หรูหราอลังการ' },
        { id: 't3-2', number: '02', name: 'Soon', preview: '', description: '', disabled: true },
        { id: 't3-3', number: '03', name: 'Soon', preview: '', description: '', disabled: true },
    ],
};

// Demo component map for inline preview modal
const DEMO_TEMPLATES = {
    't1-1': Tier1Template1,
    't1-2': Tier1Template2,

    't2-1': Tier2Template1,
    't3-1': Tier3Template1,
};

// Inline Full-Screen Preview Modal (Using Portal to escape parent overflow/z-index)
const PreviewModal = ({ templateId, onClose, colorTheme }) => {
    const Component = DEMO_TEMPLATES[templateId];
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!Component || !mounted) return null;

    return createPortal(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 lg:p-0"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="relative w-full max-w-sm h-[85vh] rounded-3xl lg:max-w-full lg:h-full lg:rounded-none overflow-hidden shadow-2xl border border-white/20 bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Badge */}
                <div className="absolute top-3 left-3 lg:top-6 lg:left-6 z-[100] bg-black/50 backdrop-blur text-white text-[10px] lg:text-sm px-3 lg:px-4 py-1 lg:py-2 rounded-full flex items-center gap-1.5 font-medium shadow-lg">
                    <Eye size={11} className="lg:w-4 lg:h-4" /> ตัวอย่าง (Demo)
                </div>
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 lg:top-6 lg:right-6 z-[100] w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center bg-black/50 backdrop-blur text-white rounded-full text-lg lg:text-xl hover:bg-black/70 transition-colors shadow-lg"
                >
                    ×
                </button>
                {/* Template render */}
                <div className="w-full h-full overflow-y-auto relative">
                    <Component
                        targetName="ที่รัก"
                        customMessage="ทุกช่วงเวลาที่มีเธอ คือของขวัญที่ดีที่สุดในชีวิต"
                        customSignOff="รักเธอเสมอ"
                        pinCode="1234"
                        pin="1234"
                        timelines={[]}
                        isDemo={true}
                        isModalPreview={true}
                        colorTheme={colorTheme}
                    />
                </div>
            </motion.div>
        </motion.div>,
        document.body
    );
};

const TemplateSelector = ({ tierId, selectedTemplate, onSelect }) => {
    const { selectedColorTheme } = useCheckout();
    const templates = TEMPLATE_PREVIEWS[tierId] || TEMPLATE_PREVIEWS[1];
    const [previewId, setPreviewId] = useState(null);

    return (
        <div className="w-full">
            {/* Color Theme Picker */}
            <ColorPicker />

            {/* Template Grid */}
            <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => {
                    const isSelected = selectedTemplate === template.id;
                    const isDisabled = template.disabled;
                    const hasPreview = Boolean(DEMO_TEMPLATES[template.id]);

                    return (
                        <motion.div
                            key={template.id}
                            whileTap={isDisabled ? {} : { scale: 0.97 }}
                            onClick={() => !isDisabled && onSelect(template.id)}
                            className={`relative rounded-2xl p-4 text-center transition-all select-none
                                ${isDisabled
                                    ? 'bg-gray-100 opacity-50 cursor-not-allowed'
                                    : isSelected
                                        ? 'bg-gray-50 ring-2 ring-[#1A3C40] shadow-sm cursor-pointer'
                                        : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
                                }`}
                        >
                            {/* Soon badge */}
                            {isDisabled && (
                                <div className="absolute top-2 right-2 bg-gray-400 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                                    เร็วๆนี้
                                </div>
                            )}

                            {/* Selected check */}
                            {isSelected && !isDisabled && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1.5 -right-1.5 bg-[#1A3C40] text-white rounded-full p-1"
                                >
                                    <Check size={10} />
                                </motion.div>
                            )}

                            {/* Number badge */}
                            <div className={`inline-block text-[10px] font-mono px-1.5 py-0.5 rounded mb-2
                                ${isDisabled ? 'bg-gray-200 text-gray-400'
                                    : isSelected ? 'bg-[#1A3C40] text-white'
                                        : 'bg-gray-200/70 text-gray-400'}`}
                            >
                                {template.number}
                            </div>

                            <p className={`text-sm font-semibold leading-tight mb-0.5
                                ${isDisabled ? 'text-gray-400' : isSelected ? 'text-[#1A3C40]' : 'text-gray-700'}`}
                            >
                                {template.name}
                            </p>
                            <p className="text-[10px] text-gray-400">{template.description}</p>

                            {/* Preview button */}
                            {hasPreview && !isDisabled && (
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => { e.stopPropagation(); setPreviewId(template.id); }}
                                    className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-medium text-[#E8A08A] hover:text-[#d89279] bg-[#E8A08A]/10 hover:bg-[#E8A08A]/20 px-2.5 py-1 rounded-full transition-colors"
                                >
                                    <Eye size={10} /> ดูตัวอย่าง
                                </motion.button>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Selected label */}
            <AnimatePresence>
                {selectedTemplate && !templates.find(t => t.id === selectedTemplate)?.disabled && (
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

            {/* Preview Modal */}
            <AnimatePresence>
                {previewId && (
                    <PreviewModal
                        templateId={previewId}
                        onClose={() => setPreviewId(null)}
                        colorTheme={selectedColorTheme}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default TemplateSelector;

import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Loader2 } from 'lucide-react';
import { mergeConfig } from '../../lib/templateConfig';
import { getTemplate } from '../../lib/templateRegistry';

const LivePreviewModal = ({ isOpen, onClose, formData, selectedTemplate, contentFiles, selectedColorTheme }) => {
    if (!isOpen || !selectedTemplate) return null;

    const templateConfig = getTemplate(selectedTemplate);
    const TemplateComponent = templateConfig?.PageComponent;
    if (!TemplateComponent) return null;

    const config = mergeConfig({});

    // Convert local File objects to preview URLs
    const previewImages = (contentFiles || [])
        .filter(Boolean)
        .map(file => (typeof file === 'string' ? file : URL.createObjectURL(file)));

    return (
        <AnimatePresence>
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
                    className="relative w-full max-w-sm h-[85vh] rounded-3xl lg:max-w-full lg:h-full lg:rounded-none overflow-hidden shadow-2xl border border-white/20 bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 lg:top-6 lg:right-6 z-[10000] w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center bg-black/50 backdrop-blur-md hover:bg-black/70 text-white rounded-full shadow-lg transition-colors"
                    >
                        <X size={20} className="lg:w-6 lg:h-6" />
                    </button>

                    {/* Preview Badge */}
                    <div className="absolute top-3 left-3 lg:top-6 lg:left-6 z-[10000] bg-black/50 backdrop-blur-md text-white px-3 lg:px-4 py-1 lg:py-2 rounded-full text-[10px] lg:text-sm font-medium flex items-center gap-1.5 lg:gap-2 shadow-lg">
                        <Eye size={11} className="lg:w-4 lg:h-4" />
                        ตัวอย่างก่อนจ่ายเงิน
                    </div>

                    {/* Template Render */}
                    <div className="w-full h-full overflow-y-auto relative">
                        <Suspense fallback={
                            <div className="w-full h-full flex items-center justify-center">
                                <Loader2 className="animate-spin text-gray-400" size={32} />
                            </div>
                        }>
                            <TemplateComponent
                                targetName={formData.targetName || 'คนพิเศษ'}
                                customMessage={formData.message || 'ข้อความของคุณจะแสดงที่นี่...'}
                                customSignOff={formData.signOff || '— ผู้ส่ง'}
                                pinCode={formData.pin || '1234'}
                                pin={formData.pin || '1234'}
                                timelines={formData.timelines || []}
                                finaleMessage={formData.finaleMessage || ''}
                                finaleSignOff={formData.finaleSignOff || ''}
                                images={previewImages}
                                musicUrl={formData.musicUrl || ''}
                                colorTheme={selectedColorTheme || null}
                                config={config}
                                isDemo={false}
                                isModalPreview={true}
                            />
                        </Suspense>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LivePreviewModal;

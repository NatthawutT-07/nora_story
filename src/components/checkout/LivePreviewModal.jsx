import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye } from 'lucide-react';
import { mergeConfig } from '../../lib/templateConfig';

// Import all templates (same map as StoryPage)
import Tier1Template1 from '../templates/tier1/Tier1Template1';
import Tier1Template2 from '../templates/tier1/Tier1Template2';
import Tier1Template3 from '../templates/tier1/Tier1Template3';
import Tier2Template1 from '../templates/tier2/Tier2Template1';
import Tier2Template2 from '../templates/tier2/Tier2Template2';
import Tier2Template3 from '../templates/tier2/Tier2Template3';
import Tier3Template1 from '../templates/tier3/Tier3Template1';
import Tier3Template2 from '../templates/tier3/Tier3Template2';
import Tier3Template3 from '../templates/tier3/Tier3Template3';

const TEMPLATES = {
    't1-1': Tier1Template1, 't1-2': Tier1Template2, 't1-3': Tier1Template3,
    't2-1': Tier2Template1, 't2-2': Tier2Template2, 't2-3': Tier2Template3,
    't3-1': Tier3Template1, 't3-2': Tier3Template2, 't3-3': Tier3Template3,
};

const LivePreviewModal = ({ isOpen, onClose, formData, selectedTemplate, contentFiles }) => {
    if (!isOpen || !selectedTemplate) return null;

    const TemplateComponent = TEMPLATES[selectedTemplate];
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
                className="fixed inset-0 z-[9999] bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="fixed top-4 right-4 z-[10000] bg-black/50 backdrop-blur-md hover:bg-black/70 text-white p-3 rounded-full shadow-lg transition-colors"
                >
                    <X size={22} />
                </button>

                {/* Preview Badge */}
                <div className="fixed top-4 left-4 z-[10000] bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 shadow-lg">
                    <Eye size={14} />
                    ตัวอย่างก่อนจ่ายเงิน
                </div>

                {/* Template Render */}
                <div className="w-full h-full overflow-y-auto">
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
                        musicUrl={''}
                        config={config}
                        isDemo={false}
                    />
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LivePreviewModal;

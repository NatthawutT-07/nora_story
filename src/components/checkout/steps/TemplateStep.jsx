import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useCheckout } from '../CheckoutContext';
import TemplateSelector from '../TemplateSelector';
import Template1Fields from '../forms/tier1/Template1Fields';

const TemplateStep = () => {
    const { tier, selectedTemplate, setSelectedTemplate, isTier1Template1 } = useCheckout();

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <TemplateSelector
                tierId={tier?.id}
                selectedTemplate={selectedTemplate}
                onSelect={setSelectedTemplate}
            />

            {/* Tier 1 Template 1 Specific Fields */}
            {isTier1Template1 && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 pt-6 border-t border-gray-100 space-y-4"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Heart size={18} className="text-pink-500" />
                        <span className="text-sm font-medium text-[#1A3C40]">ตั้งค่าข้อความพิเศษ</span>
                    </div>

                    <Template1Fields />
                </motion.div>
            )}
        </motion.div>
    );
};

export default TemplateStep;

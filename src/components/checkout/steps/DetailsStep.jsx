import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useCheckout } from '../CheckoutContext';
import MusicSelection from '../forms/MusicSelection';
import { Loader2 } from 'lucide-react';

/**
 * DetailsStep — Dynamically renders the correct form based on template registry.
 * No if/else chains. Adding a new template = adding a FormComponent in the registry.
 */
const DetailsStep = () => {
    const { templateConfig, selectedTemplate } = useCheckout();

    // Loading fallback for lazy-loaded form components
    const FormLoading = () => (
        <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-gray-400" size={24} />
        </div>
    );

    // If no template config or no FormComponent, show placeholder
    if (!templateConfig || !templateConfig.FormComponent) {
        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">ธีมนี้ยังไม่มีรายละเอียดเพิ่มเติม</p>
                    <p className="text-xs mt-1">กดถัดไปเพื่อดำเนินการต่อ</p>
                </div>
            </motion.div>
        );
    }

    const { FormComponent, hasMusic } = templateConfig;

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Suspense fallback={<FormLoading />}>
                <FormComponent />
            </Suspense>
            {hasMusic && <MusicSelection />}
        </motion.div>
    );
};

export default DetailsStep;

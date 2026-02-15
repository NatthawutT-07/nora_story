import { motion } from 'framer-motion';
import { useCheckout } from '../CheckoutContext';
import TemplateSelector from '../TemplateSelector';

const TemplateStep = () => {
    const { tier, selectedTemplate, setSelectedTemplate } = useCheckout();

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <TemplateSelector
                tierId={tier?.id}
                selectedTemplate={selectedTemplate}
                onSelect={setSelectedTemplate}
            />
        </motion.div>
    );
};

export default TemplateStep;

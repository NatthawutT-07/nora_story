import { motion } from 'framer-motion';
import { useCheckout } from '../CheckoutContext';
import Template1Fields from '../forms/tier1/Template1Fields';
import TimelineFields from '../forms/tier3/TimelineFields';
import MusicSelection from '../forms/MusicSelection';

const DetailsStep = () => {
    const { needsDetailFields, needsTimelineFields, selectedTemplate } = useCheckout();

    // T1-1 and T2 templates: PIN, Target Name, Message, Sign Off
    if (needsDetailFields) {
        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Template1Fields />
                {selectedTemplate !== 't1-1' && <MusicSelection />}
            </motion.div>
        );
    }

    // Tier 3: Timeline fields (5 slots)
    if (needsTimelineFields) {
        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <TimelineFields />
                <MusicSelection />
            </motion.div>
        );
    }

    // Default: placeholder for other templates that don't have details yet
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="text-center py-8 text-gray-400">
                <p className="text-sm">ธีมนี้ยังไม่มีรายละเอียดเพิ่มเติม</p>
                <p className="text-xs mt-1">กดถัดไปเพื่อดำเนินการต่อ</p>
            </div>
            {selectedTemplate !== 't1-1' && <MusicSelection />}
        </motion.div>
    );
};

export default DetailsStep;

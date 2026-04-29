import { motion } from 'framer-motion';
import { useCheckout } from '../CheckoutContext';
import Template1Fields from '../forms/tier1/Template1Fields';
import Template2Fields from '../forms/tier1/Template2Fields';
import { Wand2 } from 'lucide-react';
import TimelineFields from '../forms/tier3/TimelineFields';
import MusicSelection from '../forms/MusicSelection';

const DetailsStep = () => {
    const { needsDetailFields, needsTimelineFields, isChatTemplate, selectedTemplate, updateFormData } = useCheckout();

    const handleDemoFill = () => {
        if (isChatTemplate) {
            updateFormData({
                targetName: 'Honey ❤️',
                shortMessage: 'Baby',
                customMessage: 'Thank you for being in my life and making me smile every day. Through thick and thin, having you by my side gives me the strength to keep going. I love you.'
            });
        }
        if (needsDetailFields) {
            updateFormData({
                pin: '1234',
                targetName: 'ที่รัก',
                message: 'ทุกช่วงเวลาที่มีเธอ คือของขวัญที่ฉันไม่อยากสูญเสีย',
                signOff: 'รักเสมอ'
            });
        }
        if (needsTimelineFields) {
            updateFormData({
                timelines: [
                    { label: '1 Month', desc: '' },
                    { label: '1 Year', desc: '' },
                    { label: '3 Years', desc: '' },
                    { label: 'Memories', desc: '' },
                    { label: 'To Infinity', desc: '' },
                ],
                finaleMessage: 'ขอบคุณที่เข้ามาในชีวิต และทำให้ทุกวันมีความหมาย',
                finaleSignOff: 'รักที่สุด'
            });
        }
    };

    const DemoButton = () => (
        <button
            onClick={handleDemoFill}
            className="mb-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-50 text-purple-600 text-sm font-medium hover:bg-purple-100 transition-colors border border-purple-100"
        >
            <Wand2 size={16} />
            ทดลองกรอกข้อมูลอัตโนมัติ (Demo)
        </button>
    );  

    // Chat template (t1-2)
    if (isChatTemplate) {
        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Template2Fields />
            </motion.div>
        );
    }

    // T1-1 and T2 templates
    if (needsDetailFields) {
        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                {/* <DemoButton /> */}
                <Template1Fields />
                {selectedTemplate !== 't1-1' && <MusicSelection />}
            </motion.div>
        );
    }

    // Tier 3: Timeline fields (5 slots)
    if (needsTimelineFields) {
        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                {/* <DemoButton /> */}
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

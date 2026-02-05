import { motion } from 'framer-motion';

const Tier1Template2 = ({ customImage, customMessage }) => {
    return (
        <div className="min-h-screen bg-[#222] flex items-center justify-center p-4">
            <motion.div
                initial={{ rotate: -5, opacity: 0 }}
                animate={{ rotate: -2, opacity: 1 }}
                transition={{ duration: 0.8, type: 'spring' }}
                className="bg-white p-4 pb-16 max-w-sm w-full shadow-2xl relative"
            >
                <div className="aspect-square bg-gray-100 overflow-hidden mb-4 grayscale hover:grayscale-0 transition-all duration-500">
                    <img src={customImage || "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1780&auto=format&fit=crop"} alt="Us" className="w-full h-full object-cover" />
                </div>
                <p className="font-handwriting text-2xl text-center text-gray-700 font-bold transform -rotate-1">
                    {customMessage || "Our First Date ❤️"}
                </p>
            </motion.div>
        </div>
    );
};

export default Tier1Template2;

import { motion } from 'framer-motion';

const Tier1Template1 = ({ customMessage, customSignOff }) => {
    return (
        <div className="min-h-screen bg-[#F5F5F0] flex flex-col items-center justify-center p-4 md:p-8 text-center font-serif text-[#333]">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="max-w-md w-full bg-white p-6 md:p-12 shadow-sm border border-gray-200"
            >
                <p className="text-xs md:text-sm tracking-[0.2em] uppercase text-gray-400 mb-4 md:mb-8">For You</p>
                <h1 className="text-2xl md:text-4xl italic mb-4 md:mb-6 leading-relaxed">
                    "{customMessage || "Every moment with you is a gift I never want to lose."}"
                </h1>
                <p className="text-xs text-gray-400 mt-8 md:mt-12">- {customSignOff || "Yours, Always"}</p>
            </motion.div>
            <div className="mt-6 md:mt-8 text-xs text-gray-300">Nora.dev Tier 1 Template</div>
        </div>
    );
};

export default Tier1Template1;

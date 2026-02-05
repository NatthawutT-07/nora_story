import { motion } from 'framer-motion';

const Tier1Template4 = ({ customTitle, customMessage, customSignOff }) => {
    return (
        <div className="min-h-screen bg-[#fffcf5] flex flex-col items-center justify-center p-6 text-center font-serif text-[#2c2c2c] overflow-hidden relative">
            {/* Background Texture Line */}
            <div className="absolute inset-0 border-[20px] border-[#fffcf5] z-10 pointer-events-none"></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <span className="text-[20rem] font-bold font-playfair">&</span>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="max-w-lg w-full relative z-20 border-y-2 border-[#2c2c2c] py-12 px-4"
            >
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xs tracking-[0.3em] font-sans uppercase mb-6 text-gray-500"
                >
                    {customTitle || "A NOTE FOR YOU"}
                </motion.h2>

                <h1 className="text-3xl md:text-5xl font-playfair font-medium leading-tight mb-8">
                    "{customMessage || "Simplicity is the ultimate sophistication. Just like my love for you—simple, pure, and endless."}"
                </h1>

                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100px" }}
                    transition={{ delay: 1, duration: 1 }}
                    className="h-[1px] bg-[#2c2c2c] mx-auto mb-8"
                />

                <p className="text-sm md:text-base font-bold tracking-widest uppercase">
                    — {customSignOff || "WITH LOVE"}
                </p>
            </motion.div>
        </div>
    );
};

export default Tier1Template4;

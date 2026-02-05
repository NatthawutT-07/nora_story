import { motion } from 'framer-motion';

const Tier1Template5 = ({ customImage, customMessage, customSignOff }) => {
    return (
        <div className="min-h-screen bg-[#dfe6e9] flex flex-col items-center justify-center p-6 font-handwriting text-gray-700">
            <motion.div
                initial={{ rotate: -5, opacity: 0, scale: 0.9 }}
                animate={{ rotate: -2, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="bg-white p-4 pb-12 shadow-[0_10px_40px_rgba(0,0,0,0.15)] max-w-sm w-full transform hover:rotate-0 transition-transform duration-500"
            >
                <div className="aspect-square bg-gray-100 mb-6 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/dust.png')] relative">
                    {customImage ? (
                        <img src={customImage} alt="Memory" className="w-full h-full object-cover grayscale-[20%] sepia-[10%] contrast-110" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                            <span className="text-sm">No Photo</span>
                        </div>
                    )}
                    <div className="absolute inset-0 shadow-inner pointer-events-none opacity-20"></div>
                </div>

                <div className="px-2 text-center relative">
                    <p className="font-handwriting text-2xl md:text-3xl leading-relaxed text-[#2d3436]">
                        {customMessage || "This moment right here? I want to stay in it forever."}
                    </p>
                    <div className="mt-6 flex justify-end">
                        <span className="text-sm md:text-base font-sans text-gray-400 tracking-wide transform rotate-[-2deg] border-b border-gray-300 pb-1">
                            {customSignOff || "xoxo"}
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Tier1Template5;

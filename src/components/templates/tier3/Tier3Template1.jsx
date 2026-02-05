import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Mail } from 'lucide-react';

const Tier3Template1 = ({ customMessage, customSignOff }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#FDF6E3] flex items-center justify-center p-4 font-serif">
            <AnimatePresence>
                {!isOpen ? (
                    <motion.div
                        key="envelope"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        className="cursor-pointer"
                        onClick={() => setIsOpen(true)}
                    >
                        <div className="w-64 md:w-80 h-44 md:h-56 bg-[#E6D4B9] rounded-lg shadow-2xl relative flex items-center justify-center border-b-8 border-[#D4C0A1]">
                            {/* Envelope Flap */}
                            <div className="absolute top-0 left-0 w-full h-0 border-l-[128px] md:border-l-[160px] border-l-transparent border-r-[128px] md:border-r-[160px] border-r-transparent border-t-[88px] md:border-t-[112px] border-t-[#DBC6A7] transform origin-top hover:scale-y-90 transition-transform"></div>

                            <div className="text-[#8B7355] flex flex-col items-center z-10">
                                <Mail size={40} className="mb-2" />
                                <span className="tracking-widest font-semibold uppercase text-[10px] md:text-xs">Tap to Open</span>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="letter"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="bg-white p-6 md:p-10 max-w-lg w-full shadow-xl relative mx-4"
                    >
                        <div className="absolute -top-5 md:-top-6 left-1/2 -translate-x-1/2 w-10 md:w-12 h-10 md:h-12 bg-red-800 rounded-full flex items-center justify-center text-white text-[10px] md:text-xs shadow-md">
                            From Me
                        </div>
                        <h1 className="text-2xl md:text-3xl italic text-[#2C3E50] mb-6 md:mb-8 text-center border-b pb-4">My Dearest,</h1>
                        <p className="text-gray-600 leading-loose text-justify mb-6 md:mb-8 text-sm md:text-base">
                            "{customMessage || "Every day with you feels like a page out of a beautiful novel. I never believed in fairytales until I met you. You are my sun, my moon, and all my stars."}"
                        </p>
                        <p className="text-right text-[#2C3E50] font-bold text-sm md:text-base">- {customSignOff || "Always Yours"}</p>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="mt-8 text-xs text-gray-400 block mx-auto hover:text-gray-600"
                        >
                            Close Letter
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Tier3Template1;

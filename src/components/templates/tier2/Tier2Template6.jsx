import { motion } from 'framer-motion';

const Tier2Template6 = ({ customTitle, customMessage, customImage }) => {
    return (
        <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center p-4 font-sans text-white overflow-hidden">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-lg"
            >
                {/* Title */}
                <motion.h1
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center text-2xl md:text-3xl font-playfair mb-6 text-pink-200"
                >
                    {customTitle || "You & Me"}
                </motion.h1>

                {/* Split Screen Container */}
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                    {/* Left Side */}
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="absolute top-0 left-0 w-1/2 h-full"
                    >
                        <div className="w-full h-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
                            {customImage ? (
                                <img src={customImage} className="w-full h-full object-cover" style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }} />
                            ) : (
                                <div className="text-6xl">👩</div>
                            )}
                        </div>
                    </motion.div>

                    {/* Right Side */}
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.7, type: "spring" }}
                        className="absolute top-0 right-0 w-1/2 h-full"
                    >
                        <div className="w-full h-full bg-gradient-to-bl from-blue-400 to-indigo-500 flex items-center justify-center">
                            <div className="text-6xl">👨</div>
                        </div>
                    </motion.div>

                    {/* Center Divider with Heart */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1, type: "spring", stiffness: 200 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                    >
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                            <span className="text-3xl">❤️</span>
                        </div>
                    </motion.div>

                    {/* Diagonal Line */}
                    <div className="absolute inset-0 pointer-events-none">
                        <svg className="w-full h-full" preserveAspectRatio="none">
                            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="white" strokeWidth="4" strokeDasharray="10,10" />
                        </svg>
                    </div>
                </div>

                {/* Message */}
                <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-center mt-6 text-pink-100/80 text-sm md:text-base leading-relaxed"
                >
                    {customMessage || "Two halves of the same heart, together we are complete."}
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Tier2Template6;

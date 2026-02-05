import { motion } from 'framer-motion';
import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

const Tier3Template5 = ({ customTitle, customMessage, customImage }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-800 to-fuchsia-900 flex flex-col items-center justify-center p-6 font-sans">
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            x: Math.random() * 100 + '%',
                            y: '100%',
                            opacity: 0.3
                        }}
                        animate={{
                            y: '-10%',
                            opacity: [0.3, 0.8, 0.3]
                        }}
                        transition={{
                            duration: 8 + Math.random() * 4,
                            repeat: Infinity,
                            delay: Math.random() * 5
                        }}
                        className="absolute w-1 h-1 bg-white rounded-full"
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center relative z-10"
            >
                <h1 className="text-2xl md:text-3xl text-white font-playfair mb-6 drop-shadow-lg">
                    {customTitle || "Click to Reveal ✨"}
                </h1>

                {/* 3D Flip Card */}
                <div
                    className="relative w-72 h-96 md:w-80 md:h-[28rem] cursor-pointer perspective-1000"
                    onClick={() => setIsFlipped(!isFlipped)}
                    style={{ perspective: '1000px' }}
                >
                    <motion.div
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                        className="relative w-full h-full"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Front */}
                        <div
                            className="absolute inset-0 rounded-2xl shadow-2xl overflow-hidden"
                            style={{ backfaceVisibility: 'hidden' }}
                        >
                            <div className="w-full h-full bg-gradient-to-br from-pink-400 to-rose-500 flex flex-col items-center justify-center p-6">
                                {customImage ? (
                                    <img src={customImage} className="w-full h-full object-cover absolute inset-0" />
                                ) : (
                                    <>
                                        <div className="text-6xl mb-4">💝</div>
                                        <p className="text-white text-lg font-medium">Tap to flip</p>
                                    </>
                                )}
                                <div className="absolute bottom-4 text-white/60 text-xs flex items-center gap-1">
                                    <RotateCcw size={12} /> Flip me
                                </div>
                            </div>
                        </div>

                        {/* Back */}
                        <div
                            className="absolute inset-0 rounded-2xl shadow-2xl overflow-hidden"
                            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                        >
                            <div className="w-full h-full bg-gradient-to-br from-violet-500 to-purple-700 flex flex-col items-center justify-center p-8 text-white">
                                <div className="text-4xl mb-4">💜</div>
                                <p className="text-lg md:text-xl text-center leading-relaxed font-light">
                                    {customMessage || "Every love story is beautiful, but ours is my favorite. You make every moment magical."}
                                </p>
                                <div className="absolute bottom-4 text-white/60 text-xs flex items-center gap-1">
                                    <RotateCcw size={12} /> Flip back
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <p className="mt-6 text-purple-200/60 text-sm">Click the card to flip</p>
            </motion.div>
        </div>
    );
};

export default Tier3Template5;

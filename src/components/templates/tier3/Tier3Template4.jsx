import { motion } from 'framer-motion';
import { useState } from 'react';

const Tier3Template4 = ({ customMessage, customSignOff }) => {
    const [isScratched, setIsScratched] = useState(false);
    const [scratchProgress, setScratchProgress] = useState(0);

    const handleScratch = () => {
        if (scratchProgress < 100) {
            setScratchProgress(prev => Math.min(prev + 25, 100));
        }
        if (scratchProgress >= 75) {
            setIsScratched(true);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 flex flex-col items-center justify-center p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">🎁 Scratch to Reveal!</h1>
                <p className="text-white/80 mb-8 text-sm">Tap and hold to scratch the card</p>

                <div className="relative w-72 md:w-80 h-48 md:h-56 mx-auto">
                    {/* Hidden Message Layer */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center p-6 shadow-inner">
                        <div className="text-center text-white">
                            <p className="text-lg md:text-xl font-medium leading-relaxed">
                                {customMessage || "You are the best thing that ever happened to me! 💖"}
                            </p>
                            <p className="mt-4 text-sm text-pink-200">— {customSignOff || "Your Secret Admirer"}</p>
                        </div>
                    </div>

                    {/* Scratch Layer */}
                    <motion.div
                        onTap={handleScratch}
                        onPan={handleScratch}
                        animate={{
                            opacity: isScratched ? 0 : 1,
                            scale: isScratched ? 1.1 : 1
                        }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 rounded-2xl cursor-pointer shadow-xl overflow-hidden"
                        style={{
                            backgroundImage: `url('https://www.transparenttextures.com/patterns/brushed-alum.png')`,
                            maskImage: `radial-gradient(circle at 50% 50%, transparent ${scratchProgress}%, black ${scratchProgress + 10}%)`
                        }}
                    >
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                            <div className="text-5xl mb-2">🪙</div>
                            <p className="text-sm font-medium uppercase tracking-wider">Scratch Here</p>
                            <div className="mt-4 w-32 h-2 bg-gray-500/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-400 transition-all duration-300"
                                    style={{ width: `${scratchProgress}%` }}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Sparkle Effect */}
                    {isScratched && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0 pointer-events-none"
                        >
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0, x: '50%', y: '50%' }}
                                    animate={{
                                        scale: [0, 1, 0],
                                        x: `${50 + (Math.random() - 0.5) * 100}%`,
                                        y: `${50 + (Math.random() - 0.5) * 100}%`
                                    }}
                                    transition={{ duration: 0.6, delay: i * 0.05 }}
                                    className="absolute w-3 h-3 bg-yellow-300 rounded-full"
                                />
                            ))}
                        </motion.div>
                    )}
                </div>

                {isScratched && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 text-white font-medium"
                    >
                        🎉 Message Revealed! 🎉
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
};

export default Tier3Template4;

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Delete, Heart, Sparkles } from 'lucide-react';

// Floating Hearts Component
const FloatingHearts = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        x: Math.random() * 100 + '%',
                        y: '100%',
                        opacity: 0,
                        scale: 0.5 + Math.random() * 0.5
                    }}
                    animate={{
                        y: '-20%',
                        opacity: [0, 1, 1, 0],
                        rotate: Math.random() * 360
                    }}
                    transition={{
                        duration: 8 + Math.random() * 4,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: 'linear'
                    }}
                    className="absolute text-rose-300/40"
                >
                    <Heart size={16 + Math.random() * 16} fill="currentColor" />
                </motion.div>
            ))}
        </div>
    );
};

// Animated Background Gradient
const AnimatedBackground = ({ variant = 'default' }) => {
    const gradients = {
        default: 'from-rose-50 via-pink-50 to-amber-50',
        question: 'from-pink-100 via-rose-50 to-red-50',
        content: 'from-amber-50 via-rose-50 to-pink-50'
    };

    return (
        <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${gradients[variant]}`}
            animate={{
                background: [
                    'linear-gradient(135deg, #fdf2f8 0%, #fff1f2 50%, #fef3c7 100%)',
                    'linear-gradient(135deg, #fff1f2 0%, #fef3c7 50%, #fdf2f8 100%)',
                    'linear-gradient(135deg, #fef3c7 0%, #fdf2f8 50%, #fff1f2 100%)',
                    'linear-gradient(135deg, #fdf2f8 0%, #fff1f2 50%, #fef3c7 100%)'
                ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
    );
};

const Watermark = () => (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
        <div className="absolute inset-0 flex flex-wrap items-center justify-center opacity-[0.03] rotate-[-12deg] scale-150 gap-8">
            {Array.from({ length: 400 }).map((_, i) => (
                <span key={i} className="text-lg font-black text-slate-900 whitespace-nowrap select-none">
                    https://norastory.com
                </span>
            ))}
        </div>
    </div>
);

const Tier1Template1 = ({ customMessage, customSignOff, targetName = 'เธอ', pinCode = '1234' }) => {
    const [viewState, setViewState] = useState('LOCKED');
    const [pin, setPin] = useState("");
    const [showError, setShowError] = useState(false);

    const CORRECT_PIN = pinCode;

    useEffect(() => {
        if (pin.length === 4) {
            if (pin === CORRECT_PIN) {
                handleUnlock();
            } else {
                handleError();
            }
        }
    }, [pin]);

    const handleUnlock = () => {
        setViewState('CONTENT');
        triggerConfetti();
    };

    const handleError = () => {
        setShowError(true);
        setTimeout(() => {
            setPin("");
            setShowError(false);
        }, 500);
    };

    const handleKeyPress = (num) => {
        if (pin.length < 4) {
            setPin(prev => prev + num);
        }
    };

    const handleBackspace = () => setPin(prev => prev.slice(0, -1));



    const [canSendLove, setCanSendLove] = useState(true);



    const triggerConfetti = () => {
        if (!canSendLove) return;

        setCanSendLove(false);
        setTimeout(() => setCanSendLove(true), 5000);

        // Heart-shaped confetti
        const heart = confetti.shapeFromPath({
            path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
        });

        const duration = 4 * 1000;
        const animationEnd = Date.now() + duration;
        const colors = ['#f43f5e', '#ec4899', '#f97316', '#fbbf24'];

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 4 * (timeLeft / duration);

            confetti({
                particleCount,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.6 },
                colors,
                shapes: [heart, 'circle'],
                scalar: 1.2
            });
            confetti({
                particleCount,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.6 },
                colors,
                shapes: [heart, 'circle'],
                scalar: 1.2
            });
        }, 200);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 text-center font-serif text-gray-800 overflow-hidden relative">
            <Watermark />
            <AnimatePresence mode="wait">
                {/* LOCKED STATE - PIN Entry */}
                {viewState === 'LOCKED' && (
                    <motion.div
                        key="lock-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        transition={{ duration: 0.6 }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
                    >
                        <AnimatedBackground variant="default" />
                        <FloatingHearts />

                        <motion.div
                            animate={showError ? { x: [-10, 10, -10, 10, 0] } : {}}
                            transition={{ duration: 0.4 }}
                            className="relative z-10 w-full max-w-sm px-8"
                        >
                            {/* Lock Icon */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                className="mb-6 flex justify-center"
                            >
                                <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center border border-rose-100">
                                    <Heart size={36} className="text-rose-400" fill="currentColor" />
                                </div>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-2xl md:text-3xl text-gray-700 mb-5 font-light"
                            >
                            </motion.h2>


                            {/* PIN Dots */}
                            <div className="flex justify-center gap-4 mb-10">
                                {[...Array(4)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0 }}
                                        animate={{
                                            scale: 1,
                                            backgroundColor: i < pin.length ? '#f43f5e' : '#e5e7eb'
                                        }}
                                        transition={{ delay: i * 0.05, type: "spring" }}
                                        className={`w-4 h-4 rounded-full shadow-inner ${i < pin.length ? 'shadow-rose-200' : ''
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Keypad */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="grid grid-cols-3 gap-4 max-w-[260px] mx-auto"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, idx) => (
                                    <motion.button
                                        key={num}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 + idx * 0.03 }}
                                        whileHover={{ scale: 1.1, backgroundColor: '#fff1f2' }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleKeyPress(num.toString())}
                                        className="w-16 h-16 rounded-2xl bg-white/90 backdrop-blur-sm border border-rose-100 shadow-md text-xl font-medium text-gray-700 hover:text-rose-500 hover:border-rose-300 transition-colors duration-200 flex items-center justify-center"
                                    >
                                        {num}
                                    </motion.button>
                                ))}
                                <div className="w-16 h-16" />
                                <motion.button
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8 }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleKeyPress("0")}
                                    className="w-16 h-16 rounded-2xl bg-white/90 backdrop-blur-sm border border-rose-100 shadow-md text-xl font-medium text-gray-700 hover:text-rose-500 hover:border-rose-300 transition-colors duration-200 flex items-center justify-center"
                                >
                                    0
                                </motion.button>
                                <motion.button
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.85 }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleBackspace}
                                    className="w-16 h-16 rounded-2xl bg-white/60 backdrop-blur-sm text-gray-400 hover:text-rose-500 transition-colors duration-200 flex items-center justify-center"
                                >
                                    <Delete size={22} />
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}

                {/* CONTENT STATE - Greeting Card */}
                {viewState === 'CONTENT' && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                        className="relative z-10 max-w-lg w-full"
                    >
                        <AnimatedBackground variant="content" />
                        <FloatingHearts />

                        {/* Card */}
                        <div className="relative bg-white/90 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-2xl border border-rose-100 overflow-hidden">
                            {/* Decorative corner */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-rose-100 to-transparent rounded-bl-full opacity-50" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-100 to-transparent rounded-tr-full opacity-50" />

                            {/* Top decorative line */}
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-400 to-transparent"
                            />

                            {/* Content */}
                            <div className="relative z-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3, type: "spring" }}
                                    className="flex justify-center mb-6"
                                >
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg">
                                        <Heart size={28} className="text-white" fill="currentColor" />
                                    </div>
                                </motion.div>

                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-sm tracking-[0.3em] uppercase text-rose-400 mb-6 font-medium"
                                >
                                    ✨ For You ✨
                                </motion.p>

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-2xl md:text-4xl italic leading-relaxed text-gray-800 mb-8"
                                >
                                    "{customMessage || "ทุกช่วงเวลาที่มีเธอ คือของขวัญที่เค้าไม่อยากสูญเสีย"}"
                                </motion.h1>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="flex items-center justify-center gap-2 text-gray-500"
                                >
                                    <div className="w-8 h-px bg-gray-300" />
                                    <span className="text-sm tracking-wide">{customSignOff || "รักเธอเสมอ"}</span>
                                    <div className="w-8 h-px bg-gray-300" />
                                </motion.div>

                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    onClick={triggerConfetti}
                                    disabled={!canSendLove}
                                    whileHover={canSendLove ? { scale: 1.05 } : {}}
                                    whileTap={canSendLove ? { scale: 0.95 } : {}}
                                    className={`mt-10 text-sm text-rose-400 flex items-center gap-2 mx-auto bg-rose-50 px-6 py-3 rounded-full transition-all duration-300 uppercase tracking-widest ${!canSendLove ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:text-rose-500'}`}
                                >
                                    <Sparkles size={16} />
                                    {canSendLove ? "ส่งความรักอีกครั้ง" : "รอสักครู่..."}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {viewState === 'CONTENT' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-4 text-xs text-gray-300"
                >
                    Made with by Nora Story
                </motion.div>
            )}
        </div>
    );
};

export default Tier1Template1;

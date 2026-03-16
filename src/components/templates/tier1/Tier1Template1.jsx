import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Delete, Heart, Sparkles } from 'lucide-react';

// Floating Hearts Component
const FloatingHearts = ({ colorTheme }) => {
    const defaultClass = 'text-rose-300/40';
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
                    className={`absolute ${!colorTheme ? defaultClass : ''}`}
                    style={colorTheme ? { color: `${colorTheme.colors?.accent || '#fda4af'}66` } : {}}
                >
                    <Heart size={16 + Math.random() * 16} fill="currentColor" />
                </motion.div>
            ))}
        </div>
    );
};

// Animated Background Gradient
const AnimatedBackground = ({ gradientColors }) => {
    const g = gradientColors || ['#fdf2f8', '#fff1f2', '#fef3c7'];

    return (
        <motion.div
            className="absolute inset-0"
            animate={{
                background: [
                    `linear-gradient(135deg, ${g[0]} 0%, ${g[1]} 50%, ${g[2]} 100%)`,
                    `linear-gradient(135deg, ${g[1]} 0%, ${g[2]} 50%, ${g[0]} 100%)`,
                    `linear-gradient(135deg, ${g[2]} 0%, ${g[0]} 50%, ${g[1]} 100%)`,
                    `linear-gradient(135deg, ${g[0]} 0%, ${g[1]} 50%, ${g[2]} 100%)`
                ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
    );
};


const Tier1Template1 = ({ customMessage, customSignOff, targetName = 'ถึง ที่รักของเค้า', pinCode = '1234', isDemo = false, isModalPreview = false, colorTheme }) => {
    const c = colorTheme?.colors || null;
    const gradientColors = c?.gradient || ['#fdf2f8', '#fff1f2', '#fef3c7'];
    const confettiColors = c?.confetti || ['#f43f5e', '#ec4899', '#f97316', '#fbbf24'];
    const primaryColor = c?.primary || '#f43f5e';
    const accentColor = c?.accent || '#fda4af';
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
        const colors = confettiColors;

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
                scalar: 1.2,
                zIndex: 99999
            });
            confetti({
                particleCount,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.6 },
                colors,
                shapes: [heart, 'circle'],
                scalar: 1.2,
                zIndex: 99999
            });
        }, 200);
    };

    return (
        <div className={`${isModalPreview ? 'absolute inset-0' : 'fixed inset-0'} w-full h-full flex flex-col items-center justify-center p-4 md:p-8 text-center font-serif text-gray-800`}>

            {/* Watermark for Demo */}
            {isDemo && (
                <div
                    className="absolute inset-0 pointer-events-none z-[100]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' transform='rotate(-30 150 150)' fill='rgba(0,0,0,0.06)' font-family='sans-serif' font-size='22' font-weight='bold' letter-spacing='4'%3ENORA STORY DEMO%3C/text%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat'
                    }}
                />
            )}

            <AnimatePresence mode="wait">
                {/* LOCKED STATE - PIN Entry */}
                {viewState === 'LOCKED' && (
                    <motion.div
                        key="lock-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center"
                    >
                        <AnimatedBackground gradientColors={gradientColors} />
                        <FloatingHearts colorTheme={c} />

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
                                <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center border" style={{ borderColor: `${primaryColor}33` }}>
                                    <Heart size={36} style={{ color: primaryColor }} fill="currentColor" />
                                </div>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-2xl md:text-3xl text-gray-700 mb-5 font-light flex justify-center"
                            >
                                {isDemo && (
                                    <span className="text-sm px-4 py-1.5 rounded-full font-sans tracking-wide" style={{ backgroundColor: `${primaryColor}33`, color: primaryColor }}>
                                        รหัสผ่าน Demo: <span className="font-bold">1234</span>
                                    </span>
                                )}
                            </motion.h2>

                            {/* PIN Dots */}
                            <div className="flex justify-center gap-4 mb-10">
                                {[...Array(4)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0 }}
                                        animate={{
                                            scale: 1,
                                            backgroundColor: i < pin.length ? primaryColor : '#e5e7eb'
                                        }}
                                        transition={{ delay: i * 0.05, type: "spring" }}
                                        className={`w-4 h-4 rounded-full shadow-inner`}
                                        style={i < pin.length ? { boxShadow: `inset 0 2px 4px 0 ${primaryColor}40` } : {}}
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
                                        whileHover={{ scale: 1.1, backgroundColor: `${primaryColor}1A`, color: primaryColor, borderColor: accentColor }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleKeyPress(num.toString())}
                                        className="w-16 h-16 rounded-2xl bg-white/90 backdrop-blur-sm border shadow-md text-xl font-medium text-gray-700 transition-colors duration-200 flex items-center justify-center"
                                        style={{ borderColor: `${primaryColor}33` }}
                                    >
                                        {num}
                                    </motion.button>
                                ))}
                                <div className="w-16 h-16" />
                                <motion.button
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8 }}
                                    whileHover={{ scale: 1.1, backgroundColor: `${primaryColor}1A`, color: primaryColor, borderColor: accentColor }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleKeyPress("0")}
                                    className="w-16 h-16 rounded-2xl bg-white/90 backdrop-blur-sm border shadow-md text-xl font-medium text-gray-700 transition-colors duration-200 flex items-center justify-center"
                                    style={{ borderColor: `${primaryColor}33` }}
                                >
                                    0
                                </motion.button>
                                <motion.button
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.85 }}
                                    whileHover={{ scale: 1.1, color: primaryColor }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleBackspace}
                                    className="w-16 h-16 rounded-2xl bg-white/60 backdrop-blur-sm text-gray-400 transition-colors duration-200 flex items-center justify-center"
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
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center px-4"
                    >
                        <AnimatedBackground gradientColors={gradientColors} />
                        <FloatingHearts colorTheme={c} />

                        {/* Card */}
                        <div className="relative z-10 w-full max-w-lg bg-white/90 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-2xl border overflow-hidden min-h-[400px]" style={{ borderColor: `${primaryColor}33` }}>
                            {/* Decorative corner */}
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-50" style={{ background: `linear-gradient(to bottom left, ${primaryColor}33, transparent)` }} />
                            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-tr-full opacity-50" style={{ background: `linear-gradient(to top right, ${accentColor}33, transparent)` }} />

                            {/* Top decorative line */}
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="absolute top-0 left-0 w-full h-1"
                                style={{ background: `linear-gradient(to right, transparent, ${primaryColor}, transparent)` }}
                            />

                            {/* Content */}
                            <div className="relative z-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3, type: "spring" }}
                                    className="flex justify-center mb-6"
                                >
                                    <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${accentColor})` }}>
                                        <Heart size={28} className="text-white" fill="currentColor" />
                                    </div>
                                </motion.div>

                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-sm tracking-[0.1em] uppercase mb-6 font-medium text-center break-words"
                                    style={{ color: primaryColor }}
                                >
                                    ✨ {targetName || "For You"} ✨
                                </motion.p>

                                <div className="space-y-4">
                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className={`${(customMessage || "ทุกช่วงเวลาที่มีเธอ คือของขวัญที่เค้าไม่อยากสูญเสีย").length > 80
                                            ? "text-lg md:text-xl"
                                            : (customMessage || "ทุกช่วงเวลาที่มีเธอ คือของขวัญที่เค้าไม่อยากสูญเสีย").length > 50
                                                ? "text-xl md:text-xl"
                                                : "text-2xl md:text-xl"
                                            } italic leading-relaxed text-gray-800 mb-8 max-w-[90%] mx-auto break-words`}
                                    >
                                        "{customMessage || "ทุกช่วงเวลาที่มีเธอ คือของขวัญที่เค้าไม่อยากสูญเสีย"}"
                                    </motion.h1>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="flex items-center justify-center gap-2 text-gray-500"
                                >
                                    <div className="w-8 h-px bg-gray-300" />
                                    <span className="text-sm tracking-wide break-words">{customSignOff || "รักเธอเสมอ"}</span>
                                    <div className="w-8 h-px bg-gray-300" />
                                </motion.div>

                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    onClick={triggerConfetti}
                                    disabled={!canSendLove}
                                    whileHover={canSendLove ? { scale: 1.05, color: accentColor } : {}}
                                    whileTap={canSendLove ? { scale: 0.95 } : {}}
                                    className={`mt-10 text-sm flex items-center gap-2 mx-auto px-6 py-3 rounded-full transition-all duration-300 uppercase tracking-widest ${!canSendLove ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                                    style={{ backgroundColor: `${primaryColor}1A`, color: primaryColor }}
                                >
                                    <Sparkles size={16} />
                                    {canSendLove ? "" : ""}
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

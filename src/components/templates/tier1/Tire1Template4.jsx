import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Delete, Heart, Sparkles, Star } from 'lucide-react';

// Floating Petals / Stars
const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(18)].map((_, i) => (
            <motion.div
                key={i}
                initial={{ x: Math.random() * 100 + '%', y: '110%', opacity: 0, rotate: 0 }}
                animate={{ y: '-15%', opacity: [0, 0.8, 0.8, 0], rotate: Math.random() * 360 }}
                transition={{ duration: 9 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 6, ease: 'linear' }}
                className="absolute"
                style={{ color: ['#f43f5e', '#fb7185', '#fda4af', '#fbbf24', '#f472b6'][i % 5] }}
            >
                {i % 3 === 0
                    ? <Heart size={10 + Math.random() * 12} fill="currentColor" />
                    : <Star size={8 + Math.random() * 10} fill="currentColor" />}
            </motion.div>
        ))}
    </div>
);

// Animated gradient bg — purple/rose/indigo
const LoveBg = () => (
    <motion.div
        className="absolute inset-0"
        animate={{
            background: [
                'linear-gradient(135deg, #fdf2f8 0%, #ede9fe 50%, #fce7f3 100%)',
                'linear-gradient(135deg, #ede9fe 0%, #fce7f3 50%, #fdf2f8 100%)',
                'linear-gradient(135deg, #fce7f3 0%, #fdf2f8 50%, #ede9fe 100%)',
                'linear-gradient(135deg, #fdf2f8 0%, #ede9fe 50%, #fce7f3 100%)',
            ]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
    />
);

const Tier1Template4 = ({
    customMessage,
    customSignOff,
    targetName = 'ที่รักของฉัน',
    pin: pinProp,
    pinCode,
    isDemo = false,
}) => {
    // support both prop names
    const CORRECT_PIN = pinProp || pinCode || (isDemo ? '1234' : null);

    const [viewState, setViewState] = useState(CORRECT_PIN ? 'LOCKED' : 'CONTENT');
    const [pin, setPin] = useState('');
    const [showError, setShowError] = useState(false);
    const [canSendLove, setCanSendLove] = useState(true);

    const handleKeyPress = (num) => {
        if (pin.length < 4) {
            const next = pin + num;
            setPin(next);
            if (next.length === 4) {
                if (next === CORRECT_PIN) {
                    setTimeout(() => { setViewState('CONTENT'); triggerConfetti(); }, 300);
                } else {
                    setShowError(true);
                    setTimeout(() => { setPin(''); setShowError(false); }, 600);
                }
            }
        }
    };

    const handleBackspace = () => setPin(prev => prev.slice(0, -1));

    const triggerConfetti = () => {
        if (!canSendLove) return;
        setCanSendLove(false);
        setTimeout(() => setCanSendLove(true), 5000);
        const colors = ['#f43f5e', '#ec4899', '#a855f7', '#8b5cf6', '#fbbf24'];
        const duration = 4000;
        const end = Date.now() + duration;
        const interval = setInterval(() => {
            if (Date.now() > end) return clearInterval(interval);
            const tl = (end - Date.now()) / duration;
            confetti({ particleCount: 4 * tl, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors, zIndex: 99999 });
            confetti({ particleCount: 4 * tl, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors, zIndex: 99999 });
        }, 200);
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center overflow-hidden font-serif text-gray-800">

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
                {/* ── LOCKED STATE ── */}
                {viewState === 'LOCKED' && (
                    <motion.div
                        key="lock"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.08, filter: 'blur(12px)' }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center"
                    >
                        <LoveBg />
                        <FloatingParticles />

                        <motion.div
                            animate={showError ? { x: [-10, 10, -8, 8, 0] } : {}}
                            transition={{ duration: 0.4 }}
                            className="relative z-10 w-full max-w-xs px-6"
                        >
                            {/* Icon */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 180, damping: 14 }}
                                className="mb-5 flex justify-center"
                            >
                                <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur shadow-lg flex items-center justify-center border border-rose-200">
                                    <motion.div
                                        animate={{ scale: [1, 1.15, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                    >
                                        <Heart size={36} className="text-rose-500" fill="currentColor" />
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Title */}
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-lg font-light text-gray-600 mb-1 tracking-wide"
                            >
                                💌 Love Story
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-sm text-gray-400 mb-6"
                            >
                                {isDemo ? (
                                    <span className="bg-rose-100 text-rose-500 px-3 py-1 rounded-full text-xs font-sans">
                                        Demo PIN: <strong>1234</strong>
                                    </span>
                                ) : 'กรอก PIN เพื่อเปิดข้อความ'}
                            </motion.p>

                            {/* PIN Dots */}
                            <div className="flex justify-center gap-5 mb-8">
                                {[...Array(4)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            scale: i < pin.length ? 1.2 : 1,
                                            backgroundColor: showError
                                                ? '#ef4444'
                                                : i < pin.length ? '#a855f7' : '#e5e7eb'
                                        }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        className="w-4 h-4 rounded-full shadow-inner"
                                    />
                                ))}
                            </div>

                            {/* Keypad */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, idx) => (
                                    <motion.button
                                        key={num}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.45 + idx * 0.03 }}
                                        whileHover={{ scale: 1.1, backgroundColor: '#f3e8ff' }}
                                        whileTap={{ scale: 0.92 }}
                                        onClick={() => handleKeyPress(num.toString())}
                                        className="w-16 h-16 rounded-2xl bg-white/85 backdrop-blur border border-purple-100 shadow text-xl font-medium text-gray-700 hover:text-purple-600 hover:border-purple-300 transition-colors flex items-center justify-center"
                                    >
                                        {num}
                                    </motion.button>
                                ))}
                                <div className="w-16 h-16" />
                                <motion.button
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.78 }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.92 }}
                                    onClick={() => handleKeyPress('0')}
                                    className="w-16 h-16 rounded-2xl bg-white/85 backdrop-blur border border-purple-100 shadow text-xl font-medium text-gray-700 hover:text-purple-600 transition-colors flex items-center justify-center"
                                >
                                    0
                                </motion.button>
                                <motion.button
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.82 }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.92 }}
                                    onClick={handleBackspace}
                                    className="w-16 h-16 rounded-2xl bg-white/60 text-gray-400 hover:text-purple-500 transition-colors flex items-center justify-center"
                                >
                                    <Delete size={22} />
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}

                {/* ── CONTENT STATE ── */}
                {viewState === 'CONTENT' && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, scale: 0.85, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.7, type: 'spring', stiffness: 90 }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center"
                    >
                        <LoveBg />
                        <FloatingParticles />

                        {/* Card */}
                        <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-purple-100 p-8 md:p-10">

                            {/* Top gradient bar */}
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-400 via-purple-400 to-pink-400"
                            />

                            {/* Corner deco */}
                            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-purple-100/60 to-transparent rounded-bl-full" />
                            <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-rose-100/60 to-transparent rounded-tr-full" />

                            <div className="relative z-10">
                                {/* Hearts icon */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3, type: 'spring' }}
                                    className="flex justify-center mb-5"
                                >
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center shadow-lg">
                                            <Heart size={28} className="text-white" fill="currentColor" />
                                        </div>
                                        <motion.div
                                            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute inset-0 rounded-full bg-rose-400/30"
                                        />
                                    </div>
                                </motion.div>

                                {/* To label */}
                                <motion.p
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-xs tracking-[0.35em] uppercase text-purple-400 mb-6 font-medium"
                                >
                                    ✨ {targetName || 'For You'} ✨
                                </motion.p>

                                {/* Message */}
                                <motion.blockquote
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className={`italic leading-relaxed text-gray-800 mb-8 max-w-[92%] mx-auto break-words
                                        ${(customMessage || '').length > 80 ? 'text-base md:text-xl'
                                            : (customMessage || '').length > 50 ? 'text-xl md:text-2xl'
                                                : 'text-2xl md:text-3xl'}`}
                                >
                                    &ldquo;{customMessage || 'ทุกวันที่มีเธอ คือวันที่ดีที่สุดในชีวิต'}&rdquo;
                                </motion.blockquote>

                                {/* Divider + SignOff */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="flex items-center justify-center gap-3 text-gray-500"
                                >
                                    <div className="h-px w-10 bg-gradient-to-r from-transparent via-purple-300 to-purple-300" />
                                    <span className="text-sm tracking-wide text-purple-500 font-light">
                                        {customSignOff || 'รักเธอเสมอ'}
                                    </span>
                                    <div className="h-px w-10 bg-gradient-to-l from-transparent via-purple-300 to-purple-300" />
                                </motion.div>

                                {/* Send Love again button */}
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    onClick={triggerConfetti}
                                    disabled={!canSendLove}
                                    whileHover={canSendLove ? { scale: 1.05 } : {}}
                                    whileTap={canSendLove ? { scale: 0.95 } : {}}
                                    className={`mt-9 text-xs flex items-center gap-2 mx-auto px-6 py-2.5 rounded-full uppercase tracking-widest transition-all
                                        ${canSendLove
                                            ? 'bg-gradient-to-r from-rose-100 to-purple-100 text-purple-500 hover:shadow-md'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                >
                                    <Sparkles size={14} />
                                    {canSendLove ? 'ส่งความรักอีกครั้ง' : 'รอสักครู่...'}
                                </motion.button>
                            </div>
                        </div>

                        {/* Footer */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                            className="text-[10px] text-gray-300 mt-4"
                        >
                            Made with ♡ by Nora Story
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Tier1Template4;

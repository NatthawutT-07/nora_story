import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Delete, Heart, Sparkles, Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

// Floating Images Component
const FloatingImages = ({ images = [] }) => {
    const getPlaceholder = (width, height, text) => {
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#2a2a2a"/>
                <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="72" fill="#666" text-anchor="middle" dy=".3em">${text}</text>
            </svg>
        `;
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
    };

    const defaultImages = [
        getPlaceholder(500, 500, "1:1"),
        getPlaceholder(500, 500, "1:1"),
        getPlaceholder(500, 500, "1:1"),
        getPlaceholder(500, 500, "1:1"),
        getPlaceholder(500, 500, "1:1")
    ];
    const displayImages = images.length > 0 ? images : defaultImages;

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Random positions for floating images
    // Desktop: Closer to center but surrounding the card
    const desktopPositions = [
        { top: '25%', left: '20%', rotate: -8 },
        { top: '20%', right: '20%', rotate: 8 },
        { bottom: '20%', left: '15%', rotate: -5 },
        { bottom: '25%', right: '18%', rotate: 5 },
        { top: '45%', left: '10%', rotate: -12 },
        { top: '50%', right: '10%', rotate: 12 },
    ];

    // Mobile: 3 Top, 2 Bottom - Pushed closer to center but still framing content
    const mobilePositions = [
        { top: '10%', left: '0%', rotate: -12 },           // Top Left
        { top: '8%', right: '0%', rotate: 12 },           // Top Right
        { top: '15%', left: '50%', marginLeft: '-3.5rem', rotate: 5 }, // Top Center
        { bottom: '12%', left: '5%', rotate: -8 },           // Bottom Left
        { bottom: '10%', right: '5%', rotate: 8 },           // Bottom Right
    ];

    const positions = isMobile ? mobilePositions : desktopPositions;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {displayImages.map((img, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: 0.8,
                        scale: 1,
                        y: [0, -20, 0],
                        rotate: positions[i % positions.length].rotate
                    }}
                    transition={{
                        opacity: { delay: 0.5 + i * 0.2, duration: 1 },
                        scale: { delay: 0.5 + i * 0.2, duration: 1, type: "spring" },
                        y: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute w-28 h-28 md:w-48 md:h-48 rounded-xl border-4 border-white/20 shadow-xl overflow-hidden"
                    style={positions[i % positions.length]}
                >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                </motion.div>
            ))}
        </div>
    );
};

// Floating Hearts Component - Enhanced
const FloatingHearts = ({ intensity = 1 }) => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(Math.floor(20 * intensity))].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        x: Math.random() * 100 + '%',
                        y: '110%',
                        opacity: 0,
                        scale: 0.3 + Math.random() * 0.7
                    }}
                    animate={{
                        y: '-10%',
                        opacity: [0, 0.8, 0.8, 0],
                        rotate: Math.random() * 360,
                        x: `${Math.random() * 100}%`
                    }}
                    transition={{
                        duration: 6 + Math.random() * 6,
                        repeat: Infinity,
                        delay: Math.random() * 8,
                        ease: 'linear'
                    }}
                    className="absolute"
                    style={{
                        color: ['#f43f5e', '#ec4899', '#f97316', '#fbbf24'][Math.floor(Math.random() * 4)],
                        opacity: 0.3 + Math.random() * 0.3
                    }}
                >
                    <Heart size={12 + Math.random() * 20} fill="currentColor" />
                </motion.div>
            ))}
        </div>
    );
};

// Sparkle Effect
const SparkleEffect = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0]
                    }}
                    transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                    }}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%',
                        boxShadow: '0 0 6px 2px rgba(255,255,255,0.8)'
                    }}
                />
            ))}
        </div>
    );
};

// Animated Background - Premium
const AnimatedBackground = ({ variant = 'default' }) => {
    const gradients = {
        default: 'from-purple-900 via-rose-900 to-pink-900',
        question: 'from-rose-900 via-pink-800 to-purple-900',
        content: 'from-slate-900 via-purple-900 to-rose-900'
    };

    return (
        <>
            <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${gradients[variant]}`}
                animate={{
                    background: [
                        'linear-gradient(135deg, #1e1b4b 0%, #831843 50%, #be185d 100%)',
                        'linear-gradient(135deg, #831843 0%, #be185d 50%, #1e1b4b 100%)',
                        'linear-gradient(135deg, #be185d 0%, #1e1b4b 50%, #831843 100%)',
                        'linear-gradient(135deg, #1e1b4b 0%, #831843 50%, #be185d 100%)'
                    ]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            />
            {/* Subtle grid overlay */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}
            />
        </>
    );
};



// Music Player Component
const MusicPlayer = ({ musicUrl }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
            <audio ref={audioRef} src={musicUrl} loop />
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20 shadow-xl">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-lg"
                >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </motion.button>

                <div className="flex items-center gap-2">
                    <Music size={14} className="text-white/60" />
                    <span className="text-white/80 text-sm font-medium">Our Song</span>
                </div>

                <button onClick={toggleMute} className="text-white/60 hover:text-white transition-colors">
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
            </div>
        </motion.div>
    );
};


const Tier2Template1 = ({
    pin = "1234",
    targetName = "คุณ",
    customMessage,
    customSignOff,
    images = [],
    musicUrl,
    isDemo = false,
    demoMusicUrl = null
}) => {
    const [viewState, setViewState] = useState('LOCKED');
    const [pinInput, setPinInput] = useState(""); // Renamed from 'pin' state
    const [isPinError, setIsPinError] = useState(false); // Renamed from 'showError'
    const [showMusicPlayer, setShowMusicPlayer] = useState(false);


    useEffect(() => {
        if (pinInput.length === 4) { // Use pinInput
            if (pinInput === pin) { // Compare pinInput state with pin prop
                handleUnlock();
            } else {
                handleError();
            }
        }
    }, [pinInput, pin]); // Add pin to dependency array

    const handleUnlock = () => {
        setViewState('CONTENT');
        setShowMusicPlayer(true);
        triggerConfetti();
    };

    const handleError = () => {
        setIsPinError(true); // Use isPinError
        setTimeout(() => {
            setPinInput(""); // Use setPinInput
            setIsPinError(false); // Use isPinError
        }, 500);
    };

    const handleKeyPress = (num) => {
        if (pinInput.length < 4) { // Use pinInput
            setPinInput(prev => prev + num); // Use setPinInput
        }
    };

    const handleBackspace = () => setPinInput(prev => prev.slice(0, -1)); // Use setPinInput



    const [canSendLove, setCanSendLove] = useState(true);

    const triggerConfetti = () => {
        if (!canSendLove) return;

        setCanSendLove(false);
        setTimeout(() => setCanSendLove(true), 5000);

        const heart = confetti.shapeFromPath({
            path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
        });

        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const colors = ['#f43f5e', '#ec4899', '#f97316', '#fbbf24', '#a855f7'];

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 5 * (timeLeft / duration);

            confetti({
                particleCount,
                angle: 60,
                spread: 70,
                origin: { x: 0, y: 0.7 },
                colors,
                shapes: [heart, 'circle', 'star'],
                scalar: 1.3
            });
            confetti({
                particleCount,
                angle: 120,
                spread: 70,
                origin: { x: 1, y: 0.7 },
                colors,
                shapes: [heart, 'circle', 'star'],
                scalar: 1.3
            });
        }, 180);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 text-center text-white overflow-hidden relative">

            <AnimatePresence mode="wait">
                {/* LOCKED STATE - Premium PIN Entry */}
                {viewState === 'LOCKED' && (
                    <motion.div
                        key="lock-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
                        transition={{ duration: 0.8 }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
                    >
                        <AnimatedBackground variant="default" />
                        <FloatingHearts intensity={0.8} />
                        <SparkleEffect />

                        <motion.div
                            animate={isPinError ? { x: [-15, 15, -15, 15, 0] } : {}} // Use isPinError
                            transition={{ duration: 0.4 }}
                            className="relative z-10 w-full max-w-sm px-6"
                        >
                            {/* Premium Lock Icon */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                className="mb-4 flex justify-center"
                            >
                                <div className="relative">
                                    <motion.div
                                        animate={{
                                            boxShadow: [
                                                '0 0 20px rgba(244,63,94,0.3)',
                                                '0 0 40px rgba(244,63,94,0.5)',
                                                '0 0 20px rgba(244,63,94,0.3)'
                                            ]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-2xl"
                                    >
                                        <Heart size={44} className="text-white" fill="currentColor" />
                                    </motion.div>
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute inset-0 rounded-full border-2 border-rose-400"
                                    />
                                </div>
                            </motion.div>

                            {/* Premium PIN Dots */}
                            <div className="flex justify-center gap-5 mb-6">
                                {[...Array(4)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0 }}
                                        animate={{
                                            scale: 1,
                                            backgroundColor: i < pinInput.length ? '#f43f5e' : 'rgba(255,255,255,0.2)', // Use pinInput
                                            boxShadow: i < pinInput.length ? '0 0 15px rgba(244,63,94,0.6)' : 'none' // Use pinInput
                                        }}
                                        transition={{ delay: i * 0.05, type: "spring" }}
                                        className="w-5 h-5 rounded-full"
                                    />
                                ))}
                            </div>

                            {/* Premium Keypad */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="grid grid-cols-3 gap-4 max-w-[280px] mx-auto"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, idx) => (
                                    <motion.button
                                        key={num}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.6 + idx * 0.03 }}
                                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(244,63,94,0.3)' }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleKeyPress(num.toString())}
                                        className="w-18 h-18 aspect-square rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-2xl font-medium text-white hover:border-rose-400 transition-all flex items-center justify-center"
                                    >
                                        {num}
                                    </motion.button>
                                ))}
                                <div className="aspect-square" />
                                <motion.button
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.9 }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleKeyPress("0")}
                                    className="w-18 h-18 aspect-square rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-2xl font-medium text-white hover:border-rose-400 transition-all flex items-center justify-center"
                                >
                                    0
                                </motion.button>
                                <motion.button
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.95 }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleBackspace}
                                    className="aspect-square rounded-2xl bg-white/5 text-white/50 hover:text-rose-400 transition-all flex items-center justify-center"
                                >
                                    <Delete size={24} />
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}

                {/* CONTENT STATE - Premium Card with Photos & Music */}
                {viewState === 'CONTENT' && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-30 flex flex-col items-center justify-center overflow-hidden p-4"
                    >
                        <AnimatedBackground variant="content" />
                        <FloatingHearts intensity={0.6} />
                        <SparkleEffect />

                        {/* Floating Images */}
                        <FloatingImages images={images} />

                        <div className="relative z-10 w-full max-w-lg flex flex-col items-center justify-center">

                            {/* Message Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="relative bg-white/10 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
                            >
                                {/* Decorative Elements */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-rose-500/20 to-transparent rounded-bl-full" />
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-500/20 to-transparent rounded-tr-full" />

                                {/* Glowing Border */}
                                <motion.div
                                    animate={{
                                        boxShadow: [
                                            '0 0 20px rgba(244,63,94,0.2)',
                                            '0 0 40px rgba(244,63,94,0.3)',
                                            '0 0 20px rgba(244,63,94,0.2)'
                                        ]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute inset-0 rounded-3xl"
                                />

                                {/* Content */}
                                <div className="relative z-10">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.4, type: "spring" }}
                                        className="flex justify-center mb-6"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
                                            <Heart size={28} className="text-white" fill="currentColor" />
                                        </div>
                                    </motion.div>

                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="text-sm tracking-[0.3em] uppercase text-rose-300 mb-6 font-medium"
                                    >
                                        ✨ {targetName || "For You"} ✨
                                    </motion.p>

                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className={`${(customMessage || "ทุกช่วงเวลาที่มีเธอ คือของขวัญที่ฉันไม่อยากสูญเสีย").length > 80
                                            ? "text-lg md:text-2xl"
                                            : (customMessage || "ทุกช่วงเวลาที่มีเธอ คือของขวัญที่ฉันไม่อยากสูญเสีย").length > 50
                                                ? "text-xl md:text-3xl"
                                                : "text-2xl md:text-4xl"
                                            } font-serif italic leading-relaxed text-white mb-8 max-w-[90%] mx-auto break-words`}
                                    >
                                        "{customMessage || "ทุกช่วงเวลาที่มีเธอ คือของขวัญที่ฉันไม่อยากสูญเสีย"}"
                                    </motion.h1>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.8 }}
                                        className="flex items-center justify-center gap-3 text-rose-200"
                                    >
                                        <div className="w-10 h-px bg-gradient-to-r from-transparent to-rose-400" />
                                        <span className="text-sm tracking-wide font-medium">{customSignOff || "รักเธอเสมอ"}</span>
                                        <div className="w-10 h-px bg-gradient-to-l from-transparent to-rose-400" />
                                    </motion.div>

                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1 }}
                                        onClick={triggerConfetti}
                                        disabled={!canSendLove}
                                        whileHover={canSendLove ? { scale: 1.05 } : {}}
                                        whileTap={canSendLove ? { scale: 0.95 } : {}}
                                        className={`mt-10 text-sm text-white hover:text-rose-200 transition-colors duration-300 uppercase tracking-widest flex items-center gap-2 mx-auto bg-gradient-to-r from-rose-500/30 to-pink-500/30 px-6 py-3 rounded-full border border-white/20 ${!canSendLove ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                                    >
                                        <Sparkles size={16} />
                                        {canSendLove ? "ส่งความรักอีกครั้ง" : "รอสักครู่..."}
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Music Player */}
                        {showMusicPlayer && (demoMusicUrl || musicUrl) && <MusicPlayer musicUrl={demoMusicUrl || musicUrl} />}
                    </motion.div>
                )}
            </AnimatePresence>

            {
                viewState === 'CONTENT' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="fixed bottom-4 text-xs text-white/30 z-10 flex items-center gap-1"
                    >
                        Made with by Nora Story
                    </motion.div>
                )
            }
        </div>
    );
};

export default Tier2Template1;

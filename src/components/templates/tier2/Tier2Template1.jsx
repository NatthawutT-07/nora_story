import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Delete, Heart, Sparkles, Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX, Music } from 'lucide-react';

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

// Photo Gallery Component
const PhotoGallery = ({ images = [], onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const defaultImages = [
        'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800',
        'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800',
        'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800',
        'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800',
        'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800'
    ];

    const displayImages = images.length > 0 ? images : defaultImages;

    const nextImage = () => setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    const prevImage = () => setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md mx-auto mb-8"
        >
            {/* Main Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={displayImages[currentIndex]}
                        alt={`Photo ${currentIndex + 1}`}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full object-cover"
                    />
                </AnimatePresence>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Navigation Arrows */}
                {displayImages.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {displayImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-6' : 'bg-white/40'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Thumbnail Strip */}
            {displayImages.length > 1 && (
                <div className="flex gap-2 mt-4 justify-center overflow-x-auto pb-2">
                    {displayImages.map((img, idx) => (
                        <motion.button
                            key={idx}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentIndex(idx)}
                            className={`flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${idx === currentIndex ? 'border-rose-400 shadow-lg shadow-rose-500/30' : 'border-white/20'
                                }`}
                        >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </motion.button>
                    ))}
                </div>
            )}
        </motion.div>
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
    customMessage,
    customSignOff,
    targetName = 'คุณ',
    pinCode = '1234',
    images = [],
    musicUrl = ''
}) => {
    const [viewState, setViewState] = useState('LOCKED');
    const [pin, setPin] = useState("");
    const [showError, setShowError] = useState(false);
    const [noCount, setNoCount] = useState(0);
    const [showMusicPlayer, setShowMusicPlayer] = useState(false);

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

    const handleUnlock = () => setViewState('QUESTION');

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

    const handleLoveAnswer = (answer) => {
        if (answer) {
            setViewState('CONTENT');
            setShowMusicPlayer(true);
            triggerConfetti();
        } else {
            setNoCount(prev => prev + 1);
        }
    };

    const getNoButtonText = () => {
        if (noCount === 0) return "ไม่รักหรอก 💔";
        if (noCount === 1) return "คิดอีกทีสิ~ 🤔";
        if (noCount === 2) return "แน่ใจนะ?! 😤";
        if (noCount === 3) return "จริงดิ?! 😭";
        return "ไม่มีทาง! 🙈";
    };

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
                            animate={showError ? { x: [-15, 15, -15, 15, 0] } : {}}
                            transition={{ duration: 0.4 }}
                            className="relative z-10 w-full max-w-sm px-6"
                        >
                            {/* Premium Lock Icon */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                className="mb-8 flex justify-center"
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

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-3xl md:text-4xl font-serif mb-3 bg-gradient-to-r from-rose-200 via-pink-200 to-rose-200 bg-clip-text text-transparent"
                            >
                                ข้อความลับ 💌
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-white/50 text-sm mb-8"
                            >
                                กรุณาใส่รหัสเพื่อเปิดดู
                            </motion.p>

                            {/* Premium PIN Dots */}
                            <div className="flex justify-center gap-5 mb-12">
                                {[...Array(4)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0 }}
                                        animate={{
                                            scale: 1,
                                            backgroundColor: i < pin.length ? '#f43f5e' : 'rgba(255,255,255,0.2)',
                                            boxShadow: i < pin.length ? '0 0 15px rgba(244,63,94,0.6)' : 'none'
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

                {/* QUESTION STATE - Premium Love Question */}
                {viewState === 'QUESTION' && (
                    <motion.div
                        key="question-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -50, filter: "blur(20px)" }}
                        transition={{ duration: 0.6 }}
                        className="fixed inset-0 z-40 flex flex-col items-center justify-center p-4"
                    >
                        <AnimatedBackground variant="question" />
                        <FloatingHearts intensity={1.2} />
                        <SparkleEffect />

                        <div className="relative z-10 flex flex-col items-center">
                            {/* Animated Premium Heart */}
                            <motion.div
                                initial={{ scale: 0, rotate: -30 }}
                                animate={{
                                    scale: [1, 1.15, 1],
                                    rotate: 0
                                }}
                                transition={{
                                    scale: { duration: 0.8, repeat: Infinity, repeatDelay: 0.3 },
                                    rotate: { type: "spring", stiffness: 200 }
                                }}
                                className="mb-10 relative"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                    className="absolute -inset-8 rounded-full border border-dashed border-rose-400/30"
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                                    className="absolute -inset-16 rounded-full border border-dashed border-pink-400/20"
                                />
                                <div className="relative">
                                    <Heart size={100} className="text-rose-500 drop-shadow-2xl" fill="currentColor" />
                                    <motion.div
                                        animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        <Heart size={100} className="text-rose-400" fill="currentColor" />
                                    </motion.div>
                                </div>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl md:text-6xl font-serif mb-6 bg-gradient-to-r from-rose-200 via-pink-100 to-rose-200 bg-clip-text text-transparent"
                            >
                                {targetName}รักเค้าไหม? 💕
                            </motion.h2>

                            <div className="flex flex-col items-center gap-6 relative min-h-[160px] w-full max-w-md justify-center">
                                <motion.button
                                    onClick={() => handleLoveAnswer(true)}
                                    initial={{ scale: 1 }}
                                    animate={{
                                        scale: 1 + (noCount * 0.3),
                                        boxShadow: noCount > 2
                                            ? '0 0 60px rgba(244, 63, 94, 0.7)'
                                            : '0 15px 50px rgba(244, 63, 94, 0.4)'
                                    }}
                                    whileHover={{ scale: 1.1 + (noCount * 0.3) }}
                                    whileTap={{ scale: 0.95 + (noCount * 0.3) }}
                                    className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-white px-12 py-5 rounded-full text-xl font-medium shadow-2xl hover:from-rose-600 hover:via-pink-600 hover:to-rose-600 transition-all duration-300 flex items-center gap-3 border border-white/20"
                                    style={{ zIndex: 10 }}
                                >
                                    <Sparkles size={22} />
                                    รักที่สุดเลย
                                    <Heart size={22} fill="currentColor" />
                                </motion.button>

                                {noCount < 5 && (
                                    <motion.button
                                        onClick={() => handleLoveAnswer(false)}
                                        initial={{ opacity: 0 }}
                                        animate={{
                                            opacity: 1 - (noCount * 0.18),
                                            scale: 1 - (noCount * 0.12)
                                        }}
                                        whileHover={{ scale: 0.95 - (noCount * 0.12) }}
                                        className="text-white/50 hover:text-white/70 text-base px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"
                                    >
                                        {getNoButtonText()}
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* CONTENT STATE - Premium Card with Photos & Music */}
                {viewState === 'CONTENT' && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-30 flex flex-col items-center justify-start overflow-y-auto py-8 px-4"
                    >
                        <AnimatedBackground variant="content" />
                        <FloatingHearts intensity={0.6} />
                        <SparkleEffect />

                        <div className="relative z-10 w-full max-w-lg">
                            {/* Photo Gallery */}
                            <PhotoGallery images={images} />

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
                                        ✨ For You ✨
                                    </motion.p>

                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="text-2xl md:text-3xl font-serif italic leading-relaxed text-white mb-8"
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
                        {showMusicPlayer && musicUrl && <MusicPlayer musicUrl={musicUrl} />}
                    </motion.div>
                )}
            </AnimatePresence>

            {viewState === 'CONTENT' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="fixed bottom-4 text-xs text-white/30 z-10"
                >
                    Made with 💕 by Nora.dev
                </motion.div>
            )}
        </div>
    );
};

export default Tier2Template1;

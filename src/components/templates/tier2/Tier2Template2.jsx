import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sun, Flower, Sparkles, Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

// Floating Lotus/Flower Component
const FloatingFlowers = ({ intensity = 1 }) => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(Math.floor(15 * intensity))].map((_, i) => (
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
                        duration: 10 + Math.random() * 10,
                        repeat: Infinity,
                        delay: Math.random() * 8,
                        ease: 'linear'
                    }}
                    className="absolute text-amber-200/40"
                    style={{
                        zIndex: Math.floor(Math.random() * 10)
                    }}
                >
                    <Flower size={16 + Math.random() * 24} fill="currentColor" />
                </motion.div>
            ))}
        </div>
    );
};

// Golden Sparkle Effect
const GoldenSparkle = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(40)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0]
                    }}
                    transition={{
                        duration: 3 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                    }}
                    className="absolute w-1 h-1 bg-amber-200 rounded-full"
                    style={{
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%',
                        boxShadow: '0 0 8px 2px rgba(251, 191, 36, 0.6)'
                    }}
                />
            ))}
        </div>
    );
};

// Animated Background
const AnimatedBackground = ({ gradientColors }) => {
    const g = gradientColors || ['#451a03', '#78350f', '#92400e'];

    return (
        <>
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
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 2px, transparent 0)',
                    backgroundSize: '32px 32px'
                }}
            />
        </>
    );
};

// Memory Gallery Component (Dynamic Grid)
const MemoryGallery = ({ images = [] }) => {
    // Ensure we have at least one image/placeholder
    const displayImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1599553240723-5e9854737274?w=800'];
    const count = displayImages.length;

    // Helper for Image Card styling
    const ImageCard = ({ src, className = "" }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, rotate: 1, zIndex: 10 }}
            className={`relative rounded-xl overflow-hidden shadow-xl border-4 border-white bg-white ${className}`}
        >
            <img loading="lazy" src={src} alt="Memory" className="w-full h-full object-cover" />
        </motion.div>
    );

    // Layout Logic based on Count
    const renderLayout = () => {
        if (count === 1) {
            return (
                <div className="w-full max-w-sm mx-auto p-4">
                    <ImageCard src={displayImages[0]} className="aspect-[3/4] rotate-1" />
                </div>
            );
        }

        if (count === 2) {
            return (
                <div className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto p-2">
                    <ImageCard src={displayImages[0]} className="aspect-[3/4] -rotate-2 translate-y-4" />
                    <ImageCard src={displayImages[1]} className="aspect-[3/4] rotate-2" />
                </div>
            );
        }

        if (count === 3) {
            return (
                <div className="grid grid-cols-2 gap-3 w-full max-w-md mx-auto p-2 relative">
                    <div className="col-span-2 flex justify-center mb-[-20px] z-10">
                        <div className="w-2/3">
                            <ImageCard src={displayImages[0]} className="aspect-square rotate-0 shadow-2xl" />
                        </div>
                    </div>
                    <ImageCard src={displayImages[1]} className="aspect-square -rotate-3 mt-4" />
                    <ImageCard src={displayImages[2]} className="aspect-square rotate-3 mt-4" />
                </div>
            );
        }

        if (count === 4) {
            // Center + 3? Or 2x2. User asked for Center + 4 corners for 5.
            // For 4, let's do a 2x2 grid.
            return (
                <div className="grid grid-cols-2 gap-3 w-full max-w-md mx-auto p-2">
                    {displayImages.map((img, idx) => (
                        <ImageCard key={idx} src={img} className={`aspect-square ${idx % 2 === 0 ? '-rotate-1' : 'rotate-1'}`} />
                    ))}
                </div>
            );
        }

        if (count >= 5) {
            // 5 Images: Center + 4 corners (Mosaic)
            return (
                <div className="relative w-full max-w-md mx-auto h-[400px] flex items-center justify-center">
                    {/* Center Main */}
                    <ImageCard src={displayImages[0]} className="w-48 h-64 z-20 shadow-2xl absolute" />

                    {/* Corners */}
                    <div className="absolute top-0 left-0 w-32 h-32 transform -rotate-6 z-10">
                        <ImageCard src={displayImages[1]} className="w-full h-full" />
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 transform rotate-6 z-10">
                        <ImageCard src={displayImages[2]} className="w-full h-full" />
                    </div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 transform rotate-3 z-10">
                        <ImageCard src={displayImages[3]} className="w-full h-full" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 transform -rotate-3 z-10">
                        <ImageCard src={displayImages[4]} className="w-full h-full" />
                    </div>
                </div>
            );
        }

        return null; // Fallback
    };

    return (
        <div className="w-full py-4">
            {renderLayout()}
        </div>
    );
};

// Music Player Component
const MusicPlayer = ({ musicUrl }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const wasPlayingRef = useRef(false);

    useEffect(() => {
        if (!audioRef.current) return;
        audioRef.current.volume = 0.4;
        const tryPlay = () => {
            audioRef.current?.play()
                .then(() => {
                    setIsPlaying(true);
                    wasPlayingRef.current = true;
                })
                .catch(() => {
                    const playOnClick = () => {
                        audioRef.current?.play().then(() => {
                            setIsPlaying(true);
                            wasPlayingRef.current = true;
                        });
                        document.removeEventListener('click', playOnClick);
                        document.removeEventListener('touchstart', playOnClick);
                    };
                    document.addEventListener('click', playOnClick, { once: true });
                    document.addEventListener('touchstart', playOnClick, { once: true });
                });
        };
        tryPlay();

        const handleVisibilityChange = () => {
            if (document.hidden) {
                wasPlayingRef.current = !audioRef.current?.paused;
                audioRef.current?.pause();
                setIsPlaying(false);
            } else {
                if (wasPlayingRef.current) {
                    audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
                wasPlayingRef.current = false;
            } else {
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                    wasPlayingRef.current = true;
                });
            }
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <audio ref={audioRef} src={musicUrl} loop />
            <button
                onClick={togglePlay}
                className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border border-amber-200/30 shadow-lg transition-all duration-300 ${isPlaying ? 'bg-amber-500/20 text-amber-300' : 'bg-black/20 text-amber-200/50'}`}
            >
                {isPlaying ? <Pause size={18} /> : <Music size={18} />}
            </button>
        </div>
    );
};

const Tier2Template2 = ({
    customMessage,
    customSignOff,
    images = [],
    musicUrl = '',
    isDemo = false,
    demoMusicUrl = null,
    colorTheme
}) => {
    const ct = colorTheme?.colors || null;
    const gradientColors = ct?.gradient || ['#451a03', '#78350f', '#92400e'];
    const confettiColors = ct?.confetti || ['#fbbf24', '#f59e0b', '#d97706', '#f43f5e'];
    const showMusicPlayer = true;
    const [canSendMerit, setCanSendMerit] = useState(true);

    const triggerConfetti = () => {
        if (!canSendMerit) return;

        setCanSendMerit(false);
        setTimeout(() => setCanSendMerit(true), 5000);

        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const colors = ['#f59e0b', '#fbbf24', '#fcd34d', '#ffffff', '#fffbeb'];

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
                shapes: ['circle', 'square'],
                scalar: 1.2,
                zIndex: 99999
            });
            confetti({
                particleCount,
                angle: 120,
                spread: 70,
                origin: { x: 1, y: 0.7 },
                colors,
                shapes: ['circle', 'square'],
                scalar: 1.2,
                zIndex: 99999
            });
        }, 180);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 text-center text-white overflow-hidden relative font-serif">
            <AnimatePresence mode="wait">
                <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-30 flex flex-col items-center justify-start overflow-y-auto py-8 px-4"
                >
                    <AnimatedBackground gradientColors={gradientColors} />
                    <FloatingFlowers intensity={0.6} />
                    <GoldenSparkle />

                    <div className="relative z-10 w-full max-w-lg mt-4 mb-24">
                        {/* HEADER: Invitation Card Title */}
                        <motion.h2
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-bold text-amber-200 mb-3 md:mb-6 drop-shadow-lg"
                        >
                            Memory Gallery
                        </motion.h2>

                        {/* Memory Gallery (Dynamic) */}
                        <MemoryGallery images={images} />

                        {/* Message Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative bg-black/20 backdrop-blur-xl p-6 md:p-10 rounded-3xl border border-amber-200/20 shadow-2xl overflow-hidden mt-4 md:mt-8"
                        >
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-tr-full" />

                            {/* Content */}
                            <div className="relative z-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4, type: "spring" }}
                                    className="flex justify-center mb-6"
                                >
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                                        <Sun size={28} className="text-white" fill="currentColor" />
                                    </div>
                                </motion.div>

                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-sm tracking-[0.3em] uppercase text-amber-300 mb-6 font-medium"
                                >
                                    ✨ พิธีอุปสมบท ✨
                                </motion.p>

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-2xl md:text-3xl font-serif italic leading-relaxed text-amber-50 mb-8 font-light break-words break-all"
                                >
                                    "{customMessage || "ขอกราบลาอุปสมบท เพื่อทดแทนคุณบิดามารดา และศึกษาพระธรรมวินัย"}"
                                </motion.h1>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="flex items-center justify-center gap-3 text-amber-200/80"
                                >
                                    <div className="w-10 h-px bg-gradient-to-r from-transparent to-amber-400" />
                                    <span className="text-lg tracking-wide font-medium break-words break-all">{customSignOff || "นาย อุปสมบท ตั้งใจ"}</span>
                                    <div className="w-10 h-px bg-gradient-to-l from-transparent to-amber-400" />
                                </motion.div>

                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    onClick={triggerConfetti}
                                    disabled={!canSendMerit}
                                    whileHover={canSendMerit ? { scale: 1.05 } : {}}
                                    whileTap={canSendMerit ? { scale: 0.95 } : {}}
                                    className={`mt-6 md:mt-10 text-sm text-white hover:text-amber-200 transition-colors duration-300 uppercase tracking-widest flex items-center gap-2 mx-auto bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-8 py-3 rounded-full border border-amber-200/20 ${!canSendMerit ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                                >
                                    <Sparkles size={16} />
                                    {canSendMerit ? "อนุโมทนาสาธุ" : "สาธุ..."}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Music Player */}
                    {showMusicPlayer && (demoMusicUrl || musicUrl) && <MusicPlayer musicUrl={demoMusicUrl || musicUrl} />}
                </motion.div>
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="fixed bottom-4 text-xs text-amber-100/20 z-10"
            >
                Made with 🙏 by Nora.dev
            </motion.div>
        </div>
    );
};

export default Tier2Template2;

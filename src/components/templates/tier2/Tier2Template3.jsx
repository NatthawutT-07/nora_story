import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Play, Pause, Volume2, VolumeX, Music, Stars } from 'lucide-react';

// Floating Hearts Component
const FloatingHearts = ({ intensity = 1, themeColors }) => {
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
                        opacity: [0, 0.6, 0.6, 0],
                        rotate: Math.random() * 360,
                        x: `${Math.random() * 100}%`
                    }}
                    transition={{
                        duration: 12 + Math.random() * 8,
                        repeat: Infinity,
                        delay: Math.random() * 8,
                        ease: 'linear'
                    }}
                    className={`absolute ${!themeColors ? 'text-rose-300/40' : ''}`}
                    style={{
                        zIndex: Math.floor(Math.random() * 10),
                        ...(themeColors ? { color: `${themeColors.accent}66` } : {})
                    }}
                >
                    <Heart size={16 + Math.random() * 24} fill="currentColor" />
                </motion.div>
            ))}
        </div>
    );
};

// Gradient Background
const RomanticGradient = ({ gradientColors }) => {
    const g = gradientColors || ['#ffe4e6', '#fff1f2', '#ffffff'];

    return (
        <motion.div
            className="absolute inset-0"
            animate={{
                background: [
                    `linear-gradient(135deg, ${g[0]} 0%, ${g[1]} 50%, ${g[2]} 100%)`,
                    `linear-gradient(135deg, ${g[2]} 0%, ${g[0]} 50%, ${g[1]} 100%)`,
                    `linear-gradient(135deg, ${g[1]} 0%, ${g[2]} 50%, ${g[0]} 100%)`,
                ]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
    );
};

// Love Gallery Component (Dynamic Grid)
const LoveGallery = ({ images = [], themeColors }) => {
    const displayImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1511285560982-1351cdeb9821?w=800'];
    const count = displayImages.length;

    const ImageCard = ({ src, className = "", style = {} }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, rotate: 0, zIndex: 10 }}
            className={`relative rounded-3xl overflow-hidden shadow-xl border-[6px] border-white bg-white ${className}`}
            style={style}
        >
            <img loading="lazy" src={src} alt="Memory" className="w-full h-full object-cover" />
        </motion.div>
    );

    // Layout Logic
    const renderLayout = () => {
        if (count === 1) {
            return (
                <div className="w-full max-w-sm mx-auto p-4">
                    <ImageCard src={displayImages[0]} className={`aspect-[3/4] rotate-2 shadow-2xl ${!themeColors ? 'shadow-rose-200' : ''}`} style={themeColors ? { boxShadow: `0 25px 50px -12px ${themeColors.accent}4D` } : {}} />
                </div>
            );
        }

        if (count === 2) {
            return (
                <div className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto p-2">
                    <ImageCard src={displayImages[0]} className="aspect-[3/4] -rotate-3 translate-y-6" />
                    <ImageCard src={displayImages[1]} className="aspect-[3/4] rotate-3" />
                </div>
            );
        }

        if (count === 3) {
            return (
                <div className="grid grid-cols-2 gap-3 w-full max-w-md mx-auto p-2 relative">
                    <div className="col-span-2 flex justify-center mb-[-20px] z-10">
                        <div className="w-2/3">
                            <ImageCard src={displayImages[0]} className={`aspect-square rotate-0 shadow-2xl ${!themeColors ? 'shadow-rose-200' : ''}`} style={themeColors ? { boxShadow: `0 25px 50px -12px ${themeColors.accent}4D` } : {}} />
                        </div>
                    </div>
                    <ImageCard src={displayImages[1]} className="aspect-square -rotate-2 mt-4" />
                    <ImageCard src={displayImages[2]} className="aspect-square rotate-2 mt-4" />
                </div>
            );
        }

        if (count === 4) {
            return (
                <div className="grid grid-cols-2 gap-3 w-full max-w-md mx-auto p-2">
                    {displayImages.map((img, idx) => (
                        <ImageCard key={idx} src={img} className={`aspect-square ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'}`} />
                    ))}
                </div>
            );
        }

        if (count >= 5) {
            return (
                <div className="relative w-full max-w-md mx-auto h-[450px] flex items-center justify-center">
                    {/* Center Main */}
                    <ImageCard src={displayImages[0]} className={`w-48 h-64 z-20 shadow-2xl absolute border-8 ${!themeColors ? 'shadow-rose-300' : ''}`} style={themeColors ? { boxShadow: `0 25px 50px -12px ${themeColors.primary}80` } : {}} />

                    {/* Corners */}
                    <div className="absolute top-0 left-0 w-32 h-32 transform -rotate-12 z-10 transition-transform hover:scale-110">
                        <ImageCard src={displayImages[1]} className="w-full h-full" />
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 transform rotate-12 z-10 transition-transform hover:scale-110">
                        <ImageCard src={displayImages[2]} className="w-full h-full" />
                    </div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 transform rotate-6 z-10 transition-transform hover:scale-110">
                        <ImageCard src={displayImages[3]} className="w-full h-full" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 transform -rotate-6 z-10 transition-transform hover:scale-110">
                        <ImageCard src={displayImages[4]} className="w-full h-full" />
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="w-full py-4">
            {renderLayout()}
        </div>
    );
};

// Music Player Component
const MusicPlayer = ({ musicUrl, themeColors }) => {
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
                className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border shadow-lg transition-all duration-300 ${!themeColors ? (isPlaying ? 'bg-rose-400/20 text-rose-400 border-rose-200/30' : 'bg-white/80 text-rose-300 border-rose-200/30') : ''}`}
                style={themeColors ? {
                    backgroundColor: isPlaying ? `${themeColors.primary}33` : 'rgba(255,255,255,0.8)',
                    color: isPlaying ? themeColors.primary : themeColors.accent,
                    borderColor: `${themeColors.accent}4D`
                } : {}}
            >
                {isPlaying ? <Pause size={18} /> : <Music size={18} />}
            </button>
        </div>
    );
};

const Tier2Template3 = ({
    customMessage,
    customSignOff,
    images = [],
    musicUrl = '',
    isDemo = false,
    demoMusicUrl = null,
    colorTheme
}) => {
    const ct = colorTheme?.colors || null;
    const themeColors = {
        primary: ct?.primary || '#f43f5e',
        secondary: ct?.secondary || '#ec4899',
        accent: ct?.accent || '#fda4af',
        gradient: ct?.gradient || ['#ffe4e6', '#fff1f2', '#ffffff']
    };
    const gradientColors = themeColors.gradient;
    const confettiColors = ct?.confetti || ['#f43f5e', '#ec4899', '#a855f7', '#fbbf24'];
    const showMusicPlayer = true;
    const [canSendLove, setCanSendLove] = useState(true);

    const triggerConfetti = () => {
        if (!canSendLove) return;

        setCanSendLove(false);
        setTimeout(() => setCanSendLove(true), 5000);

        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const colors = confettiColors;

        const heart = confetti.shapeFromPath({
            path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
        });

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 4 * (timeLeft / duration);

            confetti({
                particleCount,
                angle: 60,
                spread: 70,
                origin: { x: 0, y: 0.7 },
                colors,
                shapes: [heart, 'circle'],
                scalar: 1.2,
                zIndex: 99999
            });
            confetti({
                particleCount,
                angle: 120,
                spread: 70,
                origin: { x: 1, y: 0.7 },
                colors,
                shapes: [heart, 'circle'],
                scalar: 1.2,
                zIndex: 99999
            });
        }, 200);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 text-center text-slate-700 overflow-hidden relative font-sans">
            <AnimatePresence mode="wait">
                <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-30 flex flex-col items-center justify-start overflow-y-auto py-8 px-4"
                >
                    <RomanticGradient gradientColors={gradientColors} />
                    <FloatingHearts intensity={0.6} themeColors={themeColors} />

                    <div className="relative z-10 w-full max-w-lg mt-4 mb-24">
                        {/* HEADER */}
                        <motion.h2
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`text-2xl font-bold mb-3 md:mb-6 font-serif italic ${!ct ? 'text-rose-400' : ''}`}
                            style={ct ? { color: themeColors.primary } : {}}
                        >
                            Our Love Story
                        </motion.h2>

                        {/* Love Gallery (Dynamic) */}
                        <LoveGallery images={images} themeColors={themeColors} />

                        {/* Message Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className={`relative bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-[2.5rem] border shadow-xl overflow-hidden mt-4 md:mt-8 ${!ct ? 'border-rose-100' : ''}`}
                            style={ct ? { borderColor: `${themeColors.accent}4D` } : {}}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-50" style={{ background: `linear-gradient(to bottom left, ${themeColors.accent}4D, transparent)` }} />
                            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-tr-full opacity-50" style={{ background: `linear-gradient(to top right, ${themeColors.accent}4D, transparent)` }} />

                            {/* Content */}
                            <div className="relative z-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4, type: "spring" }}
                                    className={`flex justify-center mb-6 ${!ct ? 'text-rose-400' : ''}`}
                                    style={ct ? { color: themeColors.primary } : {}}
                                >
                                    <Stars size={28} fill="currentColor" className="opacity-50" />
                                </motion.div>

                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-xs tracking-[0.3em] uppercase text-slate-400 mb-6 font-medium break-words break-all"
                                >
                                    Wedding Invitation
                                </motion.p>

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-2xl md:text-3xl font-serif italic leading-relaxed text-slate-800 mb-8 font-light break-words break-all"
                                >
                                    "{customMessage || "Two souls, one heart. Join us as we begin our forever."}"
                                </motion.h1>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className={`flex items-center justify-center gap-3 ${!ct ? 'text-rose-300' : ''}`}
                                    style={ct ? { color: themeColors.accent } : {}}
                                >
                                    <div className="w-8 h-px" style={{ backgroundColor: themeColors.accent }} />
                                    <span className={`text-lg tracking-wide font-medium break-words break-all ${!ct ? 'text-rose-500' : ''}`} style={ct ? { color: themeColors.primary } : {}}>{customSignOff || "Bride & Groom"}</span>
                                    <div className="w-8 h-px" style={{ backgroundColor: themeColors.accent }} />
                                </motion.div>

                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    onClick={triggerConfetti}
                                    disabled={!canSendLove}
                                    whileHover={canSendLove ? { scale: 1.05 } : {}}
                                    whileTap={canSendLove ? { scale: 0.95 } : {}}
                                    className={`mt-6 md:mt-10 text-xs text-white hover:text-white transition-all duration-300 uppercase tracking-widest flex items-center gap-2 mx-auto px-8 py-3 rounded-full shadow-lg ${!canSendLove ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                                    style={{ background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.secondary})`, boxShadow: canSendLove ? `0 10px 15px -3px ${themeColors.primary}4D` : 'none' }}
                                >
                                    <Heart size={14} fill={canSendLove ? "none" : "currentColor"} />
                                    {canSendLove ? "Send Love" : "Sent!"}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                    {/* Music Player */}
                    {showMusicPlayer && (demoMusicUrl || musicUrl) && <MusicPlayer musicUrl={demoMusicUrl || musicUrl} themeColors={themeColors} />}
                </motion.div>
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="fixed bottom-4 text-xs text-rose-300/50 z-10"
            >
                Made with Love by Nora.dev
            </motion.div>
        </div>
    );
};

export default Tier2Template3;

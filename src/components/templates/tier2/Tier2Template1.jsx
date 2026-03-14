import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Delete, Heart, Sparkles, Clock, MapPin, Calendar, Play, Pause, Volume2, VolumeX, Music, Search } from 'lucide-react';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';

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
                    <img loading="lazy" src={img} alt="" className="w-full h-full object-cover" />
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
const AnimatedBackground = ({ gradientColors }) => {
    // Brighter default colors - purple to pink to rose gradient
    const g = gradientColors || ['#4c1d95', '#be185d', '#f43f5e'];

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
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            />
            {/* Soft glow overlay for brightness */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(255,200,200,0.3) 0%, transparent 50%)'
                }}
            />
            {/* Subtle grid overlay */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}
            />
        </>
    );
};



// Music Player Component
const MusicPlayer = ({ musicUrl, isModalPreview, themeColors }) => {
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
    }, [musicUrl]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                wasPlayingRef.current = !audioRef.current?.paused;
                audioRef.current?.pause();
                setIsPlaying(false);
            } else {
                if (wasPlayingRef.current) {
                    audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => { });
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
        <div className={`${isModalPreview ? 'absolute' : 'fixed'} bottom-6 right-6 z-[100]`}>
            <audio ref={audioRef} src={musicUrl} loop />
            <button
                onClick={togglePlay}
                className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg transition-all duration-300 ${isPlaying ? '' : 'bg-white/5 text-white/50'}`}
                style={isPlaying ? { backgroundColor: `${themeColors.primary}33`, color: themeColors.accent } : {}}
            >
                {isPlaying ? <Pause size={18} /> : <Music size={18} />}
            </button>
        </div>
    );
};


const Tier2Template1 = ({
    pinCode = "1234",
    targetName = "ถึง ที่รักของเค้า",
    customMessage,
    customSignOff,
    images = [],
    musicUrl,
    isDemo = false,
    isModalPreview = false,
    demoMusicUrl = null,
    colorTheme
}) => {
    const ct = colorTheme?.colors || null;
    const themeColors = {
        primary: ct?.primary || '#f43f5e',
        secondary: ct?.secondary || '#ec4899',
        accent: ct?.accent || '#fda4af',
        gradient: ct?.gradient || ['#4c1d95', '#be185d', '#f43f5e']
    };
    // Brighter, more vibrant gradient - less dark and gloomy
    const gradientColors = themeColors.gradient;
    const confettiColors = ct?.confetti || ['#f43f5e', '#ec4899', '#f97316', '#fbbf24', '#a855f7'];
    const [viewState, setViewState] = useState(pinCode ? 'LOCKED' : 'CONTENT');
    const [pinInput, setPinInput] = useState('');
    const [showError, setShowError] = useState(false);
    const initialAudioUrl = (isDemo && !demoMusicUrl) ? null : (demoMusicUrl || musicUrl || '');
    const [demoAudioUrl, setDemoAudioUrl] = useState(initialAudioUrl);
    const [showMusicPlayer, setShowMusicPlayer] = useState(true);


    useEffect(() => {
        if (isDemo && !demoMusicUrl) {
            const fetchRandomMusic = async () => {
                try {
                    const storage = getStorage();
                    const musicRef = ref(storage, 'music');
                    const musicList = await listAll(musicRef);
                    if (musicList.items.length > 0) {
                        const randomItem = musicList.items[Math.floor(Math.random() * musicList.items.length)];
                        const url = await getDownloadURL(randomItem);
                        setDemoAudioUrl(url);
                    }
                } catch (error) {
                    console.error("Error fetching demo music:", error);
                }
            };
            fetchRandomMusic();
        }
    }, [isDemo, demoMusicUrl]);

    useEffect(() => {
        if (pinInput.length === 4) { // Use pinInput
            if (pinInput === pinCode) { // Compare pinInput state with pin prop
                handleUnlock();
            } else {
                handleError();
            }
        }
    }, [pinInput, pinCode]); // Add pin to dependency array

    const handleUnlock = () => {
        setViewState('CONTENT');
        setShowMusicPlayer(true);
        triggerConfetti();
    };

    const handleError = () => {
        setShowError(true); // Use showError
        setTimeout(() => {
            setPinInput(""); // Use setPinInput
            setShowError(false); // Use showError
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
        setTimeout(() => setCanSendLove(true), 3500);

        const heart = confetti.shapeFromPath({
            path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
        });

        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const colors = confettiColors;

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
                scalar: 1.3,
                zIndex: 99999
            });
            confetti({
                particleCount,
                angle: 120,
                spread: 70,
                origin: { x: 1, y: 0.7 },
                colors,
                shapes: [heart, 'circle', 'star'],
                scalar: 1.3,
                zIndex: 99999
            });
        }, 180);
    };

    return (
        <div className={`${isModalPreview ? 'absolute inset-0' : 'fixed inset-0'} w-full h-full text-white`}>

            {/* Watermark for Demo */}
            {isDemo && (
                <div
                    className="absolute inset-0 pointer-events-none z-[100]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' transform='rotate(-30 150 150)' fill='rgba(255,255,255,0.04)' font-family='sans-serif' font-size='22' font-weight='bold' letter-spacing='4'%3ENORA STORY DEMO%3C/text%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat'
                    }}
                />
            )}

            <AnimatePresence mode="wait">
                {/* LOCKED STATE - Premium PIN Entry */}
                {viewState === 'LOCKED' && (
                    <motion.div
                        key="lock-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center"
                    >
                        <AnimatedBackground gradientColors={gradientColors} />
                        <FloatingHearts intensity={0.8} />
                        <SparkleEffect />

                        <motion.div
                            animate={showError ? { x: [-15, 15, -15, 15, 0] } : {}} // Use showError
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
                                                `0 0 20px ${themeColors.primary}4D`,
                                                `0 0 40px ${themeColors.primary}80`,
                                                `0 0 20px ${themeColors.primary}4D`
                                            ]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl"
                                        style={{ background: `linear-gradient(to bottom right, ${themeColors.primary}, ${themeColors.secondary})` }}
                                    >
                                        <Heart size={44} className="text-white" fill="currentColor" />
                                    </motion.div>
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute inset-0 rounded-full border-2"
                                        style={{ borderColor: themeColors.accent }}
                                    />
                                </div>
                            </motion.div>

                            {/* Demo Hint */}
                            {isDemo && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 flex justify-center"
                                >
                                    <span className="text-sm px-4 py-1.5 rounded-full font-sans tracking-wide backdrop-blur-sm" style={{ backgroundColor: `${themeColors.primary}33`, borderColor: `${themeColors.accent}4D`, color: themeColors.accent, borderStyle: 'solid', borderWidth: '1px' }}>
                                        รหัสผ่าน Demo: <span className="font-bold">1234</span>
                                    </span>
                                </motion.div>
                            )}

                            {/* Premium PIN Dots */}
                            <div className="flex justify-center gap-5 mb-6">
                                {[...Array(4)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0 }}
                                        animate={{
                                            scale: 1,
                                            backgroundColor: i < pinInput.length ? themeColors.primary : 'rgba(255,255,255,0.2)', // Use pinInput
                                            boxShadow: i < pinInput.length ? `0 0 15px ${themeColors.primary}99` : 'none' // Use pinInput
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
                                        whileHover={{ scale: 1.1, backgroundColor: `${themeColors.primary}4D`, borderColor: themeColors.accent }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleKeyPress(num.toString())}
                                        className="w-18 h-18 aspect-square rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-2xl font-medium text-white transition-all flex items-center justify-center"
                                    >
                                        {num}
                                    </motion.button>
                                ))}
                                <div className="aspect-square" />
                                <motion.button
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.9 }}
                                    whileHover={{ scale: 1.1, backgroundColor: `${themeColors.primary}4D`, borderColor: themeColors.accent }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleKeyPress("0")}
                                    className="w-18 h-18 aspect-square rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-2xl font-medium text-white transition-all flex items-center justify-center"
                                >
                                    0
                                </motion.button>
                                <motion.button
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.95 }}
                                    whileHover={{ scale: 1.1, color: themeColors.accent }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleBackspace}
                                    className="w-16 h-16 aspect-square rounded-2xl bg-white/5 text-white/50 transition-all flex items-center justify-center"
                                >
                                    <Delete size={20} />
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
                        className="absolute inset-0 z-30 flex flex-col items-center justify-center overflow-hidden p-4"
                    >
                        <AnimatedBackground gradientColors={gradientColors} />
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
                                <div className="absolute top-0 right-0 w-40 h-40 rounded-bl-full" style={{ background: `linear-gradient(to bottom left, ${themeColors.primary}33, transparent)` }} />
                                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-tr-full" style={{ background: `linear-gradient(to top right, ${themeColors.secondary}33, transparent)` }} />

                                {/* Glowing Border */}
                                <motion.div
                                    animate={{
                                        boxShadow: [
                                            `0 0 20px ${themeColors.primary}33`,
                                            `0 0 40px ${themeColors.primary}4D`,
                                            `0 0 20px ${themeColors.primary}33`
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
                                        <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(to bottom right, ${themeColors.primary}, ${themeColors.secondary})`, boxShadow: `0 10px 15px -3px ${themeColors.primary}4D` }}>
                                            <Heart size={28} className="text-white" fill="currentColor" />
                                        </div>
                                    </motion.div>

                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-sm tracking-[0.1em] uppercase mb-6 font-medium text-center break-words break-all"
                                        style={{ color: themeColors.accent }}
                                    >
                                        ✨ {targetName || "For You"} ✨
                                    </motion.p>

                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className={`${(customMessage || "ทุกช่วงเวลาที่มีเธอ คือของขวัญที่ฉันไม่อยากสูญเสีย").length > 80
                                            ? "text-base md:text-xl"
                                            : (customMessage || "ทุกช่วงเวลาที่มีเธอ คือของขวัญที่ฉันไม่อยากสูญเสีย").length > 50
                                                ? "text-lg md:text-xl"
                                                : "text-xl md:text-xl"
                                            } font-serif italic leading-relaxed text-white mb-6 px-4 break-words break-all text-center`}
                                    >
                                        "{customMessage || "ทุกช่วงเวลาที่มีเธอ คือของขวัญที่ฉันไม่อยากสูญเสีย"}"
                                    </motion.h1>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.8 }}
                                        className="flex items-center justify-center gap-3"
                                        style={{ color: themeColors.accent }}
                                    >
                                        <div className="w-10 h-px" style={{ background: `linear-gradient(to right, transparent, ${themeColors.accent})` }} />
                                        <span className="text-sm tracking-wide font-medium break-words break-all">{customSignOff || "รักเธอเสมอ"}</span>
                                        <div className="w-10 h-px" style={{ background: `linear-gradient(to left, transparent, ${themeColors.accent})` }} />
                                    </motion.div>

                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1 }}
                                        onClick={triggerConfetti}
                                        disabled={!canSendLove}
                                        whileHover={canSendLove ? { scale: 1.05, color: themeColors.accent } : {}}
                                        whileTap={canSendLove ? { scale: 0.95 } : {}}
                                        className={`mt-10 text-sm text-white transition-colors duration-300 uppercase tracking-widest flex items-center gap-2 mx-auto px-6 py-3 rounded-full border border-white/20 ${!canSendLove ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                                        style={{ background: `linear-gradient(to right, ${themeColors.primary}4D, ${themeColors.secondary}4D)` }}
                                    >
                                        <Sparkles size={16} />
                                        {canSendLove ? "" : ""}
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Render Music Player Outside AnimatePresence to Play on Lock Screen */}
            {showMusicPlayer && (demoAudioUrl) && <MusicPlayer musicUrl={demoAudioUrl} themeColors={themeColors} />}

            {
                viewState === 'CONTENT' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className={`${isModalPreview ? 'absolute' : 'fixed'} bottom-4 text-xs text-white/30 z-10 flex items-center gap-1`}
                    >
                        Made with by Nora Story
                    </motion.div>
                )
            }
        </div>
    );
};

export default Tier2Template1;

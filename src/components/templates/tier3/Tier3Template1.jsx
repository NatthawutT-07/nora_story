import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Play, Pause, Volume2, VolumeX, Music, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';

// --- Utility Components ---

const Starfield = ({ speed = 1 }) => {
    const stars = useMemo(() => [...Array(50)].map(() => ({
        x: Math.random() * 100 + "%",
        y: Math.random() * 100 + "%",
        scale: Math.random() * 0.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        duration: (Math.random() * 10 + 20),
        delay: Math.random() * -20
    })), []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {stars.map((star, i) => (
                <motion.div
                    key={i}
                    initial={{
                        x: star.x,
                        y: star.y,
                        scale: star.scale,
                        opacity: star.opacity,
                    }}
                    animate={{
                        y: ["0%", "100%"],
                        opacity: [0.2, 1, 0.2],
                    }}
                    transition={{
                        duration: star.duration / speed,
                        repeat: Infinity,
                        ease: "linear",
                        delay: star.delay,
                    }}
                    className="absolute w-1 h-1 bg-white rounded-full lg:w-0.5 lg:h-0.5"
                />
            ))}
            <ShootingStar delay={2} />
            <ShootingStar delay={7} />
            <ShootingStar delay={15} />
        </div>
    );
};

const ShootingStar = ({ delay }) => {
    const style = useMemo(() => ({
        top: `${Math.random() * 50}%`,
        left: `${Math.random() * 50}%`
    }), []);

    return (
        <motion.div
            initial={{ x: "0%", y: "0%", opacity: 0, scale: 0 }}
            animate={{
                x: ["0%", "100%"],
                y: ["0%", "100%"],
                opacity: [0, 1, 0, 0],
                scale: [0, 1, 0.5, 0]
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: delay,
                ease: "easeInOut"
            }}
            className="absolute top-0 left-0 w-[150px] h-[2px] bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-45 origin-top-left"
            style={style}
        />
    );
};



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
        <div className={`${isModalPreview ? 'absolute' : 'fixed'} bottom-6 right-6 z-[100] pointer-events-auto`}>
            <audio ref={audioRef} src={musicUrl} loop />
            <button
                onClick={togglePlay}
                className={`group relative w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg transition-all duration-500 ${isPlaying ? "" : "bg-white/5 text-white/50"}`}
                style={isPlaying ? { backgroundColor: `${themeColors.primary}33`, color: themeColors.accent } : {}}
            >
                {isPlaying && <span className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: `${themeColors.primary}33` }} />}
                {isPlaying ? <Pause size={18} /> : <Music size={18} />}
            </button>
        </div>
    );
};

const ScrollIndicator = ({ themeColors }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const handleScroll = (e) => {
            if (e.target && e.target.scrollTop > 100) {
                setVisible(false);
            } else {
                setVisible(true);
            }
        };

        const container = document.getElementById('t3-scroll-container');
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none"
                >
                    <span className="text-white/50 text-[10px] uppercase tracking-[0.2em] mb-2 animate-pulse">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-px h-12"
                        style={{ background: `linear-gradient(to bottom, ${themeColors.primary}, transparent)` }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const TimelineNav = ({ items, activeIndex, onSelect, themeColors }) => {
    return (
        <div className="absolute top-1/2 right-2 md:right-8 transform -translate-y-1/2 z-40 flex flex-col gap-4 md:gap-6 items-end pointer-events-auto">
            <div className="absolute top-0 bottom-0 right-[5px] w-px bg-white/10 -z-10" />
            {items.map((item, idx) => (
                <button
                    key={idx}
                    onClick={() => onSelect(idx)}
                    className="group relative flex items-center justify-end"
                >
                    <span
                        className={`mr-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 transform ${activeIndex === idx
                            ? 'opacity-100 translate-x-0'
                            : 'text-white/30 opacity-0 group-hover:opacity-100 translate-x-2'
                            } hidden md:block`}
                        style={activeIndex === idx ? { color: themeColors.accent } : {}}
                    >
                        {item.label}
                    </span>
                    <div
                        className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-500 border relative z-10 ${activeIndex === idx
                            ? 'scale-125'
                            : 'bg-[#050510] border-white/20 group-hover:bg-white/20'
                            }`}
                        style={activeIndex === idx ? { 
                            backgroundColor: themeColors.primary, 
                            borderColor: themeColors.accent,
                            boxShadow: `0 0 15px ${themeColors.primary}99`
                        } : {}}
                    />
                </button>
            ))}
        </div>
    );
};

// --- Layout Sub-Components ---

const SingleLayout = ({ chapter, themeColors }) => (
    <div className="relative w-[85%] md:w-[75%] mx-auto h-[260px] md:h-[400px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 group">
        <img loading="lazy" src={chapter.images[0]} alt="" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[20s] ease-linear" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent opacity-90" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
            <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} 
                className="inline-block text-[10px] md:text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-widest border"
                style={{ backgroundColor: `${themeColors.primary}33`, color: themeColors.textLight, borderColor: `${themeColors.primary}4D` }}
            >
                {chapter.label}
            </motion.div>
        </div>
    </div>
);

const DualLayout = ({ chapter, customMessage, customSignOff, onConfetti, canSendLove, themeColors }) => (
    <div className="relative w-full min-h-[450px] p-6 flex flex-col items-center justify-center">
        <div className="relative w-full max-w-lg mx-auto aspect-[4/3.5] my-8">
            {/* Photo 1: Top Left */}
            <motion.div
                initial={{ x: -50, opacity: 0, rotate: -5 }}
                whileInView={{ x: 0, opacity: 1, rotate: -3 }}
                viewport={{ once: true }}
                className="absolute top-0 left-0 w-[65%] aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10 z-10"
            >
                <img loading="lazy" src={chapter.images[0]} alt="" className="w-full h-full object-cover" />
            </motion.div>

            {/* Photo 2: Bottom Right */}
            <motion.div
                initial={{ x: 50, opacity: 0, rotate: 5 }}
                whileInView={{ x: 0, opacity: 1, rotate: 3 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-0 right-0 w-[65%] aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10 z-20"
            >
                <img loading="lazy" src={chapter.images[1]} alt="" className="w-full h-full object-cover" />
            </motion.div>
        </div>

        {/* Finale Message Section if needed */}
        {onConfetti && (
            <div className="relative z-30 max-w-2xl w-full bg-black/60 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[3rem] text-center shadow-2xl mt-8 mx-auto">
                <h2 className="text-xl font-bold mb-4 text-white break-words break-all">{chapter.title}</h2>
                <p className="text-sm text-white/90 leading-relaxed font-light italic mb-6 break-words break-all">
                    "{customMessage || "ทุกเรื่องราวของเรา คือความทรงจำที่ฉันอยากเก็บรักษาไว้ตลอดไป"}"
                </p>
                <div className="flex flex-col items-center gap-2 mb-6">
                    <div className="w-12 h-1 bg-gradient-to-r from-transparent via-current to-transparent" style={{ color: themeColors.primary }} />
                    <span className="font-medium break-words break-all" style={{ color: themeColors.accent }}>{customSignOff || "รักเสมอนะ"}</span>
                </div>
                <button
                    onClick={onConfetti}
                    disabled={!canSendLove}
                    className={`px-8 py-3 rounded-full text-white font-bold tracking-wide shadow-lg flex items-center gap-2 mx-auto transition-all ${!canSendLove ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-105'
                        }`}
                    style={{ background: `linear-gradient(to right, ${themeColors.gradient?.[1] || themeColors.primary}, ${themeColors.gradient?.[0] || themeColors.secondary})`, boxShadow: `0 10px 15px -3px ${themeColors.primary}80` }}
                >
                    <Sparkles size={18} />
                    {canSendLove ? "" : ""}
                </button>
            </div>
        )}
    </div>
);

const CollageLayout = ({ chapter, themeColors }) => {
    const animations = [
        { initial: { opacity: 0, y: -20, x: -20, rotate: -2 }, delay: 0 },
        { initial: { opacity: 0, y: -20, x: 20, rotate: 2 }, delay: 0.1 },
        { initial: { opacity: 0, scale: 0.9 }, delay: 0.2 },
        { initial: { opacity: 0, y: 20, x: -20, rotate: 1 }, delay: 0.3 },
        { initial: { opacity: 0, y: 20, x: 20, rotate: -1 }, delay: 0.4 },
    ];

    return (
        <div className="relative w-full p-4 flex flex-col justify-center min-h-[500px] md:min-h-[700px]">
            {/* Elegant Title Section */}
            <div className="relative text-center mb-8 md:mb-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-block"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-[1px] w-8" style={{ background: `linear-gradient(to right, transparent, ${themeColors.accent}80)` }} />
                        <span className="text-xs font-serif italic tracking-[0.2em] uppercase opacity-80" style={{ color: themeColors.accent }}>
                            {chapter.label}
                        </span>
                        <div className="h-[1px] w-8" style={{ background: `linear-gradient(to left, transparent, ${themeColors.accent}80)` }} />
                    </div>
                </motion.div>
            </div>

            {/* Cross Pattern Layout */}
            <div className="relative w-full max-w-2xl mx-auto aspect-square md:aspect-[4/3]">
                {/* Top Left */}
                <motion.div
                    initial={animations[0].initial}
                    whileInView={{ opacity: 1, y: 0, x: 0, rotate: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: animations[0].delay, duration: 0.6 }}
                    className="absolute top-0 left-0 w-[45%] md:w-[40%] z-10 group rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] transform hover:z-50 hover:scale-105 transition-all duration-500"
                >
                    <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <img loading="lazy" src={chapter.images[0]} alt="" className="w-full h-full object-cover" />
                </motion.div>

                {/* Top Right */}
                <motion.div
                    initial={animations[1].initial}
                    whileInView={{ opacity: 1, y: 0, x: 0, rotate: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: animations[1].delay, duration: 0.6 }}
                    className="absolute top-0 right-0 w-[45%] md:w-[40%] z-10 group rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] transform hover:z-50 hover:scale-105 transition-all duration-500"
                >
                    <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <img loading="lazy" src={chapter.images[1]} alt="" className="w-full h-full object-cover" />
                </motion.div>

                {/* Bottom Left */}
                <motion.div
                    initial={animations[3].initial}
                    whileInView={{ opacity: 1, y: 0, x: 0, rotate: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: animations[3].delay, duration: 0.6 }}
                    className="absolute bottom-0 left-0 w-[45%] md:w-[40%] z-10 group rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] transform hover:z-50 hover:scale-105 transition-all duration-500"
                >
                    <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <img loading="lazy" src={chapter.images[3]} alt="" className="w-full h-full object-cover" />
                </motion.div>

                {/* Bottom Right */}
                <motion.div
                    initial={animations[4].initial}
                    whileInView={{ opacity: 1, y: 0, x: 0, rotate: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: animations[4].delay, duration: 0.6 }}
                    className="absolute bottom-0 right-0 w-[45%] md:w-[40%] z-10 group rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] transform hover:z-50 hover:scale-105 transition-all duration-500"
                >
                    <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <img loading="lazy" src={chapter.images[4]} alt="" className="w-full h-full object-cover" />
                </motion.div>

                {/* Center Featured */}
                <motion.div
                    initial={animations[2].initial}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: animations[2].delay, duration: 0.6 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] md:w-[50%] z-20 group rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] transform hover:z-50 hover:scale-110 transition-all duration-500 border-4 border-white/20"
                >
                    <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <img loading="lazy" src={chapter.images[2]} alt="" className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                        <span className="text-white/90 font-serif italic text-sm md:text-lg">{chapter.label}</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};


const Tier3Template1 = ({
    customMessage,
    customSignOff,
    timelines = [],
    finaleMessage,
    finaleSignOff,
    images = [],
    musicUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    isDemo = false,
    isModalPreview = false,
    demoMusicUrl = null,
    colorTheme
}) => {
    const ct = colorTheme?.colors || null;
    const bgColor = ct?.bg || '#050510';
    const bgAltColor = ct?.bgAlt || '#1a103c';
    
    // Default to nebula theme if ct is missing
    const themeColors = {
        primary: ct?.primary || '#c084fc',
        secondary: ct?.secondary || '#e879f9',
        accent: ct?.accent || '#a78bfa',
        textLight: ct?.textLight || '#e9d5ff',
        gradient: ct?.gradient || ['#050510', '#1a103c', '#0c0520']
    };
    
    const confettiColors = ct?.confetti || ['#c084fc', '#e879f9', '#a78bfa', '#f0abfc'];
    const [activeSection, setActiveSection] = useState(0);
    const [canSendLove, setCanSendLove] = useState(true);
    const initialAudioUrl = (isDemo && !demoMusicUrl) ? null : (demoMusicUrl || musicUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    const [demoAudioUrl, setDemoAudioUrl] = useState(initialAudioUrl);
    const sectionRefs = useRef([]);

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

    const getPlaceholder = (width, height, text) => {
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#2a2a2a"/>
                <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="52" fill="#666" text-anchor="middle" dy=".3em">${text}</text>
            </svg>
        `;
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
    };

    // Standardized default images with strict ratios (4:3, 1:1, 16:9)
    const defaultImages = {
        single: [getPlaceholder(800, 600, "4:3")],
        collage: [
            getPlaceholder(800, 600, "4:3"),   // Photo 1
            getPlaceholder(800, 600, "4:3"),   // Photo 2
            getPlaceholder(800, 600, "4:3"),   // Photo 3
            getPlaceholder(800, 600, "4:3"),   // Photo 4
            getPlaceholder(800, 600, "4:3"),   // Photo 5
        ],
        dual: [
            getPlaceholder(800, 600, "4:3"),
            getPlaceholder(800, 600, "4:3"),
        ]
    };

    // Helper to merge user provided images with defaults
    const getSectionImages = (startIndex, count, defaults) => {
        const currentImages = images || [];
        const userSlice = currentImages.slice(startIndex, startIndex + count);
        return Array(count).fill(null).map((_, i) => userSlice[i] || defaults[i]);
    };

    // Layout configuration for each slot matching the checkout ImagesStep structure:
    // Timeline 1(1) + 2(1) + 3(1) + 4(collage 5). Finale takes the last 2 images.
    // Total exactly 10 images.
    const slotConfigs = [
        { type: 'single', imageCount: 1, defaultImages: defaultImages.single },    // T1
        { type: 'single', imageCount: 1, defaultImages: defaultImages.single },    // T2
        { type: 'single', imageCount: 1, defaultImages: defaultImages.single },    // T3
        { type: 'collage', imageCount: 5, defaultImages: defaultImages.collage },  // T4 (Memories)
    ];

    // Default timeline data
    const defaultTimelines = [
        { label: 'Day 1', desc: '' },
        { label: 'Day 30', desc: '' },
        { label: 'Day 60', desc: '' },
        { label: 'Memories', desc: '' },
        { label: 'Forever', desc: '' },
    ];

    // Merge user timelines with defaults
    const mergedTimelines = defaultTimelines.map((dt, i) => ({
        label: timelines[i]?.label || dt.label,
        desc: timelines[i]?.desc !== undefined ? timelines[i].desc : dt.desc,
    }));

    const listItems = [];
    let currentImageIndex = 0;

    slotConfigs.forEach((config, index) => {
        // Calculate images for this slot
        const sectionImages = getSectionImages(currentImageIndex, config.imageCount, config.defaultImages);
        currentImageIndex += config.imageCount;

        const timeline = mergedTimelines[index];
        const userProvided = timelines[index];

        // In demo mode, we always want to show all slots with defaults.
        if (!isDemo && !userProvided?.label) {
            return;
        }

        listItems.push({
            type: config.type,
            label: timeline.label,
            title: timeline.label,
            desc: '',
            images: sectionImages
        });
    });

    // Add Finale as the 5th section using the 5th timeline data (or fallback to finaleMessage/finaleSignOff)
    const finaleTimeline = mergedTimelines[4];
    listItems.push({
        type: 'finale',
        label: finaleTimeline?.label || 'To Infinity',
        title: finaleTimeline?.label || 'To Infinity', // ใช้ค่าขึ้นต้น (label) เป็น title หัวข้อ
        desc: '',
        images: getSectionImages(currentImageIndex, 2, defaultImages.dual)
    });

    const scrollToSection = (index) => {
        sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setActiveSection(index);
    };

    const triggerSupernova = () => {
        if (!canSendLove) return;
        setCanSendLove(false);
        setTimeout(() => setCanSendLove(true), 5000);

        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999, colors: confettiColors };
        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    return (
        <div className={`${isModalPreview ? 'absolute inset-0' : 'fixed inset-0'} w-full h-full text-white font-sans selection:bg-rose-500/30`} style={{ backgroundColor: bgColor }}>

            <div className="absolute inset-0 opacity-80 z-0 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 50%, ${bgAltColor} 0%, ${bgColor} 100%)` }} />
            <Starfield speed={0.5} />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none mix-blend-overlay z-0" />
            
            {(demoAudioUrl) && <MusicPlayer musicUrl={demoAudioUrl} isModalPreview={isModalPreview} themeColors={themeColors} />}
            <ScrollIndicator themeColors={themeColors} />
            <TimelineNav items={listItems} activeIndex={activeSection} onSelect={scrollToSection} themeColors={themeColors} />

            <div id="t3-scroll-container" className="absolute inset-0 overflow-y-auto overflow-x-hidden scroll-smooth z-10">
                <div className="relative w-full min-h-full py-4 px-4 md:px-8">
                    <div className="max-w-4xl mx-auto flex flex-col gap-2 pb-6">
                        {listItems.map((item, index) => (
                        <motion.div
                            key={index}
                            ref={el => sectionRefs.current[index] = el}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            onViewportEnter={() => setActiveSection(index)}
                            transition={{ duration: 0.8 }}
                        >
                            {item.type === 'single' && <SingleLayout chapter={item} themeColors={themeColors} />}
                            {item.type === 'dual' && <DualLayout chapter={item} themeColors={themeColors} />}
                            {item.type === 'collage' && <CollageLayout chapter={item} themeColors={themeColors} />}
                            {item.type === 'finale' && <DualLayout chapter={item} customMessage={finaleMessage || customMessage} customSignOff={finaleSignOff || customSignOff} onConfetti={triggerSupernova} canSendLove={canSendLove} themeColors={themeColors} />}
                        </motion.div>
                    ))}

                    <div className="text-center text-white/30 text-sm mt-6">
                        Made with by Nora Story
                    </div>
                </div>
            </div>
            </div>

            {/* Demo Watermark */}
            {isDemo && (
                <div
                    className="absolute inset-0 pointer-events-none z-[100]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' transform='rotate(-30 150 150)' fill='rgba(255,255,255,0.04)' font-family='sans-serif' font-size='22' font-weight='bold' letter-spacing='4'%3ENORA STORY DEMO%3C/text%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat'
                    }}
                />
            )}
        </div>
    );
};

export default Tier3Template1;

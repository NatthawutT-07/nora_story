import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Play, Pause, Volume2, VolumeX, Music, ArrowRight, Image as ImageIcon } from 'lucide-react';

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



const MusicPlayer = ({ musicUrl }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = 0.4;
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.pause();
            else audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <audio ref={audioRef} src={musicUrl} loop />
            <button
                onClick={togglePlay}
                className={`group relative w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg transition-all duration-500 ${isPlaying ? "bg-rose-500/20 text-rose-300" : "bg-white/5 text-white/50"
                    }`}
            >
                {isPlaying && <span className="absolute inset-0 rounded-full animate-ping bg-rose-500/20" />}
                {isPlaying ? <Pause size={20} /> : <Music size={20} />}
            </button>
        </div>
    );
};

const ScrollIndicator = () => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setVisible(false);
            } else {
                setVisible(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none"
                >
                    <span className="text-white/50 text-[10px] uppercase tracking-[0.2em] mb-2 animate-pulse">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-px h-12 bg-gradient-to-b from-rose-500 to-transparent"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const TimelineNav = ({ items, activeIndex, onSelect }) => {
    return (
        <div className="fixed top-1/2 right-2 md:right-8 transform -translate-y-1/2 z-40 flex flex-col gap-4 md:gap-6 items-end">
            <div className="absolute top-0 bottom-0 right-[5px] w-px bg-white/10 -z-10" />
            {items.map((item, idx) => (
                <button
                    key={idx}
                    onClick={() => onSelect(idx)}
                    className="group relative flex items-center justify-end"
                >
                    <span
                        className={`mr-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 transform ${activeIndex === idx
                            ? 'text-rose-400 opacity-100 translate-x-0'
                            : 'text-white/30 opacity-0 group-hover:opacity-100 translate-x-2'
                            } hidden md:block`} // Keep text hidden on mobile to save space, or show if valid? Let's hide text on mobile for cleanliness
                    >
                        {item.label}
                    </span>
                    <div
                        className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-500 border border-white/20 relative z-10 ${activeIndex === idx
                            ? 'bg-rose-500 scale-125 shadow-[0_0_15px_rgba(244,63,94,0.6)] border-rose-400'
                            : 'bg-[#050510] group-hover:bg-white/20'
                            }`}
                    />
                </button>
            ))}
        </div>
    );
};

// --- Layout Sub-Components ---

const SingleLayout = ({ chapter }) => (
    <div className="relative w-full h-[400px] md:h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 group">
        <img src={chapter.images[0]} alt="" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[20s] ease-linear" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent opacity-90" />
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
            <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="inline-block bg-rose-500/20 text-rose-300 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest border border-rose-500/30">
                {chapter.label}
            </motion.div>
            <motion.h2 initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl font-bold mb-4 text-white leading-tight">{chapter.title}</motion.h2>
            <motion.p initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-white/70 text-lg md:text-xl max-w-xl leading-relaxed">{chapter.desc}</motion.p>
        </div>
    </div>
);

const DualLayout = ({ chapter, customMessage, customSignOff, onConfetti, canSendLove }) => (
    <div className="relative w-full min-h-[600px] p-6 flex flex-col items-center justify-center">
        <div className="relative w-full md:w-[90%] h-[500px]">
            {/* Photo 1: Large Left */}
            <motion.div
                initial={{ x: -50, opacity: 0, rotate: -5 }}
                whileInView={{ x: 0, opacity: 1, rotate: -3 }}
                viewport={{ once: true }}
                className="absolute top-0 left-0 w-[60%] h-[70%] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10 z-10"
            >
                <img src={chapter.images[0]} alt="" className="w-full h-full object-cover" />
            </motion.div>

            {/* Photo 2: Large Right */}
            <motion.div
                initial={{ x: 50, opacity: 0, rotate: 5 }}
                whileInView={{ x: 0, opacity: 1, rotate: 3 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-10 right-0 w-[55%] h-[65%] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10 z-20"
            >
                <img src={chapter.images[1]} alt="" className="w-full h-full object-cover" />
            </motion.div>
        </div>

        {/* Finale Message Section if needed */}
        {onConfetti && (
            <div className="relative z-30 max-w-2xl w-full bg-black/60 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[3rem] text-center shadow-2xl mt-8">
                <h2 className="text-3xl font-bold mb-4 text-white">{chapter.title}</h2>
                <p className="text-lg text-white/90 leading-relaxed font-light italic mb-6">
                    "{customMessage || "ทุกเรื่องราวของเรา คือความทรงจำที่ฉันอยากเก็บรักษาไว้ตลอดไป"}"
                </p>
                <div className="flex flex-col items-center gap-2 mb-6">
                    <div className="w-12 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent" />
                    <span className="text-rose-300 font-medium">{customSignOff || "รักเสมอนะ"}</span>
                </div>
                <button
                    onClick={onConfetti}
                    disabled={!canSendLove}
                    className={`px-8 py-3 bg-gradient-to-r from-rose-600 to-indigo-600 rounded-full text-white font-bold tracking-wide shadow-lg shadow-rose-900/50 flex items-center gap-2 mx-auto transition-all ${!canSendLove ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-105'
                        }`}
                >
                    <Sparkles size={18} />
                    {canSendLove ? "Send My Love" : "Wait a moment..."}
                </button>
            </div>
        )}
    </div>
);

const CollageLayout = ({ chapter }) => (
    <div className="relative w-full h-full p-6 flex flex-col justify-center min-h-[500px] md:min-h-[800px]">
        {/* Elegant Title Section */}
        <div className="relative text-center mb-4 md:mb-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-block"
            >
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-rose-400/50" />
                    <span className="text-xs font-serif italic text-rose-300 tracking-[0.2em] uppercase opacity-80">
                        {chapter.label}
                    </span>
                    <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-rose-400/50" />
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-white/90 tracking-wide">
                    {chapter.title}
                </h2>
                {chapter.desc && (
                    <p className="mt-3 text-white/50 font-light text-sm tracking-wide max-w-md mx-auto">
                        {chapter.desc}
                    </p>
                )}
            </motion.div>
        </div>

        {/* Premium Bento Grid - Unified Layout for Mobile & Desktop */}
        <div className="grid grid-cols-4 grid-rows-3 gap-2 md:gap-4 w-full max-w-6xl mx-auto aspect-[4/3]">

            {/* Main Featured Photo (Large Left) */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="col-span-2 row-span-3 relative group rounded-[1rem] md:rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl"
            >
                <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img
                    src={chapter.images[0]}
                    alt=""
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Overlay Text */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 translate-y-4 group-hover:translate-y-0">
                    <span className="text-white/90 font-serif italic text-sm md:text-lg">Pure Elegance</span>
                </div>
            </motion.div>

            {/* Top Right (Wide) */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="col-span-2 row-span-1 relative group rounded-[1rem] md:rounded-[2rem] overflow-hidden border border-white/5 shadow-lg"
            >
                <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img
                    src={chapter.images[1]}
                    alt=""
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
            </motion.div>

            {/* Middle Right Split 1 */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="col-span-1 row-span-1 relative group rounded-[1rem] md:rounded-[2rem] overflow-hidden border border-white/5 shadow-lg"
            >
                <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img
                    src={chapter.images[2]}
                    alt=""
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
            </motion.div>

            {/* Middle Right Split 2 */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="col-span-1 row-span-1 relative group rounded-[1rem] md:rounded-[2rem] overflow-hidden border border-white/5 shadow-lg"
            >
                <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img
                    src={chapter.images[3]}
                    alt=""
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
            </motion.div>

            {/* Bottom Right (Wide) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="col-span-2 row-span-1 relative group rounded-[1rem] md:rounded-[2rem] overflow-hidden border border-white/5 shadow-lg"
            >
                <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img
                    src={chapter.images[4]}
                    alt=""
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
            </motion.div>

        </div>
    </div>
);

const Watermark = () => (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
        <div className="absolute inset-0 flex flex-wrap items-center justify-center opacity-[0.03] rotate-[-12deg] scale-150 gap-8">
            {Array.from({ length: 400 }).map((_, i) => (
                <span key={i} className="text-lg font-black text-white whitespace-nowrap select-none">
                    SAMPLE WEB • ตัวอย่างเว็บไซต์
                </span>
            ))}
        </div>
    </div>
);

const Tier3Template1 = ({
    customMessage,
    customSignOff,
    images = [],
    musicUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
}) => {
    const [activeSection, setActiveSection] = useState(0);
    const [canSendLove, setCanSendLove] = useState(true);
    const sectionRefs = useRef([]);

    const getPlaceholder = (width, height, text) => {
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#2a2a2a"/>
                <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="36" fill="#666" text-anchor="middle" dy=".3em">${text}</text>
            </svg>
        `;
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
    };

    // Standardized default images with strict ratios (4:3, 1:1, 16:9)
    const defaultImages = {
        single: [getPlaceholder(800, 600, "4:3")],
        collage: [
            getPlaceholder(600, 800, "3:4"),   // Main Left (Portrait 4:3)
            getPlaceholder(800, 450, "16:9"),   // Top Right (Wide)
            getPlaceholder(500, 500, "1:1"),    // Mid R1 (Square)
            getPlaceholder(500, 500, "1:1"),    // Mid R2 (Square)
            getPlaceholder(800, 450, "16:9"),   // Bot Right (Wide)
        ],
        dual: [
            getPlaceholder(600, 800, "3:4"),
            getPlaceholder(600, 800, "3:4"),
        ]
    };

    // Helper to merge user provided images with defaults
    const getSectionImages = (startIndex, count, defaults) => {
        // Handle case where images might be undefined or empty
        const currentImages = images || [];
        const sectionUserImages = currentImages.slice(startIndex, startIndex + count);
        return [...sectionUserImages, ...defaults].slice(0, count);
    };

    const listItems = [
        { type: 'single', label: "Day 1", title: "The Beginning", desc: "จุดเริ่มต้นของการเดินทาง", images: getSectionImages(0, 1, defaultImages.single) },
        { type: 'single', label: "Day 30", title: "First Month", desc: "ความทรงจำที่งดงามในเดือนแรก", images: getSectionImages(1, 1, defaultImages.single) },
        { type: 'single', label: "Day 60", title: "Growing Closer", desc: "ยิ่งนานยิ่งผูกพัน", images: getSectionImages(2, 1, defaultImages.single) },
        { type: 'collage', label: "Memories", title: "Our Collection", desc: "ทุกช่วงเวลาพิเศษของเรา", images: getSectionImages(3, 5, defaultImages.collage) },
        { type: 'finale', label: "Forever", title: "To Infinity", desc: "", images: getSectionImages(8, 2, defaultImages.dual) },
    ];

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
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 60 };
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
        <div className="relative min-h-screen w-full bg-[#050510] text-white overflow-x-hidden font-sans selection:bg-rose-500/30">
            <Watermark />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1a103c_0%,_#050510_100%)] opacity-80" />
            <Starfield speed={0.5} />
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none mix-blend-overlay" />
            {musicUrl && <MusicPlayer musicUrl={musicUrl} />}
            <ScrollIndicator />

            <div className="relative z-10 w-full min-h-screen py-10 px-4 md:px-8">

                <TimelineNav items={listItems} activeIndex={activeSection} onSelect={scrollToSection} />

                <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-10">
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
                            {item.type === 'single' && <SingleLayout chapter={item} />}
                            {item.type === 'collage' && <CollageLayout chapter={item} />}
                            {item.type === 'finale' && <DualLayout chapter={item} customMessage={customMessage} customSignOff={customSignOff} onConfetti={triggerSupernova} canSendLove={canSendLove} />}
                        </motion.div>
                    ))}

                    <div className="text-center text-white/30 text-sm mt-6">
                        Made with by Nora Story
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tier3Template1;

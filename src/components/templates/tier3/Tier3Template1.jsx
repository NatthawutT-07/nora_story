import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useTransform, useMotionValue, useScroll } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Play, Pause, ChevronRight, Volume2, VolumeX, Music, ArrowRight, Image as ImageIcon } from 'lucide-react';

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

const TiltCard = ({ children, className = "" }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [5, -5]);
    const rotateY = useTransform(x, [-100, 100], [-5, 5]);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        x.set(clientX - left - width / 2);
        y.set(clientY - top - height / 2);
    }

    return (
        <motion.div
            style={{ perspective: 1000, rotateX, rotateY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            className={`transition-all duration-200 ease-out ${className}`}
        >
            {children}
        </motion.div>
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

const TimelineNav = ({ items, activeIndex, onSelect }) => {
    return (
        <div className="fixed top-1/2 right-4 md:right-8 transform -translate-y-1/2 z-40 hidden md:flex flex-col gap-6 items-end">
            <div className="absolute top-0 bottom-0 right-[5px] w-px bg-white/10 -z-10" />
            {items.map((item, idx) => (
                <button
                    key={idx}
                    onClick={() => onSelect(idx)}
                    className="group relative flex items-center justify-end"
                >
                    <span
                        className={`mr-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 transform ${activeIndex === idx
                            ? 'text-rose-400 opacity-100 translate-x-0'
                            : 'text-white/30 opacity-0 group-hover:opacity-100 translate-x-2'
                            }`}
                    >
                        {item.label}
                    </span>
                    <div
                        className={`w-3 h-3 rounded-full transition-all duration-500 border border-white/20 relative z-10 ${activeIndex === idx
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
    <div className="relative w-full h-[500px] md:h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 group">
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
    <div className="relative w-full h-full p-4 flex flex-col justify-center min-h-[700px]">
        <div className="text-center mb-8">
            <div className="inline-block bg-rose-500/20 text-rose-300 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest border border-rose-500/30">
                {chapter.label}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">{chapter.title}</h2>
        </div>

        <div className="grid grid-cols-6 grid-rows-6 gap-3 h-[600px] w-full max-w-5xl mx-auto">
            {/* Main Feature */}
            <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} className="col-span-4 row-span-4 rounded-[2rem] overflow-hidden relative shadow-lg border border-white/10">
                <img src={chapter.images[0]} alt="" className="w-full h-full object-cover" />
            </motion.div>

            {/* Smaller Shots */}
            <motion.div initial={{ y: -20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="col-span-2 row-span-2 rounded-[1.5rem] overflow-hidden border border-white/10">
                <img src={chapter.images[1]} alt="" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div initial={{ x: 20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="col-span-2 row-span-2 rounded-[1.5rem] overflow-hidden border border-white/10">
                <img src={chapter.images[2]} alt="" className="w-full h-full object-cover" />
            </motion.div>

            {/* Bottom Row */}
            <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="col-span-3 row-span-2 rounded-[1.5rem] overflow-hidden border border-white/10">
                <img src={chapter.images[3]} alt="" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="col-span-3 row-span-2 rounded-[1.5rem] overflow-hidden border border-white/10">
                <img src={chapter.images[4]} alt="" className="w-full h-full object-cover" />
            </motion.div>
        </div>
    </div>
);

const Tier3Template1 = ({
    customMessage,
    customSignOff,
    targetName = 'คนดี',
    pinCode = '1234',
    images = [],
    musicUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
}) => {
    const [viewState, setViewState] = useState('LOCKED');
    const [pin, setPin] = useState("");
    const [activeSection, setActiveSection] = useState(0);
    const [canSendLove, setCanSendLove] = useState(true);
    const sectionRefs = useRef([]);

    useEffect(() => {
        if (pin === pinCode) setTimeout(() => setViewState('MAIN'), 500);
        else if (pin.length === 4) setPin("");
    }, [pin, pinCode]);

    const handleKeyPress = (n) => { if (pin.length < 4) setPin(prev => prev + n); };



    const getImages = (count, startIndex = 0) => {
        const placeholders = [
            'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800',
            'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800',
            'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800',
            'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800',
            'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800'
        ];
        return Array(count).fill(0).map((_, i) => images[startIndex + i] || placeholders[i % placeholders.length]);
    };

    const listItems = [
        { type: 'single', label: "Day 1", title: "The Beginning", desc: "จุดเริ่มต้นของการเดินทาง", images: getImages(1, 0) },
        { type: 'single', label: "Day 30", title: "First Month", desc: "ความทรงจำที่งดงามในเดือนแรก", images: getImages(1, 1) },
        { type: 'single', label: "Day 60", title: "Growing Closer", desc: "ยิ่งนานยิ่งผูกพัน", images: getImages(1, 2) },
        { type: 'collage', label: "Memories", title: "Our Collection", desc: "ทุกช่วงเวลาพิเศษของเรา", images: getImages(5, 3) },
        { type: 'finale', label: "Forever", title: "To Infinity", desc: "", images: getImages(2, 8) },
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
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1a103c_0%,_#050510_100%)] opacity-80" />
            <Starfield speed={0.5} />
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none mix-blend-overlay" />
            {viewState !== 'LOCKED' && musicUrl && <MusicPlayer musicUrl={musicUrl} />}

            <AnimatePresence mode="wait">
                {viewState === 'LOCKED' && (
                    <motion.div key="locked" exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }} transition={{ duration: 1 }} className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
                        <TiltCard className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl max-w-sm w-full">
                            <div className="text-center">
                                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-tr from-rose-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30">
                                    <Heart className="w-8 h-8 text-white fill-white" />
                                </div>
                                <h1 className="text-2xl font-light mb-2 text-white/90">Welcome Home</h1>
                                <p className="text-sm text-white/50 mb-8">Enter the cosmic code</p>
                                <div className="flex justify-center gap-4 mb-8">
                                    {[0, 1, 2, 3].map(i => <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${i < pin.length ? 'bg-rose-400 scale-125 shadow-[0_0_10px_rgba(251,113,133,0.8)]' : 'bg-white/20'}`} />)}
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => (
                                        <button key={n} onClick={() => handleKeyPress(n.toString())} className={`w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-lg font-medium border border-white/5 hover:border-white/20 ${n === 0 ? 'col-start-2' : ''}`}>
                                            {n}
                                        </button>
                                    ))}
                                    <button onClick={() => setPin(p => p.slice(0, -1))} className="w-14 h-14 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors col-start-3"><ChevronRight className="rotate-180" /></button>
                                </div>
                            </div>
                        </TiltCard>
                    </motion.div>
                )}

                {viewState === 'MAIN' && (
                    <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="relative z-10 w-full min-h-screen py-20 px-4 md:px-8">

                        <TimelineNav items={listItems} activeIndex={activeSection} onSelect={scrollToSection} />

                        <div className="max-w-4xl mx-auto flex flex-col gap-32 pb-32">
                            {listItems.map((item, index) => (
                                <motion.div
                                    key={index}
                                    ref={el => sectionRefs.current[index] = el}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-20%" }}
                                    onViewportEnter={() => setActiveSection(index)}
                                    transition={{ duration: 0.8 }}
                                >
                                    {item.type === 'single' && <SingleLayout chapter={item} />}
                                    {item.type === 'collage' && <CollageLayout chapter={item} />}
                                    {item.type === 'finale' && <DualLayout chapter={item} customMessage={customMessage} customSignOff={customSignOff} onConfetti={triggerSupernova} canSendLove={canSendLove} />}
                                </motion.div>
                            ))}

                            <div className="text-center text-white/30 text-sm mt-10">
                                End of your story... for now.
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Tier3Template1;

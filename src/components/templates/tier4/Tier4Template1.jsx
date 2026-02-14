import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useTransform, useMotionValue } from 'framer-motion';
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

// --- Layout Sub-Components ---

const SingleLayout = ({ chapter }) => (
    <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 group">
        <img src={chapter.images[0]} alt="" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[20s] ease-linear" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent opacity-90" />
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
            <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl md:text-5xl font-bold mb-4 text-white leading-tight">{chapter.title}</motion.h2>
            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-white/70 text-lg md:text-xl max-w-xl leading-relaxed">{chapter.desc}</motion.p>
        </div>
    </div>
);

const DualLayout = ({ chapter }) => (
    <div className="relative w-full h-full p-6 flex items-center justify-center">
        <div className="relative w-full h-full max-w-4xl">
            {/* Photo 1: Large Left */}
            <motion.div
                initial={{ x: -50, opacity: 0, rotate: -5 }}
                animate={{ x: 0, opacity: 1, rotate: -3 }}
                className="absolute top-0 left-0 w-[60%] h-[70%] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10 z-10"
            >
                <img src={chapter.images[0]} alt="" className="w-full h-full object-cover" />
            </motion.div>

            {/* Photo 2: Large Right */}
            <motion.div
                initial={{ x: 50, opacity: 0, rotate: 5 }}
                animate={{ x: 0, opacity: 1, rotate: 3 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-10 right-0 w-[55%] h-[65%] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10 z-20"
            >
                <img src={chapter.images[1]} alt="" className="w-full h-full object-cover" />
            </motion.div>

            {/* Text Overlay */}
            <div className="absolute bottom-0 left-0 p-8 z-30 max-w-md bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 m-4">
                <h2 className="text-2xl font-bold text-white mb-2">{chapter.title}</h2>
                <p className="text-white/80">{chapter.desc}</p>
            </div>
        </div>
    </div>
);

const CollageLayout = ({ chapter }) => (
    <div className="relative w-full h-full p-4 flex flex-col justify-center">
        <div className="grid grid-cols-2 md:grid-cols-6 grid-rows-4 md:grid-rows-6 gap-2 md:gap-3 h-[500px] md:h-full md:max-h-[700px] w-full max-w-4xl mx-auto">
            {/* Main Feature */}
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="col-span-2 row-span-2 md:col-span-4 md:row-span-4 rounded-2xl md:rounded-[2rem] overflow-hidden relative shadow-lg border border-white/10">
                <img src={chapter.images[0]} alt="" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <h2 className="text-2xl font-bold text-white">{chapter.title}</h2>
                </div>
            </motion.div>

            {/* Smaller Shots */}
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="col-span-1 md:col-span-2 row-span-1 md:row-span-2 rounded-xl md:rounded-[1.5rem] overflow-hidden border border-white/10">
                <img src={chapter.images[1]} alt="" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="col-span-1 md:col-span-2 row-span-1 md:row-span-2 rounded-xl md:rounded-[1.5rem] overflow-hidden border border-white/10">
                <img src={chapter.images[2]} alt="" className="w-full h-full object-cover" />
            </motion.div>

            {/* Bottom Row */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="col-span-1 md:col-span-3 row-span-1 md:row-span-2 rounded-xl md:rounded-[1.5rem] overflow-hidden border border-white/10">
                <img src={chapter.images[3]} alt="" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="col-span-1 md:col-span-3 row-span-1 md:row-span-2 rounded-xl md:rounded-[1.5rem] overflow-hidden border border-white/10">
                <img src={chapter.images[4]} alt="" className="w-full h-full object-cover" />
            </motion.div>
        </div>
    </div>
);

const CollageMessageLayout = ({ chapter, customMessage, customSignOff, onConfetti }) => (
    <div className="relative w-full h-full flex flex-col justify-center items-center p-4">
        {/* Background Collage Layer */}
        <div className="absolute inset-0 z-0 opacity-40 hidden md:block">
            <img src={chapter.images[0]} className="absolute top-[10%] left-[5%] w-32 h-40 object-cover rounded-xl rotate-[-12deg]" />
            <img src={chapter.images[1]} className="absolute top-[15%] right-[8%] w-40 h-32 object-cover rounded-xl rotate-[12deg]" />
            <img src={chapter.images[2]} className="absolute bottom-[20%] left-[10%] w-36 h-36 object-cover rounded-xl rotate-[-6deg]" />
            <img src={chapter.images[3]} className="absolute bottom-[10%] right-[15%] w-32 h-40 object-cover rounded-xl rotate-[8deg]" />
            <img src={chapter.images[4]} className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-64 h-64 object-cover rounded-full blur-sm" />
        </div>

        <div className="relative z-10 max-w-2xl w-full bg-black/40 backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-2xl md:rounded-[3rem] text-center shadow-2xl">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-tr from-rose-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30">
                <Heart className="w-8 h-8 text-white fill-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">{chapter.title}</h2>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light italic mb-8">
                "{customMessage || "ทุกเรื่องราวของเรา คือความทรงจำที่ฉันอยากเก็บรักษาไว้ตลอดไป"}"
            </p>
            <div className="flex flex-col items-center gap-2 mb-8">
                <div className="w-12 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent" />
                <span className="text-lg font-medium text-rose-300">{customSignOff || "รักเสมอนะ"}</span>
            </div>
            <button
                onClick={onConfetti}
                className="px-8 py-4 bg-gradient-to-r from-rose-600 to-indigo-600 rounded-full text-white font-bold tracking-wide shadow-lg shadow-rose-900/50 hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
            >
                <Sparkles size={20} />
                Send My Love
            </button>
        </div>
    </div>
);

const Tier4Template1 = ({
    customMessage,
    customSignOff,
    targetName = 'คนดี',
    pinCode = '1234',
    images = [],
    musicUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
}) => {
    const [viewState, setViewState] = useState('LOCKED');
    const [pin, setPin] = useState("");
    const [activeChapter, setActiveChapter] = useState(0);

    useEffect(() => {
        if (pin === pinCode) setTimeout(() => setViewState('MAIN'), 500);
        else if (pin.length === 4) setPin("");
    }, [pin, pinCode]);

    const handleKeyPress = (n) => { if (pin.length < 4) setPin(prev => prev + n); };



    // Data Mockup Logic (Fill images if missing)
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

    const chapters = [
        // 1-6 Single Photo
        { type: 'single', title: "Day 1: จุดเริ่มต้น", desc: "วันแรกที่โลกเหวี่ยงเรามาเจอกัน", images: getImages(1, 0) },
        { type: 'single', title: "Day 30: รอยยิ้มแรก", desc: "จำรอยยิ้มวันนั้นได้ไหม ยังชัดเจนเสมอ", images: getImages(1, 1) },
        { type: 'single', title: "Day 60: การเดินทาง", desc: "ทุกก้าวที่เราเดินไปด้วยกันช่างมีความหมาย", images: getImages(1, 2) },
        { type: 'single', title: "First Trip", desc: "ทะเลที่เราไปนั่งดูพระอาทิตย์ตกด้วยกัน", images: getImages(1, 3) },
        { type: 'single', title: "Surprise!", desc: "ของขวัญชิ้นแรกที่เธอให้ ฉันเก็บไว้อย่างดี", images: getImages(1, 4) },
        { type: 'single', title: "Growing Together", desc: "ขอบคุณที่คอยเป็นกำลังใจให้กันเสมอมา", images: getImages(1, 5) },
        // 7-8 Dual Photo
        { type: 'dual', title: "Our Favorites", desc: "ร้านโปรด หนังเรื่องโปรด เพลงของเรา", images: getImages(2, 6) },
        { type: 'dual', title: "Silly Moments", desc: "ช่วงเวลาติ๊งต๊องที่เราหัวเราะจนท้องแข็ง", images: getImages(2, 8) },
        // 9-10 Collage (5 photos)
        { type: 'collage', title: "Collection of Memories", desc: "รวมภาพความประทับใจที่ไม่มีวันลืม", images: getImages(5, 10) },
        { type: 'finale', title: "To Infinity & Beyond", desc: "", images: getImages(5, 15) },
    ];

    const nextChapter = () => { if (activeChapter < chapters.length - 1) setActiveChapter(c => c + 1); };
    const prevChapter = () => { if (activeChapter > 0) setActiveChapter(c => c - 1); };

    const triggerSupernova = () => {
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
        <div className="relative min-h-screen w-full bg-[#050510] text-white overflow-hidden font-sans selection:bg-rose-500/30">
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

                {viewState === 'INTRO' && (
                    <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black">
                        <div className="relative z-10 text-center">
                            <motion.h2 initial={{ scale: 0.5, opacity: 0, letterSpacing: "10px" }} animate={{ scale: 1, opacity: 1, letterSpacing: "2px" }} transition={{ duration: 2, ease: "easeOut" }} className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-rose-200 via-white to-indigo-200 bg-clip-text text-transparent">For {targetName}</motion.h2>
                        </div>
                    </motion.div>
                )}

                {viewState === 'MAIN' && (
                    <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="relative z-10 w-full min-h-screen flex items-center justify-center p-4 md:p-8">
                        <div className="w-full max-w-6xl mx-auto min-h-[85vh] flex flex-col md:flex-row gap-4 md:gap-8 items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeChapter}
                                    initial={{ opacity: 0, x: 50, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: -50, scale: 0.95 }}
                                    transition={{ duration: 0.6, ease: "circOut" }}
                                    className="relative w-full h-[60vh] md:h-full md:w-3/4 rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 bg-black/20 backdrop-blur-sm"
                                >
                                    {chapters[activeChapter].type === 'single' && <SingleLayout chapter={chapters[activeChapter]} />}
                                    {chapters[activeChapter].type === 'dual' && <DualLayout chapter={chapters[activeChapter]} />}
                                    {chapters[activeChapter].type === 'collage' && <CollageLayout chapter={chapters[activeChapter]} />}
                                    {chapters[activeChapter].type === 'finale' && <CollageMessageLayout chapter={chapters[activeChapter]} customMessage={customMessage} customSignOff={customSignOff} onConfetti={triggerSupernova} />}

                                    {/* Progress Indicator inside card */}
                                    <div className="absolute top-4 right-4 md:top-6 md:right-6 z-40 bg-black/40 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 text-[10px] md:text-xs font-bold text-white/60 uppercase tracking-widest">
                                        Chapter {activeChapter + 1} / {chapters.length}
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation */}
                            <div className="w-full md:w-1/4 flex flex-col h-full justify-center gap-4">
                                <div className="bg-white/5 p-4 md:p-6 rounded-2xl border border-white/10 backdrop-blur-md hidden md:block">
                                    <h3 className="text-white/40 text-xs font-bold uppercase tracking-wider mb-4">You are viewing</h3>
                                    <p className="text-xl font-bold text-white mb-2">{chapters[activeChapter].title}</p>
                                    <div className="h-1 w-full bg-white/10 rounded-full mt-4 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${((activeChapter + 1) / chapters.length) * 100}%` }}
                                            className="h-full bg-rose-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={prevChapter}
                                        disabled={activeChapter === 0}
                                        className="flex-1 py-6 rounded-[1.5rem] bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 transition-all text-white flex items-center justify-center group"
                                    >
                                        <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                                    </button>
                                    <button
                                        onClick={nextChapter}
                                        disabled={activeChapter === chapters.length - 1}
                                        className="flex-[2] py-6 rounded-[1.5rem] bg-gradient-to-r from-rose-600 to-indigo-600 hover:scale-[1.02] shadow-lg shadow-rose-900/30 disabled:opacity-30 transition-all text-white font-bold flex items-center justify-center gap-2 group"
                                    >
                                        Next
                                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Tier4Template1;

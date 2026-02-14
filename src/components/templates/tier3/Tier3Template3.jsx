import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Heart, Sparkles, Clock, MapPin, Calendar, Play, Pause, Volume2, VolumeX, Music, Sun, Crown, Gift, Users } from 'lucide-react';

// --- Background Effects ---
const RoseDust = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        x: Math.random() * 100 + '%',
                        y: Math.random() * 100 + '%',
                        opacity: 0,
                        scale: 0
                    }}
                    animate={{
                        y: [null, Math.random() * 100 + '%'],
                        opacity: [0, 0.6, 0],
                        scale: [0, 1.5, 0]
                    }}
                    transition={{
                        duration: 8 + Math.random() * 10,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "easeInOut"
                    }}
                    className="absolute w-1 h-1 bg-rose-300 rounded-full blur-[1px]"
                />
            ))}
        </div>
    );
};

// --- Timeline Components ---
const TimelineEvent = ({ time, title, desc, icon: Icon, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: index * 0.2 }}
            className="relative flex gap-4 md:gap-10 mb-6 md:mb-12 last:mb-0 group"
        >
            {/* Time Column */}
            <div className="flex flex-col items-end w-20 md:w-32 pt-2 flex-shrink-0 text-right">
                <span className="text-lg md:text-2xl font-bold text-rose-500 font-serif">{time}</span>
                <span className="text-[10px] md:text-xs text-rose-800/60 uppercase tracking-widest mt-1">Time</span>
            </div>

            {/* Timeline Line & Dot */}
            <div className="relative flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-rose-400 border-4 border-white shadow-lg z-10 group-hover:scale-125 transition-transform duration-300 ring-2 ring-rose-100" />
                <div className="w-0.5 flex-1 bg-gradient-to-b from-rose-200 to-transparent my-2" />
            </div>

            {/* Content Card */}
            <div className="flex-1 pb-8">
                <div className="bg-white/70 backdrop-blur-md p-6 rounded-[2rem] border border-white shadow-lg group-hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-rose-100 hover:bg-white/90">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-rose-100 rounded-full text-rose-500">
                            <Icon size={18} />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-slate-800 font-serif">{title}</h3>
                    </div>
                    <p className="text-slate-500 font-light leading-relaxed text-sm md:text-base">{desc}</p>
                </div>
            </div>
        </motion.div>
    );
};

// --- Music Player ---
const MusicPlayer = ({ musicUrl }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.pause();
            else audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-6 right-6 z-50"
        >
            <audio ref={audioRef} src={musicUrl} loop />
            <button
                onClick={togglePlay}
                className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border border-rose-200 shadow-xl transition-all duration-300 ${isPlaying ? 'bg-rose-500 text-white animate-spin-slow' : 'bg-white/80 text-rose-400'}`}
            >
                {isPlaying ? <Pause size={20} /> : <Music size={20} />}
            </button>
        </motion.div>
    );
};

// --- Main Component ---
const Tier3Template3 = ({
    customMessage,
    customSignOff,
    targetName = 'แขกผู้มีเกียรติ',
    images = [],
    musicUrl = ''
}) => {
    // Default Schedule (Wedding Day)
    const schedule = [
        { time: "07:09", title: "แห่ขันหมาก", desc: "ขบวนแห่ขันหมากและพิธีเจรจาสู่ขอ", icon: Users },
        { time: "08:09", title: "พิธีหมั้น", desc: "พิธีสวมแหวนหมั้นตามประเพณีไทย", icon: Crown },
        { time: "09:09", title: "รดน้ำสังข์", desc: "พิธีหลั่งน้ำพระพุทธมนต์และประสาทพร", icon: Gift },
        { time: "11:00", title: "ฉลองมงคลสมรส", desc: "ร่วมรับประทานอาหารโต๊ะจีนและถ่ายรูปหน้างาน", icon: Heart },
        { time: "12:00", title: "ส่งตัวเข้าหอ", desc: "พิธีส่งตัวบ่าวสาวเข้าห้องหอ", icon: Sun }
    ];

    return (
        <div className="min-h-screen w-full bg-[#fff0f3] relative overflow-hidden font-sans text-slate-700">
            {/* Background Layers */}
            <div className="fixed inset-0 bg-gradient-to-tr from-rose-50 via-white to-pink-50 z-0" />
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-white/80 to-transparent z-10" />
            <RoseDust />

            <div className="relative z-20 container mx-auto px-4 py-12 md:py-20 max-w-3xl">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8 md:mb-16"
                >
                    <div className="inline-block p-4 rounded-full bg-rose-100/50 mb-6 text-rose-500 shadow-inner">
                        <Heart size={40} fill="currentColor" className="opacity-80" />
                    </div>
                    <div className="text-sm font-bold tracking-[0.3em] uppercase text-rose-400 mb-2">The Wedding Day</div>
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-4 leading-tight font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-600">
                        Our Schedule
                    </h1>

                    {/* Main Image (if available) */}
                    {images.length > 0 && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-10 rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white aspect-video relative group max-w-2xl mx-auto"
                        >
                            <img src={images[0]} alt="Couple" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-rose-900/60 via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-6 left-8 text-white text-left">
                                <p className="text-sm font-light opacity-90 tracking-wider uppercase mb-1">Location</p>
                                <h3 className="text-2xl font-bold font-serif">{customSignOff || "Grand Ballroom"}</h3>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Timeline Section */}
                <div className="relative px-2 md:px-0">
                    {/* Vertical Line Background */}
                    <div className="absolute left-[5.5rem] md:left-[8.5rem] top-4 bottom-0 w-px bg-rose-200 z-0" />

                    {schedule.map((event, index) => (
                        <TimelineEvent
                            key={index}
                            index={index}
                            {...event}
                        />
                    ))}
                </div>

                {/* Footer Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-10 md:mt-20 p-6 md:p-10 bg-white/60 backdrop-blur-xl rounded-2xl md:rounded-[3rem] border border-white shadow-xl max-w-xl mx-auto"
                >
                    <div className="mb-6 flex justify-center">
                        <Sparkles className="text-rose-400 animate-pulse" />
                    </div>
                    <p className="text-xl md:text-2xl italic text-slate-600 font-serif font-light mb-6 leading-relaxed">
                        "{customMessage || "We are so excited to celebrate this special day with you."}"
                    </p>
                    <div className="text-sm font-bold tracking-widest uppercase text-rose-400">
                        {customSignOff || "With Love"}
                    </div>
                </motion.div>

                <div className="text-center text-rose-300/60 text-xs mt-12 pb-8">
                    Made with Love by Nora.dev
                </div>
            </div>

            {musicUrl && <MusicPlayer musicUrl={musicUrl} />}
        </div>
    );
};

export default Tier3Template3;

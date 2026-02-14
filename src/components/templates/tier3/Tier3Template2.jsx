import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Flower, Sparkles, Clock, MapPin, Calendar, Play, Pause, Volume2, VolumeX, Music, Sun } from 'lucide-react';

// --- Background Effects ---
const GoldenDust = () => {
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
                        opacity: [0, 0.8, 0],
                        scale: [0, 1.5, 0]
                    }}
                    transition={{
                        duration: 5 + Math.random() * 10,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "easeInOut"
                    }}
                    className="absolute w-1 h-1 bg-amber-200 rounded-full blur-[1px]"
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
            className="relative flex gap-6 md:gap-10 mb-6 md:mb-12 last:mb-0 group"
        >
            {/* Time Column */}
            <div className="flex flex-col items-end w-24 md:w-32 pt-2 flex-shrink-0">
                <span className="text-xl md:text-2xl font-bold text-amber-600 font-serif">{time}</span>
                <span className="text-xs text-amber-800/60 uppercase tracking-widest mt-1">Time</span>
            </div>

            {/* Timeline Line & Dot */}
            <div className="relative flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-amber-400 border-4 border-white shadow-lg z-10 group-hover:scale-125 transition-transform duration-300" />
                <div className="w-0.5 flex-1 bg-gradient-to-b from-amber-200 to-transparent my-2" />
            </div>

            {/* Content Card */}
            <div className="flex-1 pb-8">
                <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-lg group-hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:bg-white/80">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                            <Icon size={18} />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-800">{title}</h3>
                    </div>
                    <p className="text-gray-600 font-light leading-relaxed">{desc}</p>
                </div>
            </div>
        </motion.div>
    );
};

// --- Music Player ---
const MusicPlayer = ({ musicUrl }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

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
                className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border border-amber-200 shadow-xl transition-all duration-300 ${isPlaying ? 'bg-amber-500 text-white animate-spin-slow' : 'bg-white/80 text-amber-600'}`}
            >
                {isPlaying ? <Pause size={20} /> : <Music size={20} />}
            </button>
        </motion.div>
    );
};

// --- Main Component ---
const Tier3Template2 = ({
    customMessage,
    customSignOff,
    targetName = 'ผู้บวช',
    images = [],
    musicUrl = ''
}) => {
    // Default Schedule (Sacred Timeline)
    const schedule = [
        { time: "07:30", title: "พิธีปลงผมนาค", desc: "ขอเชิญญาติมิตรและผู้มีจิตศรัทธาร่วมพิธีปลงผมนาค ณ ลานพิธี", icon: UserCheck },
        { time: "09:00", title: "ทำขวัญนาค", desc: "พิธีทำขวัญนาคเพื่อความเป็นสิริมงคล", icon: Sparkles },
        { time: "10:30", title: "แห่นาคเข้าโบสถ์", desc: "เคลื่อนขบวนแห่นาคเวียนรอบอุโบสถ 3 รอบ", icon: Calendar },
        { time: "11:00", title: "พิธีอุปสมบท", desc: "นาคเข้าสู่ร่มกาสาวพัสตร์ เป็นพระภิกษุสงฆ์", icon: Sun },
        { time: "12:00", title: "ฉลองพระใหม่", desc: "ร่วมถวายภัตตาหารเพลและรับประทานอาหารร่วมกัน", icon: Flower }
    ];

    // Helper icon mapping if needed, used generic ones above
    // Let's define the UserCheck since used it
    function UserCheck(props) {
        return (
            <svg
                {...props}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <polyline points="16 11 18 13 22 9" />
            </svg>
        )
    }

    return (
        <div className="min-h-screen w-full bg-[#FCF8F3] relative overflow-hidden font-serif text-[#5D4037]">
            {/* Background Layers */}
            <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-[#FFF8E1] to-orange-50 z-0" />
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white/80 to-transparent z-10" />
            <GoldenDust />

            <div className="relative z-20 container mx-auto px-4 py-12 md:py-20 max-w-2xl">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8 md:mb-16"
                >
                    <div className="inline-block p-3 rounded-full bg-amber-100/50 mb-4 text-amber-600">
                        <Sun size={32} />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-amber-800 mb-4 leading-tight">
                        กำหนดการ<br />พิธีอุปสมบท
                    </h1>
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="h-px w-12 bg-amber-300" />
                        <span className="text-amber-600/80 uppercase tracking-widest text-sm font-medium">Sacred Timeline</span>
                        <div className="h-px w-12 bg-amber-300" />
                    </div>

                    {/* Main Image (if available) */}
                    {images.length > 0 && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-video relative group"
                        >
                            <img src={images[0]} alt="Venue" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                            <div className="absolute bottom-4 left-4 text-white text-left">
                                <p className="text-sm font-light opacity-90">สถานที่จัดงาน</p>
                                <h3 className="text-xl font-bold">{customSignOff || "วัด..."}</h3>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Timeline Section */}
                <div className="relative">
                    {/* Vertical Line Background */}
                    <div className="absolute left-[5.5rem] md:left-[7.5rem] top-4 bottom-0 w-px bg-amber-200 z-0" />

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
                    className="text-center mt-10 md:mt-20 p-6 md:p-8 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/60"
                >
                    <p className="text-xl italic text-amber-800 font-light mb-4">
                        "{customMessage || "ขอเชิญร่วมอนุโมทนาบุญ ในงานพิธีอุปสมบทครั้งนี้"}"
                    </p>
                    <div className="flex justify-center text-amber-400 gap-2">
                        <Flower size={20} />
                        <Flower size={20} />
                        <Flower size={20} />
                    </div>
                </motion.div>

                <div className="text-center text-amber-800/30 text-xs mt-12 pb-8">
                    Made with 🙏 by Nora.dev
                </div>
            </div>

            {musicUrl && <MusicPlayer musicUrl={musicUrl} />}
        </div>
    );
};

export default Tier3Template2;

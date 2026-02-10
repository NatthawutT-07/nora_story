import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Gem, Sparkles, Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX, Music, Stars } from 'lucide-react';

// Floating Petals/Hearts Component
const FloatingPetals = ({ intensity = 1 }) => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(Math.floor(25 * intensity))].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        x: Math.random() * 100 + '%',
                        y: '-10%',
                        opacity: 0,
                        rotate: Math.random() * 360,
                        rotateX: Math.random() * 360
                    }}
                    animate={{
                        y: '110%',
                        x: `${Math.random() * 100}%`,
                        opacity: [0, 0.6, 0.6, 0],
                        rotate: Math.random() * 720,
                        rotateX: Math.random() * 720
                    }}
                    transition={{
                        duration: 15 + Math.random() * 10,
                        repeat: Infinity,
                        delay: Math.random() * 10,
                        ease: 'linear'
                    }}
                    className="absolute"
                    style={{
                        color: ['#fda4af', '#f43f5e', '#ffffff'][Math.floor(Math.random() * 3)],
                    }}
                >
                    {i % 2 === 0 ? <Heart size={10 + Math.random() * 15} fill="currentColor" /> : <div className="w-3 h-3 rounded-full bg-current opacity-60 filter blur-[1px]" />}
                </motion.div>
            ))}
        </div>
    );
};

// Shimmer Effect
const ShimmerEffect = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
                animate={{
                    opacity: [0, 0.3, 0],
                    rotate: [0, 45, 90]
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-[100px]"
            />
            <motion.div
                animate={{
                    opacity: [0, 0.2, 0],
                    rotate: [0, -45, -90]
                }}
                transition={{ duration: 7, repeat: Infinity, delay: 2 }}
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-transparent via-rose-200/5 to-transparent blur-[80px]"
            />
        </div>
    );
};

// Animated Background - Premium Wedding (Pearl/Rose Gold)
const AnimatedBackground = ({ variant = 'default' }) => {
    const gradients = {
        default: 'from-slate-50 via-rose-50 to-indigo-50',
        question: 'from-rose-50 via-slate-50 to-purple-50',
        content: 'from-indigo-50 via-rose-50 to-slate-50'
    };

    return (
        <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${gradients[variant]}`}
            animate={{
                background: [
                    'linear-gradient(135deg, #f8fafc 0%, #fff1f2 50%, #f5f3ff 100%)',
                    'linear-gradient(135deg, #f5f3ff 0%, #f8fafc 50%, #fff1f2 100%)',
                    'linear-gradient(135deg, #fff1f2 0%, #f5f3ff 50%, #f8fafc 100%)',
                    'linear-gradient(135deg, #f8fafc 0%, #fff1f2 50%, #f5f3ff 100%)'
                ]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
    );
};

// Photo Gallery Component
const PhotoGallery = ({ images = [], onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const defaultImages = [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
        'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?w=800',
        'https://images.unsplash.com/photo-1520854221256-17451cc330e7?w=800',
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
            <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={displayImages[currentIndex]}
                        alt={`Photo ${currentIndex + 1}`}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.7 }}
                        className="w-full h-full object-cover"
                    />
                </AnimatePresence>

                {/* Navigation Arrows */}
                {displayImages.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/50 transition-all shadow-lg"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/50 transition-all shadow-lg"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnail Strip */}
            {displayImages.length > 1 && (
                <div className="flex gap-3 mt-6 justify-center overflow-x-auto pb-2 px-2">
                    {displayImages.map((img, idx) => (
                        <motion.button
                            key={idx}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentIndex(idx)}
                            className={`flex-shrink-0 w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all ${idx === currentIndex ? 'border-rose-400 shadow-xl shadow-rose-200' : 'border-white/50 grayscale opacity-70'
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
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl rounded-full px-4 py-2 border border-rose-100 shadow-xl">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 flex items-center justify-center text-white shadow-lg"
                >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </motion.button>

                <div className="flex items-center gap-2">
                    <Music size={14} className="text-rose-400" />
                    <span className="text-gray-600 text-sm font-medium">Wedding Song</span>
                </div>

                <button onClick={toggleMute} className="text-gray-400 hover:text-rose-500 transition-colors">
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
            </div>
        </motion.div>
    );
};

const Tier2Template3 = ({
    customMessage,
    customSignOff,
    targetName = 'แขกผู้มีเกียรติ',
    images = [],
    musicUrl = ''
}) => {
    // Default to CONTENT view immediately
    const [showMusicPlayer, setShowMusicPlayer] = useState(true);
    const [canSendCongrat, setCanSendCongrat] = useState(true);

    const triggerConfetti = () => {
        if (!canSendCongrat) return;

        setCanSendCongrat(false);
        setTimeout(() => setCanSendCongrat(true), 5000);

        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const colors = ['#f43f5e', '#ec4899', '#f9a8d4', '#e2e8f0', '#ffffff'];

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
                scalar: 1.2
            });
            confetti({
                particleCount,
                angle: 120,
                spread: 70,
                origin: { x: 1, y: 0.7 },
                colors,
                shapes: ['circle', 'square'],
                scalar: 1.2
            });
        }, 180);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 text-center text-slate-800 overflow-hidden relative font-sans">
            <AnimatePresence mode="wait">
                {/* CONTENT STATE - Premium Card with Photos & Music */}
                <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-30 flex flex-col items-center justify-start overflow-y-auto py-8 px-4"
                >
                    <AnimatedBackground variant="content" />
                    <FloatingPetals intensity={0.6} />
                    <ShimmerEffect />

                    <div className="relative z-10 w-full max-w-lg mt-8 mb-24">
                        {/* Photo Gallery */}
                        <PhotoGallery images={images} />

                        {/* Message Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] border border-white shadow-2xl overflow-hidden text-center"
                        >
                            {/* Decorative Ring */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-rose-100 rounded-full opacity-30 pointer-events-none" />

                            {/* Content */}
                            <div className="relative z-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4, type: "spring" }}
                                    className="flex justify-center mb-8"
                                >
                                    <Stars size={24} className="text-rose-300" />
                                </motion.div>

                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-xs tracking-[0.4em] uppercase text-slate-400 mb-6"
                                >
                                    Save The Date
                                </motion.p>

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-2xl md:text-3xl font-serif leading-relaxed text-slate-800 mb-8 font-light"
                                >
                                    "{customMessage || "ขอเรียนเชิญร่วมเป็นเกียรติในงานมงคลสมรสของเรา"}"
                                </motion.h1>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="w-20 h-px bg-slate-200 mx-auto mb-8"
                                />

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.9 }}
                                    className="text-lg font-serif italic text-slate-600 mb-10"
                                >
                                    {customSignOff || "เจ้าบ่าว & เจ้าสาว"}
                                </motion.p>

                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    onClick={triggerConfetti}
                                    disabled={!canSendCongrat}
                                    whileHover={canSendCongrat ? { scale: 1.05 } : {}}
                                    whileTap={canSendCongrat ? { scale: 0.95 } : {}}
                                    className={`text-xs text-slate-400 hover:text-rose-400 transition-colors duration-300 uppercase tracking-widest flex items-center justify-center gap-2 mx-auto ${!canSendCongrat ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                                >
                                    <Sparkles size={14} />
                                    {canSendCongrat ? "Send Congratulations" : "Thank you"}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Music Player */}
                    {showMusicPlayer && musicUrl && <MusicPlayer musicUrl={musicUrl} />}
                </motion.div>
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="fixed bottom-4 text-xs text-slate-300 z-10"
            >
                Made with Love
            </motion.div>
        </div>
    );
};

export default Tier2Template3;

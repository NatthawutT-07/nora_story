import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Play, Pause, Volume2, VolumeX, Music, Stars } from 'lucide-react';

// Floating Hearts Component
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
                    className="absolute text-rose-300/40"
                    style={{
                        zIndex: Math.floor(Math.random() * 10)
                    }}
                >
                    <Heart size={16 + Math.random() * 24} fill="currentColor" />
                </motion.div>
            ))}
        </div>
    );
};

// Gradient Background
const RomanticGradient = () => {
    return (
        <motion.div
            className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-50 to-white"
            animate={{
                background: [
                    'linear-gradient(135deg, #ffe4e6 0%, #fff1f2 50%, #fff 100%)',
                    'linear-gradient(135deg, #fff 0%, #ffe4e6 50%, #fff1f2 100%)',
                    'linear-gradient(135deg, #fff1f2 0%, #fff 50%, #ffe4e6 100%)',
                ]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
    );
};

// Love Gallery Component (Dynamic Grid)
const LoveGallery = ({ images = [] }) => {
    const displayImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1511285560982-1351cdeb9821?w=800'];
    const count = displayImages.length;

    const ImageCard = ({ src, className = "" }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, rotate: 0, zIndex: 10 }}
            className={`relative rounded-3xl overflow-hidden shadow-xl border-[6px] border-white bg-white ${className}`}
        >
            <img src={src} alt="Memory" className="w-full h-full object-cover" />
        </motion.div>
    );

    // Layout Logic
    const renderLayout = () => {
        if (count === 1) {
            return (
                <div className="w-full max-w-sm mx-auto p-4">
                    <ImageCard src={displayImages[0]} className="aspect-[3/4] rotate-2 shadow-2xl shadow-rose-200" />
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
                            <ImageCard src={displayImages[0]} className="aspect-square rotate-0 shadow-2xl shadow-rose-200" />
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
                    <ImageCard src={displayImages[0]} className="w-48 h-64 z-20 shadow-2xl shadow-rose-300 absolute border-8" />

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
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xl rounded-full px-4 py-2 border border-rose-200 shadow-xl">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 flex items-center justify-center text-white shadow-lg border border-pink-200"
                >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </motion.button>

                <div className="flex items-center gap-2">
                    <Music size={14} className="text-rose-400" />
                    <span className="text-gray-600 text-sm font-medium tracking-wide">Romantic Vibe</span>
                </div>

                <button onClick={toggleMute} className="text-rose-300 hover:text-rose-500 transition-colors">
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
            </div>
        </motion.div>
    );
};

const Tier2Template3 = ({
    customMessage,
    customSignOff,
    targetName = 'ผู้มีเกียรติ',
    images = [],
    musicUrl = ''
}) => {
    const [showMusicPlayer, setShowMusicPlayer] = useState(true);
    const [canSendLove, setCanSendLove] = useState(true);

    const triggerConfetti = () => {
        if (!canSendLove) return;

        setCanSendLove(false);
        setTimeout(() => setCanSendLove(true), 5000);

        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const colors = ['#f43f5e', '#fb7185', '#fce7f3', '#ffffff'];

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
                scalar: 1.2
            });
            confetti({
                particleCount,
                angle: 120,
                spread: 70,
                origin: { x: 1, y: 0.7 },
                colors,
                shapes: [heart, 'circle'],
                scalar: 1.2
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
                    <RomanticGradient />
                    <FloatingHearts intensity={0.6} />

                    <div className="relative z-10 w-full max-w-lg mt-4 mb-24">
                        {/* HEADER */}
                        <motion.h2
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-bold text-rose-400 mb-3 md:mb-6 font-serif italic"
                        >
                            Our Love Story
                        </motion.h2>

                        {/* Love Gallery (Dynamic) */}
                        <LoveGallery images={images} />

                        {/* Message Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-[2.5rem] border border-rose-100 shadow-xl overflow-hidden mt-4 md:mt-8"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-rose-100 to-transparent rounded-bl-full opacity-50" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-rose-100 to-transparent rounded-tr-full opacity-50" />

                            {/* Content */}
                            <div className="relative z-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4, type: "spring" }}
                                    className="flex justify-center mb-6 text-rose-400"
                                >
                                    <Stars size={28} fill="currentColor" className="opacity-50" />
                                </motion.div>

                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-xs tracking-[0.3em] uppercase text-slate-400 mb-6 font-medium"
                                >
                                    Wedding Invitation
                                </motion.p>

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-2xl md:text-3xl font-serif italic leading-relaxed text-slate-800 mb-8 font-light"
                                >
                                    "{customMessage || "Two souls, one heart. Join us as we begin our forever."}"
                                </motion.h1>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="flex items-center justify-center gap-3 text-rose-300"
                                >
                                    <div className="w-8 h-px bg-rose-200" />
                                    <span className="text-lg tracking-wide font-medium text-rose-500">{customSignOff || "Bride & Groom"}</span>
                                    <div className="w-8 h-px bg-rose-200" />
                                </motion.div>

                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    onClick={triggerConfetti}
                                    disabled={!canSendLove}
                                    whileHover={canSendLove ? { scale: 1.05 } : {}}
                                    whileTap={canSendLove ? { scale: 0.95 } : {}}
                                    className={`mt-6 md:mt-10 text-xs text-white hover:text-white transition-all duration-300 uppercase tracking-widest flex items-center gap-2 mx-auto bg-gradient-to-r from-rose-400 to-pink-500 px-8 py-3 rounded-full shadow-lg ${!canSendLove ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:shadow-rose-300/50 hover:shadow-xl'}`}
                                >
                                    <Heart size={14} fill={canSendLove ? "none" : "currentColor"} />
                                    {canSendLove ? "Send Love" : "Sent!"}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>

                    {showMusicPlayer && musicUrl && <MusicPlayer musicUrl={musicUrl} />}
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

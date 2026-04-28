import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, Delete, Music, Pause, Play } from 'lucide-react';

// 1. Floating Hearts Component
export const FloatingHearts = ({ colorTheme, intensity = 1 }) => {
    const c = colorTheme?.colors || {};
    const accentColor = c.accent || '#fda4af';
    
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(Math.floor(15 * intensity))].map((_, i) => (
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
                    style={{ color: `${accentColor}66` }}
                >
                    <Heart size={12 + Math.random() * 20} fill="currentColor" />
                </motion.div>
            ))}
        </div>
    );
};

// 2. Animated Background Component
export const AnimatedBackground = ({ gradientColors }) => {
    const g = gradientColors || ['#fdf2f8', '#fff1f2', '#fef3c7'];

    return (
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
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
    );
};

// 3. Sparkle Effect Component
export const SparkleEffect = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
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

// 4. Music Player Component
export const MusicPlayer = ({ musicUrl, themeColors, isModalPreview = false }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const wasPlayingRef = useRef(false);

    useEffect(() => {
        if (!audioRef.current || !musicUrl) return;
        audioRef.current.volume = 0.4;
        
        const tryPlay = () => {
            audioRef.current?.play()
                .then(() => {
                    setIsPlaying(true);
                    wasPlayingRef.current = true;
                })
                .catch(() => {
                    // Interaction required
                    const playOnClick = () => {
                        audioRef.current?.play().then(() => {
                            setIsPlaying(true);
                            wasPlayingRef.current = true;
                        });
                        document.removeEventListener('click', playOnClick);
                    };
                    document.addEventListener('click', playOnClick, { once: true });
                });
        };
        tryPlay();
    }, [musicUrl]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play().then(() => setIsPlaying(true));
            }
        }
    };

    if (!musicUrl) return null;

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

// 5. Demo Watermark
export const DemoWatermark = ({ isWhite = false }) => {
    const color = isWhite ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)';
    return (
        <div
            className="absolute inset-0 pointer-events-none z-[100]"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' transform='rotate(-30 150 150)' fill='${encodeURIComponent(color)}' font-family='sans-serif' font-size='22' font-weight='bold' letter-spacing='4'%3ENORA STORY DEMO%3C/text%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat'
            }}
        />
    );
};

// 6. Pin Entry UI Component
export const PinEntry = ({ 
    pinInput, 
    showError, 
    primaryColor, 
    accentColor, 
    onKeyPress, 
    onBackspace, 
    isDemo = false 
}) => {
    return (
        <motion.div
            animate={showError ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full max-w-sm px-8"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mb-6 flex justify-center"
            >
                <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center border" style={{ borderColor: `${primaryColor}33` }}>
                    <Heart size={36} style={{ color: primaryColor }} fill="currentColor" />
                </div>
            </motion.div>

            {isDemo && (
                <div className="mb-5 flex justify-center">
                    <span className="text-sm px-4 py-1.5 rounded-full font-sans tracking-wide" style={{ backgroundColor: `${primaryColor}33`, color: primaryColor }}>
                        รหัสผ่าน Demo: <span className="font-bold">1234</span>
                    </span>
                </div>
            )}

            <div className="flex justify-center gap-4 mb-10">
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            scale: i < pinInput.length ? 1.2 : 1,
                            backgroundColor: i < pinInput.length ? primaryColor : 'rgba(0,0,0,0.1)'
                        }}
                        className="w-4 h-4 rounded-full shadow-inner"
                    />
                ))}
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-[260px] mx-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'back'].map((item, idx) => {
                    if (item === '') return <div key={`empty-${idx}`} />;
                    if (item === 'back') {
                        return (
                            <button
                                key="back"
                                onClick={onBackspace}
                                className="w-16 h-16 rounded-2xl bg-white/40 backdrop-blur-sm flex items-center justify-center text-gray-400"
                            >
                                <Delete size={22} />
                            </button>
                        );
                    }
                    return (
                        <button
                            key={`num-${item}`}
                            onClick={() => onKeyPress(item.toString())}
                            className="w-16 h-16 rounded-2xl bg-white/90 backdrop-blur-sm border shadow-md text-xl font-medium text-gray-700 active:scale-95 transition-all"
                            style={{ borderColor: `${primaryColor}22` }}
                        >
                            {item}
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
};

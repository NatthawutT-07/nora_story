import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { usePinLock } from '../../../hooks/usePinLock';
import { useConfetti } from '../../../hooks/useConfetti';
import { 
    FloatingHearts, 
    AnimatedBackground, 
    DemoWatermark, 
    PinEntry,
    MusicPlayer,
    SparkleEffect
} from '../common/TemplateCommon';

// Floating Images Component (Specific to Tier 2)
const FloatingImages = ({ images = [] }) => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const desktopPositions = [
        { top: '25%', left: '20%', rotate: -8 },
        { top: '20%', right: '20%', rotate: 8 },
        { bottom: '20%', left: '15%', rotate: -5 },
        { bottom: '25%', right: '18%', rotate: 5 },
        { top: '45%', left: '10%', rotate: -12 }
    ];
    const mobilePositions = [
        { top: '10%', left: '0%', rotate: -12 },
        { top: '8%', right: '0%', rotate: 12 },
        { top: '15%', left: '50%', marginLeft: '-3.5rem', rotate: 5 },
        { bottom: '12%', left: '5%', rotate: -8 },
        { bottom: '10%', right: '5%', rotate: 8 },
    ];
    const positions = isMobile ? mobilePositions : desktopPositions;

    if (images.length === 0) return null;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {images.slice(0, 5).map((img, i) => (
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
                    className="absolute w-28 h-28 md:w-48 md:h-48 rounded-xl border-4 border-white/20 shadow-xl overflow-hidden aspect-square"
                    style={positions[i % positions.length]}
                >
                    <img loading="lazy" src={img} alt="" className="w-full h-full object-cover" />
                </motion.div>
            ))}
        </div>
    );
};

const Tier2Template1 = ({
    pin: pinProp,
    pinCode,
    targetName = "ถึง ที่รักของเค้า",
    customMessage,
    customSignOff,
    isDemo = false,
    images = [],
    musicUrl,
    colorTheme,
    isModalPreview = false
}) => {
    const c = colorTheme?.colors || {
        primary: '#f43f5e',
        gradient: ['#4c1d95', '#be185d', '#f43f5e'],
        accent: '#fda4af',
        confetti: ['#f43f5e', '#ec4899', '#f97316', '#fbbf24']
    };

    const themeColors = {
        primary: c.primary,
        accent: c.accent,
    };

    const CORRECT_PIN = pinProp || pinCode || (isDemo ? '1234' : null);
    
    const {
        viewState,
        pinInput,
        showError,
        handleKeyPress,
        handleBackspace,
        isLocked
    } = usePinLock(CORRECT_PIN);

    const { triggerConfetti, canTrigger: canSendLove } = useConfetti(c.confetti);

    return (
        <div className={`${isModalPreview ? 'absolute inset-0' : 'fixed inset-0'} w-full h-full text-white`}>
            {isDemo && <DemoWatermark isWhite={true} />}

            <AnimatePresence mode="wait">
                {isLocked ? (
                    <motion.div
                        key="lock-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center"
                    >
                        <AnimatedBackground gradientColors={c.gradient} />
                        <FloatingHearts intensity={0.8} colorTheme={colorTheme} />
                        <SparkleEffect />
                        
                        <PinEntry 
                            pinInput={pinInput}
                            showError={showError}
                            primaryColor={c.primary}
                            accentColor={c.accent}
                            onKeyPress={handleKeyPress}
                            onBackspace={handleBackspace}
                            isDemo={isDemo}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                        className="absolute inset-0 z-30 flex flex-col items-center justify-center overflow-hidden p-4"
                    >
                        <AnimatedBackground gradientColors={c.gradient} />
                        <FloatingHearts intensity={0.6} colorTheme={colorTheme} />
                        <SparkleEffect />
                        <FloatingImages images={images} />

                        <div className="relative z-10 w-full max-w-sm flex flex-col items-center justify-center px-4">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="relative bg-white/10 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/20 shadow-2xl overflow-hidden min-h-[350px] w-full flex flex-col justify-center text-center"
                            >
                                {/* Decorative Elements */}
                                <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-50" style={{ background: `linear-gradient(to bottom left, ${c.primary}33, transparent)` }} />
                                <div className="absolute bottom-0 left-0 w-20 h-20 rounded-tr-full opacity-50" style={{ background: `linear-gradient(to top right, ${c.accent}33, transparent)` }} />

                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    className="absolute top-0 left-0 w-full h-1"
                                    style={{ background: `linear-gradient(to right, transparent, ${c.primary}, transparent)` }}
                                />

                                <div className="relative z-10 w-full flex flex-col items-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.4, type: "spring" }}
                                        className="flex justify-center mb-4"
                                    >
                                        <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(to bottom right, ${c.primary}, ${c.accent})` }}>
                                            <Heart size={24} className="text-white" fill="currentColor" />
                                        </div>
                                    </motion.div>

                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-xs tracking-widest uppercase mb-4 font-medium break-keep"
                                        style={{ color: c.accent }}
                                    >
                                        ✨ {targetName || "For You"} ✨
                                    </motion.p>

                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className={`${(customMessage || "").length > 80 ? "text-base" : "text-xl"} font-serif italic leading-relaxed text-white mb-6 max-w-[95%] mx-auto break-keep`}
                                    >
                                        "{customMessage || "ทุกช่วงเวลาที่มีเธอ คือของขวัญที่ฉันไม่อยากสูญเสีย"}"
                                    </motion.h1>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.8 }}
                                        className="flex items-center justify-center gap-3 w-full"
                                        style={{ color: c.accent }}
                                    >
                                        <div className="w-6 h-px" style={{ background: `linear-gradient(to right, transparent, ${c.accent})` }} />
                                        <span className="text-xs tracking-wide font-medium break-keep">{customSignOff || "รักเธอเสมอ"}</span>
                                        <div className="w-6 h-px" style={{ background: `linear-gradient(to left, transparent, ${c.accent})` }} />
                                    </motion.div>

                                    <motion.button
                                        onClick={triggerConfetti}
                                        disabled={!canSendLove}
                                        className={`mt-6 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 border ${!canSendLove ? 'opacity-50 grayscale' : ''}`}
                                        style={{ backgroundColor: `${c.primary}33`, borderColor: c.primary, color: c.accent }}
                                    >
                                        <Sparkles size={18} />
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <MusicPlayer musicUrl={musicUrl} themeColors={themeColors} isModalPreview={isModalPreview} />

            {!isLocked && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className={`${isModalPreview ? 'absolute' : 'fixed'} bottom-4 text-xs text-white/30 z-10 flex items-center gap-1`}
                >
                    Made with ♥ by Nora Story
                </motion.div>
            )}
        </div>
    );
};

export default Tier2Template1;

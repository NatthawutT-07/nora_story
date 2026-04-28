import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { usePinLock } from '../../../hooks/usePinLock';
import { useConfetti } from '../../../hooks/useConfetti';
import { 
    FloatingHearts, 
    AnimatedBackground, 
    DemoWatermark, 
    PinEntry 
} from '../common/TemplateCommon';

const Tier1Template1 = ({ 
    customMessage, 
    customSignOff, 
    targetName = 'ถึง ที่รักของเค้า', 
    pin: pinProp, 
    pinCode, 
    isDemo = false, 
    isModalPreview = false, 
    colorTheme 
}) => {
    const c = colorTheme?.colors || {};
    const gradientColors = c.gradient || ['#fdf2f8', '#fff1f2', '#fef3c7'];
    const primaryColor = c.primary || '#f43f5e';
    const accentColor = c.accent || '#fda4af';
    
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
        <div className={`${isModalPreview ? 'absolute inset-0' : 'fixed inset-0'} w-full h-full flex flex-col items-center justify-center p-4 md:p-8 text-center font-serif text-gray-800`}>
            {isDemo && <DemoWatermark />}

            <AnimatePresence mode="wait">
                {isLocked ? (
                    <motion.div
                        key="lock-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center"
                    >
                        <AnimatedBackground gradientColors={gradientColors} />
                        <FloatingHearts colorTheme={colorTheme} />
                        <PinEntry 
                            pinInput={pinInput}
                            showError={showError}
                            primaryColor={primaryColor}
                            accentColor={accentColor}
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
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center px-4"
                    >
                        <AnimatedBackground gradientColors={gradientColors} />
                        <FloatingHearts colorTheme={colorTheme} />

                        {/* Card */}
                        <div className="relative z-10 w-full max-w-lg bg-white/90 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-2xl border overflow-hidden min-h-[400px]" style={{ borderColor: `${primaryColor}33` }}>
                            {/* Decorative corner */}
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-50" style={{ background: `linear-gradient(to bottom left, ${primaryColor}33, transparent)` }} />
                            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-tr-full opacity-50" style={{ background: `linear-gradient(to top right, ${accentColor}33, transparent)` }} />

                            {/* Top decorative line */}
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="absolute top-0 left-0 w-full h-1"
                                style={{ background: `linear-gradient(to right, transparent, ${primaryColor}, transparent)` }}
                            />

                            {/* Content */}
                            <div className="relative z-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3, type: "spring" }}
                                    className="flex justify-center mb-6"
                                >
                                    <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${accentColor})` }}>
                                        <Heart size={28} className="text-white" fill="currentColor" />
                                    </div>
                                </motion.div>

                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-sm tracking-[0.1em] uppercase mb-6 font-medium text-center break-keep"
                                    style={{ color: primaryColor }}
                                >
                                    ✨ {targetName || "For You"} ✨
                                </motion.p>

                                <div className="space-y-4">
                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className={`${(customMessage || "ทุกช่วงเวลาที่มีเธอ คือของขวัญที่เค้าไม่อยากสูญเสีย").length > 80
                                            ? "text-lg md:text-xl"
                                            : "text-2xl md:text-xl"
                                            } italic leading-relaxed text-gray-800 mb-8 max-w-[90%] mx-auto break-keep`}
                                    >
                                        "{customMessage || "ทุกช่วงเวลาที่มีเธอ คือของขวัญที่เค้าไม่อยากสูญเสีย"}"
                                    </motion.h1>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="flex items-center justify-center gap-2 text-gray-500"
                                >
                                    <div className="w-8 h-px bg-gray-300" />
                                    <span className="text-sm tracking-wide break-keep">{customSignOff || "รักเธอเสมอ"}</span>
                                    <div className="w-8 h-px bg-gray-300" />
                                </motion.div>

                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    onClick={triggerConfetti}
                                    disabled={!canSendLove}
                                    whileHover={canSendLove ? { scale: 1.05, color: accentColor } : {}}
                                    whileTap={canSendLove ? { scale: 0.95 } : {}}
                                    className={`mt-10 text-sm flex items-center gap-2 mx-auto px-6 py-3 rounded-full transition-all duration-300 uppercase tracking-widest ${!canSendLove ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                                    style={{ backgroundColor: `${primaryColor}1A`, color: primaryColor }}
                                >
                                    <Sparkles size={16} />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isLocked && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-4 text-xs text-gray-300"
                >
                    Made with ♥ by Nora Story
                </motion.div>
            )}
        </div>
    );
};

export default Tier1Template1;

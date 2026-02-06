import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Clock, Lock, Zap, Gift, Image } from 'lucide-react';

const CountdownDemo = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 23, minutes: 59, seconds: 45 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                return { ...prev, seconds: 59 };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#1A3C40] to-[#0F2A2E] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white text-center relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <Clock size={120} />
            </div>

            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-[#E8A08A]" />
            </div>

            <h3 className="text-lg sm:text-xl font-playfair mb-2 text-white">Countdown Timer</h3>
            <p className="text-white/60 text-sm mb-6">สร้างความตื่นเต้นด้วย Countdown</p>

            <div className="flex justify-center gap-2 sm:gap-3 my-6">
                {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="flex flex-col items-center">
                        <div className="w-12 h-14 sm:w-14 sm:h-16 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold font-mono">
                            {String(value).padStart(2, '0')}
                        </div>
                        <span className="text-[10px] sm:text-xs text-white/40 mt-1.5 uppercase tracking-wide">{unit.slice(0, 3)}</span>
                    </div>
                ))}
            </div>

            <p className="text-xs text-[#E8A08A]/80">"This memory will disappear..."</p>
        </motion.div>
    );
};

const UnlockDemo = () => {
    const [clicks, setClicks] = useState(0);
    const targetClicks = 5;
    const isUnlocked = clicks >= targetClicks;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-xl"
        >
            <div className="absolute top-0 right-0 p-4 opacity-5 text-[#E8A08A]">
                <Lock size={120} />
            </div>

            <div className="w-12 h-12 bg-[#E8A08A]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-[#E8A08A]" />
            </div>

            <h3 className="text-lg sm:text-xl font-playfair mb-2 text-[#1A3C40]">Secret Message</h3>
            <p className="text-gray-400 text-sm mb-6">ต้องทำภารกิจเพื่อปลดล็อค</p>

            <div className="h-32 sm:h-36 flex items-center justify-center relative">
                <AnimatePresence mode='wait'>
                    {!isUnlocked ? (
                        <motion.button
                            key="locked"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setClicks(prev => prev + 1)}
                            className="relative flex flex-col items-center"
                        >
                            <div className="relative">
                                <Heart
                                    size={60}
                                    className="text-[#E8A08A] fill-[#E8A08A]/20"
                                />
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-[#1A3C40]">
                                    {targetClicks - clicks}
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-3">แตะหัวใจ {targetClicks} ครั้ง!</p>
                        </motion.button>
                    ) : (
                        <motion.div
                            key="unlocked"
                            initial={{ scale: 0, opacity: 0, rotate: -10 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            className="bg-gradient-to-br from-[#E8A08A]/20 to-[#E8A08A]/5 p-5 rounded-2xl border border-[#E8A08A]/30"
                        >
                            <p className="text-[#1A3C40] font-playfair italic font-semibold text-lg">
                                "I Love You 💖"
                            </p>
                            <button
                                onClick={() => setClicks(0)}
                                className="text-xs text-gray-400 mt-3 hover:text-[#E8A08A] transition-colors"
                            >
                                เล่นอีกครั้ง
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
    >
        <div className="w-10 h-10 bg-[#E8A08A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-[#E8A08A]" />
        </div>
        <div>
            <h4 className="font-semibold text-[#1A3C40] mb-1">{title}</h4>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    </motion.div>
);

const InteractiveDemos = () => {
    return (
        <section className="py-16 sm:py-24 px-4 bg-gray-50" id="experience">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-4 shadow-sm"
                    >
                        <Zap className="w-4 h-4 text-[#E8A08A]" />
                        <span className="text-gray-600 text-sm font-medium">Special Features</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-playfair text-[#1A3C40] mb-4"
                    >
                        Interactive<span className="text-[#E8A08A] italic">Features</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 text-base sm:text-lg max-w-md mx-auto"
                    >
                        ลองเล่นกับ Demo ด้านล่าง
                    </motion.p>
                </div>

                {/* Interactive Demos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
                    <CountdownDemo />
                    <UnlockDemo />
                </div>

                {/* Feature List */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg">
                    <h3 className="text-xl font-playfair text-[#1A3C40] mb-6 text-center">More Features</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        <FeatureCard
                            icon={Image}
                            title="Photo Gallery"
                            description="อัปโหลดรูปคู่รักได้สูงสุด 30 รูป"
                            delay={0}
                        />
                        <FeatureCard
                            icon={Gift}
                            title="Custom Domain"
                            description="ใช้ชื่อแฟนเป็น URL ได้เลย"
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Animation Effects"
                            description="เอฟเฟกต์สวยๆ ตามธีม"
                            delay={0.2}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InteractiveDemos;

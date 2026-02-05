import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Clock, Lock } from 'lucide-react';

const CountdownDemo = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 23, minutes: 59, seconds: 45 });

    // Mock countdown effect
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
        <div className="bg-[#1A3C40] rounded-2xl p-6 text-white text-center relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Clock size={100} />
            </div>

            <h3 className="text-xl font-playfair mb-1 text-[#E8A08A]">Scarcity Effect</h3>
            <p className="text-gray-300 text-sm mb-6">สร้างความรู้สึก "เสียดาย" ถ้าไม่รีบจอง</p>

            <div className="flex justify-center gap-4 my-8">
                {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-xl font-bold font-mono">
                            {String(value).padStart(2, '0')}
                        </div>
                        <span className="text-xs text-gray-400 mt-1 uppercase">{unit}</span>
                    </div>
                ))}
            </div>

            <p className="text-xs text-[#E8A08A]">"This memory will disappear in..."</p>
        </div>
    );
};

const UnlockDemo = () => {
    const [clicks, setClicks] = useState(0);
    const targetClicks = 5;
    const isUnlocked = clicks >= targetClicks;

    const handleClick = () => {
        if (!isUnlocked) {
            setClicks(prev => prev + 1);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-[#E8A08A]">
                <Lock size={100} />
            </div>

            <h3 className="text-xl font-playfair mb-1 text-[#1A3C40]">Interactive Memory</h3>
            <p className="text-gray-500 text-sm mb-6">ต้องทำภารกิจเพื่อดูข้อความลับ (Gamification)</p>

            <div className="h-40 flex items-center justify-center relative">
                <AnimatePresence mode='wait'>
                    {!isUnlocked ? (
                        <motion.button
                            key="locked"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleClick}
                            className="relative"
                        >
                            <Heart
                                size={60}
                                className="text-[#E8A08A] fill-[#E8A08A]/20"
                            />
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-[#1A3C40]">
                                {targetClicks - clicks}
                            </span>
                            <p className="text-xs text-gray-400 mt-2 absolute -bottom-8 w-max left-1/2 -translate-x-1/2">
                                Tap the Heart!
                            </p>
                        </motion.button>
                    ) : (
                        <motion.div
                            key="unlocked"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1, rotate: [0, 10, -10, 0] }}
                            className="bg-[#E8A08A]/10 p-6 rounded-xl border border-[#E8A08A]/30"
                        >
                            <p className="text-[#1A3C40] font-playfair italic font-medium">
                                "Will you marry me?" <br />
                                or "Happy Anniversary!"
                            </p>
                            <button
                                onClick={() => setClicks(0)}
                                className="text-xs text-gray-400 mt-4 hover:text-[#E8A08A]"
                            >
                                Play Again
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const InteractiveDemos = () => {
    return (
        <section className="py-20 px-4" id="experience">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16 relative">
                    {/* Floating Hearts */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <span className="absolute top-0 left-[20%] text-2xl animate-float-heart" style={{ animationDelay: '0s' }}>💕</span>
                        <span className="absolute top-4 right-[25%] text-xl animate-float-heart" style={{ animationDelay: '0.5s' }}>💖</span>
                        <span className="absolute bottom-0 left-[40%] text-lg animate-float-heart" style={{ animationDelay: '1s' }}>💗</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-playfair text-[#1A3C40] mb-4">
                        Experience <span className="text-[#E8A08A] italic">Premium Features</span>
                    </h2>
                    <p className="text-[#4E6E81] text-lg font-light">ตัวอย่างลูกเล่นที่จะทำให้คนพิเศษของคุณประทับใจ</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
                    <CountdownDemo />
                    <UnlockDemo />
                </div>
            </div>
        </section>
    );
};

export default InteractiveDemos;

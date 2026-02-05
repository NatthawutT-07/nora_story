import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Tier3Template6 = ({ customMessage, customSignOff }) => {
    const [snowflakes, setSnowflakes] = useState([]);
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        // Generate initial snowflakes
        const flakes = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            size: Math.random() * 4 + 2,
            delay: Math.random() * 2,
            duration: Math.random() * 3 + 4
        }));
        setSnowflakes(flakes);
    }, []);

    const shake = () => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-900 via-sky-800 to-sky-900 flex flex-col items-center justify-center p-6 font-sans overflow-hidden">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white text-xl md:text-2xl font-playfair mb-6 text-center z-10"
            >
                Shake the Snow Globe! ❄️
            </motion.h1>

            {/* Snow Globe */}
            <motion.div
                animate={isShaking ? {
                    rotate: [0, -5, 5, -5, 5, 0],
                    scale: [1, 1.02, 1]
                } : {}}
                transition={{ duration: 0.5 }}
                onClick={shake}
                className="relative cursor-pointer"
            >
                {/* Glass Dome */}
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-b from-white/20 to-transparent border-4 border-white/30 shadow-2xl overflow-hidden">
                    {/* Inner Scene */}
                    <div className="absolute inset-4 rounded-full bg-gradient-to-b from-blue-200/20 to-blue-400/30 overflow-hidden">
                        {/* Background */}
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-blue-50 rounded-b-full" />

                        {/* Couple */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-end gap-1">
                            <div className="text-4xl">👩‍❤️‍👨</div>
                        </div>

                        {/* Trees */}
                        <div className="absolute bottom-6 left-6 text-2xl">🎄</div>
                        <div className="absolute bottom-6 right-6 text-2xl">🎄</div>

                        {/* Snowflakes */}
                        {snowflakes.map((flake) => (
                            <motion.div
                                key={flake.id}
                                initial={{ y: -10, opacity: 0 }}
                                animate={{
                                    y: isShaking ? ['-10%', '90%'] : ['100%', '-10%'],
                                    opacity: [0, 1, 1, 0]
                                }}
                                transition={{
                                    duration: flake.duration,
                                    delay: isShaking ? Math.random() * 0.5 : flake.delay,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                className="absolute rounded-full bg-white"
                                style={{
                                    left: `${flake.x}%`,
                                    width: flake.size,
                                    height: flake.size,
                                }}
                            />
                        ))}
                    </div>

                    {/* Glass Reflection */}
                    <div className="absolute top-4 left-8 w-16 h-8 bg-white/20 rounded-full blur-sm transform -rotate-45" />
                </div>

                {/* Base */}
                <div className="relative -mt-4 mx-auto">
                    <div className="w-48 md:w-56 h-8 bg-gradient-to-b from-amber-700 to-amber-900 rounded-lg mx-auto shadow-lg" />
                    <div className="w-56 md:w-64 h-6 bg-gradient-to-b from-amber-800 to-amber-950 rounded-b-xl mx-auto shadow-lg" />
                </div>
            </motion.div>

            {/* Message */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center max-w-sm"
            >
                <p className="text-white/90 text-lg leading-relaxed">
                    {customMessage || "Our love is like winter magic — beautiful, pure, and everlasting."}
                </p>
                <p className="text-sky-300 mt-4 text-sm">— {customSignOff || "Forever Yours"}</p>
            </motion.div>

            <p className="mt-6 text-sky-200/50 text-xs">Click the globe to shake it!</p>
        </div>
    );
};

export default Tier3Template6;

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Tier2Template3 = ({ customTitle, customSubtitle }) => {
    // Generate random hearts
    const hearts = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 5,
        scale: Math.random() * 0.5 + 0.5
    }));

    return (
        <div className="min-h-screen bg-pink-50 relative overflow-hidden flex items-center justify-center">
            {hearts.map(heart => (
                <motion.div
                    key={heart.id}
                    className="absolute text-pink-300"
                    style={{ left: `${heart.x}%`, bottom: '-10%' }}
                    animate={{
                        y: '-120vh',
                        x: Math.sin(heart.x) * 50 // Generic sway
                    }}
                    transition={{
                        duration: 10 + Math.random() * 10,
                        repeat: Infinity,
                        ease: "linear",
                        delay: heart.delay
                    }}
                >
                    <Heart size={40 * heart.scale} fill="currentColor" />
                </motion.div>
            ))}

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="z-10 bg-white/80 backdrop-blur-sm p-10 rounded-full shadow-xl text-center border-4 border-pink-100"
            >
                <h1 className="text-3xl font-bold text-pink-600 mb-2">{customTitle || "My Heart"}</h1>
                <p className="text-gray-500">{customSubtitle || "Floats for you..."}</p>
            </motion.div>
        </div>
    );
};

export default Tier2Template3;

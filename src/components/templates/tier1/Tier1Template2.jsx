import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Flower } from 'lucide-react';

// Floating Lotus/Flower Component
const FloatingFlowers = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(10)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        x: Math.random() * 100 + '%',
                        y: '100%',
                        opacity: 0,
                        scale: 0.5 + Math.random() * 0.5
                    }}
                    animate={{
                        y: '-20%',
                        opacity: [0, 0.6, 0.6, 0],
                        rotate: Math.random() * 360
                    }}
                    transition={{
                        duration: 10 + Math.random() * 5,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: 'linear'
                    }}
                    className="absolute text-amber-300/40"
                >
                    <Flower size={20 + Math.random() * 20} fill="currentColor" />
                </motion.div>
            ))}
        </div>
    );
};

// Animated Background Gradient (Gold/White/Saffron)
const AnimatedBackground = ({ variant = 'default' }) => {
    const gradients = {
        default: 'from-amber-50 via-yellow-50 to-orange-50',
        question: 'from-yellow-100 via-amber-50 to-orange-50',
        content: 'from-orange-50 via-amber-50 to-yellow-50'
    };

    return (
        <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${gradients[variant]}`}
            animate={{
                background: [
                    'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fff7ed 100%)',
                    'linear-gradient(135deg, #fff7ed 0%, #fffbeb 50%, #fef3c7 100%)',
                    'linear-gradient(135deg, #fef3c7 0%, #fff7ed 50%, #fffbeb 100%)',
                    'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fff7ed 100%)'
                ]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
    );
};

const Tier1Template2 = ({
    // This prop will come from the upload "Invitation Card Image"
    invitationImage = 'https://images.unsplash.com/photo-1599553240723-5e9854737274?w=800'
}) => {
    // Default to content view immediately, no logic needed

    useEffect(() => {
        const triggerConfetti = () => {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const colors = ['#f59e0b', '#fbbf24', '#fcd34d', '#ffffff'];

            const interval = setInterval(() => {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);

                const particleCount = 3 * (timeLeft / duration);

                confetti({
                    particleCount,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0, y: 0.6 },
                    colors,
                    shapes: ['circle', 'square'],
                    scalar: 1
                });
                confetti({
                    particleCount,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.6 },
                    colors,
                    shapes: ['circle', 'square'],
                    scalar: 1
                });
            }, 200);
        };

        // Trigger immediately
        triggerConfetti();

        // Loop every 5 seconds
        const loopInterval = setInterval(triggerConfetti, 5000);

        return () => clearInterval(loopInterval);
    }, []);

    return (
        <div className="h-screen w-full flex items-center justify-center bg-amber-50 overflow-hidden relative font-serif">
            <AnimatedBackground variant="content" />
            <FloatingFlowers />

            {/* Main Invitation Card Image - Centered */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="relative z-10 w-[90%] max-w-md md:max-w-lg p-4"
            >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50">
                    <img
                        src={invitationImage}
                        alt="Invitation Card"
                        className="w-full h-auto object-contain bg-white"
                    />
                </div>
            </motion.div>
        </div>
    );
};


export default Tier1Template2;

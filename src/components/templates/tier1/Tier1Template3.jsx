import { useState, useEffect } from 'react';
import { motion, } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Gem } from 'lucide-react';

// Floating Rings/Gem Component
const FloatingGems = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
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
                        opacity: [0, 0.8, 0.8, 0],
                        rotate: Math.random() * 360
                    }}
                    transition={{
                        duration: 12 + Math.random() * 6,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: 'linear'
                    }}
                    className="absolute text-slate-300/60"
                >
                    <Gem size={14 + Math.random() * 14} strokeWidth={1} />
                </motion.div>
            ))}
        </div>
    );
};

// Animated Background Gradient (Wedding White/Gold/Slate)
const AnimatedBackground = ({ variant = 'default' }) => {
    const gradients = {
        default: 'from-slate-50 via-gray-50 to-zinc-50',
        question: 'from-gray-100 via-slate-50 to-zinc-50',
        content: 'from-zinc-50 via-gray-50 to-slate-50'
    };

    return (
        <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${gradients[variant]}`}
            animate={{
                background: [
                    'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
                    'linear-gradient(135deg, #e2e8f0 0%, #f8fafc 50%, #f1f5f9 100%)',
                    'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #f8fafc 100%)',
                    'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)'
                ]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
    );
};

const Tier1Template3 = ({
    // This prop will come from the upload "Invitation Card Image"
    invitationImage = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800'
}) => {
    // Default to content view immediately, no logic needed

    useEffect(() => {
        const triggerConfetti = () => {
            // Heart-shaped confetti
            const heart = confetti.shapeFromPath({
                path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
            });

            const duration = 4 * 1000;
            const animationEnd = Date.now() + duration;
            const colors = ['#cbd5e1', '#94a3b8', '#fbbf24', '#fcd34d', '#f43f5e'];

            const interval = setInterval(() => {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);

                const particleCount = 3 * (timeLeft / duration);

                confetti({
                    particleCount,
                    angle: 60,
                    spread: 60,
                    origin: { x: 0, y: 0.6 },
                    colors,
                    shapes: [heart, 'circle'],
                    scalar: 1.2
                });
                confetti({
                    particleCount,
                    angle: 120,
                    spread: 60,
                    origin: { x: 1, y: 0.6 },
                    colors,
                    shapes: [heart, 'circle'],
                    scalar: 1.2
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
        <div className="h-screen w-full flex items-center justify-center bg-slate-50 overflow-hidden relative font-serif">
            <AnimatedBackground variant="content" />
            <FloatingGems />

            {/* Main Invitation Card Image - Centered */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-[90%] max-w-md md:max-w-lg p-4"
            >
                <div className="relative rounded-sm overflow-hidden shadow-2xl border-4 border-white/80">
                    <img
                        src={invitationImage}
                        alt="Wedding Invitation"
                        className="w-full h-auto object-contain bg-white"
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default Tier1Template3;


import { motion } from 'framer-motion';
import { Heart, Sparkles, Gem } from 'lucide-react';

// Floating Hearts Component
const FloatingHearts = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
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
                        duration: 15 + Math.random() * 10,
                        repeat: Infinity,
                        delay: Math.random() * 10,
                        ease: 'linear'
                    }}
                    className="absolute text-rose-300/40"
                >
                    <Heart size={20 + Math.random() * 20} fill="currentColor" />
                </motion.div>
            ))}
        </div>
    );
};

// Gradient Background (Rose Gold / Soft Pink)
const RomanticBackground = () => {
    return (
        <motion.div
            className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-pink-50"
            animate={{
                background: [
                    'linear-gradient(135deg, #fff1f2 0%, #ffffff 50%, #fdf2f8 100%)', // Rose-50 -> Pink-50
                    'linear-gradient(135deg, #fdf2f8 0%, #fff1f2 50%, #ffffff 100%)',
                    'linear-gradient(135deg, #ffffff 0%, #fdf2f8 50%, #fff1f2 100%)',
                ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
    );
};

const Tier1Template3 = ({ images = [] }) => {
    // Use the first uploaded image or a fallback
    const mainImage = images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800';

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative font-serif overflow-hidden text-[#5D4037]">
            <RomanticBackground />
            <FloatingHearts />

            <div className="relative z-10 w-full max-w-md text-center">
                {/* Decorative Top */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-5 md:mb-8 flex justify-center text-rose-400"
                >
                    <Gem size={32} strokeWidth={1.5} />
                </motion.div>

                {/* Main Image Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="relative mb-6 md:mb-10 mx-auto"
                >
                    {/* Soft Glow */}
                    <div className="absolute -inset-4 bg-rose-200/30 rounded-full blur-xl"></div>

                    <div className="relative bg-white p-3 rounded-[3rem] shadow-2xl border border-rose-100">
                        <div className="rounded-[2.5rem] overflow-hidden aspect-[3/4] relative">
                            <img
                                src={mainImage}
                                alt="Wedding Couple"
                                className="w-full h-full object-cover"
                            />
                            {/* Inner Border */}
                            <div className="absolute inset-3 border border-white/40 rounded-[2rem] pointer-events-none"></div>
                        </div>
                    </div>
                </motion.div>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="flex items-center justify-center gap-3 text-rose-400/60 mb-4">
                        <Sparkles size={14} />
                        <span className="text-xs tracking-[0.3em] uppercase">Save the Date</span>
                        <Sparkles size={14} />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800 font-serif italic">
                        The Wedding<br />Ceremony
                    </h1>

                    <p className="text-slate-500 font-light leading-relaxed">
                        "Two hearts, one love,<br />two lives, one path."
                    </p>
                </motion.div>

                {/* Footer Decor */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 md:mt-12 flex justify-center items-center gap-4 opacity-50"
                >
                    <div className="w-12 h-px bg-rose-300"></div>
                    <Heart size={12} className="text-rose-300" fill="currentColor" />
                    <div className="w-12 h-px bg-rose-300"></div>
                </motion.div>
            </div>
        </div>
    );
};

export default Tier1Template3;

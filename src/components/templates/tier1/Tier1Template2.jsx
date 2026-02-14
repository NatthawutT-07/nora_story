import { motion } from 'framer-motion';
import { Flower, Sparkles } from 'lucide-react';

// Floating Lotus Component
const FloatingLotus = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
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
                        opacity: [0, 0.4, 0.4, 0],
                        rotate: Math.random() * 360
                    }}
                    transition={{
                        duration: 15 + Math.random() * 10,
                        repeat: Infinity,
                        delay: Math.random() * 10,
                        ease: 'linear'
                    }}
                    className="absolute text-amber-400/30"
                >
                    <Flower size={24 + Math.random() * 24} fill="currentColor" />
                </motion.div>
            ))}
        </div>
    );
};

// Golden Gradient Background
const GoldenBackground = () => {
    return (
        <motion.div
            className="absolute inset-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50"
            animate={{
                background: [
                    'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fff7ed 100%)',
                    'linear-gradient(135deg, #fff7ed 0%, #fffbeb 50%, #fef3c7 100%)',
                    'linear-gradient(135deg, #fef3c7 0%, #fff7ed 50%, #fffbeb 100%)',
                ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
    );
};

const Tier1Template2 = ({ images = [] }) => {
    // Use the first uploaded image or a fallback
    const mainImage = images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1599553240723-5e9854737274?w=800';

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative font-serif overflow-hidden text-[#5D4037]">
            <GoldenBackground />
            <FloatingLotus />

            <div className="relative z-10 w-full max-w-md text-center">
                {/* Decorative Top Icon */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6 flex justify-center text-amber-500"
                >
                    <Flower size={40} fill="currentColor" />
                </motion.div>

                {/* Main Image Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="relative mb-5 md:mb-8 mx-auto"
                >
                    {/* Golden Glow/Border Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-tr from-amber-300 to-yellow-200 rounded-2xl blur-sm opacity-70"></div>

                    <div className="relative bg-white p-2 rounded-2xl shadow-xl border border-amber-100">
                        <div className="rounded-xl overflow-hidden aspect-[3/4] relative">
                            <img
                                src={mainImage}
                                alt="Ordination"
                                className="w-full h-full object-cover"
                            />
                            {/* Inner Border */}
                            <div className="absolute inset-2 border border-white/50 rounded-lg pointer-events-none"></div>
                        </div>
                    </div>
                </motion.div>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h1 className="text-2xl md:text-3xl font-bold mb-3 text-amber-700 bg-clip-text">
                        ขอเชิญร่วมอนุโมทนาบุญ<br />อุปสมบท
                    </h1>

                    <div className="flex items-center justify-center gap-2 text-amber-600/60 mb-6">
                        <Sparkles size={16} />
                        <span className="text-sm tracking-widest uppercase">Ordination Ceremony</span>
                        <Sparkles size={16} />
                    </div>

                    <p className="text-sm text-[#8D6E63] italic font-light">
                        "ขอให้กุศลผลบุญนี้ จงส่งผลให้ท่านและครอบครัว<br />ประสบแต่ความสุขความเจริญ"
                    </p>
                </motion.div>

                {/* Footer Decor */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 md:mt-12 flex justify-center"
                >
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
                </motion.div>
            </div>
        </div>
    );
};

export default Tier1Template2;

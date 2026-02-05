import { motion } from 'framer-motion';

const Tier1Template6 = ({ customTitle, customMessage, customSignOff }) => {
    // Generate random stars
    const stars = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5
    }));

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0B1026] to-[#2B32B2] flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden">
            {/* Stars */}
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    initial={{ opacity: 0.2, scale: 0.5 }}
                    animate={{ opacity: [0.2, 1, 0.2], scale: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, delay: star.delay, repeat: Infinity }}
                    className="absolute rounded-full bg-white blur-[1px]"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: star.size,
                        height: star.size
                    }}
                />
            ))}

            {/* Moon Glow */}
            <div className="absolute top-10 right-10 w-24 h-24 bg-white rounded-full blur-[60px] opacity-20"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2 }}
                className="max-w-lg w-full relative z-10 p-8 border border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl"
            >
                <div className="mb-8">
                    <h2 className="text-xl md:text-2xl font-playfair italic text-yellow-100 drop-shadow-[0_0_10px_rgba(255,255,200,0.5)]">
                        {customTitle || "Under the Same Sky"}
                    </h2>
                </div>

                <p className="text-lg md:text-xl font-light leading-relaxed text-gray-100 mb-10 font-sans">
                    "{customMessage || "No matter how far apart we are, we are always looking at the same moon. Sending you starlight and love tonight."}"
                </p>

                <div className="text-sm font-medium tracking-widest text-[#89C4F4] uppercase">
                    — {customSignOff || "Thinking of You"}
                </div>
            </motion.div>
        </div>
    );
};

export default Tier1Template6;

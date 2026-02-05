import { motion } from 'framer-motion';

const photos = [
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400",
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400",
    "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400",
    "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=400"
];

const Tier2Template2 = ({ customTitle }) => {
    return (
        <div className="min-h-screen bg-stone-50 p-4 font-serif">
            <div className="max-w-2xl mx-auto pt-10 pb-20">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl text-center text-stone-800 mb-12 italic tracking-wide"
                >
                    {customTitle || "Captured Moments"}
                </motion.h1>

                <div className="columns-2 gap-4 space-y-4">
                    {photos.map((src, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.2 }}
                            className="break-inside-avoid"
                        >
                            <div className="bg-white p-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <img src={src} className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-500" alt="Memory" />
                                <div className="pt-3 pb-1 px-1">
                                    <p className="text-xs text-gray-400 font-sans text-right">0{idx + 1} / 04</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tier2Template2;

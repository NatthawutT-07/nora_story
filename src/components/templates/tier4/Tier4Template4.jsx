import { motion } from 'framer-motion';
import { Film } from 'lucide-react';

const Tier4Template4 = ({ customTitle, customMessage, customImage }) => {
    const frames = [
        { image: customImage || 'https://images.unsplash.com/photo-1529519195486-f3a0c8e44d12?w=400', label: 'Chapter 1' },
        { image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400', label: 'Chapter 2' },
        { image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400', label: 'Chapter 3' },
        { image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400', label: 'Chapter 4' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex flex-col items-center justify-center p-4 font-sans text-white overflow-hidden">
            {/* Film Grain Overlay */}
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8 z-10"
            >
                <div className="flex items-center justify-center gap-2 text-amber-500 mb-2">
                    <Film size={20} />
                    <span className="text-xs uppercase tracking-[0.3em]">A Cinematic Experience</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-playfair italic">{customTitle || "Our Story"}</h1>
            </motion.div>

            {/* Film Strip */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: '-100%' }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="flex gap-2 py-4"
            >
                {[...frames, ...frames, ...frames].map((frame, i) => (
                    <div key={i} className="flex-shrink-0 w-32 md:w-40">
                        {/* Film Perforations Top */}
                        <div className="flex justify-between px-1 mb-1">
                            {[...Array(4)].map((_, j) => (
                                <div key={j} className="w-2 h-3 bg-gray-800 rounded-sm" />
                            ))}
                        </div>

                        {/* Frame */}
                        <div className="aspect-[3/4] bg-gray-800 rounded overflow-hidden border-2 border-gray-700">
                            <img src={frame.image} className="w-full h-full object-cover sepia-[30%] contrast-110" />
                        </div>

                        {/* Film Perforations Bottom */}
                        <div className="flex justify-between px-1 mt-1">
                            {[...Array(4)].map((_, j) => (
                                <div key={j} className="w-2 h-3 bg-gray-800 rounded-sm" />
                            ))}
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Static Center Frame */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="relative -mt-20 md:-mt-24 z-10"
            >
                <div className="w-64 md:w-72 aspect-[3/4] bg-black rounded-lg overflow-hidden border-4 border-amber-600 shadow-[0_0_60px_rgba(217,119,6,0.3)]">
                    <img
                        src={frames[0].image}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-sm text-amber-200/80 italic text-center">
                            {customMessage || "Every frame of our life together is worth a thousand words."}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Bottom Credits */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 text-center text-gray-500 text-xs uppercase tracking-widest"
            >
                <p>A Love Story Production</p>
                <p className="text-amber-600 mt-1">★ ★ ★ ★ ★</p>
            </motion.div>
        </div>
    );
};

export default Tier4Template4;

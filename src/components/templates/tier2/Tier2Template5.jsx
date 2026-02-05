import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { useState } from 'react';

const Tier2Template5 = ({ customTitle, customSubtitle, customImage }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [rotation, setRotation] = useState(0);

    // Animate vinyl rotation when playing
    useState(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setRotation(prev => prev + 2);
            }, 50);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-900 via-amber-800 to-stone-900 flex flex-col items-center justify-center p-6 font-sans text-amber-100">
            {/* Wood Grain Texture */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 text-center"
            >
                {/* Vinyl Record */}
                <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto mb-8">
                    {/* Vinyl Disc */}
                    <motion.div
                        animate={{ rotate: isPlaying ? rotation : 0 }}
                        transition={{ duration: 0, ease: "linear" }}
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl"
                        style={{
                            backgroundImage: `repeating-radial-gradient(circle at center, transparent 0, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)`
                        }}
                    >
                        {/* Center Label */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center overflow-hidden shadow-inner">
                            {customImage ? (
                                <img src={customImage} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-2">
                                    <p className="text-[8px] uppercase tracking-widest text-amber-200/80">Nora Records</p>
                                    <p className="text-xs font-bold mt-1">♫</p>
                                </div>
                            )}
                        </div>
                        {/* Center Hole */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-900"></div>
                    </motion.div>
                </div>

                {/* Song Info */}
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{customTitle || "Our Song"}</h2>
                <p className="text-amber-300/70 mb-6">{customSubtitle || "The Soundtrack of Us"}</p>

                {/* Play Button */}
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-16 h-16 bg-amber-500 hover:bg-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 transition-all hover:scale-105"
                >
                    {isPlaying ? <Pause size={28} className="text-amber-900" /> : <Play size={28} className="text-amber-900 ml-1" />}
                </button>
            </motion.div>
        </div>
    );
};

export default Tier2Template5;

import { motion } from 'framer-motion';
import { Play, SkipBack, SkipForward, Heart } from 'lucide-react';

const Tier2Template1 = ({ customImage, customTitle, customSubtitle }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-4 md:p-6 font-sans text-white">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-sm bg-white/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl border border-white/20"
            >
                <div className="aspect-square rounded-xl md:rounded-2xl bg-gradient-to-tr from-pink-500 to-orange-400 mb-4 md:mb-8 shadow-lg overflow-hidden relative group">
                    <img src={customImage || "https://images.unsplash.com/photo-1501901609772-df0848060b33?q=80&w=2670&auto=format&fit=crop"} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" alt="Cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-12 md:w-16 h-12 md:h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                            <div className="w-3 md:w-4 h-3 md:h-4 rounded-full bg-white animate-pulse"></div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-end mb-2">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg md:text-2xl font-bold truncate">{customTitle || "Our Love Song 🎵"}</h2>
                        <p className="text-white/60 text-sm md:text-base">{customSubtitle || "Nora & You"}</p>
                    </div>
                    <Heart className="text-pink-500 fill-pink-500" />
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-white/10 rounded-full mt-6 mb-2 overflow-hidden">
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "65%" }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        className="h-full bg-white rounded-full"
                    />
                </div>
                <div className="flex justify-between text-xs text-white/40 mb-8">
                    <span>2:14</span>
                    <span>3:45</span>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6 md:gap-8 mb-4">
                    <SkipBack size={24} className="text-white/70 hover:text-white cursor-pointer" />
                    <div className="w-12 md:w-16 h-12 md:h-16 bg-white rounded-full flex items-center justify-center text-purple-900 hover:scale-105 transition-transform cursor-pointer shadow-lg shadow-white/20">
                        <Play size={24} fill="currentColor" />
                    </div>
                    <SkipForward size={24} className="text-white/70 hover:text-white cursor-pointer" />
                </div>
            </motion.div>
        </div>
    );
};

export default Tier2Template1;

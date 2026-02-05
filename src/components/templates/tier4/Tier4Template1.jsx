import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const Tier4Template1 = () => {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden">
            {/* Video Background Placeholder */}
            <div className="absolute inset-0 z-0">
                {/* Simulating video with a heavily filtered image for this demo */}
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2670&auto=format&fit=crop"
                    className="w-full h-full object-cover animation-pan" // Add custom CSS animation for pan if wanted
                    alt="Background"
                />
            </div>

            <div className="z-20 text-center max-w-4xl px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5 }}
                >
                    <p className="text-sm md:text-lg tracking-[0.5em] uppercase mb-6 text-white/80">The Wedding Film</p>
                    <h1 className="text-6xl md:text-9xl font-playfair mb-8 leading-none">
                        Sarah <br />
                        <span className="text-4xl md:text-6xl italic text-serif opacity-70">&</span> <br />
                        James
                    </h1>
                </motion.div>

                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="w-20 h-20 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-500 mx-auto group"
                >
                    <Play className="ml-1 group-hover:scale-110 transition-transform" />
                </motion.button>
            </div>

            <div className="absolute bottom-10 z-20 text-xs tracking-widest opacity-50">
                EST. 2024
            </div>
        </div>
    );
};

export default Tier4Template1;

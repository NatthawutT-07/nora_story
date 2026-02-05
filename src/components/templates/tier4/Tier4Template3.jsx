import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const ParallaxSection = ({ src, title, text }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    return (
        <div ref={ref} className="relative h-screen overflow-hidden flex items-center justify-center">
            <motion.div style={{ y }} className="absolute inset-0 z-0">
                <img src={src} className="w-full h-[120%] object-cover" alt="bg" />
            </motion.div>
            <div className="absolute inset-0 bg-black/40 z-10" />

            <div className="relative z-20 text-center text-white p-4 max-w-2xl">
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-6xl md:text-8xl font-playfair mb-6"
                >
                    {title}
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 1 }}
                    className="text-xl font-light leading-relaxed"
                >
                    {text}
                </motion.p>
            </div>
        </div>
    );
};

const Tier4Template3 = () => {
    return (
        <div className="bg-black">
            <div className="h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center">
                    <p className="text-sm tracking-widest uppercase mb-4 text-[#E8A08A]">Scroll Down</p>
                    <h1 className="text-4xl font-light">The Story of Us</h1>
                </div>
            </div>

            <ParallaxSection
                src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=2560"
                title="Chapter I"
                text="Where it all began. The sun was setting, and for the first time, I saw forever in someone's eyes."
            />

            <ParallaxSection
                src="https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2670"
                title="Adventure"
                text="Hand in hand, we explored the world. Not to escape life, but for life not to escape us."
            />

            <ParallaxSection
                src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=2670"
                title="Forever"
                text="And so, the adventure continues. Together, always."
            />

            <div className="h-[50vh] flex items-center justify-center bg-[#111] text-white">
                <h2 className="text-2xl font-serif italic text-[#E8A08A]">To be continued...</h2>
            </div>
        </div>
    );
};

export default Tier4Template3;

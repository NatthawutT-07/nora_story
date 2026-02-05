import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const Tier2Template4 = ({ customTitle, customImage }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Sample slides - in production these would come from props
    const slides = [
        { image: customImage || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800', caption: 'Our first adventure' },
        { image: 'https://images.unsplash.com/photo-1529519195486-f3a0c8e44d12?w=800', caption: 'Making memories' },
        { image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800', caption: 'Forever together' },
    ];

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 flex flex-col items-center justify-center p-4 md:p-6 font-sans">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-4xl font-playfair text-rose-800 mb-6 text-center"
            >
                {customTitle || "Our Photo Album 📸"}
            </motion.h1>

            <div className="relative w-full max-w-md">
                {/* Main Image */}
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-white p-2"
                >
                    <img
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].caption}
                        className="w-full h-full object-cover rounded-xl"
                    />
                </motion.div>

                {/* Caption */}
                <motion.p
                    key={`caption-${currentSlide}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center mt-4 text-rose-700 font-medium italic"
                >
                    "{slides[currentSlide].caption}"
                </motion.p>

                {/* Navigation */}
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={prevSlide}
                        className="p-3 bg-white/80 backdrop-blur rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
                    >
                        <ChevronLeft className="text-rose-600" />
                    </button>
                    <div className="flex items-center gap-2">
                        {slides.map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-rose-500 w-4' : 'bg-rose-300'}`}
                            />
                        ))}
                    </div>
                    <button
                        onClick={nextSlide}
                        className="p-3 bg-white/80 backdrop-blur rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
                    >
                        <ChevronRight className="text-rose-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Tier2Template4;

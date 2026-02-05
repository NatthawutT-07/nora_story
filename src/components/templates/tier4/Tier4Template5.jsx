import { motion } from 'framer-motion';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const Tier4Template5 = ({ customTitle, customMessage }) => {
    const [currentPage, setCurrentPage] = useState(0);

    const pages = [
        { title: "Once Upon a Time...", content: "In a world full of strangers, two hearts found their way to each other." },
        { title: "Chapter One", content: customMessage || "From the moment our eyes met, I knew you were the one I had been searching for all my life." },
        { title: "The Journey", content: "Through laughter and tears, through sunshine and rain, we walked hand in hand, writing our story." },
        { title: "Happily Ever After", content: "And so, our love story continues... with you, every day is a fairytale. 💕" },
    ];

    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, pages.length - 1));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 0));

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex flex-col items-center justify-center p-4 font-serif">
            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 text-6xl opacity-10 rotate-12">📖</div>
            <div className="absolute bottom-10 right-10 text-6xl opacity-10 -rotate-12">✨</div>

            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6 z-10"
            >
                <BookOpen className="mx-auto text-amber-700 mb-2" size={32} />
                <h1 className="text-2xl md:text-3xl font-playfair text-amber-900">
                    {customTitle || "Our Love Story"}
                </h1>
            </motion.div>

            {/* Book */}
            <div className="relative w-full max-w-md perspective-1000" style={{ perspective: '1500px' }}>
                <motion.div
                    key={currentPage}
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className="relative bg-[#f9f3e3] rounded-r-lg shadow-2xl overflow-hidden"
                    style={{
                        transformStyle: 'preserve-3d',
                        boxShadow: 'inset -10px 0 30px rgba(0,0,0,0.1), 5px 5px 20px rgba(0,0,0,0.2)'
                    }}
                >
                    {/* Page Content */}
                    <div className="p-8 md:p-12 min-h-[400px] md:min-h-[500px] flex flex-col justify-center">
                        {/* Page Number */}
                        <div className="absolute top-4 right-6 text-amber-400 text-sm">
                            {currentPage + 1} / {pages.length}
                        </div>

                        {/* Decorative Border */}
                        <div className="absolute inset-4 border-2 border-amber-200/50 rounded-lg pointer-events-none" />

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-center"
                        >
                            <h2 className="text-xl md:text-2xl text-amber-800 font-playfair italic mb-6 underline decoration-wavy decoration-amber-300">
                                {pages[currentPage].title}
                            </h2>
                            <p className="text-amber-900/80 leading-relaxed text-base md:text-lg">
                                {pages[currentPage].content}
                            </p>
                        </motion.div>

                        {/* Decorative Flourish */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-amber-300 text-2xl">
                            ❧
                        </div>
                    </div>

                    {/* Book Spine Shadow */}
                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/20 to-transparent" />
                </motion.div>

                {/* Navigation */}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft size={18} /> Previous
                    </button>
                    <button
                        onClick={nextPage}
                        disabled={currentPage === pages.length - 1}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        Next <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <p className="mt-6 text-amber-600/50 text-xs">Turn the pages of our story</p>
        </div>
    );
};

export default Tier4Template5;

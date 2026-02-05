import { motion } from 'framer-motion';

const DigitalCover = () => {
    return (
        <section className="py-20 px-4 bg-[#1A3C40] text-white relative overflow-hidden">
            {/* Background Decorative */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#E8A08A] rounded-full blur-[100px] opacity-20"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#4E6E81] rounded-full blur-[100px] opacity-20"></div>

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl md:text-5xl font-playfair mb-6 leading-tight">
                        More Than Just A Link <br />
                        <span className="text-[#E8A08A] italic">It's a Keepsake.</span>
                    </h2>
                    <p className="text-gray-300 text-lg mb-8 font-light">
                        ลูกค้าจะได้รับ "Digital Cover" หน้าปกดีไซน์พรีเมียม <br />
                        สำหรับส่งให้คนรักทางแชท เพื่อสร้างความประทับใจตั้งแต่แรกเห็น
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <div className="flex items-center gap-2 text-sm text-[#E8A08A]">
                            <span className="w-2 h-2 rounded-full bg-[#E8A08A]"></span>
                            High Quality Image
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#E8A08A]">
                            <span className="w-2 h-2 rounded-full bg-[#E8A08A]"></span>
                            Personalized Title
                        </div>
                    </div>
                </div>

                <div className="flex-1 relative">
                    {/* Mock Phone / Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative w-full max-w-sm mx-auto aspect-[3/4] bg-white rounded-3xl shadow-2xl p-4 rotate-[-3deg] hover:rotate-0 transition-transform duration-500"
                    >
                        <div className="w-full h-full rounded-2xl overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#1A3C40] to-[#E8A08A] opacity-90"></div>
                            <img
                                src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2670&auto=format&fit=crop"
                                alt="Couple"
                                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 border-4 border-white/20 m-4 rounded-xl">
                                <h3 className="text-3xl font-playfair text-white mb-2">Anniversary</h3>
                                <p className="text-white/80 font-sans tracking-widest text-sm uppercase">Natthawut & Nora</p>
                                <div className="mt-8 px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-xs">
                                    Tap to open
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Float Elements */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-10 -right-4 md:right-10 bg-white text-[#1A3C40] px-4 py-2 rounded-lg shadow-lg font-playfair italic"
                    >
                        For You ❤️
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default DigitalCover;

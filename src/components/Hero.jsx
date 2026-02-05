
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white px-4 pt-20 pb-16">
            {/* Background Gradient & Shape */}
            <div className="absolute top-0 left-0 w-full h-[85vh] rounded-b-[3rem] md:rounded-b-[5rem] overflow-hidden -z-10 bg-[#0F2A2E]">
                <div className="w-full h-full bg-gradient-to-b from-[#051113] via-[#0F2A2E] to-[#2C4A52] opacity-100" />
                <div className="absolute inset-0 bg-black/60" /> {/* Much darker overlay for better contrast */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=2560&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20" />
            </div>

            {/* Floating Logo / Header */}
            <div className="absolute top-0 left-0 w-full p-6 md:p-10 z-20 flex justify-between items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center gap-3"
                >
                    <img src={logo} alt="NoraStory" className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-lg bg-white/10 rounded-full p-1 backdrop-blur-sm" />
                    <span className="text-white font-playfair text-xl tracking-wider font-semibold drop-shadow-lg">NoraStory</span>
                </motion.div>

                {/* Navigation */}
                <motion.nav
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="hidden md:flex items-center gap-8 bg-black/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/10"
                >
                    <a href="#experience" className="text-white/80 hover:text-[#E8A08A] transition-colors text-sm font-medium">ฟีเจอร์</a>
                    <a href="#pricing" className="text-white/80 hover:text-[#E8A08A] transition-colors text-sm font-medium">ราคา</a>
                    <a href="#contact" className="text-white/80 hover:text-[#E8A08A] transition-colors text-sm font-medium">ติดต่อเรา</a>
                </motion.nav>

                {/* Mobile Menu Icon (Placeholder/Simple) */}
                <a href="#pricing" className="md:hidden text-white/90 text-sm font-medium bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                    จองเลย
                </a>
            </div>

            {/* Main Content */}
            <div className="z-10 text-center max-w-4xl mx-auto mt-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative inline-block"
                >
                    <div className="absolute -inset-1 rounded-full bg-white/20 blur-xl"></div>
                    <h1 className="relative text-5xl md:text-7xl lg:text-8xl font-playfair font-bold text-white mb-6 leading-tight drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
                        Eternalize Your <br />
                        <span className="italic text-[#FFE5B4]">Love Story</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-white text-lg md:text-2xl font-light font-inter max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                >
                    เปลี่ยนความทรงจำของคุณให้เป็นหน้าเว็บไซต์สุดพรีเมียม <br className="hidden md:block" />
                    ที่จะอยู่คู่กับโลกออนไลน์ตลอดไป
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
                            className="group relative bg-[#E8A08A] text-[#1A3C40] px-8 py-4 rounded-full text-lg font-medium tracking-wide shadow-[0_10px_30px_rgba(232,160,138,0.4)] hover:shadow-[0_15px_40px_rgba(232,160,138,0.6)] transition-all duration-300 hover:-translate-y-1 flex items-center gap-3 pulse-glow"
                        >
                            <span>สร้างความทรงจำเลย</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => navigate('/create')}
                            className="px-8 py-4 bg-[#1A3C40] hover:bg-[#1A3C40]/80 text-white border border-[#1A3C40]/50 rounded-full font-medium transition-all shadow-lg flex items-center gap-2 group"
                        >
                            <span className="group-hover:text-[#E8A08A] transition-colors">Try Playground</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Circuit Line Animation (Decorative) */}
            <svg className="absolute top-[20%] right-0 w-[300px] h-[300px] pointer-events-none opacity-40 mix-blend-screen" viewBox="0 0 100 100">
                <motion.path
                    d="M 100 50 C 70 50, 70 20, 40 20 C 10 20, 10 50, 10 50"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                />
                <motion.path
                    d="M 100 60 C 80 60, 60 80, 40 80 C 20 80, 20 50, 0 50"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                />
            </svg>
        </section>
    );
};

export default Hero;

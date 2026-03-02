
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import logo from '../assets/logo.png';

const Hero = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
        // Listen to real-time updates of the user counter
        const statsRef = doc(db, 'stats', 'users');
        const unsubscribe = onSnapshot(statsRef, (doc) => {
            if (doc.exists()) {
                // Add a base number to make it look active initially, plus real counts
                const realCount = doc.data().count || 0;
                setUserCount(realCount);
            }
        });

        return () => unsubscribe();
    }, []);

    const scrollToSection = (id) => {
        setIsMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#0F2A2E] via-[#1A3C40] to-[#0F2A2E]">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating Hearts */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-[#E8A08A]/20"
                        initial={{
                            x: Math.random() * 100 + '%',
                            y: '100%',
                            rotate: 0
                        }}
                        animate={{
                            y: '-20%',
                            rotate: 360
                        }}
                        transition={{
                            duration: 15 + Math.random() * 10,
                            repeat: Infinity,
                            delay: i * 2,
                            ease: 'linear'
                        }}
                    >
                        <Heart size={20 + Math.random() * 30} fill="currentColor" />
                    </motion.div>
                ))}

                {/* Gradient Orbs */}
                <div className="absolute top-20 -left-32 w-96 h-96 bg-[#E8A08A]/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 -right-32 w-96 h-96 bg-[#FFE5B4]/10 rounded-full blur-[100px]" />
            </div>

            {/* Header Navigation */}
            <header className="relative z-30 w-full px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-2 sm:gap-3 cursor-pointer"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <img
                            src={logo}
                            alt="NoraStory"
                            className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                        />
                        <div className="flex flex-col">
                            <span className="text-white font-playfair text-lg sm:text-xl tracking-wide font-semibold leading-none">
                                Nora Story
                            </span>
                            <span className="text-white/70 text-[10px] sm:text-xs tracking-wider">
                                Online Love Delivery
                            </span>
                        </div>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <motion.nav
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="hidden md:flex items-center gap-1"
                    >
                        <button onClick={() => scrollToSection('experience')} className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all text-sm font-medium">
                            ฟีเจอร์
                        </button>
                        <button onClick={() => scrollToSection('pricing')} className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all text-sm font-medium">
                            แพ็คเกจ
                        </button>
                        <button onClick={() => scrollToSection('contact')} className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all text-sm font-medium">
                            ติดต่อ
                        </button>
                        <button
                            onClick={() => scrollToSection('pricing')}
                            className="ml-2 px-5 py-2.5 bg-[#E8A08A] hover:bg-[#d89279] text-[#1A3C40] rounded-full text-sm font-semibold transition-all shadow-lg shadow-[#E8A08A]/25"
                        >
                            เริ่มสร้างเลย
                        </button>
                    </motion.nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-white/80 hover:text-white"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden absolute top-full left-0 right-0 bg-[#0F2A2E]/95 backdrop-blur-xl border-t border-white/10 px-4 py-4"
                    >
                        <div className="flex flex-col gap-2">
                            <button onClick={() => scrollToSection('experience')} className="text-left px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all font-medium">
                                ฟีเจอร์
                            </button>
                            <button onClick={() => scrollToSection('pricing')} className="text-left px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all font-medium">
                                แพ็คเกจ
                            </button>
                            <button onClick={() => scrollToSection('contact')} className="text-left px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all font-medium">
                                ติดต่อ
                            </button>
                            <button
                                onClick={() => scrollToSection('pricing')}
                                className="mt-2 px-4 py-3 bg-[#E8A08A] text-[#1A3C40] rounded-xl text-center font-semibold w-full"
                            >
                                เริ่มสร้างเลย
                            </button>
                        </div>
                    </motion.div>
                )}
            </header>

            {/* Main Hero Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-20 pb-32">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6 sm:mb-8"
                >
                    <Sparkles className="w-4 h-4 text-[#FFE5B4]" />
                    <span className="text-white/90 text-sm font-medium">Share Good Feelings Online</span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair font-bold text-white mb-4 sm:mb-6 leading-tight max-w-4xl"
                >
                    Express Your Feelings{' '}
                    <br />
                    <span className="text-[#FFE5B4] italic">Via Website</span>
                </motion.h1>

                {/* Subheading */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-base sm:text-lg md:text-xl text-white/70 max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4"
                >
                    บอกรักแฟน อวยพรวันเกิด ครบรอบ งานบวช หรือส่งการ์ดให้คนพิเศษ ด้วยเทมเพลตสุดพรีเมียม
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0"
                >
                    <button
                        onClick={() => scrollToSection('pricing')}
                        className="group flex items-center justify-center gap-2 bg-[#E8A08A] hover:bg-[#d89279] text-[#1A3C40] px-6 sm:px-8 py-4 rounded-2xl text-base sm:text-lg font-semibold shadow-lg shadow-[#E8A08A]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#E8A08A]/40"
                    >
                        <Heart className="w-5 h-5" fill="currentColor" />
                        <span>ดูแพ็คเกจทั้งหมด</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={() => navigate('/gallery')}
                        className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-6 sm:px-8 py-4 rounded-2xl text-base sm:text-lg font-medium transition-all"
                    >
                        <Play className="w-5 h-5" />
                        <span>ลองเล่น Playground</span>
                    </button>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 sm:mt-16 pt-8 border-t border-white/10 w-full max-w-lg"
                >
                    <div className="text-center">
                        <p className="text-2xl sm:text-3xl font-bold text-white">3</p>
                        <p className="text-xs sm:text-sm text-white/50 mt-1">เทมเพลต</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl sm:text-3xl font-bold text-white">{(89 + userCount).toLocaleString()}</p>
                        <p className="text-xs sm:text-sm text-white/50 mt-1">ผู้ใช้งาน</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl sm:text-3xl font-bold text-white">79฿</p>
                        <p className="text-xs sm:text-sm text-white/50 mt-1">เริ่มต้นเพียง</p>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator (Desktop only) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2"
            >
                <span className="text-white/40 text-xs uppercase tracking-widest">เลื่อนลง</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2"
                >
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;

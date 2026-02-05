import { motion } from 'framer-motion';
import { Check, Star, Music, Clock, Lock, Zap } from 'lucide-react';
import { useState } from 'react';

const tiers = [
    {
        id: 1,
        name: 'Basic Memory',
        price: '99',
        description: 'สำหรับความสำเร็จรูป รวดเร็ว',
        duration: 'อยู่ได้ 1-3 วัน',
        features: [
            'Template สำเร็จรูป (แก้ไขไม่ได้)',
            'ข้อความสั้นๆ ได้ใจความ',
            'โดเมนสุ่ม ({random}.norastory.com)',
            'Countdown นับถอยหลัง (Scarcity)'
        ],
        highlight: false,
        icon: Clock,
    },
    {
        id: 2,
        name: 'Standard Love',
        price: '259',
        description: 'เพิ่มความโรแมนติกด้วยเสียงเพลง',
        duration: 'อยู่ได้ 7 วัน',
        features: [
            'ทุกอย่างใน Basic',
            'เพิ่มรูปคู่รักได้ 2-5 รูป',
            'โดเมนสุ่ม ({random}.norastory.com)',
            'Background Music (Spotify/Youtube)'
        ],
        highlight: false,
        icon: Music,
    },
    {
        id: 3,
        name: 'Premium Valentine',
        price: '499',
        description: 'ความคุ้มค่าที่ดีที่สุด สำหรับคนพิเศษ',
        duration: 'อยู่ได้ 15 วัน',
        features: [
            'ทุกอย่างใน Standard',
            'เพิ่มรูปคู่รักได้สูงสุด 10 รูป',
            'โดเมนสุ่ม ({random}.norastory.com)',
            'Interactive & Animation ระดับสูง'
        ],
        highlight: true,
        tag: 'Best Seller / ดอกไม้ช่อใหญ่ 🌹',
        icon: Star,
    },
    {
        id: 4,
        name: 'Lifetime Archive',
        price: '1,290',
        description: 'ความทรงจำชั่วนิรันดร์',
        duration: 'ตลอดไป (Lifetime File)',
        features: [
            'Custom Sub-domain (ชื่อแฟน.norastory.com)',
            'เพิ่มรูปคู่รักได้สูงสุด 30 รูป',
            'แถมไฟล์ PDF/Video เก็บไว้ตลอดไป',
            'Priority Support & Full Customization'
        ],
        highlight: false,
        tag: 'Exclusive',
        icon: Lock,
    }
];

const Pricing = ({ onSelectTier, onViewDemos }) => {
    return (
        <section className="py-20 px-4 bg-[#FAFAFA]" id="pricing">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-playfair text-[#1A3C40] mb-4"
                    >
                        Choose Your <span className="text-[#E8A08A] italic">Love Tier</span>
                    </motion.h2>
                    <p className="text-[#4E6E81] text-lg font-light">เลือกแพ็คเกจที่เหมาะกับเรื่องราวความรักของคุณ</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {tiers.map((tier, index) => (
                        <motion.div
                            key={tier.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col h-full border transition-all duration-300 ${tier.highlight
                                ? 'bg-white border-[#E8A08A] shadow-[0_20px_40px_rgba(232,160,138,0.2)] md:scale-105 z-10 ring-4 ring-[#E8A08A]/10 pulse-glow'
                                : 'bg-white/50 border-gray-100 hover:border-[#E8A08A]/30 hover:shadow-xl'
                                }`}
                        >
                            {tier.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#E8A08A] text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg whitespace-nowrap">
                                    {tier.tag}
                                </div>
                            )}

                            <div className="mb-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${tier.highlight ? 'bg-[#E8A08A]/10 text-[#E8A08A]' : 'bg-gray-100 text-gray-500'}`}>
                                    <tier.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-[#1A3C40]">{tier.name}</h3>
                                <p className="text-sm text-gray-400 mt-2 min-h-[40px]">{tier.description}</p>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-baseline">
                                    <span className="text-4xl font-playfair font-bold text-[#1A3C40]">{tier.price}</span>
                                    <span className="text-gray-400 ml-2">บาท</span>
                                </div>
                                <div className="text-sm font-medium text-[#E8A08A] mt-2 bg-[#E8A08A]/5 inline-block px-3 py-1 rounded-lg">
                                    {tier.duration}
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {tier.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start text-sm text-gray-600">
                                        <Check className={`w-5 h-5 mr-3 flex-shrink-0 ${tier.highlight ? 'text-[#E8A08A]' : 'text-gray-300'}`} />
                                        <span className="leading-snug">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => onViewDemos(tier.id)}
                                className="w-full py-2 mb-3 rounded-xl font-medium text-sm text-gray-500 hover:text-[#E8A08A] hover:bg-[#E8A08A]/10 transition-colors"
                            >
                                ดูตัวอย่าง (3 รูปแบบ)
                            </button>

                            <button
                                onClick={() => onSelectTier(tier)}
                                className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${tier.highlight
                                    ? 'bg-[#1A3C40] text-white hover:bg-[#1A3C40]/90 shadow-lg hover:shadow-xl hover:-translate-y-1'
                                    : 'bg-white border-2 border-gray-100 text-gray-500 hover:border-[#1A3C40] hover:text-[#1A3C40]'
                                    }`}
                            >
                                เลือกแพ็คเกจนี้
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;

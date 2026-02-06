import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Music, Clock, Lock, Sparkles, ChevronRight } from 'lucide-react';

const tiers = [
    {
        id: 1,
        name: 'Basic',
        price: '99',
        description: 'เริ่มต้นความทรงจำ',
        duration: '3 วัน',
        features: [
            'Template สำเร็จรูป 7 แบบ',
            'ข้อความสั้นๆ ได้ใจความ',
            'โดเมนแบบสุ่ม',
            'Countdown นับถอยหลัง'
        ],
        highlight: false,
        icon: Clock,
        color: 'from-slate-500 to-slate-600',
        bgColor: 'bg-slate-50',
    },
    {
        id: 2,
        name: 'Standard',
        price: '249',
        description: 'เพิ่มรูปและเพลง',
        duration: '7 วัน',
        features: [
            'ทุกอย่างใน Basic',
            'อัปโหลดรูปได้ 5 รูป',
            'Background Music',
            'Template พรีเมียม 6 แบบ'
        ],
        highlight: true,
        tag: '🔥 Best Seller',
        icon: Music,
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
    },
    {
        id: 3,
        name: 'Premium Plus',
        price: '499',
        description: 'ยอดนิยมสำหรับคนพิเศษ',
        duration: '15 วัน',
        features: [
            'ทุกอย่างใน Standard',
            'อัปโหลดรูปได้ 10 รูป',
            'Interactive Animation',
            'Template Exclusive 6 แบบ'
        ],
        highlight: false,
        icon: Star,
        color: 'from-[#E8A08A] to-[#d4917b]',
        bgColor: 'bg-[#E8A08A]/5',
    },
    {
        id: 4,
        name: 'Lifetime Archive',
        price: '1,290',
        description: 'ความทรงจำชั่วนิรันดร์',
        duration: '30 วัน',
        features: [
            'อัปโหลดรูปได้ 30 รูป',
            'แถม PDF/Video เก็บถาวร',
            'Priority Support',
            'Custom Domain (+2,000฿)'
        ],
        highlight: false,
        tag: 'VIP',
        icon: Lock,
        color: 'from-amber-500 to-amber-600',
        bgColor: 'bg-amber-50',
        hasSubTiers: true,
        subTiers: [
            { days: 30, price: 1290, perDay: 43, label: '1 เดือน' },
            { days: 90, price: 2399, perDay: 27, label: '3 เดือน', discount: '38%' },
            { days: 180, price: 3199, perDay: 18, label: '6 เดือน', discount: '58%' },
            { days: 365, price: 4999, perDay: 14, label: '1 ปี', discount: '68%' },
        ],
        customDomainPrice: 2000,
    }
];

const Pricing = ({ onSelectTier, onViewDemos }) => {
    return (
        <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-white to-gray-50" id="pricing">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-[#E8A08A]/10 rounded-full px-4 py-2 mb-4"
                    >
                        <Sparkles className="w-4 h-4 text-[#E8A08A]" />
                        <span className="text-[#E8A08A] text-sm font-medium">Choose Your Plan</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-playfair text-[#1A3C40] mb-4"
                    >
                        Packages for <span className="text-[#E8A08A] italic">Special Ones</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 text-base sm:text-lg max-w-md mx-auto"
                    >
                        เลือกแพ็คเกจที่เหมาะกับความรักของคุณ
                    </motion.p>
                </div>

                {/* Pricing Cards - Mobile Horizontal Scroll, Desktop Grid */}
                <div className="relative">
                    {/* Mobile: Horizontal Scroll */}
                    <div className="flex lg:hidden overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
                        {tiers.map((tier, index) => (
                            <PricingCard
                                key={tier.id}
                                tier={tier}
                                index={index}
                                onSelectTier={onSelectTier}
                                onViewDemos={onViewDemos}
                                isMobile={true}
                            />
                        ))}
                    </div>

                    {/* Desktop: Grid */}
                    <div className="hidden lg:grid grid-cols-4 gap-6">
                        {tiers.map((tier, index) => (
                            <PricingCard
                                key={tier.id}
                                tier={tier}
                                index={index}
                                onSelectTier={onSelectTier}
                                onViewDemos={onViewDemos}
                                isMobile={false}
                            />
                        ))}
                    </div>
                </div>

                {/* Trust Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 sm:mt-16 text-center"
                >
                    <div className="inline-flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-gray-400 text-sm">
                        <span className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            ปลอดภัย 100%
                        </span>
                        <span className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            ชำระผ่าน PromptPay
                        </span>
                        <span className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            ได้รับลิงก์ภายใน 24 ชม.
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// Separate Pricing Card Component
const PricingCard = ({ tier, index, onSelectTier, onViewDemos, isMobile }) => {
    const [selectedSubTier, setSelectedSubTier] = useState(tier.subTiers ? tier.subTiers[0] : null);
    const [wantDomain, setWantDomain] = useState(false);

    const displayPrice = tier.hasSubTiers && selectedSubTier
        ? selectedSubTier.price.toLocaleString()
        : tier.price;

    const displayDuration = tier.hasSubTiers && selectedSubTier
        ? selectedSubTier.label
        : tier.duration;

    const totalPrice = tier.hasSubTiers && selectedSubTier
        ? selectedSubTier.price + (wantDomain ? tier.customDomainPrice : 0)
        : parseInt(tier.price.replace(',', ''));

    const handleSelectTier = () => {
        // Pass additional info for Lifetime Archive
        if (tier.hasSubTiers && selectedSubTier) {
            onSelectTier({
                ...tier,
                price: totalPrice.toLocaleString(),
                duration: selectedSubTier.label,
                selectedDays: selectedSubTier.days,
                wantCustomDomain: wantDomain,
            });
        } else {
            onSelectTier(tier);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`
                relative rounded-2xl sm:rounded-3xl flex flex-col
                ${isMobile ? 'min-w-[280px] snap-center' : ''}
                ${tier.highlight
                    ? 'bg-white shadow-2xl shadow-[#E8A08A]/20 border-2 border-[#E8A08A] lg:scale-105 z-10'
                    : 'bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl'
                }
                transition-all duration-300
            `}
        >
            {/* Tag */}
            {tier.tag && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold shadow-lg whitespace-nowrap
                    ${tier.highlight ? 'bg-[#E8A08A] text-white' : 'bg-amber-500 text-white'}
                `}>
                    {tier.tag}
                </div>
            )}

            {/* Card Content */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col">
                {/* Icon & Name */}
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center bg-gradient-to-br ${tier.color} text-white shadow-lg`}>
                        <tier.icon size={20} />
                    </div>
                    <div>
                        <h3 className="text-base sm:text-lg font-bold text-[#1A3C40]">{tier.name}</h3>
                        <p className="text-xs text-gray-400">{tier.description}</p>
                    </div>
                </div>

                {/* Sub-Tier Selector for Lifetime Archive */}
                {tier.hasSubTiers && tier.subTiers && (
                    <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">เลือกระยะเวลา:</p>
                        <div className="grid grid-cols-2 gap-2">
                            {tier.subTiers.map((sub) => (
                                <button
                                    key={sub.days}
                                    onClick={() => setSelectedSubTier(sub)}
                                    className={`relative p-2 rounded-lg text-center border-2 transition-all ${selectedSubTier?.days === sub.days
                                        ? 'border-amber-500 bg-amber-50'
                                        : 'border-gray-100 hover:border-gray-200'
                                        }`}
                                >
                                    {sub.discount && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                            -{sub.discount}
                                        </span>
                                    )}
                                    <p className="text-xs font-semibold text-[#1A3C40]">{sub.label}</p>
                                    <p className="text-[10px] text-gray-400">{sub.perDay}฿/วัน</p>
                                </button>
                            ))}
                        </div>

                        {/* Custom Domain Add-on */}
                        <label className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                            <input
                                type="checkbox"
                                checked={wantDomain}
                                onChange={(e) => setWantDomain(e.target.checked)}
                                className="w-4 h-4 accent-amber-500"
                            />
                            <span className="text-xs text-gray-600">
                                + Custom Domain <span className="text-amber-600 font-medium">(+2,000฿)</span>
                            </span>
                        </label>
                    </div>
                )}

                {/* Price */}
                <div className="mb-4 sm:mb-6">
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-bold text-[#1A3C40]">
                            {tier.hasSubTiers ? totalPrice.toLocaleString() : tier.price}
                        </span>
                        <span className="text-gray-400 text-sm">บาท</span>
                    </div>
                    <div className={`inline-block mt-2 px-2.5 py-1 rounded-lg text-xs font-medium ${tier.bgColor} text-gray-600`}>
                        ⏱️ {displayDuration}
                    </div>
                    {tier.hasSubTiers && selectedSubTier?.discount && (
                        <span className="ml-2 text-xs text-green-600 font-medium">ประหยัด {selectedSubTier.discount}</span>
                    )}
                </div>

                {/* Features */}
                <ul className="space-y-2.5 sm:space-y-3 mb-6 flex-1">
                    {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600">
                            <Check className={`w-4 h-4 mr-2 flex-shrink-0 mt-0.5 ${tier.highlight ? 'text-[#E8A08A]' : 'text-gray-300'}`} />
                            <span className="leading-snug">{feature}</span>
                        </li>
                    ))}
                </ul>

                {/* Buttons */}
                <div className="space-y-2">
                    <button
                        onClick={handleSelectTier}
                        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
                            ${tier.highlight
                                ? 'bg-gradient-to-r from-[#1A3C40] to-[#2a4c50] text-white hover:shadow-lg hover:-translate-y-0.5'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                        `}
                    >
                        เลือกแพ็คเกจนี้
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onViewDemos(tier.id)}
                        className="w-full py-2 text-sm text-gray-400 hover:text-[#E8A08A] transition-colors"
                    >
                        ดูตัวอย่าง →
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default Pricing;

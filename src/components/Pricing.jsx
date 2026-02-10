import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Music, Clock, Crown, Sparkles, ChevronRight, Gift, Zap, Heart, Globe } from 'lucide-react';

const tiers = [
    {
        id: 1,
        name: 'Trial',
        price: '79',
        originalPrice: '99',
        description: 'ทดลองใช้สั้นๆ',
        duration: '3 วัน',
        features: [
            'Template สำเร็จรูปพร้อมใช้',
            'มีลูกเล่นน่ารักๆ 💕',
            'Random Link + QR Code',
            'รองรับทุกอุปกรณ์',
            'ดูแลหลังการขาย'
        ],
        icon: Clock,
        gradient: 'from-slate-400 to-slate-500',
        bgGradient: 'from-slate-50 to-white',
        accentColor: 'slate',
    },
    {
        id: 2,
        name: 'Standard',
        price: '149',
        description: 'มาตรฐานยอดนิยม',
        duration: '7 วัน',
        features: [
            'ทุกอย่างใน Trial',
            'อัปโหลดรูป 5 รูป',
            'Background Music',
            'Random Link + QR Code',
            'ดูแลหลังการขาย'
        ],
        icon: Music,
        gradient: 'from-blue-400 to-blue-500',
        bgGradient: 'from-blue-50 to-white',
        accentColor: 'blue',
    },
    {
        id: 3,
        name: 'Premium',
        price: '299',
        description: 'สำหรับโอกาสพิเศษ',
        duration: '15 วัน',
        features: [
            'ทุกอย่างใน Standard',
            'อัปโหลดรูป 10 รูป',
            'Custom Link เลือกชื่อเอง',
            'Background Music',
            'Priority Support'
        ],
        highlight: true,
        tag: '⭐ แนะนำ',
        icon: Star,
        gradient: 'from-[#E8A08A] to-[#d4917b]',
        bgGradient: 'from-rose-50 via-pink-50 to-amber-50',
        accentColor: 'rose',
    },
];

const tier4 = {
    id: 4,
    name: 'Archive',
    tagline: 'เก็บความทรงจำอย่างพรีเมียม',
    description: 'แพ็คเกจสูงสุดสำหรับคนพิเศษ พร้อม Custom Subdomain และ Priority Support',
    icon: Crown,
    gradient: 'from-amber-400 via-orange-400 to-amber-500',
    subTiers: [
        { days: 30, price: 499, perDay: 16, label: '30 วัน' },
        { days: 60, price: 799, perDay: 13, label: '60 วัน', discount: '20%' },
        { days: 90, price: 999, perDay: 11, label: '90 วัน', discount: '33%', popular: true },
        { days: 180, price: 1490, perDay: 8, label: '180 วัน', discount: '50%', best: true },
    ],
    customDomainPrice: 990,
    features: [
        { icon: Gift, text: 'อัปโหลดรูปสูงสุด 20 รูป', highlight: true },
        { icon: Globe, text: 'Custom Link / Subdomain', highlight: true },
        { icon: Zap, text: 'Priority Support 24/7' },
        { icon: Heart, text: 'Background Music' },
        { icon: Star, text: 'Premium Templates' },
    ],
};

const Pricing = ({ onSelectTier, onViewDemos }) => {
    return (
        <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-white via-gray-50/50 to-white" id="pricing">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E8A08A]/20 to-amber-100/50 rounded-full px-5 py-2.5 mb-6 shadow-sm"
                    >
                        <Sparkles className="w-4 h-4 text-[#E8A08A]" />
                        <span className="text-[#1A3C40] text-sm font-medium">Choose Your Plan</span>
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

                {/* All 4 Tiers in One Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {tiers.map((tier, index) => (
                        <TierCard
                            key={tier.id}
                            tier={tier}
                            index={index}
                            onSelectTier={onSelectTier}
                            onViewDemos={onViewDemos}
                        />
                    ))}
                    <Tier4Card
                        tier={tier4}
                        onSelectTier={onSelectTier}
                        onViewDemos={onViewDemos}
                    />
                </div>

                {/* What You'll Get Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 sm:mt-16"
                >
                    <div className="text-center mb-8">
                        <h3 className="text-xl sm:text-2xl font-playfair font-bold text-[#1A3C40] mb-2">
                            สิ่งที่คุณจะได้รับ 🎁
                        </h3>
                        <p className="text-gray-500 text-sm">ทุกแพ็คเกจรับประกันความพึงพอใจ</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* 1. Purchase Link */}
                        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-5 text-center border border-rose-100 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                                <span className="text-2xl">🔗</span>
                            </div>
                            <h4 className="font-semibold text-[#1A3C40] text-sm mb-1">ลิงก์เว็บไซต์</h4>
                            <p className="text-xs text-gray-500">ลิงก์พร้อมใช้งานภายใน 24 ชม.</p>
                        </div>

                        {/* 2. Renewal Link */}
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 text-center border border-blue-100 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                                <span className="text-2xl">🔄</span>
                            </div>
                            <h4 className="font-semibold text-[#1A3C40] text-sm mb-1">ต่ออายุง่าย</h4>
                            <p className="text-xs text-gray-500">ลิงก์สำหรับต่ออายุการใช้งาน</p>
                        </div>

                        {/* 3. QR Code */}
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-5 text-center border border-purple-100 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                                <span className="text-2xl">📱</span>
                            </div>
                            <h4 className="font-semibold text-[#1A3C40] text-sm mb-1">QR Code</h4>
                            <p className="text-xs text-gray-500">สแกนเปิดเว็บได้ทันที</p>
                        </div>

                        {/* 4. After-sales Support */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 text-center border border-amber-100 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                                <span className="text-2xl">💬</span>
                            </div>
                            <h4 className="font-semibold text-[#1A3C40] text-sm mb-1">ดูแลหลังการขาย</h4>
                            <p className="text-xs text-gray-500">ติดต่อสอบถามได้ตลอด</p>
                        </div>
                    </div>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-10 text-center"
                >
                    <div className="inline-flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-gray-400 text-sm">
                        <span className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                <Check className="w-3 h-3 text-green-600" />
                            </div>
                            ปลอดภัย 100%
                        </span>
                        <span className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                <Check className="w-3 h-3 text-green-600" />
                            </div>
                            ชำระผ่าน PromptPay
                        </span>
                        <span className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                <Check className="w-3 h-3 text-green-600" />
                            </div>
                            ได้รับลิงก์ภายใน 24 ชม.
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// Tier 1-3 Card Component
const TierCard = ({ tier, index, onSelectTier, onViewDemos }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`
                relative rounded-2xl overflow-hidden
                ${tier.highlight
                    ? 'bg-gradient-to-br ' + tier.bgGradient + ' shadow-2xl shadow-rose-200/50 ring-2 ring-[#E8A08A] md:scale-105 z-10'
                    : 'bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl'
                }
                transition-all duration-300
            `}
        >
            {/* Tag */}
            {tier.tag && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#E8A08A] to-[#d4917b] text-white text-center py-1.5 text-xs font-semibold">
                    {tier.tag}
                </div>
            )}

            <div className={`p-6 ${tier.tag ? 'pt-10' : ''}`}>
                {/* Icon & Name */}
                <div className="flex items-center gap-3 mb-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${tier.gradient} text-white shadow-lg`}>
                        <tier.icon size={22} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[#1A3C40]">{tier.name}</h3>
                        <p className="text-xs text-gray-400">{tier.description}</p>
                    </div>
                </div>

                {/* Price */}
                <div className="mb-5">
                    <div className="flex items-baseline gap-2">
                        {tier.originalPrice && (
                            <span className="text-lg text-gray-300 line-through">{tier.originalPrice}</span>
                        )}
                        <span className={`text-4xl font-bold ${tier.highlight ? 'text-[#E8A08A]' : 'text-[#1A3C40]'}`}>
                            {tier.price}
                        </span>
                        <span className="text-gray-400 text-sm">บาท</span>
                    </div>
                    <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-${tier.accentColor}-100 text-${tier.accentColor}-600`}>
                        ⏱️ {tier.duration}
                    </div>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-6">
                    {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                            <div className={`w-5 h-5 rounded-full mr-2.5 flex items-center justify-center ${tier.highlight ? 'bg-[#E8A08A]/20' : 'bg-gray-100'}`}>
                                <Check className={`w-3 h-3 ${tier.highlight ? 'text-[#E8A08A]' : 'text-gray-400'}`} />
                            </div>
                            {feature}
                        </li>
                    ))}
                </ul>

                {/* Buttons */}
                <div className="space-y-2">
                    <button
                        onClick={() => onSelectTier(tier)}
                        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
                            ${tier.highlight
                                ? 'bg-gradient-to-r from-[#1A3C40] to-[#2a5c60] text-white hover:shadow-lg hover:-translate-y-0.5'
                                : 'bg-gray-100 text-[#1A3C40] hover:bg-gray-200'
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

// Tier 4 Premium Card (Single Column - matches other cards)
const Tier4Card = ({ tier, onSelectTier, onViewDemos }) => {
    const [selectedSubTier, setSelectedSubTier] = useState(tier.subTiers[0]); // Default to 30 days
    const [wantDomain, setWantDomain] = useState(false);

    const totalPrice = selectedSubTier.price + (wantDomain ? tier.customDomainPrice : 0);

    const handleSelect = () => {
        onSelectTier({
            ...tier,
            price: totalPrice.toLocaleString(),
            duration: selectedSubTier.label,
            selectedDays: selectedSubTier.days,
            wantCustomDomain: wantDomain,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-2 border-amber-300 shadow-xl hover:shadow-2xl transition-all"
        >
            {/* Premium Badge */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-white text-center py-1.5">
                <div className="flex items-center justify-center gap-1">
                    <Crown size={12} />
                    <span className="text-xs font-bold">👑 Premium</span>
                </div>
            </div>

            <div className="p-6 pt-10">
                {/* Icon & Name */}
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${tier.gradient} text-white shadow-lg`}>
                        <tier.icon size={22} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[#1A3C40]">{tier.name}</h3>
                        <p className="text-xs text-amber-600">{tier.tagline}</p>
                    </div>
                </div>

                {/* Duration Selector */}
                <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">เลือกระยะเวลา:</p>
                    <div className="grid grid-cols-2 gap-1.5">
                        {tier.subTiers.map((sub) => (
                            <button
                                key={sub.days}
                                onClick={() => setSelectedSubTier(sub)}
                                className={`relative p-2 rounded-lg text-center border transition-all ${selectedSubTier?.days === sub.days
                                    ? 'border-amber-500 bg-amber-100 shadow-sm'
                                    : 'border-gray-200 bg-white hover:border-amber-300'
                                    }`}
                            >
                                {sub.discount && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                                        -{sub.discount}
                                    </span>
                                )}
                                <p className="text-xs font-bold text-[#1A3C40]">{sub.label}</p>
                                <p className="text-[10px] text-amber-600">{sub.perDay}฿/วัน</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-amber-600">{totalPrice.toLocaleString()}</span>
                        <span className="text-gray-400 text-sm">บาท</span>
                    </div>
                    <div className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        ⏱️ {selectedSubTier.label}
                    </div>
                    {selectedSubTier?.discount && (
                        <span className="ml-2 text-xs text-green-600 font-medium">ประหยัด {selectedSubTier.discount}</span>
                    )}
                </div>

                {/* Custom Domain Add-on */}
                <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white/80 border border-amber-200 cursor-pointer hover:bg-amber-50 transition-all mb-4">
                    <input
                        type="checkbox"
                        checked={wantDomain}
                        onChange={(e) => setWantDomain(e.target.checked)}
                        className="w-4 h-4 accent-amber-500"
                    />
                    <div className="flex-1">
                        <p className="text-xs font-medium text-[#1A3C40]">+ Special Link</p>
                        <p className="text-[10px] text-gray-400">yourname.norastory.com</p>
                    </div>
                    <span className="text-amber-600 font-bold text-xs">+990฿</span>
                </label>

                {/* Features */}
                <ul className="space-y-2 mb-5">
                    {tier.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                            <div className="w-5 h-5 rounded-full mr-2 flex items-center justify-center bg-amber-100">
                                <Check className="w-3 h-3 text-amber-600" />
                            </div>
                            <span className="text-xs">{feature.text}</span>
                        </li>
                    ))}
                </ul>

                {/* Buttons */}
                <div className="space-y-2">
                    <button
                        onClick={handleSelect}
                        className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                        <Crown size={16} />
                        เลือกแพ็คเกจนี้
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onViewDemos(tier.id)}
                        className="w-full py-2 text-sm text-amber-600 hover:text-amber-700 transition-colors"
                    >
                        ดูตัวอย่าง →
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default Pricing;


import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Sparkles, Globe, RefreshCcw, QrCode, MessageCircle, Info, X } from 'lucide-react';
import { TIERS } from '../data/tierData';

const tiers = TIERS.filter(t => t.id !== '4');
const tier4 = TIERS.find(t => t.id === '4');

const Pricing = ({ onSelectTier, onViewDemos }) => {
    return (
        <section className="py-8 sm:py-28 px-4 bg-white" id="pricing">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-4 sm:mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 text-rose-500 mb-6"
                    >
                        <Sparkles size={16} />
                        <span className="text-sm font-medium">Pricing Plans</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-playfair text-[#1A3C40] mb-4"
                    >
                        Choose the Right Plan for You
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-sm sm:text-base max-w-md mx-auto"
                    >
                        แพ็คเกจทุกระดับ ออกแบบมาเพื่อความทรงจำที่งดงาม
                    </motion.p>
                </div>

                {/* All 4 Tiers in One Row */}
                {/* All 4 Tiers in One Row */}
                <div className="flex overflow-x-auto snap-x snap-mandatory pb-6 gap-4 -mx-4 px-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0 items-start">
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
                    className="mt-4 sm:mt-16"
                >
                    <div className="text-center mb-10">
                        <h3 className="text-xl sm:text-2xl font-playfair text-[#1A3C40] mb-2">
                            สิ่งที่คุณจะได้รับ
                        </h3>
                        <p className="text-gray-400 text-sm">ทุกแพ็คเกจรับประกันความพึงพอใจ</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <BenefitCard icon={Globe} color="rose" label="ลิงก์เว็บไซต์" desc="ลิงก์พร้อมใช้งานภายใน 24 ชม." />
                        <BenefitCard icon={RefreshCcw} color="amber" label="ต่ออายุง่าย" desc="ลิงก์สำหรับต่ออายุการใช้งาน" />
                        <BenefitCard icon={QrCode} color="blue" label="QR Code" desc="สแกนเปิดเว็บได้ทันที" />
                        <BenefitCard icon={MessageCircle} color="emerald" label="ดูแลหลังการขาย" desc="ติดต่อสอบถามได้ตลอด" />
                    </div>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-12 text-gray-400 text-xs uppercase tracking-wider">
                        <span>ปลอดภัย 100%</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block" />
                        <span>ชำระผ่าน PromptPay</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block" />
                        <span>ได้รับลิงก์ภายใน 24 ชม.</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// Benefit Card (minimalist with accent)
const BenefitCard = ({ icon: Icon, label, desc, color }) => (
    <div className={`border border-gray-100 rounded-2xl p-5 text-center hover:border-${color}-200 hover:shadow-lg hover:shadow-${color}-100/50 transition-all duration-300 group bg-white h-full flex flex-col items-center justify-center`}>
        <div className={`w-12 h-12 mb-3 rounded-full bg-${color}-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 text-${color}-500`} />
        </div>
        <h4 className="font-playfair font-semibold text-[#1A3C40] text-sm mb-1">{label}</h4>
        <p className="text-xs text-gray-400">{desc}</p>
    </div>
);

// Tier 1-3 Card Component
const TierCard = ({ tier, index, onSelectTier, onViewDemos }) => {
    const borderAccents = {
        slate: 'border-t-slate-400',
        blue: 'border-t-blue-400',
        rose: 'border-t-rose-400',
        amber: 'border-t-amber-400'
    };
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`
                relative rounded-2xl overflow-hidden
                ${tier.highlight
                    ? 'border-2 border-[#E8A08A] shadow-lg shadow-[#E8A08A]/10'
                    : `border border-gray-200 border-t-4 ${borderAccents[tier.accentColor]} hover:border-gray-300 hover:shadow-md`
                }
                bg-white transition-all duration-300
                h-full flex flex-col
                min-w-[85%] sm:min-w-0 snap-center
                max-h-[60vh] sm:max-h-full overflow-hidden
            `}
        >
            {/* Recommended Tag */}
            {tier.tag && (
                <div className="bg-gradient-to-r from-[#E8A08A] to-[#d4917b] text-white text-center py-2 text-xs font-medium tracking-wide">
                    {tier.tag}
                </div>
            )}

            {/* Content Split for Sticky Header on Mobile */}
            <div className="p-6 sm:p-7 flex flex-col h-full overflow-hidden">
                {/* Fixed Header Part (Name, Price, CTA) */}
                <div className="shrink-0 pb-4">
                    {/* Name & Description */}
                    <div className="mb-4 sm:mb-5">
                        <h3 className="text-lg font-playfair font-semibold text-[#1A3C40]">{tier.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{tier.description}</p>
                    </div>

                    {/* Price */}
                    <div className="mb-4 sm:mb-6">
                        <div className="flex items-baseline gap-2">
                            {tier.originalPrice && (
                                <span className="text-sm text-gray-300 line-through">{tier.originalPrice}฿</span>
                            )}
                            <span className="text-4xl font-playfair font-bold text-[#1A3C40]">
                                {tier.price}
                            </span>
                            <span className="text-gray-400 text-sm">บาท</span>
                        </div>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-${tier.accentColor}-50 text-${tier.accentColor}-500`}>{tier.duration}</span>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={() => onSelectTier(tier)}
                        className={`w-full py-3 rounded-xl font-medium text-sm transition-all duration-300
                            ${tier.highlight
                                ? 'bg-gradient-to-r from-[#E8A08A] to-[#d4917b] text-white hover:shadow-lg hover:shadow-[#E8A08A]/25'
                                : `border border-${tier.accentColor}-300 text-${tier.accentColor}-600 hover:bg-${tier.accentColor}-50`
                            }
                        `}
                    >
                        เลือกแพ็คเกจนี้
                    </button>
                </div>

                {/* Scrollable Features Part */}
                <div className="flex-1 overflow-y-auto sm:overflow-visible pr-1 -mr-1 custom-scrollbar">
                    {/* Divider */}
                    <div className="border-t border-gray-100 mb-5" />

                    {/* Features */}
                    <ul className="space-y-3 pb-2">
                        {tier.features.map((feature, idx) => (
                            feature && (
                                <li key={idx} className="flex items-start text-sm text-gray-500">
                                    <Check className={`w-4 h-4 text-${tier.accentColor}-400 mr-2.5 mt-0.5 flex-shrink-0`} />
                                    {feature}
                                </li>
                            )
                        ))}
                    </ul>

                    {/* View Demos */}
                    <button
                        onClick={() => onViewDemos(tier.id)}
                        className="mt-5 text-xs text-gray-400 hover:text-[#1A3C40] transition-colors text-center w-full block"
                    >
                        ดูตัวอย่าง →
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// Tier 4 Premium Card
const Tier4Card = ({ tier, onSelectTier, onViewDemos }) => {
    const [selectedSubTier, setSelectedSubTier] = useState(tier.subTiers[0]);
    const [wantDomain, setWantDomain] = useState(false);
    const [showFeatures, setShowFeatures] = useState(false);

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
            className="relative rounded-2xl overflow-hidden border-2 border-amber-300 bg-white shadow-lg shadow-amber-100/50 h-full flex flex-col min-w-[85%] sm:min-w-0 snap-center max-h-[60vh] sm:max-h-full"
        >
            {/* Premium Badge */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center py-2 text-xs font-medium tracking-wide uppercase">
                EXCLUSIVE
            </div>

            <div className="p-6 sm:p-7 flex flex-col h-full overflow-hidden relative">
                {/* Info Icon for Mobile/Small screens */}
                <button
                    onClick={() => setShowFeatures(true)}
                    className="absolute top-0 right-2 p-2 text-gray-300 hover:text-[#1A3C40] transition-colors z-10"
                    aria-label="See features"
                >
                    <Info size={18} />
                </button>

                {/* Fixed Header Part */}
                <div className="shrink-0 pb-4">
                    {/* Name */}
                    <div className="mb-4 sm:mb-5">
                        <h3 className="text-lg font-playfair font-semibold text-[#1A3C40]">{tier.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{tier.tagline}</p>
                    </div>

                    {/* Duration Selector */}
                    <div className="mb-4 sm:mb-5">
                        <p className="text-xs text-gray-400 mb-2">เลือกระยะเวลา</p>
                        <div className="grid grid-cols-2 gap-2">
                            {tier.subTiers.map((sub) => (
                                <button
                                    key={sub.days}
                                    onClick={() => setSelectedSubTier(sub)}
                                    className={`relative py-2.5 px-3 rounded-lg text-center border transition-all text-xs
                                        ${selectedSubTier?.days === sub.days
                                            ? 'border-[#1A3C40] bg-[#1A3C40]/5 font-semibold text-[#1A3C40]'
                                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                        }`}
                                >
                                    {sub.discount && (
                                        <span className="absolute -top-2 -right-2 bg-[#E8A08A] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                                            -{sub.discount}
                                        </span>
                                    )}
                                    <p className="font-medium">{sub.label}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">{sub.perDay}฿/วัน</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price */}
                    <div className="mb-4 sm:mb-5">
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-playfair font-bold text-amber-600">{totalPrice.toLocaleString()}</span>
                            <span className="text-gray-400 text-sm">บาท</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{selectedSubTier.label}</p>
                        {selectedSubTier?.discount && (
                            <span className="text-xs text-[#E8A08A] font-medium">ประหยัด {selectedSubTier.discount}</span>
                        )}
                    </div>

                    {/* Custom Domain Add-on */}
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:border-gray-300 transition-all mb-4 sm:mb-5">
                        <input
                            type="checkbox"
                            checked={wantDomain}
                            onChange={(e) => setWantDomain(e.target.checked)}
                            className="w-4 h-4 accent-[#1A3C40] rounded"
                        />
                        <div className="flex-1">
                            <p className="text-xs font-medium text-[#1A3C40]">Special Link</p>
                            <p className="text-[10px] text-gray-400">yourname.norastory.com</p>
                        </div>
                        <span className="text-[#1A3C40] font-semibold text-xs">+990฿</span>
                    </label>

                    {/* CTA Button */}
                    <button
                        onClick={handleSelect}
                        className="w-full py-3 rounded-xl font-medium text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-200/50 transition-all duration-300"
                    >
                        เลือกแพ็คเกจนี้
                    </button>
                </div>

                {/* Scrollable Features Part - Conditional Overlay */}
                <div className={`
                    flex-1 overflow-y-auto custom-scrollbar transition-all duration-300
                    ${showFeatures ? 'absolute inset-0 z-30 bg-white p-6' : 'pr-1 -mr-1'}
                `}>
                    {/* Close Button for Overlay */}
                    {showFeatures && (
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-playfair font-bold text-xl text-[#1A3C40]">สิ่งที่คุณจะได้รับ</h4>
                            <button
                                onClick={() => setShowFeatures(false)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                    )}

                    {!showFeatures && <div className="border-t border-gray-100 mb-5" />}

                    {/* Features */}
                    <ul className="space-y-3 pb-2">
                        {tier.features.map((feature, idx) => (
                            feature && (
                                <li key={idx} className="flex items-start text-sm text-gray-500">
                                    <Check className="w-4 h-4 text-amber-500 mr-2.5 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs">{feature.text || feature}</span>
                                </li>
                            )
                        ))}
                    </ul>

                    {/* View Demos */}
                    <button
                        onClick={() => onViewDemos(tier.id)}
                        className="mt-5 text-xs text-gray-400 hover:text-[#1A3C40] transition-colors text-center w-full block"
                    >
                        ดูตัวอย่าง →
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default Pricing;

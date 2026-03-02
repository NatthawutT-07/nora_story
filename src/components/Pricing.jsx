import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Eye, Shield, Clock, Globe, Heart, Star, Info, X } from 'lucide-react';
import { TIERS } from '../data/tierData';

const tiers = TIERS.filter(t => t.id !== '4');

const Pricing = ({ onSelectTier, onViewDemos }) => {
    return (
        <section className="py-16 sm:py-28 px-4 bg-gradient-to-b from-[#FAFAFB] to-white" id="pricing">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10 sm:mb-14">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[#E8A08A] text-sm font-medium tracking-widest uppercase mb-4"
                    >
                        Pricing
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl font-playfair font-bold text-[#1A3C40] mb-3"
                    >
                        Choose the package that's right for you.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed"
                    >
                        ทุกแพ็คเกจมาพร้อมดีไซน์คุณภาพ และบริการดูแลหลังการขาย
                    </motion.p>
                </div>

                {/* Pricing Cards */}
                <div className="flex overflow-x-auto snap-x snap-mandatory pt-4 pb-6 gap-5 -mx-4 px-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 sm:overflow-visible sm:pt-4 sm:pb-0 sm:mx-0 sm:px-0" style={{ alignItems: 'stretch' }}>
                    {/* Gallery Card */}
                    <GalleryCard onViewDemos={onViewDemos} />

                    {/* Tier Cards */}
                    {tiers.map((tier, index) => (
                        <TierCard
                            key={tier.id}
                            tier={tier}
                            index={index + 1}
                            onSelectTier={onSelectTier}
                            onViewDemos={onViewDemos}
                        />
                    ))}
                </div>

                {/* Trust Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-14 sm:mt-20"
                >
                    {/* Trust Badges */}
                    <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 mb-10">
                        <TrustBadge icon={Shield} text="ชำระเงินปลอดภัย" />
                        <TrustBadge icon={Clock} text="ได้รับลิงก์ทันทีหลังผ่านการตรวจสอบ" />
                        <TrustBadge icon={Heart} text="ดูแลหลังการขาย" />
                    </div>

                    {/* Benefits */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        <BenefitCard icon={Globe} label="ลิงก์เว็บไซต์" desc="พร้อมใช้งานทันที" />
                        <BenefitCard icon={Star} label="ดีไซน์พรีเมียม" desc="ออกแบบอย่างพิถีพิถัน" />
                        <BenefitCard icon={Shield} label="QR Code" desc="สแกนเปิดเว็บได้ทันที" />
                        <BenefitCard icon={Heart} label="ต่ออายุง่าย" desc="ขยายเวลาได้ตลอด" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// Trust Badge
const TrustBadge = ({ icon: Icon, text }) => (
    <div className="flex items-center gap-2 text-gray-400">
        <Icon className="w-4 h-4" />
        <span className="text-xs tracking-wide">{text}</span>
    </div>
);

// Benefit Card
const BenefitCard = ({ icon: Icon, label, desc }) => (
    <div className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:shadow-sm transition-shadow duration-300">
        <div className="w-9 h-9 mx-auto mb-2.5 rounded-lg bg-[#F8F4F1] flex items-center justify-center">
            <Icon className="w-4 h-4 text-[#1A3C40]" />
        </div>
        <h4 className="font-medium text-[#1A3C40] text-xs mb-0.5">{label}</h4>
        <p className="text-[10px] text-gray-400">{desc}</p>
    </div>
);

// Gallery Card
const GalleryCard = ({ onViewDemos }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onClick={() => onViewDemos('1')}
        className="relative rounded-2xl border border-gray-200 bg-white hover:shadow-md transition-all duration-300 flex flex-col min-w-[80%] sm:min-w-0 snap-center cursor-pointer group self-stretch"
    >
        <div className="p-6 sm:p-7 flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8 sm:py-10">
                <div className="w-14 h-14 rounded-xl bg-[#F8F4F1] flex items-center justify-center mb-5 group-hover:bg-[#1A3C40]/10 transition-colors">
                    <Eye className="w-6 h-6 text-[#1A3C40]" />
                </div>
                <h3 className="text-lg font-playfair font-bold text-[#1A3C40] mb-2">ดูตัวอย่าง</h3>
                <p className="text-xs text-gray-400 max-w-[180px] mx-auto leading-relaxed">
                    เลือกชมดีไซน์และเทมเพลตทั้งหมดก่อนตัดสินใจ
                </p>
            </div>

            <div className="w-full mt-auto py-3 rounded-xl text-sm font-medium border border-gray-200 text-[#1A3C40] group-hover:bg-[#F8F4F1] transition-all duration-300 flex items-center justify-center gap-2">
                ดูแบบทั้งหมด
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
        </div>
    </motion.div>
);

// Tier Card component (Flippable)
const TierCard = ({ tier, index, onSelectTier, onViewDemos }) => {
    const [wantDomain, setWantDomain] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    const basePrice = typeof tier.price === 'string' ? parseInt(tier.price.replace(/,/g, ''), 10) : tier.price;
    const totalPrice = basePrice + (wantDomain ? 999 : 0);

    const handleSelect = () => {
        onSelectTier({
            ...tier,
            price: totalPrice.toLocaleString(),
            wantCustomDomain: wantDomain,
            customDomainPrice: 999
        });
    };

    const isPopular = tier.highlight;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="relative min-w-[80%] sm:min-w-0 snap-center perspective-1000 self-stretch"
            style={{ perspective: '1000px' }}
        >
            <motion.div
                className="w-full h-full relative preserve-3d transition-transform duration-500"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* --- FRONT OF CARD --- */}
                <div
                    className={`
                        backface-hidden flex flex-col rounded-2xl h-full
                        ${isPopular
                            ? 'bg-[#1A3C40] text-white shadow-xl shadow-[#1A3C40]/15 ring-1 ring-[#1A3C40]'
                            : 'bg-white border border-gray-200 hover:shadow-md hover:border-gray-300'
                        }
                    `}
                    style={{ backfaceVisibility: 'hidden', position: 'relative' }}
                >
                    {/* Info Icon (Flip Button) */}
                    {tier.extensionTiers && tier.extensionTiers.length > 0 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
                            className={`absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isPopular ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-400'
                                }`}
                        >
                            <Info size={16} />
                        </button>
                    )}

                    {/* Popular Badge */}
                    {tier.tag && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                            <span className="bg-[#E8A08A] text-white text-[10px] font-bold px-4 py-1.5 rounded-full tracking-wide shadow-sm">
                                {tier.tag}
                            </span>
                        </div>
                    )}

                    <div className={`p-6 sm:p-7 flex flex-col h-full ${tier.tag ? 'pt-8' : ''}`}>
                        {/* Tier Name */}
                        <div className="mb-5 pr-8">
                            <h3 className={`text-base font-semibold tracking-tight ${isPopular ? 'text-white' : 'text-[#1A3C40]'}`}>
                                {tier.name}
                            </h3>
                            <p className={`text-xs mt-1 ${isPopular ? 'text-white/60' : 'text-gray-400'}`}>
                                {tier.description}
                            </p>
                        </div>

                        {/* Price */}
                        <div className="mb-5">
                            <div className="flex items-baseline gap-1.5">
                                {tier.originalPrice && (
                                    <span className={`text-sm line-through ${isPopular ? 'text-white/30' : 'text-gray-300'}`}>
                                        {tier.originalPrice}฿
                                    </span>
                                )}
                                <span className={`text-3xl sm:text-4xl font-playfair font-bold tracking-tight ${isPopular ? 'text-white' : 'text-[#1A3C40]'}`}>
                                    {totalPrice.toLocaleString()}
                                </span>
                                <span className={`text-sm ${isPopular ? 'text-white/50' : 'text-gray-400'}`}>บาท</span>
                            </div>
                            <p className={`text-xs mt-1.5 ${isPopular ? 'text-white/50' : 'text-gray-400'}`}>
                                เริ่มต้น {tier.duration}
                            </p>
                        </div>

                        {/* Custom Link Add-on */}
                        <label className={`
                            flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-5
                            ${isPopular
                                ? 'border border-white/15 hover:border-white/30 bg-white/5'
                                : 'border border-gray-100 hover:border-gray-200 bg-gray-50/50'
                            }
                        `}>
                            <input
                                type="checkbox"
                                checked={wantDomain}
                                onChange={(e) => setWantDomain(e.target.checked)}
                                className="w-3.5 h-3.5 accent-[#E8A08A] rounded cursor-pointer"
                            />
                            <div className="flex-1 min-w-0">
                                <p className={`text-xs font-medium ${isPopular ? 'text-white' : 'text-[#1A3C40]'}`}>
                                    {String(tier.id) === '3' ? 'Special Link' : 'Special Link'}
                                </p>
                                <p className={`text-[10px] ${isPopular ? 'text-white/40' : 'text-gray-400'}`}>
                                    {String(tier.id) === '3' ? 'ชื่อพิเศษไม่ซ้ำใคร' : 'yourname.norastory.com'}
                                </p>
                            </div>
                            <span className={`text-xs font-semibold whitespace-nowrap ${isPopular ? 'text-[#E8A08A]' : 'text-[#1A3C40]'}`}>+999฿</span>
                        </label>

                        {/* CTA */}
                        <button
                            onClick={handleSelect}
                            className={`
                                w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300
                                ${isPopular
                                    ? 'bg-white text-[#1A3C40] hover:bg-gray-100'
                                    : 'bg-[#1A3C40] text-white hover:bg-[#152f33]'
                                }
                            `}
                        >
                            เลือกแพ็คเกจนี้
                        </button>

                        {/* Divider */}
                        <div className={`h-px w-full my-5 flex-shrink-0 ${isPopular ? 'bg-white/10' : 'bg-gray-100'}`} />

                        {/* Features */}
                        <ul className="space-y-3 flex-1 overflow-y-auto">
                            {tier.features.map((feature, idx) => (
                                feature && (
                                    <li key={idx} className={`flex items-start text-xs leading-relaxed ${isPopular ? 'text-white/70' : 'text-gray-500'}`}>
                                        <Check className={`w-3.5 h-3.5 mr-2 mt-0.5 flex-shrink-0 ${isPopular ? 'text-[#E8A08A]' : 'text-[#1A3C40]'}`} strokeWidth={2.5} />
                                        {feature}
                                    </li>
                                )
                            ))}
                        </ul>
                    </div>
                </div>

                {/* --- BACK OF CARD (Extension Pricing) --- */}
                <div
                    className={`
                        absolute inset-0 backface-hidden flex flex-col rounded-2xl p-6 sm:p-7 cursor-pointer
                        ${isPopular
                            ? 'bg-[#152f33] text-white border border-[#1A3C40]'
                            : 'bg-gray-50 border border-gray-200'
                        }
                    `}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    onClick={() => setIsFlipped(false)}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className={`text-sm font-bold tracking-wider uppercase ${isPopular ? 'text-[#E8A08A]' : 'text-[#1A3C40]'}`}>
                            ราคาต่ออายุแพ็กเกจ
                        </h3>
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
                            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isPopular ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white border border-gray-200 hover:bg-gray-100 text-gray-500'
                                }`}
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="flex-1">
                        <p className={`text-xs mb-6 leading-relaxed ${isPopular ? 'text-white/60' : 'text-gray-500'}`}>
                            หากแพ็กเกจ {tier.name} หมดอายุแล้ว คุณสามารถต่ออายุเพิ่มได้ในราคาพิเศษ เพื่อเก็บความทรงจำไว้ได้นานยิ่งขึ้น
                        </p>

                        <div className="space-y-3">
                            {tier.extensionTiers?.map((ext, idx) => (
                                <div
                                    key={idx}
                                    className={`
                                        flex justify-between items-center p-4 rounded-xl transition-all
                                        ${ext.popular
                                            ? (isPopular ? 'bg-white/10 ring-1 ring-[#E8A08A]/30' : 'bg-white shadow-sm ring-1 ring-[#E8A08A]/30')
                                            : (isPopular ? 'bg-white/5 border border-white/5' : 'bg-white border border-gray-100')
                                        }
                                    `}
                                >
                                    <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-3 flex-1 min-w-0 pr-2">
                                        <div className="flex flex-wrap items-center gap-1.5 xs:gap-2">
                                            <span className={`text-sm font-medium ${isPopular ? 'text-white' : 'text-[#1A3C40]'}`}>
                                                {ext.label}
                                            </span>
                                            {ext.popular && (
                                                <span className="bg-[#E8A08A]/10 text-[#E8A08A] text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                                                    ยอดนิยม
                                                </span>
                                            )}
                                            {ext.best && (
                                                <span className="bg-amber-100 text-amber-600 text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                                                    คุ้มสุด
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`text-sm font-bold flex-shrink-0 ${isPopular ? 'text-[#E8A08A]' : 'text-[#1A3C40]'}`}>
                                        + {ext.price}฿
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto pt-6 text-center">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
                            className={`text-xs font-semibold underline underline-offset-4 ${isPopular ? 'text-white/50 hover:text-white' : 'text-gray-400 hover:text-[#1A3C40]'}`}
                        >
                            กลับไปหน้าตัวเลือกเดิม
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Pricing;

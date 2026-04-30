import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Heart, Mail, Star, Sparkles, Camera, ScrollText } from 'lucide-react';
import { getTemplatesByTier } from '../lib/templateRegistry';
import { TIERS } from '../data/tierData';

const tierData = TIERS.filter(t => t.id !== '4').reduce((acc, t) => {
    acc[t.slug] = t;
    return acc;
}, {});

// Helper for beautiful placeholders
const TemplateThumbnail = ({ id, name, isDisabled }) => {
    const isIcon = (IconComponent, bgClass, colorClass) => (
        <div className={`w-full aspect-[4/3] rounded-t-xl flex items-center justify-center ${isDisabled ? 'bg-gray-100' : bgClass} transition-colors`}>
            <IconComponent size={40} className={isDisabled ? 'text-gray-300' : colorClass} strokeWidth={1.5} />
        </div>
    );

    if (id === 't1-1') return isIcon(Mail, 'bg-rose-50', 'text-rose-400');
    if (id === 't2-1') return isIcon(Heart, 'bg-blue-50', 'text-blue-400');
    if (id === 't3-1') return isIcon(ScrollText, 'bg-[#FFF0F3]', 'text-[#FF8FAB]');

    if (name.includes('Ordination') || name.includes('Merit') || name.includes('Clear')) return isIcon(Star, 'bg-gray-50', 'text-amber-500');
    if (name.includes('Wedding')) return isIcon(Sparkles, 'bg-gray-50', 'text-pink-400');
    if (name.includes('Gallery')) return isIcon(Camera, 'bg-gray-50', 'text-purple-400');

    return isIcon(Heart, 'bg-gray-50', 'text-gray-400');
};

const TierGallery = ({ tierIdProp, onBack, onSelectDemo }) => {
    const location = useLocation();

    let initialTier = 't1';
    if (tierIdProp && tierData[tierIdProp]) {
        initialTier = tierIdProp;
    } else if (location.state?.tierId && tierData[location.state.tierId]) {
        initialTier = location.state.tierId;
    }

    const [activeTier, setActiveTier] = useState(initialTier);

    useEffect(() => {
        if (location.state?.tierId && tierData[location.state.tierId]) {
            setActiveTier(location.state.tierId);
        }
    }, [location.state]);

    const tier = tierData[activeTier] || tierData['t1'];

    const handleBack = () => {
        if (onBack) onBack();
    };

    const handleDemoClick = (demoId) => {
        const numericId = demoId.split('-')[1];
        if (onSelectDemo) {
            onSelectDemo(activeTier, numericId);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9F9F9] font-sans">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-[#F9F9F9]/90 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 pt-4 pb-3 sm:pt-10 sm:pb-5">
                    <div className="flex items-center justify-between">
                        {/* Left: Back Button */}
                        <div className="flex-1">
                            <button
                                onClick={handleBack}
                                className="inline-flex items-center gap-1.5 text-gray-500 hover:text-[#1A3C40] transition-colors py-2 group"
                            >
                                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                <span className="text-xs sm:text-sm font-medium">กลับ</span>
                            </button>
                        </div>

                        {/* Center: Title & Badge */}
                        <div className="flex-[2] flex flex-col items-center">
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-1.5 bg-white rounded-full px-2.5 py-0.5 mb-1.5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-gray-100/50"
                            >
                                <Sparkles className="w-2.5 h-2.5 text-[#E8A08A]" />
                                <span className="text-gray-500 text-[9px] sm:text-[10px] font-medium tracking-wide uppercase">All Templates</span>
                            </motion.div>

                            <h1 className="text-lg sm:text-2xl font-bold text-[#1A3C40] flex items-center gap-1.5 leading-none">
                                Template <span className="text-[#E8A08A] font-playfair italic font-medium">Gallery</span>
                            </h1>
                        </div>

                        {/* Right: Spacer to keep center centered */}
                        <div className="flex-1"></div>
                    </div>
                </div>

                {/* Tier Tabs (Pill Style) */}
                <div className="max-w-6xl mx-auto px-4 pb-4">
                    <div className="flex justify-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide py-1">
                        {Object.entries(tierData).map(([key, data]) => {
                            const isActive = activeTier === key;
                            const templatesCount = getTemplatesByTier(data.id).length;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveTier(key)}
                                    className={`
                                        flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-500 font-semibold text-sm border-2
                                        ${isActive
                                            ? `bg-[#1A3C40] text-white border-[#1A3C40] shadow-lg shadow-[#1A3C40]/10 scale-105`
                                            : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    <span>{data.name}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        {templatesCount}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-3 sm:py-8">
                {/* Active Package Info Summary - Compact for Mobile */}
                <motion.div
                    key={`info-${activeTier}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-4 sm:p-6 mb-4 sm:mb-8 border border-gray-100/80 shadow-sm flex items-center justify-between gap-4 relative overflow-hidden group"
                >
                    <div className="flex flex-col gap-0.5 relative z-10">
                        <div className="flex items-center gap-2">
                            <h2 className="text-base sm:text-xl font-bold text-[#1A3C40]">{tier.name}</h2>
                            <div className="text-[10px] font-bold text-[#E8A08A] bg-[#FFF5F2] px-2 py-0.5 rounded-md">
                                {tier.duration}
                            </div>
                        </div>
                        <p className="hidden sm:block text-gray-500 text-sm">{tier.description}</p>
                    </div>

                    <div className="flex items-baseline gap-1 relative z-10">
                        <span className="text-[10px] font-medium text-gray-400">เริ่ม</span>
                        <span className="text-2xl sm:text-3xl font-black text-[#1A3C40]">{tier.price}</span>
                        <span className="text-sm font-bold text-[#1A3C40]">฿</span>
                    </div>
                </motion.div>

                {/* Template Grid Section */}
                <div className="mb-3 sm:mb-4 flex items-center justify-between">
                    <h3 className="text-gray-400 text-[11px] sm:text-sm font-medium uppercase tracking-wider">Templates</h3>
                    <div className="h-px flex-1 bg-gray-100 ml-4 hidden sm:block"></div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={`grid-${activeTier}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5"
                    >
                        {getTemplatesByTier(tier.id).map((template, index) => {
                            const id = template.id;
                            const isDisabled = template.disabled;

                            return (
                                <motion.div
                                    key={id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => !isDisabled && handleDemoClick(id)}
                                    className={`group flex flex-col bg-white rounded-2xl sm:rounded-[2rem] border transition-all duration-500 overflow-hidden
                                        ${isDisabled
                                            ? 'border-gray-50 opacity-60 cursor-default'
                                            : 'border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#1A3C40]/5 hover:-translate-y-2 cursor-pointer hover:border-[#1A3C40]/10'
                                        }`}
                                >
                                    {/* Thumbnail */}
                                    <div className="relative overflow-hidden">
                                        <TemplateThumbnail id={id} name={template.name} isDisabled={isDisabled} />

                                        {/* Overlay on hover */}
                                        {!isDisabled && (
                                            <div className="absolute inset-0 bg-[#1A3C40]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                                                <div className="bg-white text-[#1A3C40] px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
                                                    <Play size={16} fill="currentColor" />
                                                    ดูตัวอย่าง
                                                </div>
                                            </div>
                                        )}

                                        {/* Status Badges */}
                                        {isDisabled && (
                                            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-sm text-gray-500 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold shadow-sm">
                                                เร็วๆ นี้
                                            </div>
                                        )}
                                        {tier.tag && !isDisabled && index === 0 && (
                                            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-[#1A3C40] text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold shadow-lg uppercase tracking-wider">
                                                {tier.tag}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-3 sm:p-6 flex flex-col flex-1">
                                        <div className="mb-2 sm:mb-4">
                                            <div className="flex justify-between items-start mb-1 sm:mb-2">
                                                <h3 className={`font-black text-sm sm:text-xl leading-tight ${isDisabled ? 'text-gray-400' : 'text-[#1A3C40]'}`}>
                                                    {template.name}
                                                </h3>
                                                <span className="hidden sm:inline text-[10px] font-bold text-gray-300">#{template.number}</span>
                                            </div>

                                            {/* Feature Badges - Dynamic Tags from Registry */}
                                            {!isDisabled && template.tags && (
                                                <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
                                                    {template.tags.map((tag, i) => (
                                                        <span key={i} className="px-1.5 py-0.5 bg-gray-50 text-gray-500 rounded text-[8px] sm:text-[10px] font-bold">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* <p className={`text-[9px] sm:text-xs leading-relaxed font-medium line-clamp-2 sm:line-clamp-none ${isDisabled ? 'text-gray-300' : 'text-gray-500/80'}`}>
                                                {template.description || template.usage}
                                            </p> */}
                                        </div>

                                        <div className="mt-auto pt-2 sm:pt-5 border-t border-gray-50">
                                            {!isDisabled ? (
                                                <button
                                                    className="w-full flex items-center justify-center gap-1.5 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-gray-50 text-gray-700 font-bold text-[10px] sm:text-sm group-hover:bg-[#1A3C40] group-hover:text-white transition-all duration-300"
                                                >
                                                    <Play size={12} className="sm:w-4 sm:h-4" fill="currentColor" />
                                                    ดูตัวอย่าง
                                                </button>
                                            ) : (
                                                <div className="w-full flex items-center justify-center py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-gray-50 text-gray-300 font-bold text-[10px] sm:text-sm">
                                                    Soon
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>

                {getTemplatesByTier(tier.id).length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 mt-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Play size={24} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1A3C40] mb-2">กำลังสร้าง Template ใหม่</h3>
                        <p className="text-gray-500">Template สำหรับ {tier.name} กำลังมาเร็วๆ นี้!</p>
                    </div>
                )}
            </div>

            {/* Mobile Fixed CTA removed as we now have card prominent CTA, but could add if requested. */}
        </div>
    );
};

export default TierGallery;

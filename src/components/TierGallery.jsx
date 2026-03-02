import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Heart, Mail, Star, Sparkles, Camera, ScrollText } from 'lucide-react';
import { TEMPLATE_DATA } from '../data/templateData';
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
                <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-1.5 text-gray-500 hover:text-[#1A3C40] transition-colors py-2 group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">กลับหน้าหลัก</span>
                        </button>

                        <div className="text-center absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-1.5 bg-white rounded-full px-3 py-1 mb-2 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-gray-100/50"
                            >
                                <Sparkles className="w-3 h-3 text-[#E8A08A]" />
                                <span className="text-gray-500 text-[10px] sm:text-xs font-medium tracking-wide">All Templates</span>
                            </motion.div>

                            <h1 className="text-xl sm:text-2xl font-bold text-[#1A3C40] flex items-center gap-1.5 leading-none">
                                Template <span className="text-[#E8A08A] font-playfair italic font-medium">Gallery</span>
                            </h1>
                        </div>

                        <div className="w-[88px]"></div> {/* Spacer for centering */}
                    </div>
                </div>

                {/* Tier Tabs (Pill Style) */}
                <div className="max-w-6xl mx-auto px-4 pb-4">
                    <div className="flex justify-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
                        {Object.entries(tierData).map(([key, data]) => {
                            const isActive = activeTier === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveTier(key)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 font-medium text-sm border
                                        ${isActive
                                            ? `bg-gradient-to-r ${data.gradient} text-white border-transparent shadow-md shadow-${data.accentColor}-500/20`
                                            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-700'
                                        }
                                    `}
                                >
                                    {data.name}
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        {data.demos.length}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Active Package Info Card */}
                <motion.div
                    key={`info-${activeTier}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-5 sm:p-6 mb-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 relative overflow-hidden"
                >
                    {/* Subtle aesthetic glow */}
                    <div className={`absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br ${tier.gradient} opacity-5 rounded-full blur-3xl rounded-full`}></div>

                    <div className="flex flex-col gap-1 relative z-10 w-full sm:w-auto">
                        <div className={`inline-flex self-start items-center px-3 py-1 rounded-full bg-gradient-to-r ${tier.gradient} text-white shadow-sm font-bold text-sm tracking-wide mb-1`}>
                            📦 Package {tier.name}
                        </div>
                        <p className="text-gray-500 text-sm">{tier.description}</p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5 sm:gap-6 relative z-10">
                        <div className="text-right flex items-baseline gap-1">
                            <span className="text-3xl font-extrabold text-[#1A3C40]">{tier.price}</span>
                            <span className="text-sm font-medium text-gray-400">฿</span>
                            <span className="text-xs text-gray-400 block sm:inline sm:ml-2">/ {tier.duration}</span>
                        </div>
                        <button
                            onClick={() => {
                                if (onBack) onBack();
                                window.location.href = `/?checkout=${tier.id}`;
                            }}
                            className={`px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r ${tier.gradient} shadow-md transition-all text-sm whitespace-nowrap hover:opacity-90 active:scale-95`}
                        >
                            เลือกแพ็คเกจ
                        </button>
                    </div>
                </motion.div>

                {/* Template Grid Section */}
                <div className="mb-4">
                    <h3 className="text-gray-500 text-sm font-medium">เลือกดู Template ที่ชอบ</h3>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={`grid-${activeTier}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                    >
                        {tier.demos.map((id, index) => {
                            const template = TEMPLATE_DATA[id] || { name: `Template ${id}`, description: `${tier.name} Style`, preview: '' };
                            const isDisabled = template.disabled;

                            return (
                                <motion.div
                                    key={id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => !isDisabled && handleDemoClick(id)}
                                    className={`group flex flex-col bg-white rounded-2xl border transition-all duration-300 overflow-hidden
                                        ${isDisabled
                                            ? 'border-gray-50 opacity-60 cursor-default'
                                            : 'border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer hover:border-[#E8A08A]/30'
                                        }`}
                                >
                                    {/* Thumbnail */}
                                    <div className="relative">
                                        <TemplateThumbnail id={id} name={template.name} isDisabled={isDisabled} />

                                        {/* Status Badges */}
                                        {isDisabled && (
                                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-500 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm">
                                                เร็วๆ นี้
                                            </div>
                                        )}
                                        {tier.tag && !isDisabled && index === 0 && (
                                            <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm uppercase tracking-wider">
                                                {tier.tag}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="mb-3">
                                            <h3 className={`font-bold text-lg mb-1.5 leading-tight ${isDisabled ? 'text-gray-400' : 'text-[#1A3C40]'}`}>
                                                {template.name}
                                            </h3>

                                            {/* Feature Badges */}
                                            {!isDisabled && (
                                                <div className="flex flex-wrap gap-1.5 mb-2.5">
                                                    {activeTier === 't1' && (
                                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-medium">รหัส PIN</span>
                                                    )}
                                                    {(activeTier === 't2' || activeTier === 't3') && (
                                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-medium">
                                                            {activeTier === 't2' ? '5 รูปภาพ' : '10 รูปภาพ'}
                                                        </span>
                                                    )}
                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-medium">การ์ดอวยพร</span>
                                                </div>
                                            )}

                                            <p className={`text-xs leading-relaxed ${isDisabled ? 'text-gray-300' : 'text-gray-500'}`}>
                                                {template.description || template.usage}
                                            </p>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                            {!isDisabled ? (
                                                <button
                                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#FFF5F2] text-[#E8A08A] font-semibold text-sm group-hover:bg-[#E8A08A] group-hover:text-white transition-colors"
                                                >
                                                    <Play size={16} fill="currentColor" />
                                                    ดูตัวอย่าง
                                                </button>
                                            ) : (
                                                <div className="w-full flex items-center justify-center py-2.5 rounded-lg bg-gray-50 text-gray-400 font-medium text-sm">
                                                    ยังไม่เปิดให้บริการ
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>

                {tier.demos.length === 0 && (
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

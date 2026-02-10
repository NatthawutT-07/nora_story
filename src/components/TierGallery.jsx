import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Music, Star, Crown, Eye, Sparkles } from 'lucide-react';

const tierData = {
    t1: {
        name: 'Trial',
        tagline: 'ทดลองใช้สั้นๆ',
        price: '79',
        duration: '3 วัน',
        icon: Clock,
        gradient: 'from-slate-400 to-slate-500',
        bgColor: 'bg-slate-50',
        demos: [1, 2, 3]
    },
    t2: {
        name: 'Standard',
        tagline: 'สำหรับคนพิเศษ',
        price: '149',
        duration: '15 วัน',
        icon: Star,
        gradient: 'from-pink-400 to-rose-500',
        bgColor: 'bg-rose-50',
        demos: [1, 2, 3, 4, 5, 6]
    },
    t3: {
        name: 'Premium',
        tagline: 'สำหรับโอกาสพิเศษ',
        price: '299',
        duration: '15 วัน',
        icon: Star,
        gradient: 'from-rose-400 to-pink-500',
        bgColor: 'bg-rose-50',
        demos: [1, 2, 3, 4, 5, 6]
    },
    t4: {
        name: 'Archive',
        tagline: 'เก็บความทรงจำอย่างพรีเมียม',
        price: '499+',
        duration: '30-180 วัน',
        icon: Crown,
        gradient: 'from-amber-400 to-orange-500',
        bgColor: 'bg-amber-50',
        demos: [1, 2, 3, 4, 5, 6]
    }
};

const TierGallery = ({ tierIdProp, onBack, onSelectDemo }) => {
    const { tierId: tierIdParam } = useParams();
    const navigate = useNavigate();

    // Default to first tier if none specified
    const initialTier = tierIdProp || tierIdParam || 't1';
    const [activeTier, setActiveTier] = useState(initialTier);

    const tier = tierData[activeTier];

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate('/');
        }
    };

    const handleDemoClick = (demoId) => {
        if (onSelectDemo) {
            onSelectDemo(activeTier, demoId);
        } else {
            navigate(`/demo/${activeTier}/${demoId}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-gray-500 hover:text-[#1A3C40] transition-colors group"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="hidden sm:inline">กลับหน้าหลัก</span>
                        </button>

                        <div className="text-center">
                            <h1 className="text-lg sm:text-xl font-playfair font-bold text-[#1A3C40]">
                                Template <span className="text-[#E8A08A] italic">Gallery</span>
                            </h1>
                        </div>

                        <div className="w-20"></div>
                    </div>
                </div>

                {/* Tier Navigation Tabs */}
                <div className="max-w-6xl mx-auto px-4 pb-3">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                        {Object.entries(tierData).map(([key, data]) => {
                            const Icon = data.icon;
                            const isActive = activeTier === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveTier(key)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-300
                                        ${isActive
                                            ? `bg-gradient-to-r ${data.gradient} text-white shadow-lg`
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }
                                    `}
                                >
                                    <Icon size={16} />
                                    <span className="font-medium text-sm">{data.name}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-200'}`}>
                                        {data.demos.length}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Current Tier Info */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <motion.div
                    key={activeTier}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${tier.bgColor} rounded-2xl p-5 sm:p-6 mb-6 border border-gray-100`}
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${tier.gradient} text-white shadow-lg`}>
                                <tier.icon size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-[#1A3C40]">{tier.name}</h2>
                                <p className="text-gray-500 text-sm">{tier.tagline}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-2xl font-bold text-[#1A3C40]">{tier.price}<span className="text-sm font-normal text-gray-400">฿</span></p>
                                <p className="text-xs text-gray-400">{tier.duration}</p>
                            </div>
                            <button
                                onClick={() => navigate('/#pricing')}
                                className={`px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r ${tier.gradient} hover:shadow-lg transition-all text-sm`}
                            >
                                เลือกแพ็คเกจ
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Template Grid */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Sparkles size={16} className="text-[#E8A08A]" />
                        <span>เลือกดู Template ที่ชอบ</span>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTier}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
                    >
                        {tier.demos.map((id, index) => (
                            <motion.div
                                key={id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => handleDemoClick(id)}
                                className="group cursor-pointer"
                            >
                                <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                                    {/* Preview Image Placeholder */}
                                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-6xl font-bold text-gray-300/50">{id}</span>
                                        </div>

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
                                            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-[#1A3C40]">
                                                <Eye size={16} />
                                                ดูตัวอย่าง
                                            </div>
                                        </div>

                                        {/* Style Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${tier.gradient} shadow-lg`}>
                                                Style {id}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="p-3 sm:p-4">
                                        <h3 className="font-semibold text-[#1A3C40] text-sm sm:text-base">Template {id}</h3>
                                        <p className="text-xs text-gray-400 mt-0.5">{tier.name} Style</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Empty State */}
                {tier.demos.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🎨</div>
                        <h3 className="text-xl font-bold text-[#1A3C40] mb-2">กำลังสร้าง Template ใหม่</h3>
                        <p className="text-gray-500">Template สำหรับ {tier.name} กำลังมาเร็วๆ นี้!</p>
                    </div>
                )}
            </div>

            {/* Bottom CTA - Mobile */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 p-4 sm:hidden">
                <button
                    onClick={() => navigate('/#pricing')}
                    className={`w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r ${tier.gradient} shadow-lg flex items-center justify-center gap-2`}
                >
                    เลือก {tier.name} Package
                </button>
            </div>
        </div>
    );
};

export default TierGallery;

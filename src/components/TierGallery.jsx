import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, Sparkles } from 'lucide-react';
import { TEMPLATE_DATA } from '../data/templateData';
import { TIERS } from '../data/tierData';

const tierData = TIERS.reduce((acc, t) => {
    acc[t.slug] = t;
    return acc;
}, {});


const TierGallery = ({ tierIdProp, onBack, onSelectDemo }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // Default to first tier if none specified
    // Check props first, then location state, then default to 't1'
    const initialTier = tierIdProp || location.state?.tierId || 't1';
    const [activeTier, setActiveTier] = useState(initialTier);

    useEffect(() => {
        // If state changed (e.g. from navigation), update activeTier
        if (location.state?.tierId && tierData[location.state.tierId]) {
            setActiveTier(location.state.tierId);
        }
    }, [location.state]);

    const tier = tierData[activeTier];

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate('/');
        }
    };

    const handleDemoClick = (demoId) => {
        // Extract numeric ID from 't1-1' -> '1'
        const numericId = demoId.split('-')[1];

        if (onSelectDemo) {
            onSelectDemo(activeTier, numericId);
        } else {
            navigate(`/demo/${activeTier}/${numericId}`);
        }
    };

    const handleTabClick = (key) => {
        setActiveTier(key);
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
                            const isActive = activeTier === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => handleTabClick(key)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-300
                                        ${isActive
                                            ? `bg-gradient-to-r ${data.gradient} text-white shadow-lg`
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }
                                    `}
                                >
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
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${tier.gradient} shadow-lg`}>
                                <span className="text-white font-playfair font-bold text-lg">{tier.name.charAt(0)}</span>
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
                                onClick={() => navigate(`/?checkout=${tier.id}`)}
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
                        className="flex flex-col gap-3"
                    >
                        {tier.demos.map((id, index) => {
                            const template = TEMPLATE_DATA[id] || { name: `Template ${id}`, description: `${tier.name} Style`, preview: '✨' };

                            return (
                                <motion.div
                                    key={id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => handleDemoClick(id)}
                                    className="group cursor-pointer"
                                >
                                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                                        {/* Preview Icon */}
                                        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-lg text-2xl group-hover:scale-110 transition-transform">
                                            {template.preview}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-[#1A3C40] text-base truncate">{template.name}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r ${tier.gradient} shadow-sm opacity-80`}>
                                                    New
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 truncate">{template.description}</p>
                                        </div>

                                        {/* Action Button */}
                                        <div className="flex items-center gap-2 text-gray-400 group-hover:text-[#1A3C40] transition-colors">
                                            <span className="text-sm font-medium hidden sm:inline opacity-0 group-hover:opacity-100 transition-opacity">ดูตัวอย่าง</span>
                                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                                                <Eye size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
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
                    onClick={() => navigate(`/?checkout=${tier.id}`)}
                    className={`w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r ${tier.gradient} shadow-lg flex items-center justify-center gap-2`}
                >
                    เลือก {tier.name} Package
                </button>
            </div>
        </div>
    );
};

export default TierGallery;

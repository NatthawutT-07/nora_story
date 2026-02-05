import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Type, Layout, Wand2, Upload, X, ChevronRight, ChevronUp, ChevronDown, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import Templates
// Import Templates
import Tier1Template1 from './templates/tier1/Tier1Template1';
import Tier1Template2 from './templates/tier1/Tier1Template2';
import Tier1Template3 from './templates/tier1/Tier1Template3';
import Tier1Template4 from './templates/tier1/Tier1Template4';
import Tier1Template5 from './templates/tier1/Tier1Template5';
import Tier1Template6 from './templates/tier1/Tier1Template6';
import Tier1Template7 from './templates/tier1/Tier1Template7';

import Tier2Template1 from './templates/tier2/Tier2Template1';
import Tier2Template2 from './templates/tier2/Tier2Template2';
import Tier2Template3 from './templates/tier2/Tier2Template3';
import Tier2Template4 from './templates/tier2/Tier2Template4';
import Tier2Template5 from './templates/tier2/Tier2Template5';
import Tier2Template6 from './templates/tier2/Tier2Template6';

import Tier3Template1 from './templates/tier3/Tier3Template1';
import Tier3Template2 from './templates/tier3/Tier3Template2';
import Tier3Template3 from './templates/tier3/Tier3Template3';
import Tier3Template4 from './templates/tier3/Tier3Template4';
import Tier3Template5 from './templates/tier3/Tier3Template5';
import Tier3Template6 from './templates/tier3/Tier3Template6';

import Tier4Template1 from './templates/tier4/Tier4Template1';
import Tier4Template2 from './templates/tier4/Tier4Template2';
import Tier4Template3 from './templates/tier4/Tier4Template3';
import Tier4Template4 from './templates/tier4/Tier4Template4';
import Tier4Template5 from './templates/tier4/Tier4Template5';
import Tier4Template6 from './templates/tier4/Tier4Template6';

const TemplatePlayground = () => {
    const navigate = useNavigate();
    const [selectedTier, setSelectedTier] = useState(1);
    const [selectedStyle, setSelectedStyle] = useState(1);
    const [customText, setCustomText] = useState('');
    const [customSignOff, setCustomSignOff] = useState('');
    const [customImage, setCustomImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showControls, setShowControls] = useState(true);

    // Default Texts configuration
    const getDefaults = (tier, style) => {
        const key = `t${tier}-${style}`;
        const map = {
            't1-1': { main: "Every moment with you is a gift I never want to lose.", sub: "Yours, Always" },
            't1-2': { main: "Our First Date ❤️", sub: "" },
            't1-3': { main: "รีบบอกรักก่อนเวลาจะหมดไป...", sub: "" },
            't1-4': { main: "Simplicity is the ultimate sophistication.", sub: "WITH LOVE" },
            't1-5': { main: "This moment right here? I want to stay in it forever.", sub: "xoxo" },
            't1-6': { main: "No matter how far apart we are, we are always looking at the same moon.", sub: "Thinking of You" },
            't1-7': { main: "You make my world so much brighter just by being in it.", sub: "" },
            't2-1': { main: "Our Love Song", sub: "Nora & You" },
            't2-2': { main: "Captured Moments", sub: "" },
            't2-3': { main: "My Heart", sub: "Floats for you..." },
            't2-4': { main: "Our Photo Album 📸", sub: "" },
            't2-5': { main: "Our Song", sub: "The Soundtrack of Us" },
            't2-6': { main: "You & Me", sub: "" },
            't3-1': { main: "Every day with you feels like a page out of a beautiful novel...", sub: "Always Yours" },
            't3-2': { main: "Our Journey", sub: "" },
            't3-3': { main: "Happy Anniversary!", sub: "" },
            't3-4': { main: "You are the best thing that ever happened to me!", sub: "Your Secret Admirer" },
            't3-5': { main: "Every love story is beautiful, but ours is my favorite.", sub: "" },
            't3-6': { main: "Our love is like winter magic — beautiful, pure, and everlasting.", sub: "Forever Yours" },
            't4-1': { main: "Lifetime Memories", sub: "Forever & Always" },
            't4-2': { main: "Cinematic Love Story", sub: "" },
            't4-3': { main: "The Ultimate Archive", sub: "" },
            't4-4': { main: "Every frame of our life together is worth a thousand words.", sub: "" },
            't4-5': { main: "From the moment our eyes met, I knew you were the one.", sub: "" },
            't4-6': { main: "Our Journey Together", sub: "" },
        };
        return map[key] || { main: "Your Text Here", sub: "" };
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCustomImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setCustomImage(null);
        setImagePreview(null);
    };

    const renderTemplate = () => {
        const props = {
            customMessage: customText || getDefaults(selectedTier, selectedStyle).main,
            customSignOff: customSignOff || getDefaults(selectedTier, selectedStyle).sub,
            customTitle: customText || getDefaults(selectedTier, selectedStyle).main, // Mapping for templates that use Title
            customSubtitle: customSignOff || getDefaults(selectedTier, selectedStyle).sub, // Mapping for templates that use Subtitle
            customImage: imagePreview
        };

        if (selectedTier === 1) {
            if (selectedStyle === 1) return <Tier1Template1 {...props} />;
            if (selectedStyle === 2) return <Tier1Template2 {...props} />;
            if (selectedStyle === 3) return <Tier1Template3 {...props} />;
            if (selectedStyle === 4) return <Tier1Template4 {...props} />;
            if (selectedStyle === 5) return <Tier1Template5 {...props} />;
            if (selectedStyle === 6) return <Tier1Template6 {...props} />;
            if (selectedStyle === 7) return <Tier1Template7 {...props} />;
        }
        if (selectedTier === 2) {
            if (selectedStyle === 1) return <Tier2Template1 {...props} />;
            if (selectedStyle === 2) return <Tier2Template2 {...props} />;
            if (selectedStyle === 3) return <Tier2Template3 {...props} />;
            if (selectedStyle === 4) return <Tier2Template4 {...props} />;
            if (selectedStyle === 5) return <Tier2Template5 {...props} />;
            if (selectedStyle === 6) return <Tier2Template6 {...props} />;
        }
        if (selectedTier === 3) {
            if (selectedStyle === 1) return <Tier3Template1 {...props} />;
            if (selectedStyle === 2) return <Tier3Template2 {...props} />;
            if (selectedStyle === 3) return <Tier3Template3 {...props} />;
            if (selectedStyle === 4) return <Tier3Template4 {...props} />;
            if (selectedStyle === 5) return <Tier3Template5 {...props} />;
            if (selectedStyle === 6) return <Tier3Template6 {...props} />;
        }
        if (selectedTier === 4) {
            if (selectedStyle === 1) return <Tier4Template1 {...props} />;
            if (selectedStyle === 2) return <Tier4Template2 {...props} />;
            if (selectedStyle === 3) return <Tier4Template3 {...props} />;
            if (selectedStyle === 4) return <Tier4Template4 {...props} />;
            if (selectedStyle === 5) return <Tier4Template5 {...props} />;
            if (selectedStyle === 6) return <Tier4Template6 {...props} />;
        }
        return null;
    };

    // Helper to determine active styles for the current tier
    const getActiveStyles = () => {
        if (selectedTier === 1) return [1, 2, 3, 4, 5, 6, 7];
        return [1, 2, 3, 4, 5, 6];
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={20} className="text-gray-500" />
                    </button>
                    <h1 className="font-playfair text-lg font-bold text-[#1A3C40]">Create Memory</h1>
                </div>
                <button
                    onClick={() => setShowControls(!showControls)}
                    className="flex items-center gap-2 px-3 py-2 bg-[#E8A08A]/10 text-[#E8A08A] rounded-lg text-sm font-medium"
                >
                    {showControls ? <ChevronUp size={16} /> : <Wand2 size={16} />}
                    {showControls ? 'Hide' : 'Customize'}
                </button>
            </div>

            {/* Sidebar Controls - Collapsible on mobile */}
            <AnimatePresence>
                {(showControls || window.innerWidth >= 768) && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col z-20 shadow-xl overflow-hidden md:overflow-visible md:h-screen md:sticky md:top-0"
                    >
                        {/* Desktop Header */}
                        <div className="hidden md:flex p-6 border-b border-gray-100 items-center gap-3">
                            <button onClick={() => navigate('/')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                                <ArrowLeft size={20} className="text-gray-500" />
                            </button>
                            <div>
                                <h1 className="font-playfair text-xl font-bold text-[#1A3C40]">Create Memory</h1>
                                <p className="text-xs text-gray-400">Design your perfect moment</p>
                            </div>
                        </div>

                        <div className="p-4 md:p-6 space-y-6 md:space-y-8 overflow-y-auto flex-1">
                            {/* Tier Selector */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                    <Layout size={16} className="text-[#E8A08A]" />
                                    Choose Package
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[1, 2, 3, 4].map((tier) => (
                                        <button
                                            key={tier}
                                            onClick={() => {
                                                setSelectedTier(tier);
                                                setSelectedStyle(1);
                                                setCustomText('');
                                                setCustomSignOff('');
                                                setImagePreview(null);
                                            }}
                                            className={`p-3 rounded-xl border text-sm font-medium transition-all ${selectedTier === tier
                                                ? 'border-[#E8A08A] bg-[#E8A08A]/10 text-[#E8A08A]'
                                                : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                                }`}
                                        >
                                            Tier {tier}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Style Selector */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                    <Wand2 size={16} className="text-[#E8A08A]" />
                                    Choose Style
                                </label>
                                <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                    {getActiveStyles().map((style) => (
                                        <button
                                            key={style}
                                            onClick={() => setSelectedStyle(style)}
                                            className={`flex-shrink-0 flex-1 md:flex-none md:w-24 h-14 md:h-16 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all ${selectedStyle === style
                                                ? 'border-[#E8A08A] bg-[#E8A08A] text-white shadow-md'
                                                : 'border-gray-200 text-gray-400 hover:border-gray-300 bg-gray-50'
                                                }`}
                                        >
                                            <span className="text-base md:text-lg font-bold">0{style}</span>
                                            <span className="text-[9px] md:text-[10px] uppercase tracking-wider">Style</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Content Editors */}
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Type size={16} className="text-[#E8A08A]" />
                                    Customize It
                                </label>

                                {/* Image Upload logic need to be updated to include new templates */}
                                {((selectedTier === 1 && [2, 5, 7].includes(selectedStyle)) || selectedTier === 2 || (selectedTier === 3 && selectedStyle === 3) || selectedTier === 4) && (
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500">Upload Photo</label>
                                        {imagePreview ? (
                                            <div className="relative aspect-video rounded-lg overflow-hidden group shadow-sm">
                                                <img src={imagePreview} className="w-full h-full object-cover" />
                                                <button
                                                    onClick={removeImage}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-gray-200 hover:border-[#E8A08A] hover:bg-[#E8A08A]/5 cursor-pointer transition-all">
                                                <Upload className="text-gray-300 mb-2" size={24} />
                                                <span className="text-xs text-gray-400">Tap to upload image</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                            </label>
                                        )}
                                    </div>
                                )}

                                {/* Text Inputs */}
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Main Text</label>
                                        <textarea
                                            value={customText}
                                            onChange={(e) => setCustomText(e.target.value)}
                                            placeholder={getDefaults(selectedTier, selectedStyle).main}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 focus:border-[#E8A08A] bg-gray-50 text-sm min-h-[80px] md:min-h-[100px] resize-none"
                                        />
                                    </div>

                                    {/* Secondary Text logic update */}
                                    {['t1-1', 't1-4', 't1-5', 't1-6', 't2-1', 't2-3', 't3-1', 't4-1'].includes(`t${selectedTier}-${selectedStyle}`) && (
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">Secondary Text</label>
                                            <input
                                                type="text"
                                                value={customSignOff}
                                                onChange={(e) => setCustomSignOff(e.target.value)}
                                                placeholder={getDefaults(selectedTier, selectedStyle).sub}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 focus:border-[#E8A08A] bg-gray-50 text-sm"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50">
                            <button className="w-full py-3 bg-[#1A3C40] text-white rounded-xl font-medium shadow-lg hover:bg-[#1A3C40]/90 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                                Buy This Design <ChevronRight size={16} />
                            </button>
                            <p className="text-center text-[10px] text-gray-400 mt-2">
                                *This is a preview. Final product will be high quality.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Preview Area */}
            <div className="flex-1 bg-gray-100 relative overflow-hidden flex items-center justify-center min-h-[60vh] md:min-h-screen p-4 md:p-8">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

                {/* Device Frame */}
                <motion.div
                    layoutId="preview-frame"
                    className="relative w-full max-w-[375px] h-[600px] md:h-[750px] bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden border-[6px] md:border-8 border-gray-900"
                >
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 md:w-40 h-6 md:h-7 bg-gray-900 rounded-b-xl md:rounded-b-2xl z-50"></div>

                    {/* Rendered Template */}
                    <div className="w-full h-full overflow-y-auto scrollbar-hide relative">
                        {renderTemplate()}
                    </div>
                </motion.div>

                {/* Live Preview Badge */}
                <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6 flex items-center gap-2 bg-white px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg text-[10px] md:text-xs font-medium text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    Live Preview
                </div>

                {/* Mobile Show Controls FAB */}
                {!showControls && (
                    <button
                        onClick={() => setShowControls(true)}
                        className="md:hidden fixed bottom-20 right-4 bg-[#E8A08A] text-white p-4 rounded-full shadow-xl z-40"
                    >
                        <Wand2 size={24} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default TemplatePlayground;

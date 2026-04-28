import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Link2, Globe, Sparkles, Copy, Check, RefreshCw, QrCode } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import logo from '../assets/logo.png';

// Random ID generator for demo
const generateRandomId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const LINK_TYPES = [
    {
        id: 'random',
        name: 'Random Link',
        description: 'ระบบสร้างลิงก์อัตโนมัติ',
        icon: RefreshCw,
        tier: 'Tier 1',
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        getUrl: (randomId) => `norastory.com/${randomId}`,
    },
    {
        id: 'custom',
        name: 'Custom Link',
        description: 'เลือกชื่อลิงก์ได้',
        icon: Link2,
        tier: 'Tier 2-3',
        color: 'from-purple-500 to-pink-500',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        getUrl: () => 'norastory.com/HappyNewYear2026',
    },
    {
        id: 'subdomain',
        name: 'Special Link (Coming Soon)',
        description: 'ชื่อพิเศษไม่ซ้ำใคร',
        icon: Globe,
        tier: 'Tier All',
        color: 'from-gray-400 to-gray-500',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        getUrl: () => 'somsri.norastory.com',
        disabled: true,
    },
];

// Simple QR code using QRCodeCanvas
const QRCodeDisplay = ({ value, size = 200, logoImg }) => {
    return (
        <QRCodeCanvas
            value={value}
            size={size}
            level="H"
            includeMargin={false}
            className="rounded-lg"
            imageSettings={{
                src: logoImg || logo,
                x: undefined,
                y: undefined,
                height: 54,
                width: 54,
                excavate: false,
            }}
        />
    );
};

const QRCodeDemo = () => {
    const [selectedType, setSelectedType] = useState('random');
    const [randomId, setRandomId] = useState(generateRandomId());
    const [copied, setCopied] = useState(false);
    const [processedLogo, setProcessedLogo] = useState(null);

    useEffect(() => {
        const img = new Image();
        img.src = logo;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.arc(100, 100, 100, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.save();
            ctx.beginPath();
            ctx.arc(100, 100, 96, 0, Math.PI * 2);
            ctx.clip();
            const minSide = Math.min(img.width, img.height);
            const sourceX = (img.width - minSide) / 2;
            const sourceY = (img.height - minSide) / 2;
            ctx.drawImage(img, sourceX, sourceY, minSide, minSide, 0, 0, 200, 200);
            ctx.restore();
            setProcessedLogo(canvas.toDataURL());
        };
    }, []);

    const currentType = LINK_TYPES.find(t => t.id === selectedType);
    const currentUrl = currentType.getUrl(randomId);
    const fullUrl = `https://${currentUrl}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRefresh = () => {
        setRandomId(generateRandomId());
    };

    return (
        <section className="py-8 bg-gradient-to-b from-white to-rose-50/30">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 sm:mb-14"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-4 shadow-sm"
                    >
                        <Smartphone className="w-4 h-4 text-[#E8A08A]" />
                        <span className="text-gray-600 text-sm font-medium">Scan to Open</span>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair text-[#1A3C40] mb-4">
                        Share With<span className="text-[#E8A08A] italic"> QR Code</span>
                    </h2>
                    <p className="text-xs md:text-base text-gray-500 max-w-xl mx-auto px-4">
                        สแกน QR Code หรือส่งลิงก์ให้คนที่คุณรัก เปิดได้ทันทีผ่านมือถือ
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6 items-center">
                    {/* Left: QR Code Display */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center"
                    >
                        <div className="relative">
                            {/* QR Code Card */}
                            <motion.div
                                key={currentUrl}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100"
                            >
                                <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-4 rounded-2xl mb-4 flex items-center justify-center">
                                    <QRCodeDisplay value={fullUrl} size={200} logoImg={processedLogo} />
                                </div>

                                {/* URL Display with Highlights */}
                                <div className={`${currentType.bgColor} ${currentType.borderColor} border rounded-xl p-3 mb-3`}>
                                    <p className="text-xs text-gray-500 mb-2">ลิงก์ตัวอย่าง:</p>
                                    <div className="flex items-center gap-2">
                                        <div className="text-sm font-mono font-medium flex-1 overflow-hidden">
                                            {selectedType === 'subdomain' ? (
                                                // Subdomain format - highlight the subdomain part
                                                <div className="flex items-center flex-wrap">
                                                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-l-md font-bold animate-pulse">
                                                        somsri
                                                    </span>
                                                    <span className="bg-[#1A3C40] text-white px-2 py-0.5 rounded-r-md">
                                                        .norastory.com
                                                    </span>
                                                    <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                                        ✨ โดเมนส่วนตัว
                                                    </span>
                                                </div>
                                            ) : (
                                                // Path-based format - path is gray
                                                <div className="flex items-center flex-wrap">
                                                    <span className="text-[#1A3C40] font-semibold">
                                                        norastory.com
                                                    </span>
                                                    <span className="text-gray-400">/</span>
                                                    <span className="text-gray-400">
                                                        {selectedType === 'random' ? randomId : 'HappyNewYear2026'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {selectedType === 'random' && (
                                            <button
                                                onClick={handleRefresh}
                                                className="p-1.5 hover:bg-white/50 rounded-lg transition-colors"
                                                title="สุ่มใหม่"
                                            >
                                                <RefreshCw size={14} className="text-gray-500" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Explanation text */}
                                    <p className="text-[10px] mt-2 text-gray-400">
                                        {selectedType === 'subdomain'
                                            ? '🌟 ชื่อของคุณอยู่ข้างหน้า ดูพิเศษสุดๆ!'
                                            : '📝 ลิงก์ต่อท้ายโดเมนหลัก'}
                                    </p>
                                </div>

                                {/* Copy Button */}
                                <button
                                    onClick={handleCopy}
                                    className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${copied
                                        ? 'bg-green-500 text-white'
                                        : 'bg-[#1A3C40] text-white hover:bg-[#1A3C40]/90'
                                        }`}
                                >
                                    {copied ? (
                                        <>
                                            <Check size={18} />
                                            คัดลอกแล้ว!
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={18} />
                                            คัดลอกลิงก์
                                        </>
                                    )}
                                </button>
                            </motion.div>

                            {/* Decorative Elements */}
                            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-rose-200 to-pink-200 rounded-full blur-2xl opacity-60" />
                            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full blur-2xl opacity-60" />
                        </div>

                        {/* Scan Hint */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-6 text-sm text-gray-400 flex items-center gap-2"
                        >
                            <Sparkles size={14} className="text-amber-500" />
                            สามารถใช้กล้องมือถือสแกน QR Code
                        </motion.p>
                    </motion.div>

                    {/* Right: Link Type Selection */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold text-[#1A3C40] mb-4">
                            รูปแบบลิงก์ที่เลือกได้
                        </h3>

                        {LINK_TYPES.map((type) => {
                            const Icon = type.icon;
                            const isSelected = selectedType === type.id;
                            const isDisabled = type.disabled;

                            return (
                                <motion.button
                                    key={type.id}
                                    onClick={() => !isDisabled && setSelectedType(type.id)}
                                    whileHover={!isDisabled ? { scale: 1.02 } : {}}
                                    whileTap={!isDisabled ? { scale: 0.98 } : {}}
                                    className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${isDisabled
                                        ? 'bg-gray-50/50 border-gray-100 cursor-not-allowed opacity-60'
                                        : isSelected
                                            ? `${type.bgColor} ${type.borderColor} shadow-lg`
                                            : 'bg-white border-gray-100 hover:border-gray-200'
                                        }`}
                                    disabled={isDisabled}
                                >
                                    <div className="flex items-start gap-3 md:gap-4">
                                        <div className={`p-2 md:p-3 rounded-xl bg-gradient-to-br ${type.color} text-white`}>
                                            <Icon size={18} className="md:w-6 md:h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-0.5 md:mb-1">
                                                <h4 className={`font-semibold text-sm md:text-base ${isDisabled ? 'text-gray-500' : 'text-gray-800'}`}>{type.name}</h4>
                                                <span className={`px-1.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium ${isDisabled ? 'bg-gray-200 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                                                    {type.tier}
                                                </span>
                                            </div>
                                            <p className={`text-xs md:text-sm mb-1 md:mb-2 ${isDisabled ? 'text-gray-400' : 'text-gray-500'}`}>{type.description}</p>
                                            <AnimatePresence>
                                                {isSelected && !isDisabled && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="mt-2 pt-2 border-t border-gray-200"
                                                    >
                                                        <p className="text-xs font-mono text-gray-600 bg-white/70 px-2 py-1 rounded-lg inline-block">
                                                            {type.getUrl(randomId)}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        {isSelected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                                            >
                                                <Check size={14} className="text-white" />
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.button>
                            );
                        })}

                        {/* Info Note */}
                        <div className="mt-2 p-4 bg-gradient-to-r from-rose-50 to-amber-50 rounded-xl border border-rose-100">
                            <p className="text-sm text-gray-600">
                                <span className="font-medium text-[#1A3C40]">💡 </span> เลือกแพ็คเกจที่สูงขึ้นเพื่อปรับแต่งลิงก์ได้มากขึ้น!
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default QRCodeDemo;

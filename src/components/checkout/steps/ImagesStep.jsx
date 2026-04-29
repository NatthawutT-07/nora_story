import { motion } from 'framer-motion';
import { X, AlertCircle, Camera } from 'lucide-react';
import { useCheckout } from '../CheckoutContext';

const ImagesStep = () => {
    const {
        contentFiles, setContentFiles,
        contentPreviews, setContentPreviews,
        getMaxImages, getMaxFileSize, setError,
        isTier3, isTier2, formData, selectedTemplate
    } = useCheckout();

    const maxImages = getMaxImages();
    const maxFileSizeMB = Math.round(getMaxFileSize() / (1024 * 1024));

    // --- Shared Logic ---
    const updateSlot = (index, file) => {
        if (file && file.size > getMaxFileSize()) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
            setError(`ไฟล์ "${file.name}" มีขนาด ${sizeMB}MB เกินลิมิต ${maxFileSizeMB}MB`);
            return;
        }
        const newFiles = [...contentFiles];
        while (newFiles.length <= index) newFiles.push(null);
        newFiles[index] = file;

        const newPreviews = [...contentPreviews];
        while (newPreviews.length <= index) newPreviews.push(null);
        newPreviews[index] = file ? URL.createObjectURL(file) : null;

        setContentFiles(newFiles);
        setContentPreviews(newPreviews);
        setError('');
    };

    const handleFileChange = (e, index) => {
        const file = e.target.files && e.target.files[0];
        if (file) updateSlot(index, file);
    };

    const filledCount = contentPreviews.filter(Boolean).length;

    // --- Shared Upload Slot Component ---
    const UploadSlot = ({ idx, hint, ratio, label, accentColor = '#1A3C40' }) => {
        const preview = contentPreviews[idx];
        const isFilled = !!preview;

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="relative group"
            >
                {isFilled ? (
                    <div className="relative w-full rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow" style={{ aspectRatio: ratio || '1/1' }}>
                        <label className="cursor-pointer group/label relative block w-full h-full">
                            <img src={preview} className="w-full h-full object-cover" alt="" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                                <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold text-[#1A3C40] opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-sm">
                                    เปลี่ยนรูป
                                </div>
                            </div>
                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, idx)} className="hidden" />
                        </label>
                        
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                updateSlot(idx, null);
                            }}
                            className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm text-red-500 p-1.5 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all z-20 border border-gray-100"
                            title="ลบรูปภาพ"
                        >
                            <X size={14} />
                        </button>
                        {label && (
                            <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/50 to-transparent">
                                <p className="text-[9px] sm:text-[10px] text-white/90 font-medium truncate">{label}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <label
                        className="w-full rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-opacity-60 transition-all relative bg-gray-50/30 group"
                        style={{ aspectRatio: ratio || '1/1', borderColor: `${accentColor}30` }}
                    >
                        <div className="flex flex-col items-center gap-1.5 p-2">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: `${accentColor}10` }}>
                                <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors" style={{ color: `${accentColor}90` }} />
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-medium transition-colors" style={{ color: `${accentColor}80` }}>เลือกรูป</span>
                            {hint && <span className="text-[8px] sm:text-[9px] text-gray-400 text-center leading-tight px-1">{hint}</span>}
                        </div>
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, idx)} className="hidden" />
                    </label>
                )}
            </motion.div>
        );
    };

    // --- Tier 3 (T3-1) Timeline Layout ---
    if (isTier3) {
        const getTimelineLabel = (index) => {
            const tl = formData?.timelines?.[index];
            return tl?.label || `Timeline ${index + 1}`;
        };

        const tier3Sections = [
            {
                title: getTimelineLabel(0),
                sectionNum: 1,
                count: 1,
                start: 0,
                hint: "4:3",
                ratio: "4/3",
                color: '#1A3C40' // Single color for all sections
            },
            {
                title: getTimelineLabel(1),
                sectionNum: 2,
                count: 1,
                start: 1,
                hint: "4:3",
                ratio: "4/3",
                color: '#1A3C40'
            },
            {
                title: getTimelineLabel(2),
                sectionNum: 3,
                count: 1,
                start: 2,
                hint: "4:3",
                ratio: "4/3",
                color: '#1A3C40'
            },
            {
                title: getTimelineLabel(3),
                sectionNum: 4,
                count: 5,
                start: 3,
                hint: "4:3",
                ratio: "4/3",
                color: '#1A3C40'
            },
            {
                title: getTimelineLabel(4),
                sectionNum: 5,
                count: 2,
                start: 8,
                hint: "4:3",
                ratio: "4/3",
                color: '#1A3C40'
            },
        ];

        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                {/* Progress bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 font-medium">อัปโหลดรูปภาพ</span>
                        <span className="font-semibold" style={{ color: '#1A3C40' }}>{filledCount}/{maxImages}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100/80 rounded-full overflow-hidden border border-gray-200/50">
                        <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: '#1A3C40' }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(filledCount / maxImages) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <p className="text-[10px] text-gray-400 text-center">ขนาดไฟล์ไม่เกิน {maxFileSizeMB}MB ต่อรูป</p>
                </div>

                {/* Timeline Sections */}
                <div className="space-y-5">
                    {tier3Sections.map((section, sIdx) => {
                        const sectionFilledCount = Array.from({ length: section.count }).filter((_, k) => contentPreviews[section.start + k]).length;
                        const isComplete = sectionFilledCount === section.count;

                        return (
                            <motion.div
                                key={sIdx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: sIdx * 0.08 }}
                                className="rounded-2xl border overflow-hidden transition-all"
                                style={{
                                    borderColor: isComplete ? `${section.color}40` : '#e5e7eb',
                                    backgroundColor: isComplete ? `${section.color}05` : '#f8fafc' // Slightly cooler gray/blue
                                }}
                            >
                                {/* Section Header */}
                                <div className="flex items-center gap-2.5 px-3 py-2.5 sm:px-4 sm:py-3" style={{ borderBottom: `1px solid ${isComplete ? `${section.color}20` : '#f1f5f9'}` }}>
                                    <div
                                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-sm"
                                        style={{ backgroundColor: section.color }}
                                    >
                                        {section.sectionNum}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xs sm:text-sm font-bold text-gray-700 truncate">{section.title}</h3>
                                        <p className="text-[10px] text-gray-400">
                                            {section.count} รูป — {section.ratio}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        {isComplete ? (
                                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: section.color, backgroundColor: `${section.color}15` }}>
                                                ครบแล้ว
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-gray-400">{sectionFilledCount}/{section.count}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Section Content */}
                                <div className="p-2.5 sm:p-3 relative z-10">
                                    {section.sectionNum === 4 ? (
                                        // Custom cross layout for Section 4 (Memories)
                                        <div className="relative w-full max-w-md mx-auto aspect-[4/3.2] my-4">
                                            {/* Top Left */}
                                            <div className="absolute top-0 left-0 w-[44%] z-10 transform hover:z-50 hover:scale-105 transition-all duration-300">
                                                <UploadSlot idx={section.start} hint={section.hint} ratio={section.ratio} label="รูปที่ 1" accentColor="#1A3C40" />
                                            </div>
                                            {/* Top Right */}
                                            <div className="absolute top-0 right-0 w-[44%] z-10 transform hover:z-50 hover:scale-105 transition-all duration-300">
                                                <UploadSlot idx={section.start + 1} hint={section.hint} ratio={section.ratio} label="รูปที่ 2" accentColor="#1A3C40" />
                                            </div>
                                            {/* Bottom Left */}
                                            <div className="absolute bottom-0 left-0 w-[44%] z-10 transform hover:z-50 hover:scale-105 transition-all duration-300">
                                                <UploadSlot idx={section.start + 3} hint={section.hint} ratio={section.ratio} label="รูปที่ 4" accentColor="#1A3C40" />
                                            </div>
                                            {/* Bottom Right */}
                                            <div className="absolute bottom-0 right-0 w-[44%] z-10 transform hover:z-50 hover:scale-105 transition-all duration-300">
                                                <UploadSlot idx={section.start + 4} hint={section.hint} ratio={section.ratio} label="รูปที่ 5" accentColor="#1A3C40" />
                                            </div>
                                            {/* Center (Overlapping) */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[48%] z-20 transform hover:z-50 hover:scale-105 transition-all duration-300 shadow-2xl rounded-2xl bg-white p-1 md:p-1.5">
                                                <UploadSlot idx={section.start + 2} hint={section.hint} ratio={section.ratio} label="รูปที่ 3 (ตรงกลาง)" accentColor="#1A3C40" />
                                            </div>
                                        </div>
                                    ) : section.sectionNum === 5 ? (
                                        // Custom overlap layout for Section 5 (Finale)
                                        <div className="relative w-full max-w-xs mx-auto aspect-[4/3.5] my-4">
                                            {/* Top Left */}
                                            <div className="absolute top-0 left-0 w-[65%] z-10 transform hover:z-50 hover:scale-105 transition-all duration-300">
                                                <UploadSlot idx={section.start} hint={section.hint} ratio={section.ratio} label="รูปที่ 1" accentColor="#1A3C40" />
                                            </div>
                                            {/* Bottom Right */}
                                            <div className="absolute bottom-0 right-0 w-[65%] z-20 transform hover:z-50 hover:scale-105 transition-all duration-300 shadow-2xl rounded-2xl bg-white p-1 md:p-1.5">
                                                <UploadSlot idx={section.start + 1} hint={section.hint} ratio={section.ratio} label="รูปที่ 2" accentColor="#1A3C40" />
                                            </div>
                                        </div>
                                    ) : section.count === 1 ? (
                                        <div className="max-w-xs mx-auto">
                                            <UploadSlot
                                                idx={section.start}
                                                hint={section.hint}
                                                ratio={section.ratio}
                                                accentColor="#1A3C40"
                                            />
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                            {Array.from({ length: section.count }).map((_, k) => (
                                                <UploadSlot
                                                    key={k}
                                                    idx={section.start + k}
                                                    hint={section.hint}
                                                    ratio={section.ratio}
                                                    label={`รูปที่ ${k + 1}`}
                                                    accentColor="#1A3C40"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        );
    }

    // --- Standard (Tier 1/2) ---
    const getTier2Sections = () => {
        if (isTier2) {
            return [
                { title: 'รูปภาพที่ 1', hint: '1:1', ratio: '1/1' },
                { title: 'รูปภาพที่ 2', hint: '1:1', ratio: '1/1' },
                { title: 'รูปภาพที่ 3', hint: '1:1', ratio: '1/1' },
                { title: 'รูปภาพที่ 4', hint: '1:1', ratio: '1/1' },
                { title: 'รูปภาพที่ 5', hint: '1:1', ratio: '1/1' },
            ];
        }
        return [
            { title: 'รูปภาพที่ 1', hint: '3:4', ratio: '3/4' },
            { title: 'รูปภาพที่ 2', hint: '16:9', ratio: '16/9' },
            { title: 'รูปภาพที่ 3', hint: '1:1', ratio: '1/1' },
            { title: 'รูปภาพที่ 4', hint: '4:3', ratio: '4/3' },
            { title: 'รูปภาพที่ 5', hint: '3:4', ratio: '3/4' },
        ];
    };

    const tier2Sections = getTier2Sections();
    const tier1Section = [
        { title: 'รูปภาพ', hint: '1:1', ratio: '1/1' },
    ];
    const sections = maxImages <= 1 ? tier1Section : tier2Sections.slice(0, maxImages);

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            {/* Progress bar */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 font-medium">อัปโหลดรูปภาพ</span>
                    <span className="font-semibold" style={{ color: '#1A3C40' }}>{filledCount}/{maxImages}</span>
                </div>
                <div className="w-full h-2 bg-gray-100/80 rounded-full overflow-hidden border border-gray-200/50">
                    <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: '#1A3C40' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(filledCount / maxImages) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <p className="text-[10px] text-gray-400 text-center">ขนาดไฟล์ไม่เกิน {maxFileSizeMB}MB ต่อรูป</p>
            </div>

            {/* Image Grid */}
            <div className={`grid gap-2.5 sm:gap-3 ${maxImages <= 1 ? 'grid-cols-1 max-w-xs mx-auto' : 'grid-cols-2 sm:grid-cols-3'}`}>
                {sections.map((section, idx) => (
                    <UploadSlot key={idx} idx={idx} hint={section.hint} ratio={section.ratio} label={section.title} accentColor="#1A3C40" />
                ))}
            </div>

            {/* Info Banner */}
            <div className="flex items-start gap-2.5 bg-blue-50/80 text-blue-600 p-3 rounded-xl text-xs border border-blue-100/50">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <span>อัปโหลดรูปภาพที่ต้องการให้ปรากฏในเว็บไซต์ สูงสุด {maxImages} รูป</span>
            </div>
        </motion.div>
    );
};

export default ImagesStep;

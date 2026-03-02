import { motion } from 'framer-motion';
import { X, ImageIcon, AlertCircle } from 'lucide-react';
import { useCheckout } from '../CheckoutContext';

const ImagesStep = () => {
    const {
        contentFiles, setContentFiles,
        contentPreviews, setContentPreviews,
        getMaxImages, getMaxFileSize, setError,
        isTier3
    } = useCheckout();

    const maxImages = getMaxImages();
    const maxFileSizeMB = Math.round(getMaxFileSize() / (1024 * 1024));

    // Handle standard file upload (bulk)
    const handleContentFilesChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length + contentFiles.length > maxImages) {
            setError(`อัปโหลดได้สูงสุด ${maxImages} รูปเท่านั้น`);
            return;
        }

        // Check file size for each file
        const oversizedFile = files.find(f => f.size > getMaxFileSize());
        if (oversizedFile) {
            const sizeMB = (oversizedFile.size / (1024 * 1024)).toFixed(1);
            setError(`ไฟล์ "${oversizedFile.name}" มีขนาด ${sizeMB}MB เกินลิมิต ${maxFileSizeMB}MB`);
            return;
        }

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setContentFiles([...contentFiles, ...files]);
        setContentPreviews([...contentPreviews, ...newPreviews]);
        setError('');
    };

    const removeContentImage = (index) => {
        const newFiles = [...contentFiles];
        const newPreviews = [...contentPreviews];
        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);
        setContentFiles(newFiles);
        setContentPreviews(newPreviews);
    };

    // --- Tier 3 Logic ---
    const tier3Sections = [
        { title: "Timeline 1 (Day 1)", count: 1, start: 0, hint: "ภาพแนวนอน (4:3)", ratio: "4/3" },
        { title: "Timeline 2 (Day 30)", count: 1, start: 1, hint: "ภาพแนวนอน (4:3)", ratio: "4/3" },
        { title: "Timeline 3 (Day 60)", count: 1, start: 2, hint: "ภาพแนวนอน (4:3)", ratio: "4/3" },
        {
            title: "Timeline 4 (Memories)",
            count: 5,
            start: 3,
            hint: "5 รูป: 1 แนวตั้ง, 2 แนวนอน, 2 สี่เหลี่ยม",
            subHints: ["แนวตั้ง (3:4)", "แนวนอน (16:9)", "สี่เหลี่ยม (1:1)", "สี่เหลี่ยม (1:1)", "แนวนอน (16:9)"],
            subRatios: ["3/4", "16/9", "1/1", "1/1", "16/9"]
        },
        { title: "Timeline 5 (Forever)", count: 2, start: 8, hint: "ภาพแนวตั้ง (3:4) — 600x800px", ratio: "3/4" },
    ];

    const updateSlot = (index, file) => {
        if (file && file.size > getMaxFileSize()) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
            setError(`ไฟล์ "${file.name}" มีขนาด ${sizeMB}MB เกินลิมิต ${maxFileSizeMB}MB`);
            return;
        }

        // Fill sparse arrays with null if needed
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

    const handleTier3FileChange = (e, index) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            updateSlot(index, file);
        }
    };

    const renderTier3Slot = (idx, hint, ratio) => {
        const file = contentFiles[idx];
        const preview = contentPreviews[idx];
        const isFilled = !!preview;

        return (
            <div key={idx} className="relative group">
                {isFilled ? (
                    <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm" style={{ aspectRatio: ratio || 'square' }}>
                        <img src={preview} className="w-full h-full object-cover" alt="" />
                        {/* File size badge */}
                        <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                            {(file?.size / (1024 * 1024)).toFixed(1)}MB
                        </div>
                        {/* Remove button */}
                        <button
                            onClick={() => updateSlot(idx, null)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ) : (
                    <label
                        className="w-full rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#E8A08A] hover:bg-[#E8A08A]/5 transition-all relative bg-gray-50/50 group-hover:bg-white"
                        style={{ aspectRatio: ratio || 'square' }}
                    >
                        <ImageIcon className="w-5 h-5 text-gray-300 mb-1 group-hover:text-[#E8A08A] transition-colors" />
                        <span className="text-[10px] text-gray-400 group-hover:text-[#E8A08A]">เลือกรูป</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleTier3FileChange(e, idx)}
                            className="hidden"
                        />
                    </label>
                )}
                <div className="mt-1 text-center">
                    <p className="text-[10px] text-gray-400 truncate px-1">{hint}</p>
                </div>
            </div>
        );
    };

    if (isTier3) {
        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="space-y-6 mb-6">
                    {/* Header info */}
                    <div className="text-center mb-2">
                        <p className="text-[10px] text-gray-400">
                            *อัปโหลดรูปภาพตาม Timeline (ขนาดไฟล์ไม่เกิน 4MB ต่อรูป)
                        </p>
                    </div>

                    {tier3Sections.map((section, sIdx) => (
                        <div key={sIdx} className="space-y-3">
                            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                                <span className="w-6 h-6 rounded-full bg-[#1A3C40] text-white text-xs flex items-center justify-center font-bold">
                                    {sIdx + 1}
                                </span>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-700">{section.title}</h3>
                                    <p className="text-xs text-gray-400">{section.hint}</p>
                                </div>
                            </div>

                            <div className={`grid gap-3 ${section.count > 2 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                                {Array.from({ length: section.count }).map((_, k) => {
                                    const slotIndex = section.start + k;
                                    // Use specific sub-hint/ratio if available, else general
                                    const hint = section.subHints ? section.subHints[k] : `รูปที่ ${k + 1}`;
                                    const ratio = section.subRatios ? section.subRatios[k] : section.ratio;
                                    return renderTier3Slot(slotIndex, hint, ratio);
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        );
    }

    // --- Standard Logic (Tier 1, 2) ---

    // Build slots array: filled slots + empty placeholders
    const slots = [];
    for (let i = 0; i < maxImages; i++) {
        // Robust check for mixed content types (sparse array handling for safety)
        if (i < contentPreviews.length && contentPreviews[i]) {
            slots.push({ type: 'filled', src: contentPreviews[i], file: contentFiles[i] });
        } else {
            slots.push({ type: 'empty', index: i });
        }
    }

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="space-y-6 mb-6">
                {/* Header info */}
                <div className="text-center mb-2">
                    <p className="text-[10px] text-gray-400">
                        *อัปโหลดรูปภาพตามที่กำหนด (ขนาดไฟล์ไม่เกิน {maxFileSizeMB}MB ต่อรูป)
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                        <span className="w-6 h-6 rounded-full bg-[#1A3C40] text-white text-xs flex items-center justify-center font-bold">
                            1
                        </span>
                        <div>
                            <h3 className="text-sm font-bold text-gray-700">รูปภาพแกลเลอรี</h3>
                            <p className="text-xs text-gray-400">
                                อัปโหลดได้สูงสุด {maxImages} รูป (ปัจจุบัน {contentFiles.filter(Boolean).length}/{maxImages} รูป)
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-3 grid-cols-3">
                        {slots.map((slot, idx) => {
                            const isFilled = slot.type === 'filled';

                            return (
                                <div key={idx} className="relative group">
                                    {isFilled ? (
                                        <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm aspect-square">
                                            <img src={slot.src} className="w-full h-full object-cover" alt="" />
                                            {/* File size badge */}
                                            <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                                                {slot.file ? (slot.file.size / (1024 * 1024)).toFixed(1) : '—'}MB
                                            </div>
                                            {/* Remove button */}
                                            <button
                                                onClick={() => removeContentImage(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label
                                            className="w-full rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#E8A08A] hover:bg-[#E8A08A]/5 transition-all relative bg-gray-50/50 group-hover:bg-white aspect-square"
                                        >
                                            <ImageIcon className="w-5 h-5 text-gray-300 mb-1 group-hover:text-[#E8A08A] transition-colors" />
                                            <span className="text-[10px] text-gray-400 group-hover:text-[#E8A08A]">เลือกรูป</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleContentFilesChange}
                                                className="hidden"
                                                multiple
                                            />
                                        </label>
                                    )}
                                    <div className="mt-1 text-center">
                                        <p className="text-[10px] text-gray-400 truncate px-1">รูปที่ {idx + 1}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Tips */}
            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                <AlertCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-700 space-y-0.5">
                    <p>• รองรับไฟล์ JPG, PNG, WebP</p>
                    <p>• ขนาดไฟล์ไม่เกิน {maxFileSizeMB}MB ต่อรูป</p>
                    <p>• แนะนำรูปแนวตั้งเพื่อความสวยงาม</p>
                </div>
            </div>
        </motion.div>
    );
};

export default ImagesStep;

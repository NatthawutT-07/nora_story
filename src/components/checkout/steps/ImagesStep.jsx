import { motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import { useCheckout } from '../CheckoutContext';

const ImagesStep = () => {
    const {
        contentFiles, setContentFiles,
        contentPreviews, setContentPreviews,
        getMaxImages, setError
    } = useCheckout();

    const handleContentFilesChange = (e) => {
        const files = Array.from(e.target.files);
        const max = getMaxImages();

        if (files.length + contentFiles.length > max) {
            setError(`อัปโหลดได้สูงสุด ${max} รูปเท่านั้น`);
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

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="text-center mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-800">
                    แพ็คเกจนี้อัปโหลดได้สูงสุด <span className="font-bold">{getMaxImages()}</span> รูป
                </p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
                {contentPreviews.map((src, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                        <img src={src} className="w-full h-full object-cover" alt="" />
                        <button
                            onClick={() => removeContentImage(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}
                {contentFiles.length < getMaxImages() && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#E8A08A] hover:bg-[#E8A08A]/5 transition-colors">
                        <Upload className="w-6 h-6 text-gray-400" />
                        <span className="text-xs text-gray-400 mt-1">เพิ่มรูป</span>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleContentFilesChange}
                            className="hidden"
                        />
                    </label>
                )}
            </div>
        </motion.div>
    );
};

export default ImagesStep;

import { motion } from 'framer-motion';
import { Upload, Copy } from 'lucide-react';
import { useCheckout } from '../CheckoutContext';

const PaymentStep = () => {
    const { tier, slipPreview, setSlipFile, setSlipPreview, setError } = useCheckout();

    const handleSlipChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('ไฟล์ขนาดใหญ่เกินไป (Max 5MB)');
                return;
            }
            setSlipFile(selectedFile);
            setError('');
            const reader = new FileReader();
            reader.onloadend = () => setSlipPreview(reader.result);
            reader.readAsDataURL(selectedFile);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-[#1A3C40]/5 rounded-xl p-5 mb-6 border border-[#1A3C40]/10 text-center">
                <p className="text-sm text-[#4E6E81] font-medium mb-2">ยอดชำระเงิน</p>
                <p className="text-4xl font-bold text-[#1A3C40] mb-4">{tier?.price}.-</p>
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm max-w-xs mx-auto">
                    <span className="text-lg font-mono text-[#1A3C40] font-bold">123-4-56789-0</span>
                    <button
                        onClick={() => navigator.clipboard.writeText('1234567890')}
                        className="text-[#E8A08A] text-sm"
                    >
                        <Copy size={16} />
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">KBank: นาย ณัฐวุฒิ</p>
            </div>

            <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-2">แนบสลิปโอนเงิน</label>
                <label className={`w-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${slipPreview ? 'border-[#E8A08A] bg-[#E8A08A]/5' : 'border-gray-200 hover:border-[#E8A08A]/50'}`}>
                    {slipPreview ? (
                        <div className="h-32 rounded-lg overflow-hidden">
                            <img src={slipPreview} className="h-full object-contain" alt="slip" />
                        </div>
                    ) : (
                        <div className="text-center text-gray-400">
                            <Upload className="w-6 h-6 mx-auto mb-2 opacity-50" />
                            <span className="text-xs">คลิกเพื่ออัปโหลดสลิป</span>
                        </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleSlipChange} className="hidden" />
                </label>
            </div>
        </motion.div>
    );
};

export default PaymentStep;

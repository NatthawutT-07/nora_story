import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useCheckout } from '../CheckoutContext';

const SuccessStep = () => {
    const { tier, formData, handleClose } = useCheckout();

    return (
        <div className="text-center flex flex-col items-center justify-center min-h-[300px] px-4">
            {/* Success Icon */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 bg-[#1A3C40] text-white rounded-full flex items-center justify-center mb-6"
            >
                <Check size={32} strokeWidth={3} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h3 className="text-xl font-playfair font-bold text-[#1A3C40] mb-2">
                    ได้รับข้อมูลเรียบร้อย!
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                    ระบบกำลังตรวจสอบและจัดทำเว็บไซต์ให้ ลิ้งเว็บไซต์จะถูกส่งไปที่อีเมลของท่าน
                </p>
            </motion.div>

            {/* Order Summary */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full max-w-xs bg-gray-50 rounded-xl p-4 mb-6 text-left"
            >
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">แพ็คเกจ</span>
                        <span className="font-medium text-[#1A3C40]">{tier?.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">ราคา</span>
                        <span className="font-medium text-[#1A3C40]">฿{tier?.price}</span>
                    </div>
                    <div className="h-px bg-gray-200" />
                    <div className="flex justify-between">
                        <span className="text-gray-400">ส่งลิงก์ไปที่</span>
                        <span className="font-medium text-[#1A3C40] text-xs">{formData.buyerEmail}</span>
                    </div>
                </div>
            </motion.div>

            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={handleClose}
                className="bg-[#1A3C40] text-white px-8 py-3 rounded-xl hover:bg-[#1A3C40]/90 transition-colors text-sm font-medium"
            >
                ปิดหน้าต่าง
            </motion.button>
        </div>
    );
};

export default SuccessStep;

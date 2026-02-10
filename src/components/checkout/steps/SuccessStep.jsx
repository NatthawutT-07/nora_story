import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useCheckout } from '../CheckoutContext';

const SuccessStep = () => {
    const { formData, handleClose } = useCheckout();

    return (
        <div className="text-center flex flex-col items-center justify-center min-h-[300px]">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6"
            >
                <CheckCircle size={40} />
            </motion.div>
            <h3 className="text-2xl font-playfair font-bold text-[#1A3C40] mb-2">
                ได้รับข้อมูลเรียบร้อย!
            </h3>
            <p className="text-gray-500 mb-2">
                ทางเราจะรีบตรวจสอบและจัดทำหน้าเว็บไซต์ให้ภายใน 24 ชม.
            </p>
            <p className="text-sm text-[#E8A08A] mb-6">
                ลิงก์จะถูกส่งไปที่: {formData.buyerEmail}
            </p>
            <button
                onClick={handleClose}
                className="bg-[#1A3C40] text-white px-8 py-3 rounded-xl hover:bg-[#1A3C40]/90 transition-colors"
            >
                ปิดหน้าต่าง
            </button>
        </div>
    );
};

export default SuccessStep;

import { motion } from 'framer-motion';
import { Check, Package, Mail, CreditCard, Sparkles } from 'lucide-react';
import { useCheckout } from '../CheckoutContext';

const SuccessStep = () => {
    const { tier, formData, handleClose } = useCheckout();

    return (
        <div className="text-center flex flex-col items-center justify-center min-h-[400px] sm:min-h-[450px] px-4 sm:px-6 py-6">
            {/* Success Icon with gradient background */}
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative mb-2"
            >
                {/* Animated rings */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 0 }}
                    transition={{ duration: 1, delay: 0.3, repeat: 1 }}
                    className="absolute inset-0 bg-[#1A3C40]/20 rounded-full"
                />
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#1A3C40] to-[#2d5a60] text-white rounded-full flex items-center justify-center shadow-xl shadow-[#1A3C40]/30 relative z-10">
                    <Check size={36} strokeWidth={3} className="sm:w-10 sm:h-10" />
                </div>
                {/* <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="absolute -top-1 -right-1 bg-[#E8A08A] text-white p-1.5 rounded-full shadow-lg"
                >
                    <Sparkles size={14} />
                </motion.div> */}
            </motion.div>

            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <h3 className="text-2xl sm:text-3xl font-playfair font-bold text-[#1A3C40] mb-3">
                    สำเร็จแล้ว!
                </h3>
              
            </motion.div>

            {/* Order Summary Card */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="w-full max-w-xs sm:max-w-sm bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 mb-6 text-left border border-gray-100 shadow-lg"
            >
                {/* Card header */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                    <div className="w-8 h-8 bg-[#1A3C40]/10 rounded-lg flex items-center justify-center">
                        <Package size={16} className="text-[#1A3C40]" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">สรุปคำสั่งซื้อ</span>
                </div>

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 flex items-center gap-2">
                            <Package size={14} />
                            แพ็คเกจ
                        </span>
                        <span className="font-semibold text-[#1A3C40]">{tier?.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 flex items-center gap-2">
                            <CreditCard size={14} />
                            ราคา
                        </span>
                        <span className="font-semibold text-[#E8A08A]">฿{tier?.price}</span>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                    <div className="flex justify-between items-start">
                        <span className="text-gray-400 flex items-center gap-2 shrink-0">
                            <Mail size={14} />
                            ส่งไปที่
                        </span>
                        <span className="font-medium text-[#1A3C40] text-xs sm:text-sm text-right break-all max-w-[140px] sm:max-w-[180px]">
                            {formData.buyerEmail}
                        </span>
                    </div>
                </div>
            </motion.div>
            <p className="text-[10px] sm:text-[11px] text-gray-400 mb-4 max-w-xs mx-auto leading-tight tracking-tighter opacity-80">
                ระบบกำลังตรวจสอบและจัดทำเว็บไซต์<br className="hidden sm:block" />
                &nbsp;&nbsp;ลิงก์จะถูกส่งไปที่อีเมลของท่าน
            </p>
            {/* Close Button */}
            <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                className="w-full max-w-xs sm:max-w-sm bg-gradient-to-r from-[#1A3C40] to-[#2d5a60] text-white px-8 py-3.5 rounded-xl hover:shadow-lg hover:shadow-[#1A3C40]/20 transition-all duration-300 text-sm font-medium"
            >
                ปิดหน้าต่าง
            </motion.button>

        </div>
    );
};

export default SuccessStep;

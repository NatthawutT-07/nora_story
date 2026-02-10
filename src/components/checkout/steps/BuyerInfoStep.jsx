import { motion } from 'framer-motion';
import { useCheckout } from '../CheckoutContext';

const BuyerInfoStep = () => {
    const { tier, formData, updateFormData } = useCheckout();

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">ชื่อผู้สั่งซื้อ</label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50"
                        placeholder="ชื่อของคุณ"
                        value={formData.buyerName}
                        onChange={(e) => updateFormData({ buyerName: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email (สำหรับรับลิงก์)</label>
                    <input
                        type="email"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50"
                        placeholder="your@email.com"
                        value={formData.buyerEmail}
                        onChange={(e) => updateFormData({ buyerEmail: e.target.value })}
                    />
                    <p className="text-xs text-gray-400 mt-1">* ลิงก์สินค้าจะถูกส่งไปที่อีเมลนี้</p>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                    <input
                        type="tel"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50"
                        placeholder="0812345678"
                        value={formData.buyerPhone}
                        onChange={(e) => updateFormData({ buyerPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    />
                </div>

                {tier?.id === 4 && (
                    <div>
                        <label className="block text-xs font-medium text-[#1A3C40] mb-1">ชื่อโดเมนที่ต้องการ</label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-l-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-white"
                                placeholder="yourname"
                                value={formData.customDomain}
                                onChange={(e) => updateFormData({ customDomain: e.target.value })}
                            />
                            <span className="bg-gray-100 border border-l-0 border-gray-200 px-4 py-3 rounded-r-xl text-gray-500 text-sm">.norastory.com</span>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default BuyerInfoStep;

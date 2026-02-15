import { motion } from 'framer-motion';
import { useCheckout } from '../CheckoutContext';

const BuyerInfoStep = () => {
    const { tier, formData, updateFormData } = useCheckout();

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">ชื่อผู้สั่งซื้อ</label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1A3C40]/20 focus:border-[#1A3C40]/40 bg-gray-50/50 outline-none transition-all text-sm"
                        placeholder="ชื่อของคุณ"
                        value={formData.buyerName}
                        onChange={(e) => updateFormData({ buyerName: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
                    <input
                        type="email"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1A3C40]/20 focus:border-[#1A3C40]/40 bg-gray-50/50 outline-none transition-all text-sm"
                        placeholder="your@email.com"
                        value={formData.buyerEmail}
                        onChange={(e) => updateFormData({ buyerEmail: e.target.value })}
                    />
                    <p className="text-[11px] text-gray-400 mt-1">ลิงก์เว็บไซต์จะถูกส่งไปที่อีเมลนี้</p>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">เบอร์โทรศัพท์</label>
                    <input
                        type="tel"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1A3C40]/20 focus:border-[#1A3C40]/40 bg-gray-50/50 outline-none transition-all text-sm"
                        placeholder="0812345678"
                        value={formData.buyerPhone}
                        onChange={(e) => updateFormData({ buyerPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    />
                </div>

                {String(tier?.id) === '4' && (
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">ชื่อโดเมนที่ต้องการ</label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-l-xl border border-gray-200 focus:ring-2 focus:ring-[#1A3C40]/20 focus:border-[#1A3C40]/40 bg-white outline-none transition-all text-sm"
                                placeholder="yourname"
                                value={formData.customDomain}
                                onChange={(e) => updateFormData({ customDomain: e.target.value })}
                            />
                            <span className="bg-gray-100 border border-l-0 border-gray-200 px-4 py-3 rounded-r-xl text-gray-500 text-sm">.norastory.com</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Trust Message */}
            <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                <span>🔒</span>
                <span>ข้อมูลของคุณปลอดภัยและเป็นความลับ</span>
            </div>
        </motion.div>
    );
};

export default BuyerInfoStep;

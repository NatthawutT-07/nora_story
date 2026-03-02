import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useCheckout } from '../CheckoutContext';
import { useState } from 'react';

const BuyerInfoStep = () => {
    const { tier, formData, updateFormData, checkDomainAvailability, isDomainAvailable, setIsDomainAvailable } = useCheckout();
    const [isChecking, setIsChecking] = useState(false);

    const handleCheckDomain = async () => {
        if (!formData.customDomain) return;
        setIsChecking(true);
        await checkDomainAvailability(formData.customDomain);
        setIsChecking(false);
    };

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

                {/* Custom/Special Link inputs */}
                {(tier?.wantSpecialLink || tier?.wantCustomLink) && (
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#E8A08A]" />
                            <span className="text-xs font-medium text-[#1A3C40]">
                                {tier?.wantSpecialLink ? 'Special Link ที่ต้องการ' : 'Custom Link ที่ต้องการ'}
                            </span>
                        </div>

                        <div>
                            <label className="block text-[11px] font-medium text-gray-500 mb-2">ตรวจสอบชื่อลิงก์ว่าว่างหรือไม่ก่อนทำรายการถัดไป</label>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center flex-1 min-w-0">
                                    <span className="bg-gray-100 border border-r-0 border-gray-200 px-2.5 py-2.5 rounded-l-xl text-gray-400 text-[11px] whitespace-nowrap">
                                        {tier?.wantSpecialLink ? 'https://' : 'norastory.com/'}
                                    </span>
                                    <input
                                        type="text"
                                        className={`flex-1 min-w-0 px-3 py-2.5 ${tier?.wantSpecialLink ? 'border-y' : 'border border-l-0 rounded-r-xl'} border-gray-200 focus:ring-2 focus:ring-[#1A3C40]/20 focus:border-[#1A3C40]/40 bg-white outline-none transition-all text-sm ${isDomainAvailable === false ? 'border-red-300 bg-red-50' : isDomainAvailable === true ? 'border-green-300 bg-green-50' : ''}`}
                                        placeholder="yourname"
                                        value={formData.customDomain}
                                        onChange={(e) => {
                                            updateFormData({ customDomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 30) });
                                            setIsDomainAvailable(null); // Reset validation state on type
                                        }}
                                    />
                                    {tier?.wantSpecialLink && (
                                        <span className="bg-gray-100 border border-l-0 border-gray-200 px-2.5 py-2.5 rounded-r-xl text-gray-400 text-[11px] whitespace-nowrap">.norastory.com</span>
                                    )}
                                </div>
                                <button
                                    onClick={handleCheckDomain}
                                    disabled={!formData.customDomain || formData.customDomain.length < 5 || isChecking}
                                    className="px-4 py-2.5 bg-[#1A3C40] hover:bg-[#2a4c50] disabled:bg-gray-300 text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap flex items-center gap-2"
                                >
                                    {isChecking ? <Loader2 size={16} className="animate-spin" /> : 'ตรวจสอบ'}
                                </button>
                            </div>

                            {/* Validation Warning for > 0 && < 5 characters */}
                            {formData.customDomain && formData.customDomain.length > 0 && formData.customDomain.length < 5 && (
                                <p className="mt-2 text-[10px] text-orange-500">
                                    ชื่อต้องมีอย่างน้อย 5 ตัวอักษร
                                </p>
                            )}

                            {/* Status Message */}
                            {isDomainAvailable === true && (
                                <p className="mt-2 text-xs text-green-600 flex items-center gap-1.5">
                                    <CheckCircle2 size={14} /> สามารถใช้ชื่อนี้ได้
                                </p>
                            )}
                            {isDomainAvailable === false && (
                                <p className="mt-2 text-xs text-red-500 flex items-center gap-1.5">
                                    <XCircle size={14} /> ชื่อนี้มีผู้ใช้งานแล้ว กรุณาเลือกชื่ออื่น
                                </p>
                            )}
                        </div>

                        <p className="text-[10px] text-gray-400 leading-relaxed">
                            ใช้ได้เฉพาะตัวอักษรพิมพ์เล็ก (a-z) ตัวเลข (0-9) และเครื่องหมาย (-) เท่านั้น
                        </p>
                    </div>
                )}
            </div>

            {/* Trust Message */}
            <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                <span>ข้อมูลของคุณปลอดภัยและเป็นความลับ</span>
            </div>
        </motion.div>
    );
};

export default BuyerInfoStep;

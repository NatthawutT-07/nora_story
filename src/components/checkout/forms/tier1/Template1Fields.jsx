import { useCheckout } from '../../CheckoutContext';

const Template1Fields = () => {
    const { formData, updateFormData, selectedTemplate } = useCheckout();

    const isTier2 = selectedTemplate === 't2-1';

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${isTier2 ? 'bg-teal-100 text-teal-600' : 'bg-pink-100 text-pink-600'}`}>
                    {isTier2 ? 'Tier 2-1' : 'Tier 1-1'}
                </span>
                <span className="text-xs text-gray-400">{isTier2 ? 'Standard Love' : 'Love Card'}</span>
            </div>

            {/* PIN */}
            <div className="relative">
                <div className="mb-1">
                    <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1">
                        <span>รหัส PIN 4 หลัก</span>
                        <span className="text-gray-400">สำหรับปลดล็อก</span>
                    </label>
                </div>
                <input
                    type="text"
                    maxLength={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50 text-center text-2xl tracking-[0.5em] font-mono outline-none transition-all"
                    placeholder="1234"
                    value={formData.pin}
                    onChange={(e) => updateFormData({ pin: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                />
            </div>

            {/* Target Name */}
            <div className="relative">
                <div className="mb-1">
                    <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1">
                        <span>ชื่อคนที่คุณอยากบอก</span>
                        <span className={`${(formData.targetName?.length || 0) > 20 ? 'text-red-500' : 'text-gray-400'}`}>
                            ({formData.targetName?.length || 0}/20)
                        </span>
                    </label>
                </div>
                <input
                    type="text"
                    maxLength={20}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50 outline-none transition-all text-sm"
                    placeholder="ชื่อแฟน, ชื่อคนที่รัก, ชื่อหวานใจ"
                    value={formData.targetName}
                    onChange={(e) => updateFormData({ targetName: e.target.value })}
                />
            </div>
            {/* Main Message */}
            <div className="relative">
                <div className="flex items-center justify-between mb-1">
                    <label className="flex items-center justify-between text-xs font-medium text-gray-600 w-full">
                        <span>ข้อความหลัก</span>
                        <span className={`${formData.message.length > 100 ? 'text-red-500' : 'text-gray-400'}`}>
                            ({formData.message.length}/100)
                        </span>
                    </label>
                </div>
                <textarea
                    maxLength={100}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50 h-32 resize-none outline-none transition-all text-sm"
                    placeholder="ข้อความที่อยากบอกคนรับ..."
                    value={formData.message}
                    onChange={(e) => updateFormData({ message: e.target.value.slice(0, 100) })}
                />
            </div>

            {/* Sign Off */}
            <div className="relative">
                <div className="mb-1">
                    <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1">
                        <span>คำลงท้ายว่า</span>
                        <span className={`${(formData.signOff?.length || 0) > 20 ? 'text-red-500' : 'text-gray-400'}`}>
                            ({formData.signOff?.length || 0}/20)
                        </span>
                    </label>
                </div>
                <input
                    type="text"
                    maxLength={20}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50 outline-none transition-all text-sm"
                    placeholder="รักเธอเสมอ, คนที่รักเธอที่สุด"
                    value={formData.signOff}
                    onChange={(e) => updateFormData({ signOff: e.target.value })}
                />
            </div>
        </div>
    );
};

export default Template1Fields;

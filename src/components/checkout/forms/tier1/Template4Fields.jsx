import { useCheckout } from '../../CheckoutContext';

const Template4Fields = () => {
    const { formData, updateFormData } = useCheckout();

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-600">
                    Tier 1-4
                </span>
                <span className="text-xs text-gray-400">Love Story</span>
            </div>

            {/* PIN */}
            <div>
                <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1">
                    <span>รหัส PIN 4 หลัก</span>
                    <span className="text-gray-400">สำหรับปลดล็อก</span>
                </label>
                <input
                    type="text"
                    maxLength={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50 text-center text-2xl tracking-[0.5em] font-mono outline-none transition-all"
                    placeholder="1234"
                    value={formData.pin}
                    onChange={(e) => updateFormData({ pin: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                />
            </div>

            {/* Target Name */}
            <div>
                <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1">
                    <span>ชื่อคนที่คุณรัก</span>
                    <span className={`${(formData.targetName?.length || 0) > 20 ? 'text-red-500' : 'text-gray-400'}`}>
                        ({formData.targetName?.length || 0}/20)
                    </span>
                </label>
                <input
                    type="text"
                    maxLength={20}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50 outline-none transition-all text-sm"
                    placeholder="ชื่อแฟน, ชื่อคนพิเศษ"
                    value={formData.targetName}
                    onChange={(e) => updateFormData({ targetName: e.target.value })}
                />
            </div>

            {/* Main Message */}
            <div>
                <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1">
                    <span>ข้อความบอกรัก</span>
                    <span className={`${formData.message.length > 100 ? 'text-red-500' : 'text-gray-400'}`}>
                        ({formData.message.length}/100)
                    </span>
                </label>
                <textarea
                    maxLength={100}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50 h-32 resize-none outline-none transition-all text-sm"
                    placeholder="เขียนความในใจที่อยากส่งถึงเขา / เธอ..."
                    value={formData.message}
                    onChange={(e) => updateFormData({ message: e.target.value.slice(0, 100) })}
                />
            </div>

            {/* Sign Off */}
            <div>
                <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1">
                    <span>ลงชื่อว่า</span>
                    <span className={`${(formData.signOff?.length || 0) > 20 ? 'text-red-500' : 'text-gray-400'}`}>
                        ({formData.signOff?.length || 0}/20)
                    </span>
                </label>
                <input
                    type="text"
                    maxLength={20}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50 outline-none transition-all text-sm"
                    placeholder="ชื่อของคุณ, คนที่รักเธอที่สุด"
                    value={formData.signOff}
                    onChange={(e) => updateFormData({ signOff: e.target.value })}
                />
            </div>
        </div>
    );
};

export default Template4Fields;

import { useCheckout } from '../../CheckoutContext';

const Template2Fields = () => {
    const { formData, updateFormData } = useCheckout();

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-pink-100 text-pink-600">
                    Tier 1-2
                </span>
                <span className="text-xs text-gray-400">Chat View</span>
            </div>

            {/* Target Name */}
            <div className="relative">
                <div className="mb-1">
                    <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1">
                        <span>ชื่อคู่สนทนา (ด้านบน)</span>
                        <span className={`${(formData.targetName?.length || 0) > 15 ? 'text-red-500' : 'text-gray-400'}`}>
                            ({formData.targetName?.length || 0}/15)
                        </span>
                    </label>
                </div>
                <input
                    type="text"
                    maxLength={15}
                    className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50 outline-none transition-all text-sm md:text-base"
                    placeholder="เช่น Honey ❤️"
                    value={formData.targetName}
                    onChange={(e) => updateFormData({ targetName: e.target.value })}
                />
            </div>

            {/* Message 1 (Short Message) */}
            <div className="relative">
                <div className="mb-1">
                    <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1">
                        <span>ข้อความแรกที่ทักทาย</span>
                    </label>
                </div>
                <input
                    type="text"
                    maxLength={50}
                    className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50 outline-none transition-all text-sm md:text-base"
                    placeholder="เช่น Baby"
                    value={formData.shortMessage}
                    onChange={(e) => updateFormData({ shortMessage: e.target.value })}
                />
            </div>

            {/* Message 2 (Custom Message) */}
            <div className="relative">
                <div className="flex items-center justify-between mb-1">
                    <label className="flex items-center justify-between text-xs font-medium text-gray-600 w-full">
                        <span>ข้อความบอกรักส่วนที่ 2</span>
                        <span className={`${formData.customMessage?.length > 200 ? 'text-red-500' : 'text-gray-400'}`}>
                            ({formData.customMessage?.length || 0}/200)
                        </span>
                    </label>
                </div>
                <textarea
                    maxLength={200}
                    className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E8A08A]/50 bg-gray-50 h-32 md:h-40 resize-none outline-none transition-all text-sm md:text-base"
                    placeholder="ข้อความความรู้สึกยาวๆ ไม่เกิน 200 ตัวอักษร"
                    value={formData.customMessage}
                    onChange={(e) => updateFormData({ customMessage: e.target.value.slice(0, 200) })}
                />
            </div>
        </div>
    );
};

export default Template2Fields;

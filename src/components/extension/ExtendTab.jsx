import { Check, Globe, Sparkles, CreditCard, Loader2, CheckCircle2, XCircle, Timer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import generatePayload from 'promptpay-qr';

const ExtendTab = ({
    packages,
    selectedPackage,
    setSelectedPackage,
    wantSpecialLink,
    setWantSpecialLink,
    wantCustomLink,
    setWantCustomLink,
    customDomain1,
    setCustomDomain1,
    domainStatus,
    isDomainChecking,
    handleCheckDomain,
    qrTimeLeft,
    order,
    expiryDate,
    isExpired,
    promptpayId,
    handleSlipChange,
    slipFile,
    isSubmitting,
    handleSubmit
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
            {/* Left: Package Selection */}
            <div className="space-y-5 sm:space-y-6">
                <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#1A3C40] mb-3 sm:mb-4">เลือกแพ็คเกจต่ออายุ</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {packages.map((pkg) => (
                            <div
                                key={pkg.days}
                                onClick={() => setSelectedPackage(pkg)}
                                className={`cursor-pointer rounded-xl p-4 border-2 transition-all relative flex justify-between items-center ${selectedPackage?.days === pkg.days
                                    ? 'border-[#E8A08A] bg-[#E8A08A]/5 shadow-md'
                                    : 'border-gray-100 bg-white hover:border-gray-200'
                                    }`}
                            >
                                {pkg.recommended && (
                                    <span className="absolute -top-3 left-4 bg-[#1A3C40] text-white text-[10px] px-2 py-0.5 rounded-full">
                                        แนะนำ
                                    </span>
                                )}
                                <div className="flex flex-col">
                                    <span className="font-bold text-[#1A3C40]">{pkg.label}</span>
                                    <span className="text-xs text-gray-400">{pkg.tierName || pkg.perDay}</span>
                                </div>
                                <span className="font-bold text-[#E8A08A] text-lg">{pkg.price} ฿</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Link Add-on Upsells — only show if not already purchased */}
                {!order?.want_special_link && !order?.want_custom_link && !order?.want_custom_domain && !order?.custom_domain && !order?.extension_requested_special_link && !order?.extension_requested_custom_link && (
                    <div className="space-y-3">
                        <div
                            onClick={() => {
                                setWantCustomLink(!wantCustomLink);
                                if (!wantCustomLink) setWantSpecialLink(false);
                            }}
                            className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${wantCustomLink
                                ? 'border-[#E8A08A] bg-[#E8A08A]/5 shadow-md'
                                : 'border-gray-100 bg-white hover:border-[#E8A08A]/30'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${wantCustomLink ? 'bg-[#E8A08A] border-[#E8A08A]' : 'border-gray-300'
                                    }`}>
                                    {wantCustomLink && <Check size={14} strokeWidth={3} className="text-white" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Globe size={16} className="text-[#1A3C40]" />
                                        <span className="font-bold text-[#1A3C40] text-sm">Custom Link</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">เปลี่ยนชื่อพาร์ทด้านหลัง เป็นชื่อคุณเอง: <span className="font-mono text-[#E8A08A]">norastory.com/ชื่อคุณ</span></p>
                                </div>
                                <span className="font-bold text-[#E8A08A] text-lg flex-shrink-0">+99 ฿</span>
                            </div>
                        </div>

                        <div
                            onClick={() => {
                                setWantSpecialLink(!wantSpecialLink);
                                if (!wantSpecialLink) setWantCustomLink(false);
                            }}
                            className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${wantSpecialLink
                                ? 'border-purple-400 bg-purple-50 shadow-md'
                                : 'border-gray-100 bg-white hover:border-purple-200'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${wantSpecialLink ? 'bg-purple-500 border-purple-500' : 'border-gray-300'
                                    }`}>
                                    {wantSpecialLink && <Check size={14} strokeWidth={3} className="text-white" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Sparkles size={16} className="text-purple-500" />
                                        <span className="font-bold text-[#1A3C40] text-sm">Special Link</span>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600 border border-red-200 animate-pulse">
                                            จำนวนจำกัด
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">ได้ลิงก์ <span className="font-mono text-purple-600">ชื่อคุณ.norastory.com</span> แทนลิงก์ปกติ</p>
                                </div>
                                <span className="font-bold text-purple-500 text-lg flex-shrink-0">+999 ฿</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Input Fields */}
                {(wantSpecialLink || wantCustomLink) && !order?.want_special_link && !order?.want_custom_link && !order?.want_custom_domain && !order?.custom_domain && !order?.extension_requested_special_link && !order?.extension_requested_custom_link && (
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200">
                        <p className="text-sm font-bold text-[#1A3C40] mb-2">
                            ระบุชื่อ {wantSpecialLink ? 'Special Link' : 'Custom Link'} ที่ต้องการ
                        </p>
                        <p className="text-[11px] text-gray-500 mb-4 block">
                            * เฉพาะภาษาอังกฤษตัวพิมพ์เล็กและตัวเลข (a-z, 0-9) และขีด (-)
                        </p>
                        <div className="space-y-3">
                            <div>
                                <label className="text-[11px] font-semibold text-gray-700 block mb-2">ตรวจสอบชื่อลิงก์ว่าว่างหรือไม่ก่อนชำระเงิน</label>
                                <div className="flex items-center gap-2">
                                    <div className={`flex items-center flex-1 min-w-0 bg-white rounded-lg border focus-within:ring-2 focus-within:ring-[#1A3C40]/20 focus-within:border-[#1A3C40]/40 transition-all ${domainStatus === false ? 'border-red-300 ring-1 ring-red-300 bg-red-50' :
                                        domainStatus === true ? 'border-green-300 ring-1 ring-green-300 bg-green-50' :
                                            'border-gray-200'
                                        }`}>
                                        {!wantSpecialLink && (
                                            <span className="bg-gray-100 px-2.5 py-2.5 text-[11px] text-gray-400 font-mono border-r border-gray-200 whitespace-nowrap rounded-l-lg">
                                                norastory.com/
                                            </span>
                                        )}
                                        <input
                                            type="text"
                                            value={customDomain1}
                                            onChange={(e) => setCustomDomain1(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                            placeholder="yourname"
                                            className={`flex-1 px-3 py-2.5 text-sm outline-none min-w-0 ${domainStatus === false ? 'bg-red-50' : domainStatus === true ? 'bg-green-50' : 'bg-white'}`}
                                        />
                                        {wantSpecialLink && (
                                            <span className="bg-gray-100 px-2.5 py-2.5 text-[11px] text-gray-400 font-mono border-l border-gray-200 whitespace-nowrap rounded-r-lg">
                                                .norastory.com
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleCheckDomain}
                                        disabled={!customDomain1 || (wantCustomLink && customDomain1.length < 5) || isDomainChecking}
                                        className="px-4 py-2.5 bg-[#1A3C40] hover:bg-[#2a4c50] disabled:bg-gray-300 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 h-full"
                                    >
                                        {isDomainChecking ? <Loader2 size={16} className="animate-spin" /> : 'ตรวจสอบ'}
                                    </button>
                                </div>

                                <div className="mt-2 text-xs">
                                    {domainStatus === false && (
                                        <p className="text-red-500 flex items-center gap-1.5 font-medium">
                                            <XCircle size={14} /> ชื่อนี้มีผู้ใช้งานแล้ว กรุณาเลือกชื่ออื่น
                                        </p>
                                    )}
                                    {domainStatus === true && (
                                        <p className="text-green-600 flex items-center gap-1.5 font-medium">
                                            <CheckCircle2 size={14} /> สามารถใช้ชื่อนี้ได้
                                        </p>
                                    )}
                                    {customDomain1.length > 0 && customDomain1.length < 5 && wantCustomLink && (
                                        <p className="text-amber-500 font-medium ml-1">
                                            ต้องใช้ชื่ออย่างน้อย 5 ตัวอักษร
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Show badge if already purchased */}
                {(order?.want_special_link || order?.want_custom_link || order?.want_custom_domain || order?.custom_domain || order?.extension_requested_special_link || order?.extension_requested_custom_link) && (
                    <div className="rounded-xl p-4 border-2 border-green-200 bg-green-50">
                        <div className="flex items-center gap-3">
                            <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-green-700">มีสิทธิเศษ Custom/Special Link แล้ว ✓</p>
                                <p className="text-xs text-green-600/70">คุณมีลิงก์พิเศษแล้ว แอดมินจัดการให้เลยครับ!</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Expiry Preview */}
                {expiryDate && selectedPackage && (
                    <div className="bg-[#1A3C40]/5 rounded-xl p-4 border border-[#1A3C40]/10">
                        <p className="text-xs text-gray-500 mb-1">วันหมดอายุใหม่หลังต่ออายุ</p>
                        <p className="font-bold text-[#1A3C40]">
                            {(() => {
                                const base = isExpired ? new Date() : expiryDate;
                                const newDate = new Date(base);
                                newDate.setDate(newDate.getDate() + selectedPackage.days);
                                return newDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
                            })()}
                        </p>
                    </div>
                )}
            </div>

            {/* Right: Payment */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 h-fit md:sticky md:top-6">
                <h3 className="text-base sm:text-lg font-bold text-[#1A3C40] mb-4 flex items-center gap-2">
                    <CreditCard size={20} className="text-[#E8A08A]" /> ชำระเงิน
                </h3>

                {/* PromptPay QR Code */}
                <div className="bg-gray-50 rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center mb-4 sm:mb-6 text-center border border-gray-100">
                    {(() => {
                        const totalAmount = (selectedPackage?.price || 0) + (wantSpecialLink ? 999 : 0) + (wantCustomLink ? 99 : 0);
                        const payload = totalAmount > 0 ? generatePayload(promptpayId, { amount: totalAmount }) : null;

                        const isQrVisible = !((wantSpecialLink || wantCustomLink) && domainStatus !== true) && (!((wantSpecialLink || wantCustomLink) && qrTimeLeft === 0));

                        return payload && isQrVisible ? (
                            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm relative mb-3 sm:mb-4">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#113566] text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap z-10 box-shadow">
                                    สแกนจ่ายด้วยแอปธนาคาร
                                </div>
                                <QRCodeSVG
                                    value={payload}
                                    size={160}
                                    level="M"
                                    includeMargin={true}
                                    className="rounded-lg"
                                />
                                {qrTimeLeft !== null && qrTimeLeft > 0 && (
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-red-50 border border-red-200 text-red-600 text-[10px] font-medium px-3 py-1 rounded-full flex items-center gap-1 min-w-[max-content] shadow-sm">
                                        <Timer size={12} className="animate-pulse" />
                                        หมดอายุใน {Math.floor(qrTimeLeft / 60)}:{(qrTimeLeft % 60).toString().padStart(2, '0')} นาที
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-40 w-40 bg-white rounded-xl flex items-center justify-center text-center text-gray-400 text-xs mb-3 border border-dashed border-gray-200 p-4">
                                {(!selectedPackage) ? 'เลือกแพ็คเกจก่อน' :
                                    ((wantSpecialLink || wantCustomLink) && domainStatus !== true) ? 'กรุณาตรวจสอบชื่อลิงก์ว่าว่างหรือไม่' :
                                        ((wantSpecialLink || wantCustomLink) && qrTimeLeft === 0) ? 'คิวอาร์โค้ดหมดอายุ กรุณาตรวจสอบลิงก์อีกครั้ง' : ''}
                            </div>
                        );
                    })()}

                    <div className="bg-[#1A3C40] text-white px-4 py-2 rounded-lg w-full">
                        <span className="text-xs sm:text-sm opacity-80 block">ยอดชำระ</span>
                        <span className="text-lg sm:text-xl font-bold">{(selectedPackage?.price || 0) + (wantSpecialLink ? 999 : 0) + (wantCustomLink ? 99 : 0)} บาท</span>
                        {(wantSpecialLink || wantCustomLink) && (
                            <span className="text-[10px] opacity-60 block mt-0.5">({selectedPackage?.price}฿ + {wantSpecialLink ? 'Special Link 999฿' : 'Custom Link 99฿'})</span>
                        )}
                    </div>
                </div>

                {/* Slip Upload */}
                <div className="mb-4 sm:mb-6">
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                        แนบสลิปโอนเงิน
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleSlipChange}
                        className="block w-full text-sm text-gray-600 border border-gray-200 rounded-lg p-1.5 cursor-pointer bg-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border file:border-gray-200 file:text-xs file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !slipFile}
                    className={`w-full py-3 rounded-xl font-bold text-base sm:text-lg transition-all flex items-center justify-center gap-2 ${isSubmitting || !slipFile
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#E8A08A] text-[#1A3C40] hover:bg-[#d89279] shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                        }`}
                >
                    {isSubmitting ? (
                        <><Loader2 className="animate-spin" size={20} /> กำลังส่ง...</>
                    ) : (
                        'ยืนยันการต่ออายุ'
                    )}
                </button>
            </div>
        </div>
    );
};

export default ExtendTab;

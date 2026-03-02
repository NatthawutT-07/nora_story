import { FileText } from 'lucide-react';

const HistoryTab = ({ order }) => {
    const formatDate = (d) => {
        if (!d) return '';
        const date = d instanceof Date ? d : d?.toDate?.() || new Date(d);
        return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
            + ' ' + date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    };

    const events = [];

    // Order Event
    if (order.created_at) {
        const d = order.created_at instanceof Date ? order.created_at : order.created_at?.toDate?.() || null;
        if (d) {
            let label = 'สั่งซื้อ Order';
            let color = 'bg-blue-500';
            let textColor = 'text-blue-600';
            let statusText = 'รอชำระเงิน';
            let statusDate = null;

            if (order.approved_at) {
                label = 'สั่งซื้อ Order (อนุมัติแล้ว)';
                color = 'bg-green-500';
                textColor = 'text-green-600';
                statusText = 'อนุมัติแล้ว';
                statusDate = order.approved_at instanceof Date ? order.approved_at : order.approved_at?.toDate?.();
            } else if (order.status === 'rejected') {
                label = 'สั่งซื้อ Order (ไม่อนุมัติ)';
                color = 'bg-red-500';
                textColor = 'text-red-600';
                statusText = 'ไม่อนุมัติ';
            }

            events.push({
                date: d,
                label, color, textColor,
                detail: `${order.tier_name || ('เทียร์ ' + order.tier_id)} — ${order.price || '?'}฿`,
                statusText, statusDate
            });
        }
    }

    // Extension Event
    if (order.extension_requested_at) {
        const d = order.extension_requested_at instanceof Date ? order.extension_requested_at : order.extension_requested_at?.toDate?.() || null;
        if (d) {
            let label = 'ขอต่ออายุ';
            let color = 'bg-amber-500';
            let textColor = 'text-amber-600';
            let statusText = 'รอตรวจสอบ';
            let statusDate = null;

            if (order.extension_approved_at) {
                label = 'ขอต่ออายุ (อนุมัติแล้ว)';
                color = 'bg-green-500';
                textColor = 'text-green-600';
                statusText = 'อนุมัติแล้ว';
                statusDate = order.extension_approved_at instanceof Date ? order.extension_approved_at : order.extension_approved_at?.toDate?.();
            } else if (order.extension_status === 'rejected' && order.extension_rejected_at) {
                label = 'ขอต่ออายุ (ไม่อนุมัติ)';
                color = 'bg-red-500';
                textColor = 'text-red-600';
                statusText = 'ไม่อนุมัติ';
                statusDate = order.extension_rejected_at instanceof Date ? order.extension_rejected_at : order.extension_rejected_at?.toDate?.();
            }

            events.push({
                date: d,
                label, color, textColor,
                detail: `${order.extension_requested_days} วัน — ${order.extension_requested_price}฿`,
                statusText, statusDate
            });
        }
    }

    // Text Edit Payment Event
    if (order.text_edit_payment_requested_at) {
        const d = order.text_edit_payment_requested_at instanceof Date ? order.text_edit_payment_requested_at : order.text_edit_payment_requested_at?.toDate?.() || null;
        if (d) {
            let label = `ขอแก้ไขข้อความ`;
            let color = 'bg-purple-500';
            let textColor = 'text-purple-600';
            let statusText = 'รอตรวจสอบ';
            let statusDate = null;

            if (order.text_edit_payment_approved_at) {
                label = `ขอแก้ไขข้อความ (อนุมัติแล้ว)`;
                color = 'bg-green-500';
                textColor = 'text-green-600';
                statusText = 'อนุมัติแล้ว';
                statusDate = order.text_edit_payment_approved_at instanceof Date ? order.text_edit_payment_approved_at : order.text_edit_payment_approved_at?.toDate?.();
            } else if (order.text_edit_payment_status === 'rejected' && order.text_edit_payment_rejected_at) {
                label = `ขอแก้ไขข้อความ (ไม่อนุมัติ)`;
                color = 'bg-red-500';
                textColor = 'text-red-600';
                statusText = 'ไม่อนุมัติ';
                statusDate = order.text_edit_payment_rejected_at instanceof Date ? order.text_edit_payment_rejected_at : order.text_edit_payment_rejected_at?.toDate?.();
            }

            events.push({
                date: d,
                label, color, textColor,
                detail: `${order.text_edit_payment_price}฿`,
                statusText, statusDate
            });
        }
    }

    // Image Edit Payment Event
    if (order.image_edit_payment_requested_at) {
        const d = order.image_edit_payment_requested_at instanceof Date ? order.image_edit_payment_requested_at : order.image_edit_payment_requested_at?.toDate?.() || null;
        if (d) {
            let label = `ขอแก้ไขรูปภาพ`;
            let color = 'bg-indigo-500';
            let textColor = 'text-indigo-600';
            let statusText = 'รอตรวจสอบ';
            let statusDate = null;

            if (order.image_edit_payment_approved_at) {
                label = `ขอแก้ไขรูปภาพ (อนุมัติแล้ว)`;
                color = 'bg-green-500';
                textColor = 'text-green-600';
                statusText = 'อนุมัติแล้ว';
                statusDate = order.image_edit_payment_approved_at instanceof Date ? order.image_edit_payment_approved_at : order.image_edit_payment_approved_at?.toDate?.();
            } else if (order.image_edit_payment_status === 'rejected' && order.image_edit_payment_rejected_at) {
                label = `ขอแก้ไขรูปภาพ (ไม่อนุมัติ)`;
                color = 'bg-red-500';
                textColor = 'text-red-600';
                statusText = 'ไม่อนุมัติ';
                statusDate = order.image_edit_payment_rejected_at instanceof Date ? order.image_edit_payment_rejected_at : order.image_edit_payment_rejected_at?.toDate?.();
            }

            events.push({
                date: d,
                label, color, textColor,
                detail: `${order.image_edit_payment_price}฿`,
                statusText, statusDate
            });
        }
    }

    // Sort by initial request date ascending
    events.sort((a, b) => a.date - b.date);

    return (
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
            <h3 className="text-base sm:text-lg font-bold text-[#1A3C40] mb-5 flex items-center gap-2">
                <FileText size={18} className="text-[#E8A08A]" /> ประวัติรายการ
            </h3>
            <div className="space-y-0">
                {events.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">ยังไม่มีประวัติ</p>
                ) : (
                    events.map((ev, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                                <div className={`w-3.5 h-3.5 rounded-full ${ev.color} flex-shrink-0 mt-1.5 ring-2 ring-white shadow-sm`} />
                                {i < events.length - 1 && <div className="w-0.5 flex-1 min-h-[48px] bg-gray-200" />}
                            </div>
                            <div className={`pb-5 ${i < events.length - 1 ? 'border-b border-gray-50' : ''} flex-1`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className={`text-sm font-semibold ${ev.textColor}`}>{ev.label}</p>
                                        {ev.detail && <p className="text-xs text-gray-500 mt-0.5">{ev.detail}</p>}
                                        <p className="text-[11px] text-gray-400 mt-1">ส่งเมื่อ: {formatDate(ev.date)}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ev.statusText.includes('อนุมัติแล้ว') ? 'bg-green-50 text-green-600' :
                                            ev.statusText.includes('ไม่อนุมัติ') ? 'bg-red-50 text-red-600' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                            {ev.statusText}
                                        </span>
                                        {ev.statusDate && (
                                            <p className="text-[10px] text-gray-400 mt-1">{formatDate(ev.statusDate)}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HistoryTab;

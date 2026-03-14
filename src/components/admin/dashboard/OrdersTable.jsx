import React from 'react';
import { Package, Eye, RefreshCw, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

const AlertBadges = ({ order }) => (
    <>
        {order.extension_status === 'pending' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700 border border-amber-200">
                <RefreshCw size={10} /> ขอต่ออายุ
            </span>
        )}
        {order.text_edit_payment_status === 'pending' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-100 text-purple-700 border border-purple-200">
                ✏️ แก้ไขข้อความ
            </span>
        )}
        {order.image_edit_payment_status === 'pending' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
                🖼️ แก้ไขรูปภาพ
            </span>
        )}
    </>
);

const OrdersTable = ({ orders, loading, onSelectOrder, onDeleteOrder }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p>กำลังโหลดข้อมูล...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>ไม่พบรายการ Order</p>
            </div>
        );
    }

    return (
        <>
            {/* ── Mobile Card List (hidden md+) ── */}
            <div className="md:hidden space-y-3">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3"
                    >
                        {/* Top: order id + status badges */}
                        <div className="flex items-start justify-between gap-2">
                            <span className="font-mono text-xs text-gray-400 mt-0.5">
                                #{order.id.slice(0, 10)}
                            </span>
                            <div className="flex flex-wrap gap-1 justify-end">
                                <StatusBadge status={order.status} />
                                <AlertBadges order={order} />
                            </div>
                        </div>

                        {/* Customer info */}
                        <div>
                            <p className="font-semibold text-gray-800 text-sm leading-tight">
                                {order.buyer_name || order.customer_name || order.buyerName || order.target_name || '-'}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5 truncate">
                                {[order.buyer_phone || order.customer_contact, order.buyer_email].filter(Boolean).join(' · ')}
                            </p>
                        </div>

                        {/* Bottom: package + date + action */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                    {order.tier_name || `Tier ${order.tier_id}`}
                                </span>
                                <span className="text-[11px] text-gray-400">
                                    {order.created_at?.toLocaleDateString?.('th-TH') || '-'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onSelectOrder(order)}
                                    className="flex items-center gap-1.5 bg-[#1A3C40] text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-[#2a4c50] transition-colors"
                                >
                                    <Eye size={13} /> ดู
                                </button>
                                <button
                                    onClick={() => onDeleteOrder(order)}
                                    className="flex items-center gap-1.5 bg-red-50 text-red-600 text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Desktop Table (hidden on mobile) ── */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Order</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">ลูกค้า</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">แพ็คเกจ</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">สถานะ</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">วันที่</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-sm text-gray-600">#{order.id.slice(0, 8)}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-800">
                                            {order.buyer_name || order.customer_name || order.buyerName || order.target_name || '-'}
                                        </p>
                                        <div className="text-sm text-gray-400">
                                            {order.buyer_phone && <div>{order.buyer_phone}</div>}
                                            {(!order.buyer_phone && order.customer_contact) && <div>{order.customer_contact}</div>}
                                            {order.buyer_email && <div className="text-xs">{order.buyer_email}</div>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">
                                            {order.tier_name || `Tier ${order.tier_id}`}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 items-start">
                                            <StatusBadge status={order.status} />
                                            <AlertBadges order={order} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {order.created_at?.toLocaleDateString?.('th-TH') || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center gap-3 justify-end">
                                            <button
                                                onClick={() => onSelectOrder(order)}
                                                className="inline-flex items-center gap-1 text-[#E8A08A] hover:text-[#d89279] text-sm font-medium"
                                            >
                                                <Eye size={16} />
                                                ดูรายละเอียด
                                            </button>
                                            <button
                                                onClick={() => onDeleteOrder(order)}
                                                className="inline-flex items-center gap-1 text-red-400 hover:text-red-600 text-sm font-medium transition-colors"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default OrdersTable;

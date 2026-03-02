import React from 'react';
import { Package, Eye, RefreshCw } from 'lucide-react';
import StatusBadge from './StatusBadge';

const OrdersTable = ({ orders, loading, onSelectOrder }) => {
    const getTierName = (tierId) => {
        const tiers = {
            1: 'Basic Memory',
            2: 'Standard Love',
            3: 'Premium Valentine',
            4: 'Lifetime Archive'
        };
        return tiers[tierId] || `Tier ${tierId}`;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-12 text-center text-gray-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p>กำลังโหลดข้อมูล...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-12 text-center text-gray-400">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>ไม่พบรายการ Order</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                                    <span className="font-mono text-sm text-gray-600">
                                        #{order.id.slice(0, 8)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {order.buyer_name || order.customer_name || order.buyerName || order.target_name || '-'}
                                        </p>
                                        <div className="text-sm text-gray-400">
                                            {order.buyer_phone && <div>{order.buyer_phone}</div>}
                                            {(!order.buyer_phone && order.customer_contact) && <div>{order.customer_contact}</div>}
                                            {order.buyer_email && <div className="text-xs">{order.buyer_email}</div>}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-600">
                                        {order.tier_name || getTierName(order.tier_id)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1 items-start">
                                        <StatusBadge status={order.status} />
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
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {order.created_at?.toLocaleDateString?.('th-TH') || '-'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onSelectOrder(order)}
                                        className="inline-flex items-center gap-1 text-[#E8A08A] hover:text-[#d89279] text-sm font-medium"
                                    >
                                        <Eye size={16} />
                                        ดูรายละเอียด
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersTable;

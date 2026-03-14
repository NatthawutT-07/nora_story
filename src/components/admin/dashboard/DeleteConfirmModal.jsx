import React, { useState } from 'react';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';

const DeleteConfirmModal = ({ order, onConfirm, onCancel, deleting }) => {
    const [confirmText, setConfirmText] = useState('');
    const orderName = order.buyer_name || order.customer_name || order.buyerName || order.target_name || order.id.slice(0, 8);
    const needsTyping = true;
    const isConfirmed = confirmText === 'ลบ';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
                {/* Header */}
                <div className="bg-red-50 px-6 py-5 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900">ยืนยันการลบ Order</h3>
                        <p className="text-sm text-gray-500 mt-1">การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
                    </div>
                    <button
                        onClick={onCancel}
                        disabled={deleting}
                        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Order ID</span>
                            <span className="font-mono text-sm text-gray-700">#{order.id.slice(0, 10)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">ชื่อ</span>
                            <span className="text-sm font-medium text-gray-800">{orderName}</span>
                        </div>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1.5">
                        <p>ระบบจะทำการ:</p>
                        <ul className="list-disc list-inside text-xs text-gray-500 space-y-1 ml-1">
                            <li>ลบข้อมูล Order ออกจากระบบ</li>
                            <li>ลบรูปภาพทั้งหมดที่เกี่ยวข้องออกจาก Storage</li>
                            <li>ลบสลิปการชำระเงิน (ถ้ามี)</li>
                        </ul>
                    </div>

                    {needsTyping && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                พิมพ์ <span className="text-red-600 font-bold">"ลบ"</span> เพื่อยืนยัน
                            </label>
                            <input
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder="พิมพ์ ลบ ที่นี่"
                                disabled={deleting}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none text-sm transition-all"
                                autoFocus
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
                    <button
                        onClick={onCancel}
                        disabled={deleting}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={() => onConfirm(order)}
                        disabled={!isConfirmed || deleting}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {deleting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                กำลังลบ...
                            </>
                        ) : (
                            <>
                                <Trash2 size={16} />
                                ลบ Order
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;

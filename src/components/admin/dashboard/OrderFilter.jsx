import React from 'react';
import { Search, Filter } from 'lucide-react';

const OrderFilter = ({ filter, setFilter, searchTerm, setSearchTerm }) => {
    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อ, Line ID, หรือ Order ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E8A08A]/50 focus:border-transparent"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-gray-400" />
                    {['all', 'pending', 'approved', 'rejected', 'extension_pending', 'edit_pending'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                                ? 'bg-[#1A3C40] text-white'
                                : (f === 'extension_pending' || f === 'edit_pending')
                                    ? f === 'edit_pending'
                                        ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {f === 'all' ? 'ทั้งหมด' :
                                f === 'pending' ? 'รอตรวจสอบ' :
                                    f === 'approved' ? 'อนุมัติ' :
                                        f === 'rejected' ? 'ปฏิเสธ' :
                                            f === 'extension_pending' ? 'คำขอต่ออายุ' :
                                                'แก้ไข (รอชำระ)'}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderFilter;

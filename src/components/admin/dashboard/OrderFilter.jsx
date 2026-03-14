import React from 'react';
import { Search } from 'lucide-react';

const FILTERS = [
    { key: 'all', label: 'ทั้งหมด', cls: 'bg-gray-100 text-gray-600 hover:bg-gray-200' },
    { key: 'pending', label: 'รอตรวจสอบ', cls: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
    { key: 'approved', label: 'อนุมัติ', cls: 'bg-green-100 text-green-800 hover:bg-green-200' },
    { key: 'rejected', label: 'ปฏิเสธ', cls: 'bg-red-100 text-red-800 hover:bg-red-200' },
    { key: 'extension_pending', label: 'ต่ออายุ', cls: 'bg-amber-100 text-amber-800 hover:bg-amber-200' },
    { key: 'edit_pending', label: 'แก้ไข (รอชำระ)', cls: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
    { key: 'expired', label: 'หมดอายุ', cls: 'bg-gray-300 text-gray-800 hover:bg-gray-400' },
];

const OrderFilter = ({ filter, setFilter, searchTerm, setSearchTerm }) => {
    return (
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 mb-4 sm:mb-6 space-y-3">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                    type="text"
                    placeholder="ค้นหาชื่อ, เบอร์, Email หรือ Order ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E8A08A]/50 focus:border-transparent outline-none"
                />
            </div>

            {/* Filter pills — horizontal scroll on mobile */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
                {FILTERS.map(({ key, label, cls }) => (
                    <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap
                            ${filter === key ? 'bg-[#1A3C40] text-white shadow-sm' : cls}`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default OrderFilter;

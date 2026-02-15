import React from 'react';

const StatsCards = ({ orders }) => {
    const stats = [
        { label: 'ทั้งหมด', value: orders.length, color: 'bg-blue-500' },
        { label: 'รอตรวจสอบ', value: orders.filter(o => o.status === 'pending').length, color: 'bg-yellow-500' },
        { label: 'อนุมัติแล้ว', value: orders.filter(o => o.status === 'approved').length, color: 'bg-green-500' },
        { label: 'ปฏิเสธ', value: orders.filter(o => o.status === 'rejected').length, color: 'bg-red-500' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                            {stat.value}
                        </div>
                        <span className="text-gray-600 text-sm">{stat.label}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;

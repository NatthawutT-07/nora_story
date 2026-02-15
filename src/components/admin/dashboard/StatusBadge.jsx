import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        approved: 'bg-green-100 text-green-700 border-green-200',
        rejected: 'bg-red-100 text-red-700 border-red-200',
    };

    const icons = {
        pending: <Clock size={14} />,
        approved: <CheckCircle size={14} />,
        rejected: <XCircle size={14} />,
    };

    const labels = {
        pending: 'รอตรวจสอบ',
        approved: 'อนุมัติแล้ว',
        rejected: 'ปฏิเสธ',
    };

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}>
            {icons[status] || icons.pending}
            {labels[status] || labels.pending}
        </span>
    );
};

export default StatusBadge;

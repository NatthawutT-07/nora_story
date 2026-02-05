import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, orderBy, query, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import {
    LogOut,
    Package,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    Image as ImageIcon,
    User,
    Phone,
    MessageSquare,
    CreditCard,
    Calendar,
    RefreshCw,
    Search,
    Filter
} from 'lucide-react';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Check auth on mount
    useEffect(() => {
        const isAuth = sessionStorage.getItem('adminAuth');
        if (!isAuth) {
            navigate('/jimdev');
        }
    }, [navigate]);

    // Fetch orders from Firebase
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const ordersRef = collection(db, 'orders');
            const q = query(ordersRef, orderBy('created_at', 'desc'));
            const snapshot = await getDocs(q);

            const ordersList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                created_at: doc.data().created_at?.toDate?.() || new Date()
            }));

            setOrders(ordersList);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Update order status
    const updateOrderStatus = async (orderId, status) => {
        try {
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, { status, updatedAt: new Date() });

            // Update local state
            setOrders(prev => prev.map(order =>
                order.id === orderId ? { ...order, status } : order
            ));

            if (selectedOrder?.id === orderId) {
                setSelectedOrder(prev => ({ ...prev, status }));
            }
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    // Logout
    const handleLogout = () => {
        sessionStorage.removeItem('adminAuth');
        navigate('/jimdev');
    };

    // Filter orders
    const filteredOrders = orders.filter(order => {
        const matchesFilter = filter === 'all' || order.status === filter;
        const matchesSearch =
            order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer_contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Status badge component
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

    // Tier name helper
    const getTierName = (tierId) => {
        const tiers = {
            1: 'Basic Memory',
            2: 'Standard Love',
            3: 'Premium Valentine',
            4: 'Lifetime Archive'
        };
        return tiers[tierId] || `Tier ${tierId}`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-[#1A3C40] text-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#E8A08A] rounded-xl flex items-center justify-center">
                            <Package size={20} />
                        </div>
                        <div>
                            <h1 className="font-playfair text-xl">NoraStory Admin</h1>
                            <p className="text-white/50 text-xs">Order Management</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={fetchOrders}
                            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
                        >
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-sm"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'ทั้งหมด', value: orders.length, color: 'bg-blue-500' },
                        { label: 'รอตรวจสอบ', value: orders.filter(o => o.status === 'pending').length, color: 'bg-yellow-500' },
                        { label: 'อนุมัติแล้ว', value: orders.filter(o => o.status === 'approved').length, color: 'bg-green-500' },
                        { label: 'ปฏิเสธ', value: orders.filter(o => o.status === 'rejected').length, color: 'bg-red-500' },
                    ].map((stat, i) => (
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

                {/* Filters */}
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
                            {['all', 'pending', 'approved', 'rejected'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                                        ? 'bg-[#1A3C40] text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {f === 'all' ? 'ทั้งหมด' : f === 'pending' ? 'รอตรวจสอบ' : f === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-gray-400">
                            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                            <p>กำลังโหลดข้อมูล...</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>ไม่พบรายการ Order</p>
                        </div>
                    ) : (
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
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-sm text-gray-600">
                                                    #{order.id.slice(0, 8)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-800">{order.customer_name || '-'}</p>
                                                    <p className="text-sm text-gray-400">{order.customer_contact || '-'}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">
                                                    {order.tier_name || getTierName(order.tier_id)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {order.created_at?.toLocaleDateString?.('th-TH') || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
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
                    )}
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
                    <div
                        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h2 className="font-playfair text-xl text-gray-800">Order Details</h2>
                                <p className="text-sm text-gray-400 font-mono">#{selectedOrder.id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Status & Actions */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-500">สถานะ:</span>
                                    <StatusBadge status={selectedOrder.status} />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateOrderStatus(selectedOrder.id, 'approved')}
                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                                    >
                                        <CheckCircle size={16} />
                                        อนุมัติ
                                    </button>
                                    <button
                                        onClick={() => updateOrderStatus(selectedOrder.id, 'rejected')}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                                    >
                                        <XCircle size={16} />
                                        ปฏิเสธ
                                    </button>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <User size={18} className="text-[#E8A08A]" />
                                    ข้อมูลลูกค้า
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-400 mb-1">ชื่อ</p>
                                        <p className="font-medium">{selectedOrder.customer_name || '-'}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                                            <Phone size={12} /> Line ID
                                        </p>
                                        <p className="font-medium">{selectedOrder.customer_contact || '-'}</p>
                                    </div>
                                </div>
                                {selectedOrder.message && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                                            <MessageSquare size={12} /> ข้อความ
                                        </p>
                                        <p className="text-sm">{selectedOrder.message}</p>
                                    </div>
                                )}
                            </div>

                            {/* Order Info */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <CreditCard size={18} className="text-[#E8A08A]" />
                                    ข้อมูล Order
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-400 mb-1">แพ็คเกจ</p>
                                        <p className="font-medium">{selectedOrder.tier_name || getTierName(selectedOrder.tier_id)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-400 mb-1">ราคา</p>
                                        <p className="font-medium text-[#E8A08A]">{selectedOrder.price || '-'} บาท</p>
                                    </div>
                                    {selectedOrder.custom_domain && (
                                        <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                                            <p className="text-xs text-gray-400 mb-1">Custom Domain</p>
                                            <p className="font-medium">{selectedOrder.custom_domain}.norastory.com</p>
                                        </div>
                                    )}
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                                            <Calendar size={12} /> วันที่สร้าง
                                        </p>
                                        <p className="text-sm">{selectedOrder.created_at?.toLocaleString?.('th-TH') || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Slip */}
                            {selectedOrder.slip_url && (
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                        <ImageIcon size={18} className="text-[#E8A08A]" />
                                        หลักฐานการชำระเงิน
                                    </h3>
                                    <a
                                        href={selectedOrder.slip_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <img
                                            src={selectedOrder.slip_url}
                                            alt="Payment Slip"
                                            className="w-full max-w-sm rounded-xl border border-gray-200 hover:shadow-lg transition-shadow cursor-zoom-in"
                                        />
                                    </a>
                                </div>
                            )}

                            {/* Content Images */}
                            {selectedOrder.content_images && selectedOrder.content_images.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                        <ImageIcon size={18} className="text-[#E8A08A]" />
                                        รูปภาพจากลูกค้า ({selectedOrder.content_images.length} รูป)
                                    </h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {selectedOrder.content_images.map((url, idx) => (
                                            <a
                                                key={idx}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <img
                                                    src={url}
                                                    alt={`Content ${idx + 1}`}
                                                    className="w-full aspect-square object-cover rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-zoom-in"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;

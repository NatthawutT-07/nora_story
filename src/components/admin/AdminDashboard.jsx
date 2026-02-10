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
    Filter,
    Copy,
    Link,
    Timer,
    ExternalLink,
    Settings,
    Snowflake,
    Heart,
    Sparkles,
    Lock,
    Gift
} from 'lucide-react';

import { DEFAULT_CONFIG, EFFECT_OPTIONS, FEATURE_OPTIONS } from '../../lib/templateConfig';

// Tier duration in days (for calculating expires_at)
const TIER_DURATIONS = {
    1: 3,   // 3 days
    2: 7,   // 7 days
    3: 15,  // 15 days
    4: 30   // 30 days
};

// All available templates
const ALL_TEMPLATES = [
    { id: 't1-1', name: 'Tier 1 - Sunrise Glow' },
    { id: 't1-2', name: 'Tier 1 - Moonlight' },
    { id: 't1-3', name: 'Tier 1 - Cherry Blossom' },
    { id: 't1-4', name: 'Tier 1 - Ocean Breeze' },
    { id: 't1-5', name: 'Tier 1 - Golden Hour' },
    { id: 't1-6', name: 'Tier 1 - Starry Night' },
    { id: 't1-7', name: 'Tier 1 - Rose Garden' },
    { id: 't2-1', name: 'Tier 2 - Love Letter' },
    { id: 't2-2', name: 'Tier 2 - Vintage Romance' },
    { id: 't2-3', name: 'Tier 2 - Neon Love' },
    { id: 't2-4', name: 'Tier 2 - Eternal Flame' },
    { id: 't2-5', name: 'Tier 2 - Spring Garden' },
    { id: 't2-6', name: 'Tier 2 - Winter Snow' },
    { id: 't3-1', name: 'Tier 3 - Luxury Gold' },
    { id: 't3-2', name: 'Tier 3 - Crystal Clear' },
    { id: 't3-3', name: 'Tier 3 - Velvet Night' },
    { id: 't3-4', name: 'Tier 3 - Rose Petal' },
    { id: 't3-5', name: 'Tier 3 - Aurora' },
    { id: 't3-6', name: 'Tier 3 - Twilight' },
    { id: 't4-1', name: 'Tier 4 - Eternal Love' },
    { id: 't4-2', name: 'Tier 4 - Paradise' },
    { id: 't4-3', name: 'Tier 4 - Infinity' },
    { id: 't4-4', name: 'Tier 4 - Royal' },
    { id: 't4-5', name: 'Tier 4 - Timeless' },
    { id: 't4-6', name: 'Tier 4 - Forever' },
];

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modifiedTemplateId, setModifiedTemplateId] = useState(null);
    const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
    const [searchTerm, setSearchTerm] = useState('');
    const [copied, setCopied] = useState(false);
    const [orderConfig, setOrderConfig] = useState(null); // Config for selected order
    const [configSaving, setConfigSaving] = useState(false);
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
                created_at: doc.data().created_at?.toDate?.() || new Date(),
                approved_at: doc.data().approved_at?.toDate?.() || null,
                expires_at: doc.data().expires_at?.toDate?.() || null
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

    // Approve order with expiration calculation
    const handleApprove = async (order) => {
        const templateId = modifiedTemplateId || order.selected_template_id;
        if (!templateId) {
            alert('กรุณาเลือก Template ก่อนอนุมัติ');
            return;
        }

        const tierId = order.tier_id || 1;
        const durationDays = TIER_DURATIONS[tierId] || 3;
        const approvedAt = new Date();
        const expiresAt = new Date(approvedAt.getTime() + durationDays * 24 * 60 * 60 * 1000);

        try {
            const orderRef = doc(db, 'orders', order.id);
            await updateDoc(orderRef, {
                status: 'approved',
                template_id: templateId,
                approved_at: approvedAt,
                expires_at: expiresAt,
                updatedAt: new Date()
            });

            // Update local state
            const updatedOrder = {
                ...order,
                status: 'approved',
                template_id: templateId,
                approved_at: approvedAt,
                expires_at: expiresAt
            };

            setOrders(prev => prev.map(o => o.id === order.id ? updatedOrder : o));
            setSelectedOrder(updatedOrder);
            setModifiedTemplateId(null);
        } catch (error) {
            console.error('Error approving order:', error);
            alert('เกิดข้อผิดพลาดในการอนุมัติ');
        }
    };

    // Reject order
    const handleReject = async (orderId) => {
        try {
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, { status: 'rejected', updatedAt: new Date() });

            setOrders(prev => prev.map(order =>
                order.id === orderId ? { ...order, status: 'rejected' } : order
            ));

            if (selectedOrder?.id === orderId) {
                setSelectedOrder(prev => ({ ...prev, status: 'rejected' }));
            }
        } catch (error) {
            console.error('Error rejecting order:', error);
        }
    };

    const [newExpiresAt, setNewExpiresAt] = useState(null);

    // Initial load of expires_at into state when modal opens
    useEffect(() => {
        if (selectedOrder) {
            setNewExpiresAt(selectedOrder.expires_at ? new Date(selectedOrder.expires_at) : null);
            setModifiedTemplateId(selectedOrder.template_id);
            // Load config from order, or use defaults
            setOrderConfig(selectedOrder.config || JSON.parse(JSON.stringify(DEFAULT_CONFIG)));
        }
    }, [selectedOrder]);

    const handleApproveExtension = async (order) => {
        if (!confirm(`ยืนยันการต่ออายุ ${order.extension_requested_days} วัน?`)) return;

        try {
            const currentExpire = order.expires_at ? new Date(order.expires_at) : new Date();
            // If expired, start from now. If not, add to current expiry.
            const baseDate = currentExpire < new Date() ? new Date() : currentExpire;
            const newDate = new Date(baseDate);
            newDate.setDate(newDate.getDate() + parseInt(order.extension_requested_days));

            const orderRef = doc(db, 'orders', order.id);
            await updateDoc(orderRef, {
                expires_at: newDate,
                extension_status: 'approved',
                extension_approved_at: new Date()
            });

            // Update local state
            setOrders(prev => prev.map(o => o.id === order.id ? {
                ...o,
                expires_at: newDate,
                extension_status: 'approved'
            } : o));
            setSelectedOrder(prev => ({ ...prev, expires_at: newDate, extension_status: 'approved' }));
            alert('ต่ออายุเรียบร้อยแล้ว');
        } catch (error) {
            console.error(error);
            alert('เกิดข้อผิดพลาด');
        }
    };

    const handleUpdateExpiry = async (orderId) => {
        if (!newExpiresAt) return;
        try {
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, { expires_at: newExpiresAt });

            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, expires_at: newExpiresAt } : o));
            setSelectedOrder(prev => ({ ...prev, expires_at: newExpiresAt }));
            alert('อัปเดตวันหมดอายุแล้ว');
        } catch (error) {
            console.error(error);
            alert('เกิดข้อผิดพลาด');
        }
    };

    // Save config to Firestore
    const handleSaveConfig = async (orderId) => {
        if (!orderConfig) return;
        setConfigSaving(true);
        try {
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, { config: orderConfig });

            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, config: orderConfig } : o));
            setSelectedOrder(prev => ({ ...prev, config: orderConfig }));
            alert('บันทึกการตั้งค่าแล้ว');
        } catch (error) {
            console.error(error);
            alert('เกิดข้อผิดพลาด');
        } finally {
            setConfigSaving(false);
        }
    };

    // Update config helper
    const updateConfig = (category, key, value) => {
        setOrderConfig(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }));
    };

    // Copy story URL
    const copyStoryUrl = (orderId) => {
        const url = `https://norastory.com/${orderId}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Calculate remaining time (days, hours, minutes)
    const getRemainingTime = (expiresAt) => {
        if (!expiresAt) return null;
        const now = new Date();
        const diffMs = expiresAt - now;

        if (diffMs <= 0) return { expired: true, days: 0, hours: 0, minutes: 0 };

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        return { expired: false, days, hours, minutes };
    };

    // Logout
    const handleLogout = () => {
        sessionStorage.removeItem('adminAuth');
        navigate('/jimdev');
    };

    // Filter orders
    const filteredOrders = orders.filter(order => {
        let matchesFilter = true;
        if (filter === 'extension_pending') {
            matchesFilter = order.extension_status === 'pending';
        } else if (filter !== 'all') {
            matchesFilter = order.status === filter;
        }

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
                            {['all', 'pending', 'approved', 'rejected', 'extension_pending'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                                        ? 'bg-[#1A3C40] text-white'
                                        : f === 'extension_pending'
                                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {f === 'all' ? 'ทั้งหมด' :
                                        f === 'pending' ? 'รอตรวจสอบ' :
                                            f === 'approved' ? 'อนุมัติ' :
                                                f === 'rejected' ? 'ปฏิเสธ' :
                                                    'คำขอต่ออายุ'}
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
                                                <div className="flex flex-col gap-1 items-start">
                                                    <StatusBadge status={order.status} />
                                                    {order.extension_status === 'pending' && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700 border border-amber-200">
                                                            <RefreshCw size={10} /> ขอต่ออายุ
                                                        </span>
                                                    )}
                                                </div>
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
                            <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-500">สถานะ:</span>
                                        <StatusBadge status={selectedOrder.status} />
                                    </div>

                                    {/* Expiration Info */}
                                    {selectedOrder.status === 'approved' && selectedOrder.expires_at && (
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                                                <Timer size={14} className="text-gray-500" />
                                                {(() => {
                                                    const time = getRemainingTime(selectedOrder.expires_at);
                                                    if (!time || time.expired) {
                                                        return <span className="text-xs text-red-500 font-medium">หมดอายุแล้ว</span>;
                                                    } else if (time.days <= 1) {
                                                        return <span className="text-xs text-orange-500 font-medium">{time.days}วัน {time.hours}ชม. {time.minutes}นาที</span>;
                                                    } else if (time.days <= 3) {
                                                        return <span className="text-xs text-orange-500 font-medium">{time.days}วัน {time.hours}ชม.</span>;
                                                    } else {
                                                        return <span className="text-xs text-green-600 font-medium">{time.days}วัน {time.hours}ชม.</span>;
                                                    }
                                                })()}
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                สิ้นสุด: {selectedOrder.expires_at?.toLocaleDateString?.('th-TH', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) || '-'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Template Selector (for pending orders or to change) */}
                                {selectedOrder.status === 'pending' && (
                                    <div className="pt-3 border-t border-gray-200">
                                        <label className="block text-xs font-medium text-gray-600 mb-2">
                                            เลือก Template
                                            {selectedOrder.selected_template_id && (
                                                <span className="text-gray-400 ml-2">(ลูกค้าเลือก: {selectedOrder.selected_template_id})</span>
                                            )}
                                        </label>
                                        <select
                                            value={modifiedTemplateId || selectedOrder.selected_template_id || ''}
                                            onChange={(e) => setModifiedTemplateId(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#E8A08A]/50"
                                        >
                                            <option value="">-- เลือก Template --</option>
                                            {ALL_TEMPLATES.map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-3 border-t border-gray-200">
                                    {selectedOrder.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(selectedOrder)}
                                                className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle size={16} />
                                                อนุมัติ
                                            </button>
                                            <button
                                                onClick={() => handleReject(selectedOrder.id)}
                                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                                            >
                                                <XCircle size={16} />
                                                ปฏิเสธ
                                            </button>
                                        </>
                                    )}

                                    {/* Copy Link (always show for approved) */}
                                    {selectedOrder.status === 'approved' && (
                                        <button
                                            onClick={() => copyStoryUrl(selectedOrder.id)}
                                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${copied ? 'bg-green-500 text-white' : 'bg-[#1A3C40] hover:bg-[#2a4c50] text-white'
                                                }`}
                                        >
                                            {copied ? (
                                                <>
                                                    <CheckCircle size={16} />
                                                    คัดลอกแล้ว!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={16} />
                                                    คัดลอกลิงก์
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {/* Open Link (for approved) */}
                                    {selectedOrder.status === 'approved' && (
                                        <a
                                            href={`https://norastory.com/${selectedOrder.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                        >
                                            <ExternalLink size={16} />
                                            เปิดดู
                                        </a>
                                    )}
                                </div>

                                {/* Template Info for Approved */}
                                {selectedOrder.status === 'approved' && selectedOrder.template_id && (
                                    <div className="pt-3 border-t border-gray-200 flex items-center gap-2">
                                        <span className="text-xs text-gray-500">Template:</span>
                                        <span className="text-xs font-medium text-[#1A3C40] bg-[#E8A08A]/10 px-2 py-1 rounded">
                                            {ALL_TEMPLATES.find(t => t.id === selectedOrder.template_id)?.name || selectedOrder.template_id}
                                        </span>
                                    </div>
                                )}
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

                            {/* Extension Request Section */}
                            {selectedOrder.extension_status === 'pending' && (
                                <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                                    <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                                        <RefreshCw size={18} /> คำขอต่ออายุ
                                    </h3>
                                    <div className="flex gap-4 mb-4">
                                        <div className="flex-1">
                                            <p className="text-sm text-amber-900">
                                                ขอต่อเพิ่ม: <span className="font-bold">{selectedOrder.extension_requested_days} วัน</span>
                                            </p>
                                            <p className="text-sm text-amber-900">
                                                ยอดโอน: <span className="font-bold">{selectedOrder.extension_requested_price} บาท</span>
                                            </p>
                                        </div>
                                        {selectedOrder.extension_slip_url && (
                                            <a href={selectedOrder.extension_slip_url} target="_blank" rel="noreferrer" className="block w-24 h-24 flex-shrink-0">
                                                <img src={selectedOrder.extension_slip_url} alt="Extension Slip" className="w-full h-full object-cover rounded-lg border border-amber-200" />
                                            </a>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleApproveExtension(selectedOrder)}
                                        className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold shadow-sm"
                                    >
                                        อนุมัติการต่ออายุ (+{selectedOrder.extension_requested_days} วัน)
                                    </button>
                                </div>
                            )}

                            {/* Manual Expiration Edit (Only for approved orders) */}
                            {selectedOrder.status === 'approved' && (
                                <div className="mt-6 p-4 bg-gray-100 rounded-xl">
                                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Timer size={18} /> แก้ไขวันหมดอายุ
                                    </h3>
                                    <div className="flex gap-2">
                                        <input
                                            type="datetime-local"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                            value={newExpiresAt ? new Date(newExpiresAt.getTime() - (newExpiresAt.getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : ''}
                                            onChange={(e) => setNewExpiresAt(new Date(e.target.value))}
                                        />
                                        <button
                                            onClick={() => handleUpdateExpiry(selectedOrder.id)}
                                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm"
                                        >
                                            บันทึก
                                        </button>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={() => {
                                            const d = new Date(selectedOrder.expires_at || new Date());
                                            d.setDate(d.getDate() + 7);
                                            setNewExpiresAt(d);
                                        }} className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">+7 วัน</button>
                                        <button onClick={() => {
                                            const d = new Date(selectedOrder.expires_at || new Date());
                                            d.setDate(d.getDate() + 30);
                                            setNewExpiresAt(d);
                                        }} className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">+30 วัน</button>
                                        <button onClick={() => {
                                            const d = new Date(selectedOrder.expires_at || new Date());
                                            d.setDate(d.getDate() + 365);
                                            setNewExpiresAt(d);
                                        }} className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">+1 ปี</button>
                                    </div>
                                </div>
                            )}

                            {/* Config Editor (For approved orders) */}
                            {selectedOrder.status === 'approved' && orderConfig && (
                                <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
                                    <h3 className="font-semibold text-purple-800 mb-4 flex items-center gap-2">
                                        <Settings size={18} /> ตั้งค่าการแสดงผล (Mix & Match)
                                    </h3>

                                    {/* Effects Toggles */}
                                    <div className="mb-4">
                                        <p className="text-xs font-medium text-purple-700 mb-2">🎨 Effects</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {EFFECT_OPTIONS.map((effect) => (
                                                <label
                                                    key={effect.key}
                                                    className={`flex flex-col items-center p-3 rounded-lg cursor-pointer border-2 transition-all ${orderConfig.effects?.[effect.key]
                                                            ? 'border-purple-500 bg-purple-100'
                                                            : 'border-gray-200 bg-white hover:border-purple-300'
                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only"
                                                        checked={orderConfig.effects?.[effect.key] || false}
                                                        onChange={(e) => updateConfig('effects', effect.key, e.target.checked)}
                                                    />
                                                    <span className="text-lg mb-1">{effect.label.split(' ')[0]}</span>
                                                    <span className="text-[10px] text-gray-500">{effect.label.split(' ').slice(1).join(' ')}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Features Toggles */}
                                    <div className="mb-4">
                                        <p className="text-xs font-medium text-purple-700 mb-2">✨ Features</p>
                                        <div className="space-y-3">
                                            {FEATURE_OPTIONS.map((feature) => (
                                                <div key={feature.key} className="p-3 bg-white rounded-lg border border-gray-200">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="w-4 h-4 accent-purple-500"
                                                            checked={orderConfig.features?.[feature.key] || false}
                                                            onChange={(e) => updateConfig('features', feature.key, e.target.checked)}
                                                        />
                                                        <span className="text-sm font-medium">{feature.label}</span>
                                                    </label>
                                                    {orderConfig.features?.[feature.key] && feature.hasInput && (
                                                        <div className="mt-2">
                                                            {feature.inputType === 'textarea' ? (
                                                                <textarea
                                                                    placeholder={feature.inputLabel}
                                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                                                    rows={2}
                                                                    value={orderConfig.features?.[feature.inputKey] || ''}
                                                                    onChange={(e) => updateConfig('features', feature.inputKey, e.target.value)}
                                                                />
                                                            ) : (
                                                                <input
                                                                    type="text"
                                                                    placeholder={feature.inputLabel}
                                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                                                    value={orderConfig.features?.[feature.inputKey] || ''}
                                                                    onChange={(e) => updateConfig('features', feature.inputKey, e.target.value)}
                                                                />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Save Button */}
                                    <button
                                        onClick={() => handleSaveConfig(selectedOrder.id)}
                                        disabled={configSaving}
                                        className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                                    >
                                        {configSaving ? (
                                            <>
                                                <RefreshCw size={16} className="animate-spin" /> กำลังบันทึก...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle size={16} /> บันทึกการตั้งค่า
                                            </>
                                        )}
                                    </button>
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

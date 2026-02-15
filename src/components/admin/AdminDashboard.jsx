import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { Package, LogOut, RefreshCw } from 'lucide-react';

import StatsCards from './dashboard/StatsCards';
import OrderFilter from './dashboard/OrderFilter';
import OrdersTable from './dashboard/OrdersTable';
import OrderDetailModal from './dashboard/OrderDetailModal';

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

    const handleLogout = () => {
        sessionStorage.removeItem('adminAuth');
        navigate('/jimdev');
    };

    // Update order in the list when it changes in the modal
    const handleOrderUpdate = (updatedOrder) => {
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
        setSelectedOrder(updatedOrder);
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
            (order.buyer_name || order.customer_name || order.buyerName || order.target_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.buyer_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.buyer_phone || order.customer_contact || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

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
                <StatsCards orders={orders} />
                <OrderFilter
                    filter={filter}
                    setFilter={setFilter}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
                <OrdersTable
                    orders={filteredOrders}
                    loading={loading}
                    onSelectOrder={setSelectedOrder}
                />
            </div>

            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onUpdate={handleOrderUpdate}
                />
            )}
        </div>
    );
};

export default AdminDashboard;

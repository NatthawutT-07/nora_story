import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Package, LogOut, RefreshCw, Music } from 'lucide-react';

import StatsCards from './dashboard/StatsCards';
import OrderFilter from './dashboard/OrderFilter';
import OrdersTable from './dashboard/OrdersTable';
import OrderDetailModal from './dashboard/OrderDetailModal';
import MusicManager from './dashboard/MusicManager';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'music'
    const [isLive, setIsLive] = useState(false); // real-time connected indicator
    const unsubscribeRef = useRef(null);
    const navigate = useNavigate();

    // Check auth on mount
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/jimdev');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    // Subscribe to real-time orders
    const subscribeToOrders = () => {
        setLoading(true);
        // Unsubscribe previous listener if any
        if (unsubscribeRef.current) {
            unsubscribeRef.current();
        }
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, orderBy('created_at', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ordersList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                created_at: doc.data().created_at?.toDate?.() || new Date(),
                approved_at: doc.data().approved_at?.toDate?.() || null,
                expires_at: doc.data().expires_at?.toDate?.() || null,
                extension_requested_at: doc.data().extension_requested_at?.toDate?.() || null,
                extension_approved_at: doc.data().extension_approved_at?.toDate?.() || null,
                text_edit_payment_requested_at: doc.data().text_edit_payment_requested_at?.toDate?.() || null,
                text_edit_payment_approved_at: doc.data().text_edit_payment_approved_at?.toDate?.() || null,
                image_edit_payment_requested_at: doc.data().image_edit_payment_requested_at?.toDate?.() || null,
                image_edit_payment_approved_at: doc.data().image_edit_payment_approved_at?.toDate?.() || null,
            }));
            setOrders(ordersList);
            setLoading(false);
            setIsLive(true);
        }, (error) => {
            console.error('Error listening to orders:', error);
            setLoading(false);
            setIsLive(false);
        });

        unsubscribeRef.current = unsubscribe;
    };

    useEffect(() => {
        subscribeToOrders();
        // Cleanup listener on unmount
        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/jimdev');
        } catch (error) {
            console.error('Logout error:', error);
        }
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
        } else if (filter === 'edit_pending') {
            matchesFilter = order.text_edit_payment_status === 'pending' || order.image_edit_payment_status === 'pending';
        } else if (filter !== 'all') {
            matchesFilter = order.status === filter;
        }

        const matchesSearch =
            (order.buyer_name || order.customer_name || order.buyerName || order.target_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.buyer_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.buyer_phone || order.customer_contact || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.custom_domain || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-[#1A3C40] text-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#E8A08A] rounded-xl flex items-center justify-center flex-shrink-0">
                            <Package size={16} className="sm:hidden" />
                            <Package size={20} className="hidden sm:block" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="font-playfair text-base sm:text-xl leading-tight">NoraStory Admin</h1>
                            <p className="text-white/50 text-[10px] sm:text-xs hidden sm:block">Order Management</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        {isLive && (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-300">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="hidden sm:inline">Live</span>
                            </div>
                        )}
                        <button
                            onClick={subscribeToOrders}
                            className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-sm"
                        >
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm"
                        >
                            <LogOut size={15} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'orders' ? 'border-[#1A3C40] text-[#1A3C40]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        จัดการออเดอร์
                    </button>
                    <button
                        onClick={() => setActiveTab('music')}
                        className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 flex items-center gap-1.5 ${activeTab === 'music' ? 'border-[#1A3C40] text-[#1A3C40]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        <Music size={16} />
                        คลังเพลงประกอบ
                    </button>
                </div>

                {activeTab === 'orders' ? (
                    <>
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
                    </>
                ) : (
                    <MusicManager />
                )}
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

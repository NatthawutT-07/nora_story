import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import {
    User,
    Edit2,
    Image as ImageIcon,
    Settings,
    Timer,
    CheckCircle,
    Copy,
    ExternalLink,
    CreditCard,
    MessageSquare,
    RefreshCw,
    Save,
    XCircle,
    MapPin
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import {
    ALL_TEMPLATES,
    DEFAULT_CONFIG,
    EFFECT_OPTIONS,
    FEATURE_OPTIONS,
    TIER_DURATIONS
} from '../../../lib/templateConfig';

const OrderDetailModal = ({ order, onClose, onUpdate }) => {
    const [modalTab, setModalTab] = useState('info'); // info, content, images, settings
    const [editContent, setEditContent] = useState({});
    const [contentSaving, setContentSaving] = useState(false);
    const [configSaving, setConfigSaving] = useState(false);
    const [modifiedTemplateId, setModifiedTemplateId] = useState(null);
    const [newExpiresAt, setNewExpiresAt] = useState(null);
    const [orderConfig, setOrderConfig] = useState(null);
    const [copied, setCopied] = useState(false);

    // Initialize state when order changes
    useEffect(() => {
        if (order) {
            setModifiedTemplateId(order.template_id);
            setOrderConfig(order.config || JSON.parse(JSON.stringify(DEFAULT_CONFIG)));
            setNewExpiresAt(order.expires_at ? new Date(order.expires_at) : null);
            setModalTab('info');
            setEditContent({
                buyer_name: order.buyer_name || order.customer_name || order.buyerName || order.target_name || '',
                buyer_phone: order.buyer_phone || order.customer_contact || '',
                buyer_email: order.buyer_email || '',
                pin_code: order.pin_code || '',
                target_name: order.target_name || '',
                message: order.message || '',
                sign_off: order.sign_off || '',
                timelines: order.timelines || [
                    { label: '', desc: '' },
                    { label: '', desc: '' },
                    { label: '', desc: '' },
                    { label: '', desc: '' },
                    { label: '', desc: '' },
                ],
                finale_message: order.finale_message || '',
                finale_sign_off: order.finale_sign_off || '',
            });
        }
    }, [order]);

    // Calculate remaining time
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

    // Copy URL
    const copyStoryUrl = (orderId) => {
        const url = `https://norastory.com/${orderId}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getTierName = (tierId) => {
        const tiers = {
            1: 'Basic Memory',
            2: 'Standard Love',
            3: 'Premium Valentine',
            4: 'Lifetime Archive'
        };
        return tiers[tierId] || `Tier ${tierId}`;
    };

    // Actions
    const handleApprove = async () => {
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

            onUpdate({
                ...order,
                status: 'approved',
                template_id: templateId,
                approved_at: approvedAt,
                expires_at: expiresAt
            });
        } catch (error) {
            console.error(error);
            alert('เกิดข้อผิดพลาดในการอนุมัติ');
        }
    };

    const handleReject = async () => {
        try {
            const orderRef = doc(db, 'orders', order.id);
            await updateDoc(orderRef, { status: 'rejected', updatedAt: new Date() });
            onUpdate({ ...order, status: 'rejected' });
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveContent = async () => {
        setContentSaving(true);
        try {
            const orderRef = doc(db, 'orders', order.id);
            await updateDoc(orderRef, {
                buyer_name: editContent.buyer_name,
                buyer_phone: editContent.buyer_phone,
                buyer_email: editContent.buyer_email,
                pin_code: editContent.pin_code,
                target_name: editContent.target_name,
                message: editContent.message,
                sign_off: editContent.sign_off,
                timelines: editContent.timelines,
                finale_message: editContent.finale_message,
                finale_sign_off: editContent.finale_sign_off,
                updatedAt: new Date()
            });
            onUpdate({ ...order, ...editContent });
            alert('บันทึกเรียบร้อยแล้ว ✅');
        } catch (error) {
            console.error(error);
            alert('เกิดข้อผิดพลาด');
        } finally {
            setContentSaving(false);
        }
    };

    const handleApproveExtension = async () => {
        if (!confirm(`ยืนยันการต่ออายุ ${order.extension_requested_days} วัน?`)) return;

        try {
            const currentExpire = order.expires_at ? new Date(order.expires_at) : new Date();
            const baseDate = currentExpire < new Date() ? new Date() : currentExpire;
            const newDate = new Date(baseDate);
            newDate.setDate(newDate.getDate() + parseInt(order.extension_requested_days));

            const orderRef = doc(db, 'orders', order.id);
            await updateDoc(orderRef, {
                expires_at: newDate,
                extension_status: 'approved',
                extension_approved_at: new Date()
            });

            onUpdate({
                ...order,
                expires_at: newDate,
                extension_status: 'approved'
            });
            alert('ต่ออายุเรียบร้อยแล้ว');
        } catch (error) {
            console.error(error);
            alert('เกิดข้อผิดพลาด');
        }
    };

    const handleUpdateExpiry = async () => {
        if (!newExpiresAt) return;
        try {
            const orderRef = doc(db, 'orders', order.id);
            await updateDoc(orderRef, { expires_at: newExpiresAt });
            onUpdate({ ...order, expires_at: newExpiresAt });
            alert('อัปเดตวันหมดอายุแล้ว');
        } catch (error) {
            console.error(error);
            alert('เกิดข้อผิดพลาด');
        }
    };

    const handleSaveConfig = async () => {
        if (!orderConfig) return;
        setConfigSaving(true);
        try {
            const orderRef = doc(db, 'orders', order.id);
            await updateDoc(orderRef, { config: orderConfig });
            onUpdate({ ...order, config: orderConfig });
            alert('บันทึกการตั้งค่าแล้ว');
        } catch (error) {
            console.error(error);
            alert('เกิดข้อผิดพลาด');
        } finally {
            setConfigSaving(false);
        }
    };

    const updateConfig = (category, key, value) => {
        setOrderConfig(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }));
    };

    if (!order) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h2 className="font-playfair text-xl text-gray-800">Order Details</h2>
                        <p className="text-sm text-gray-400 font-mono">#{order.id}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={order.status} />
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-6 flex-shrink-0 overflow-x-auto">
                    {[
                        { key: 'info', label: 'ข้อมูล', icon: <User size={14} /> },
                        { key: 'content', label: 'แก้ไขเนื้อหา', icon: <Edit2 size={14} /> },
                        { key: 'images', label: 'รูปภาพ', icon: <ImageIcon size={14} /> },
                        { key: 'settings', label: 'ตั้งค่า', icon: <Settings size={14} /> },
                    ].map(tab => (
                        <button key={tab.key} onClick={() => setModalTab(tab.key)}
                            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${modalTab === tab.key ? 'border-[#1A3C40] text-[#1A3C40]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* === TAB: INFO === */}
                    {modalTab === 'info' && (<>
                        <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                {order.status === 'approved' && order.expires_at && (
                                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                                        <Timer size={14} className="text-gray-500" />
                                        {(() => {
                                            const time = getRemainingTime(order.expires_at);
                                            if (!time || time.expired) return <span className="text-xs text-red-500 font-medium">หมดอายุแล้ว</span>;
                                            return <span className={`text-xs font-medium ${time.days <= 3 ? 'text-orange-500' : 'text-green-600'}`}>{time.days}วัน {time.hours}ชม.</span>;
                                        })()}
                                    </div>
                                )}
                            </div>
                            {order.status === 'pending' && (
                                <div className="pt-3 border-t border-gray-200">
                                    <label className="block text-xs font-medium text-gray-600 mb-2">เลือก Template {order.selected_template_id && <span className="text-gray-400 ml-2">(ลูกค้าเลือก: {order.selected_template_id})</span>}</label>
                                    <select value={modifiedTemplateId || order.selected_template_id || ''} onChange={(e) => setModifiedTemplateId(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#E8A08A]/50">
                                        <option value="">-- เลือก Template --</option>
                                        {ALL_TEMPLATES.map(t => (<option key={t.id} value={t.id}>{t.name}</option>))}
                                    </select>
                                </div>
                            )}
                            <div className="flex gap-2 pt-3 border-t border-gray-200">
                                {order.status === 'pending' && (<>
                                    <button onClick={handleApprove} className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"><CheckCircle size={16} /> อนุมัติ</button>
                                    <button onClick={handleReject} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium flex items-center gap-1"><XCircle size={16} /> ปฏิเสธ</button>
                                </>)}
                                {order.status === 'approved' && (<>
                                    <button onClick={() => copyStoryUrl(order.id)} className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${copied ? 'bg-green-500 text-white' : 'bg-[#1A3C40] hover:bg-[#2a4c50] text-white'}`}>
                                        {copied ? <><CheckCircle size={16} /> คัดลอกแล้ว!</> : <><Copy size={16} /> คัดลอกลิงก์</>}
                                    </button>
                                    <a href={`https://norastory.com/${order.id}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-2"><ExternalLink size={16} /> เปิดดู</a>
                                </>)}
                            </div>
                            {order.status === 'approved' && order.template_id && (
                                <div className="pt-3 border-t border-gray-200 flex items-center gap-2">
                                    <span className="text-xs text-gray-500">Template:</span>
                                    <span className="text-xs font-medium text-[#1A3C40] bg-[#E8A08A]/10 px-2 py-1 rounded">{ALL_TEMPLATES.find(t => t.id === order.template_id)?.name || order.template_id}</span>
                                </div>
                            )}
                        </div>
                        {/* Customer & Order Info */}
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><User size={18} className="text-[#E8A08A]" /> ข้อมูลลูกค้า</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-400 mb-1">ชื่อ</p><p className="font-medium">{order.buyer_name || order.customer_name || '-'}</p></div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-400 mb-1">ติดต่อ</p>
                                    <p className="font-medium">{order.buyer_phone || order.customer_contact || '-'}</p>
                                    {order.buyer_email && <p className="text-xs text-gray-500 mt-1">{order.buyer_email}</p>}
                                </div>
                            </div>
                            {order.message && (<div className="mt-3 p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><MessageSquare size={12} /> ข้อความ</p><p className="text-sm">{order.message}</p></div>)}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><CreditCard size={18} className="text-[#E8A08A]" /> ข้อมูล Order</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-400 mb-1">แพ็คเกจ</p><p className="font-medium">{order.tier_name || getTierName(order.tier_id)}</p></div>
                                <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-400 mb-1">ราคา</p><p className="font-medium text-[#E8A08A]">{order.price || '-'} บาท</p></div>
                                <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-400 mb-1">วันที่สร้าง</p><p className="text-sm">{order.created_at?.toLocaleString?.('th-TH') || '-'}</p></div>
                                {order.custom_domain && (<div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-400 mb-1">Custom Domain</p><p className="font-medium">{order.custom_domain}.norastory.com</p></div>)}
                            </div>
                        </div>
                        {/* Extension Request */}
                        {order.extension_status === 'pending' && (
                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                                <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2"><RefreshCw size={18} /> คำขอต่ออายุ</h3>
                                <div className="flex gap-4 mb-4">
                                    <div className="flex-1">
                                        <p className="text-sm text-amber-900">ขอต่อเพิ่ม: <span className="font-bold">{order.extension_requested_days} วัน</span></p>
                                        <p className="text-sm text-amber-900">ยอดโอน: <span className="font-bold">{order.extension_requested_price} บาท</span></p>
                                    </div>
                                    {order.extension_slip_url && (<a href={order.extension_slip_url} target="_blank" rel="noreferrer" className="block w-24 h-24 flex-shrink-0"><img src={order.extension_slip_url} alt="Extension Slip" className="w-full h-full object-cover rounded-lg border border-amber-200" /></a>)}
                                </div>
                                <button onClick={handleApproveExtension} className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold">อนุมัติการต่ออายุ (+{order.extension_requested_days} วัน)</button>
                            </div>
                        )}
                    </>)}

                    {/* === TAB: CONTENT EDITING === */}
                    {modalTab === 'content' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Edit2 size={18} className="text-[#E8A08A]" />
                                <h3 className="font-semibold text-gray-800">แก้ไขเนื้อหา ({getTierName(order.tier_id)})</h3>
                                <span className="text-xs text-gray-400 ml-auto">แก้ไขแล้วกดบันทึก</span>
                            </div>

                            {/* Common Fields for All Tiers */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">ชื่อผู้สั่งซื้อ</label>
                                <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#E8A08A]/50 outline-none" value={editContent.buyer_name} onChange={(e) => setEditContent(prev => ({ ...prev, buyer_name: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">เบอร์โทรศัพท์</label>
                                    <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#E8A08A]/50 outline-none" value={editContent.buyer_phone} onChange={(e) => setEditContent(prev => ({ ...prev, buyer_phone: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">อีเมล</label>
                                    <input type="email" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#E8A08A]/50 outline-none" value={editContent.buyer_email} onChange={(e) => setEditContent(prev => ({ ...prev, buyer_email: e.target.value }))} />
                                </div>
                            </div>

                            <hr className="border-gray-100" />
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">เนื้อหาธีม</p>

                            {/* Tier 1 & 2 Specific Fields */}
                            {(String(order.tier_id) === '1' || String(order.tier_id) === '2') && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">รหัส PIN (4 หลัก)</label>
                                        <input type="text" maxLength={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono text-center tracking-[0.5em] focus:ring-2 focus:ring-[#E8A08A]/50 outline-none" value={editContent.pin_code} onChange={(e) => setEditContent(prev => ({ ...prev, pin_code: e.target.value.replace(/\D/g, '').slice(0, 4) }))} />
                                    </div>
                                    <div>
                                        <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1"><span>ชื่อคนรับ</span><span className="text-gray-400">{editContent.target_name?.length || 0}/15</span></label>
                                        <input type="text" maxLength={15} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#E8A08A]/50 outline-none" value={editContent.target_name} onChange={(e) => setEditContent(prev => ({ ...prev, target_name: e.target.value.slice(0, 15) }))} />
                                    </div>
                                    <div>
                                        {/* Tier 1 & 2: 100 chars */}
                                        <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1">
                                            <span>ข้อความ</span>
                                            <span className="text-gray-400">{editContent.message?.length || 0}/100</span>
                                        </label>
                                        <textarea
                                            rows={4}
                                            maxLength={100}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-[#E8A08A]/50 outline-none"
                                            value={editContent.message}
                                            onChange={(e) => setEditContent(prev => ({ ...prev, message: e.target.value.slice(0, 100) }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1"><span>คำลงท้าย</span><span className="text-gray-400">{editContent.sign_off?.length || 0}/20</span></label>
                                        <input type="text" maxLength={20} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#E8A08A]/50 outline-none" value={editContent.sign_off} onChange={(e) => setEditContent(prev => ({ ...prev, sign_off: e.target.value.slice(0, 20) }))} />
                                    </div>
                                </div>
                            )}

                            {/* Tier 3: Timeline Fields */}
                            {String(order.tier_id) === '3' && (
                                <div className="space-y-4">
                                    <p className="text-xs text-gray-400">Timeline 1-4: ช่วงเวลา (15 ตัว) + คำอธิบาย (20 ตัว)</p>
                                    {(editContent.timelines || []).slice(0, 4).map((tl, idx) => (
                                        <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                                            <span className="text-xs font-bold text-gray-500">Timeline {idx + 1}</span>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="flex items-center justify-between text-xs text-gray-500 mb-0.5"><span>ช่วงเวลา</span><span>{tl.label?.length || 0}/15</span></label>
                                                    <input type="text" maxLength={15} className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#E8A08A]/50 outline-none" value={tl.label || ''} onChange={(e) => { const t = [...editContent.timelines]; t[idx] = { ...t[idx], label: e.target.value.slice(0, 15) }; setEditContent(prev => ({ ...prev, timelines: t })); }} />
                                                </div>
                                                <div>
                                                    <label className="flex items-center justify-between text-xs text-gray-500 mb-0.5"><span>คำอธิบาย</span><span>{tl.desc?.length || 0}/20</span></label>
                                                    <input type="text" maxLength={20} className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#E8A08A]/50 outline-none" value={tl.desc || ''} onChange={(e) => { const t = [...editContent.timelines]; t[idx] = { ...t[idx], desc: e.target.value.slice(0, 20) }; setEditContent(prev => ({ ...prev, timelines: t })); }} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 space-y-2">
                                        <span className="text-xs font-bold text-rose-500">To Infinity ✨ (ช่อง 5)</span>
                                        <div>
                                            <label className="flex items-center justify-between text-xs text-gray-600 mb-0.5"><span>ข้อความสุดท้าย</span><span>{editContent.finale_message?.length || 0}/100</span></label>
                                            <textarea maxLength={100} rows={3} className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-[#E8A08A]/50 outline-none" value={editContent.finale_message || ''} onChange={(e) => setEditContent(prev => ({ ...prev, finale_message: e.target.value.slice(0, 100) }))} />
                                        </div>
                                        <div>
                                            <label className="flex items-center justify-between text-xs text-gray-600 mb-0.5"><span>คำลงท้าย</span><span>{editContent.finale_sign_off?.length || 0}/20</span></label>
                                            <input type="text" maxLength={20} className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#E8A08A]/50 outline-none" value={editContent.finale_sign_off || ''} onChange={(e) => setEditContent(prev => ({ ...prev, finale_sign_off: e.target.value.slice(0, 20) }))} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tier 4 Fields */}
                            {String(order.tier_id) === '4' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1"><span>หัวข้อ/ชื่อเรื่อง (Title)</span></label>
                                        <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#E8A08A]/50 outline-none" value={editContent.target_name} onChange={(e) => setEditContent(prev => ({ ...prev, target_name: e.target.value }))} placeholder="เช่น 'Happy Anniversary'" />
                                    </div>
                                    <div>
                                        <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1"><span>ข้อความหลัก</span></label>
                                        <textarea rows={6} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-[#E8A08A]/50 outline-none" value={editContent.message} onChange={(e) => setEditContent(prev => ({ ...prev, message: e.target.value }))} placeholder="ข้อความยาวๆ..." />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Custom Subdomain</label>
                                        <div className="flex items-center">
                                            <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-l-lg text-sm focus:ring-2 focus:ring-[#E8A08A]/50 outline-none" value={editContent.custom_domain || ''} onChange={(e) => setEditContent(prev => ({ ...prev, custom_domain: e.target.value }))} />
                                            <span className="bg-gray-100 border border-l-0 border-gray-200 px-3 py-2 rounded-r-lg text-gray-500 text-sm">.norastory.com</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Save Button */}
                            <button onClick={handleSaveContent} disabled={contentSaving} className="w-full py-3 bg-[#1A3C40] hover:bg-[#2a4c50] disabled:bg-gray-300 text-white rounded-xl font-medium flex items-center justify-center gap-2 mt-4">
                                {contentSaving ? <><RefreshCw size={16} className="animate-spin" /> กำลังบันทึก...</> : <><Save size={16} /> บันทึกการแก้ไข</>}
                            </button>
                        </div>
                    )}

                    {/* === TAB: IMAGES === */}
                    {modalTab === 'images' && (<>
                        {order.slip_url ? (
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><CreditCard size={18} className="text-[#E8A08A]" /> หลักฐานการชำระเงิน</h3>
                                <a href={order.slip_url} target="_blank" rel="noopener noreferrer"><img src={order.slip_url} alt="Payment Slip" className="w-full max-w-sm rounded-xl border border-gray-200 hover:shadow-lg transition-shadow cursor-zoom-in" /></a>
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 py-8"><ImageIcon size={32} className="mx-auto mb-2 opacity-50" /><p className="text-sm">ไม่มีสลิปการชำระเงิน</p></div>
                        )}
                        {order.content_images && order.content_images.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><ImageIcon size={18} className="text-[#E8A08A]" /> รูปภาพจากลูกค้า ({order.content_images.length} รูป)</h3>
                                <div className={`grid gap-3 ${order.content_images.length > 5 ? 'grid-cols-4' : 'grid-cols-3'}`}>
                                    {order.content_images.map((url, idx) => (
                                        <div key={idx} className="relative group aspect-square">
                                            <a href={url} target="_blank" rel="noopener noreferrer">
                                                <img src={url} alt={`Content ${idx + 1}`} className="w-full h-full object-cover rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-zoom-in" />
                                            </a>
                                            <div className="absolute top-1 right-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full">{idx + 1}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>)}

                    {/* === TAB: SETTINGS === */}
                    {modalTab === 'settings' && (<>
                        {order.status === 'approved' ? (<>
                            {/* Expiry Editor */}
                            <div className="p-4 bg-gray-100 rounded-xl">
                                <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2"><Timer size={18} /> แก้ไขวันหมดอายุ</h3>
                                <div className="flex gap-2">
                                    <input type="datetime-local" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" value={newExpiresAt ? new Date(newExpiresAt.getTime() - (newExpiresAt.getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : ''} onChange={(e) => setNewExpiresAt(new Date(e.target.value))} />
                                    <button onClick={handleUpdateExpiry} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm">บันทึก</button>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <button onClick={() => { const d = new Date(order.expires_at || new Date()); d.setDate(d.getDate() + 7); setNewExpiresAt(d); }} className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">+7 วัน</button>
                                    <button onClick={() => { const d = new Date(order.expires_at || new Date()); d.setDate(d.getDate() + 30); setNewExpiresAt(d); }} className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">+30 วัน</button>
                                    <button onClick={() => { const d = new Date(order.expires_at || new Date()); d.setDate(d.getDate() + 365); setNewExpiresAt(d); }} className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">+1 ปี</button>
                                </div>
                            </div>
                            {/* Config Editor */}
                            {orderConfig && (
                                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                                    <h3 className="font-semibold text-purple-800 mb-4 flex items-center gap-2"><Settings size={18} /> ตั้งค่าการแสดงผล</h3>
                                    <div className="mb-4">
                                        <p className="text-xs font-medium text-purple-700 mb-2">🎨 Effects</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {EFFECT_OPTIONS.map((effect) => (
                                                <label key={effect.key} className={`flex flex-col items-center p-3 rounded-lg cursor-pointer border-2 transition-all ${orderConfig.effects?.[effect.key] ? 'border-purple-500 bg-purple-100' : 'border-gray-200 bg-white hover:border-purple-300'}`}>
                                                    <input type="checkbox" className="sr-only" checked={orderConfig.effects?.[effect.key] || false} onChange={(e) => updateConfig('effects', effect.key, e.target.checked)} />
                                                    <span className="text-lg mb-1">{effect.label.split(' ')[0]}</span>
                                                    <span className="text-[10px] text-gray-500">{effect.label.split(' ').slice(1).join(' ')}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <p className="text-xs font-medium text-purple-700 mb-2">✨ Features</p>
                                        <div className="space-y-3">
                                            {FEATURE_OPTIONS.map((feature) => (
                                                <div key={feature.key} className="p-3 bg-white rounded-lg border border-gray-200">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input type="checkbox" className="w-4 h-4 accent-purple-500" checked={orderConfig.features?.[feature.key] || false} onChange={(e) => updateConfig('features', feature.key, e.target.checked)} />
                                                        <span className="text-sm font-medium">{feature.label}</span>
                                                    </label>
                                                    {orderConfig.features?.[feature.key] && feature.hasInput && (
                                                        <div className="mt-2">
                                                            {feature.inputType === 'textarea' ? (
                                                                <textarea placeholder={feature.inputLabel} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={2} value={orderConfig.features?.[feature.inputKey] || ''} onChange={(e) => updateConfig('features', feature.inputKey, e.target.value)} />
                                                            ) : (
                                                                <input type="text" placeholder={feature.inputLabel} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" value={orderConfig.features?.[feature.inputKey] || ''} onChange={(e) => updateConfig('features', feature.inputKey, e.target.value)} />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <button onClick={handleSaveConfig} disabled={configSaving} className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-lg font-medium flex items-center justify-center gap-2">
                                        {configSaving ? <><RefreshCw size={16} className="animate-spin" /> กำลังบันทึก...</> : <><CheckCircle size={16} /> บันทึกการตั้งค่า</>}
                                    </button>
                                </div>
                            )}
                        </>) : (
                            <div className="text-center text-gray-400 py-12"><Settings size={40} className="mx-auto mb-3 opacity-40" /><p>ตั้งค่าได้เฉพาะ order ที่อนุมัติแล้ว</p></div>
                        )}
                    </>)}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;

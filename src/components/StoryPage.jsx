import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

// Import all templates
import Tier1Template1 from './templates/tier1/Tier1Template1';
import Tier1Template2 from './templates/tier1/Tier1Template2';
import Tier1Template3 from './templates/tier1/Tier1Template3';
import Tier1Template4 from './templates/tier1/Tier1Template4';
import Tier1Template5 from './templates/tier1/Tier1Template5';
import Tier1Template6 from './templates/tier1/Tier1Template6';
import Tier1Template7 from './templates/tier1/Tier1Template7';

import Tier2Template1 from './templates/tier2/Tier2Template1';
import Tier2Template2 from './templates/tier2/Tier2Template2';
import Tier2Template3 from './templates/tier2/Tier2Template3';
import Tier2Template4 from './templates/tier2/Tier2Template4';
import Tier2Template5 from './templates/tier2/Tier2Template5';
import Tier2Template6 from './templates/tier2/Tier2Template6';

import Tier3Template1 from './templates/tier3/Tier3Template1';
import Tier3Template2 from './templates/tier3/Tier3Template2';
import Tier3Template3 from './templates/tier3/Tier3Template3';
import Tier3Template4 from './templates/tier3/Tier3Template4';
import Tier3Template5 from './templates/tier3/Tier3Template5';
import Tier3Template6 from './templates/tier3/Tier3Template6';

import Tier4Template1 from './templates/tier4/Tier4Template1';
import Tier4Template2 from './templates/tier4/Tier4Template2';
import Tier4Template3 from './templates/tier4/Tier4Template3';
import Tier4Template4 from './templates/tier4/Tier4Template4';
import Tier4Template5 from './templates/tier4/Tier4Template5';
import Tier4Template6 from './templates/tier4/Tier4Template6';

// Template mapping
const TEMPLATES = {
    't1-1': Tier1Template1, 't1-2': Tier1Template2, 't1-3': Tier1Template3,
    't1-4': Tier1Template4, 't1-5': Tier1Template5, 't1-6': Tier1Template6, 't1-7': Tier1Template7,
    't2-1': Tier2Template1, 't2-2': Tier2Template2, 't2-3': Tier2Template3,
    't2-4': Tier2Template4, 't2-5': Tier2Template5, 't2-6': Tier2Template6,
    't3-1': Tier3Template1, 't3-2': Tier3Template2, 't3-3': Tier3Template3,
    't3-4': Tier3Template4, 't3-5': Tier3Template5, 't3-6': Tier3Template6,
    't4-1': Tier4Template1, 't4-2': Tier4Template2, 't4-3': Tier4Template3,
    't4-4': Tier4Template4, 't4-5': Tier4Template5, 't4-6': Tier4Template6,
};

/**
 * StoryPage - Dynamic page that fetches and renders customer stories
 * Supports both:
 * 1. Path-based: norastory.com/<storyId>
 * 2. Subdomain-based: <name>.norastory.com (VIP Tier 4)
 */
const StoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [storyData, setStoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStory = async () => {
            setLoading(true);
            setError(null);

            try {
                // Check if accessing via subdomain (VIP)
                const hostname = window.location.hostname;
                const isSubdomain = !['localhost', 'norastory.com', 'www.norastory.com'].includes(hostname)
                    && !hostname.endsWith('.pages.dev');

                let storyId = id;

                // If subdomain, extract the name part
                if (isSubdomain && hostname.includes('.norastory.com')) {
                    storyId = hostname.split('.')[0]; // e.g., 'joy' from 'joy.norastory.com'
                }

                if (!storyId) {
                    setError('ไม่พบรหัสเรื่องราว');
                    setLoading(false);
                    return;
                }

                // First try: Direct document lookup by ID
                const docRef = doc(db, 'orders', storyId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.status === 'approved' || data.status === 'completed') {
                        // Check expiration
                        if (data.expires_at) {
                            const expiresAt = data.expires_at.toDate ? data.expires_at.toDate() : new Date(data.expires_at);
                            if (new Date() > expiresAt) {
                                setError('ลิงก์นี้หมดอายุแล้ว');
                                setLoading(false);
                                return;
                            }
                        }
                        setStoryData({ id: docSnap.id, ...data });
                    } else {
                        setError('เรื่องราวนี้ยังไม่พร้อมแสดง');
                    }
                } else {
                    // Second try: Query by custom_domain (for VIP subdomains)
                    const q = query(collection(db, 'orders'), where('custom_domain', '==', storyId));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const docData = querySnapshot.docs[0];
                        const data = docData.data();
                        if (data.status === 'approved' || data.status === 'completed') {
                            // Check expiration for subdomain too
                            if (data.expires_at) {
                                const expiresAt = data.expires_at.toDate ? data.expires_at.toDate() : new Date(data.expires_at);
                                if (new Date() > expiresAt) {
                                    setError('ลิงก์นี้หมดอายุแล้ว');
                                    setLoading(false);
                                    return;
                                }
                            }
                            setStoryData({ id: docData.id, ...data });
                        } else {
                            setError('เรื่องราวนี้ยังไม่พร้อมแสดง');
                        }
                    } else {
                        setError('ไม่พบเรื่องราวที่คุณกำลังมองหา');
                    }
                }
            } catch (err) {
                console.error('Error fetching story:', err);
                setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
            } finally {
                setLoading(false);
            }
        };

        fetchStory();
    }, [id]);

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#1A3C40] to-[#0F2A2E] flex flex-col items-center justify-center text-white">
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
                <p className="text-white/60">กำลังโหลดเรื่องราวของคุณ...</p>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#1A3C40] to-[#0F2A2E] flex flex-col items-center justify-center text-white p-6">
                <div className="text-6xl mb-6">💔</div>
                <h1 className="text-2xl font-playfair mb-2">{error}</h1>
                <p className="text-white/60 mb-8 text-center max-w-md">
                    ลิงก์อาจไม่ถูกต้อง หรือเรื่องราวนี้ยังไม่ได้รับการอนุมัติจากทีมงาน
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-colors"
                >
                    กลับหน้าหลัก
                </button>
            </div>
        );
    }

    // Countdown Badge Component
    const CountdownBadge = ({ expiresAt }) => {
        const [timeLeft, setTimeLeft] = useState(null);

        useEffect(() => {
            const calculateTime = () => {
                if (!expiresAt) return null;
                const expDate = expiresAt.toDate ? expiresAt.toDate() : new Date(expiresAt);
                const now = new Date();
                const diffMs = expDate - now;

                if (diffMs <= 0) return { expired: true };

                const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

                return { expired: false, days, hours, minutes };
            };

            setTimeLeft(calculateTime());
            const interval = setInterval(() => setTimeLeft(calculateTime()), 60000); // Update every minute
            return () => clearInterval(interval);
        }, [expiresAt]);

        if (!timeLeft || timeLeft.expired) return null;

        const isUrgent = timeLeft.days <= 1;
        const isWarning = timeLeft.days <= 3;

        return (
            <div className={`fixed top-4 left-4 z-50 px-3 py-2 rounded-lg backdrop-blur-md text-xs font-medium flex items-center gap-2 shadow-lg ${isUrgent ? 'bg-red-500/90 text-white' :
                    isWarning ? 'bg-orange-500/90 text-white' :
                        'bg-white/20 text-white'
                }`}>
                <span className="text-lg">⏳</span>
                <span>
                    {timeLeft.days > 0 && `${timeLeft.days}วัน `}
                    {timeLeft.hours}ชม. {timeLeft.minutes}นาที
                </span>
            </div>
        );
    };

    // Render the appropriate template
    if (storyData && storyData.template_id) {
        const TemplateComponent = TEMPLATES[storyData.template_id];

        if (TemplateComponent) {
            return (
                <div className="relative">
                    {storyData.expires_at && (
                        <CountdownBadge expiresAt={storyData.expires_at} />
                    )}
                    <TemplateComponent
                        customTitle={storyData.customer_name}
                        customMessage={storyData.message}
                        customSignOff={storyData.customer_name}
                        images={storyData.content_images || []}
                    />
                </div>
            );
        }
    }

    // Fallback: No template found
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1A3C40] to-[#0F2A2E] flex flex-col items-center justify-center text-white p-6">
            <div className="text-6xl mb-6">🎨</div>
            <h1 className="text-2xl font-playfair mb-2">เรื่องราวของคุณกำลังถูกจัดทำ</h1>
            <p className="text-white/60 mb-8 text-center max-w-md">
                ทีมงานกำลังจัดทำหน้าเว็บไซต์ ให้คุณอยู่ค่ะ กรุณารอสักครู่
            </p>
        </div>
    );
};

export default StoryPage;

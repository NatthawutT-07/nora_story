import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, Suspense, lazy } from 'react';
import useSWR from 'swr';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

// Add-ons
import { mergeConfig } from '../lib/templateConfig';
import { findPaletteById } from '../lib/colorPalettes';

// Import all templates
const Tier1Template1 = lazy(() => import('./templates/tier1/Tier1Template1'));
const Tier1Template2 = lazy(() => import('./templates/tier1/Tier1Template2'));
const Tier1Template3 = lazy(() => import('./templates/tier1/Tier1Template3'));

const Tier2Template1 = lazy(() => import('./templates/tier2/Tier2Template1'));
const Tier2Template2 = lazy(() => import('./templates/tier2/Tier2Template2'));
const Tier2Template3 = lazy(() => import('./templates/tier2/Tier2Template3'));

const Tier3Template1 = lazy(() => import('./templates/tier3/Tier3Template1'));
const Tier3Template2 = lazy(() => import('./templates/tier3/Tier3Template2'));
const Tier3Template3 = lazy(() => import('./templates/tier3/Tier3Template3'));

// Template mapping
const TEMPLATES = {
    't1-1': Tier1Template1,
    't1-2': Tier1Template2, 't1-3': Tier1Template3,

    't2-1': Tier2Template1, 't2-2': Tier2Template2, 't2-3': Tier2Template3,
    // 't2-4': Tier2Template4, 't2-5': Tier2Template5, 't2-6': Tier2Template6,
    't3-1': Tier3Template1, 't3-2': Tier3Template2, 't3-3': Tier3Template3,
};

/**
 * StoryPage - Dynamic page that fetches and renders customer stories
 * Supports both:
 * 1. Path-based: norastory.com/<storyId>
 * 2. Subdomain-based: <name>.norastory.com (VIP Tier 4)
 */
// Function defined outside component to be used with SWR
const fetchStoryData = async (storyId) => {
    if (!storyId) throw new Error('ไม่พบรหัสเรื่องราว');

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
                    throw new Error('ลิงก์นี้หมดอายุแล้ว');
                }
            }
            return { id: docSnap.id, ...data };
        } else {
            throw new Error('เรื่องราวนี้ยังไม่พร้อมแสดง');
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
                        throw new Error('ลิงก์นี้หมดอายุแล้ว');
                    }
                }
                return { id: docData.id, ...data };
            } else {
                throw new Error('เรื่องราวนี้ยังไม่พร้อมแสดง');
            }
        } else {
            throw new Error('ไม่พบเรื่องราวที่คุณกำลังมองหา');
        }
    }
};

const StoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Check if accessing via subdomain (VIP)
    const hostname = window.location.hostname;
    const isSubdomain = !['localhost', 'norastory.com', 'www.norastory.com'].includes(hostname)
        && !hostname.endsWith('.pages.dev');

    let storyId = id;

    // If subdomain, extract the name part
    if (isSubdomain && hostname.includes('.norastory.com')) {
        storyId = hostname.split('.')[0]; // e.g., 'joy' from 'joy.norastory.com'
    }

    // Use SWR for fetching and caching
    const { data: storyData, error: swrError, isLoading: loading } = useSWR(
        storyId ? `story-${storyId}` : null,
        () => fetchStoryData(storyId),
        {
            revalidateOnFocus: false, // ป้องกันการดึงข้อมูลเวลาเปิดกลับมาหน้าเดิม
            dedupingInterval: 60000, // แคชข้อมูลไว้ 60 วินาที
        }
    );

    const error = swrError ? (swrError.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล') : null;

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


    // Render the appropriate template
    if (storyData && storyData.template_id) {
        const TemplateComponent = TEMPLATES[storyData.template_id];

        if (TemplateComponent) {
            // Merge config from DB with defaults
            const config = mergeConfig(storyData.config);

            // Template content with effects and features
            return (
                <div className="relative z-10 w-full min-h-screen">
                    <Suspense fallback={
                        <div className="min-h-screen bg-gradient-to-br from-[#1A3C40] to-[#0F2A2E] flex flex-col items-center justify-center text-white">
                            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
                            <p className="text-white/60">กำลังโหลดเรื่องราวของคุณ...</p>
                        </div>
                    }>
                        <TemplateComponent
                            customTitle={storyData.customer_name}
                            customMessage={storyData.message}
                            customSignOff={storyData.sign_off}
                            targetName={storyData.target_name}
                            pin={storyData.pin_code}
                            timelines={storyData.timelines || []}
                            finaleMessage={storyData.finale_message}
                            finaleSignOff={storyData.finale_sign_off}
                            images={storyData.content_images || []}
                            musicUrl={storyData.music_url}
                            colorTheme={storyData.color_theme_id ? findPaletteById(storyData.color_theme_id) : null}
                            config={config}
                        />
                    </Suspense>
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

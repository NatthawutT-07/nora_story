import { useParams } from 'react-router-dom';
import { Suspense } from 'react';
import useSWR from 'swr';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

// Add-ons
import { mergeConfig } from '../lib/templateConfig';
import { findPaletteById } from '../lib/colorPalettes';
import { getTemplateComponent } from '../lib/templates';

// UI Components
import LoadingScreen from './ui/LoadingScreen';
import ErrorScreen from './ui/ErrorScreen';

/**
 * StoryPage - Dynamic page that fetches and renders customer stories
 */
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

    // Check if accessing via subdomain (VIP)
    const hostname = window.location.hostname;
    const isSubdomain = !['localhost', 'norastory.com', 'www.norastory.com'].includes(hostname)
        && !hostname.endsWith('.pages.dev');

    let storyId = id;

    // If subdomain, extract the name part
    if (isSubdomain && hostname.includes('.norastory.com')) {
        storyId = hostname.split('.')[0];
    }

    const { data: storyData, error: swrError, isLoading: loading } = useSWR(
        storyId ? `story-${storyId}` : null,
        () => fetchStoryData(storyId),
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000,
        }
    );

    const errorMsg = swrError ? (swrError.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล') : null;

    if (loading) return <LoadingScreen />;
    if (errorMsg) return <ErrorScreen message={errorMsg} />;

    if (storyData && storyData.template_id) {
        const TemplateComponent = getTemplateComponent(storyData.template_id);

        if (TemplateComponent) {
            const config = mergeConfig(storyData.config);
            return (
                <div className="relative z-10 w-full min-h-screen">
                    <Suspense fallback={<LoadingScreen />}>
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

    // Fallback: No template found or story in progress
    return (
        <ErrorScreen 
            title="เรื่องราวของคุณกำลังถูกจัดทำ" 
            message="ทีมงานกำลังจัดทำหน้าเว็บไซต์ให้คุณอยู่ค่ะ กรุณารอสักครู่" 
            icon="🎨" 
        />
    );
};

export default StoryPage;

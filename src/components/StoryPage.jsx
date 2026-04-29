import { useParams } from 'react-router-dom';
import { Suspense } from 'react';
import useSWR from 'swr';
import { Helmet } from 'react-helmet-async';
import { db } from '../firebase';
import { getOrder } from '../api/functions';

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

    const result = await getOrder(storyId);
    if (!result.success) {
        throw new Error(result.error || 'ไม่พบเรื่องราวที่คุณกำลังมองหา');
    }
    return result.order;
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

    const templateId = storyData.template_id || storyData.selected_template_id;
    if (storyData && templateId) {
        const TemplateComponent = getTemplateComponent(templateId);

        if (TemplateComponent) {
            const config = mergeConfig(storyData.config);
            const pageTitle = `${storyData.target_name} | Nora Story`;
            const pageDesc = storyData.message ? storyData.message.substring(0, 160) : 'เปลี่ยนความทรงจำของคุณให้กลายเป็นเรื่องราวที่อยู่ตลอดไป';

            return (
                <div className="relative z-10 w-full min-h-screen">
                    <Helmet>
                        <title>{pageTitle}</title>
                        <meta name="description" content={pageDesc} />
                        <meta property="og:title" content={pageTitle} />
                        <meta property="og:description" content={pageDesc} />
                        {storyData.content_images?.[0] && (
                            <meta property="og:image" content={storyData.content_images[0]} />
                        )}
                    </Helmet>
                    <Suspense fallback={<LoadingScreen />}>
                        <TemplateComponent
                            customTitle={storyData.customer_name}
                            customSignOff={storyData.sign_off}
                            targetName={storyData.target_name || storyData.targetName}
                            shortMessage={storyData.shortMessage || storyData.short_message}
                            customMessage={storyData.customMessage || storyData.custom_message || storyData.message}
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

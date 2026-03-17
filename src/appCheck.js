/**
 * Firebase App Check Configuration
 * ป้องกันการเรียก API จากบอทและแอปปลอม
 */
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getApps } from 'firebase/app';

/**
 * Initialize App Check with reCAPTCHA v3
 * ต้องตั้งค่าก่อนใช้งาน:
 * 1. ไปที่ Google reCAPTCHA Console: https://www.google.com/recaptcha/admin
 * 2. สร้าง Site Key แบบ reCAPTCHA v3
 * 3. เพิ่มโดเมนที่อนุญาต (localhost, norastory.com, etc.)
 * 4. ใส่ Site Key ใน environment variable
 * 5. ไปที่ Firebase Console → App Check → Enable Enforcement
 */
export const initializeFirebaseAppCheck = () => {
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    
    if (!siteKey) {
        console.warn('App Check: VITE_RECAPTCHA_SITE_KEY not configured');
        return null;
    }

    try {
        const app = getApps()[0];
        
        if (!app) {
            console.warn('App Check: Firebase app not initialized yet');
            return null;
        }

        // Enable debug token in development
        if (import.meta.env.DEV) {
            // This allows testing without real reCAPTCHA in development
            // Add this token to Firebase Console → App Check → Debug tokens
            self.FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_APPCHECK_DEBUG_TOKEN || true;
        }

        const appCheck = initializeAppCheck(app, {
            provider: new ReCaptchaV3Provider(siteKey),
            isTokenAutoRefreshEnabled: true,
        });

        console.info('App Check initialized successfully');
        return appCheck;
        
    } catch (error) {
        console.error('App Check initialization failed:', error);
        return null;
    }
};

export default initializeFirebaseAppCheck;

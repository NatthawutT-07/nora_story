/**
 * Template Configuration Schema
 * ค่า Config สำหรับปรับแต่ง Template แบบ Dynamic
 */

export const DEFAULT_CONFIG = {
    theme: {
        primaryColor: '#E8A08A',      // สีหลัก
        backgroundColor: '#F5F5F0',   // สีพื้นหลัง
        fontFamily: 'serif',          // ฟอนต์
    },
    effects: {
        snow: false,       // หิมะตก
        hearts: false,     // หัวใจลอย
        sparkles: false,   // ดาวระยิบ
    },
    features: {
        passwordProtected: false,   // ล็อกรหัสผ่าน
        password: '',               // รหัสผ่าน
        hiddenMessage: false,       // ข้อความลับ
        hiddenMessageText: '',      // เนื้อหาข้อความลับ
        countdownDate: null,        // วันที่นับถอยหลัง
    }
};

/**
 * Merge user config with defaults
 * @param {Object} userConfig - Config from Firestore
 * @returns {Object} Merged config
 */
export const mergeConfig = (userConfig = {}) => {
    return {
        theme: { ...DEFAULT_CONFIG.theme, ...userConfig?.theme },
        effects: { ...DEFAULT_CONFIG.effects, ...userConfig?.effects },
        features: { ...DEFAULT_CONFIG.features, ...userConfig?.features },
    };
};

/**
 * Effect options for Admin UI
 */
export const EFFECT_OPTIONS = [
    { key: 'snow', label: '❄️ หิมะตก', description: 'เอฟเฟกต์หิมะตกลงมาจากบนลงล่าง' },
    { key: 'hearts', label: '💕 หัวใจลอย', description: 'หัวใจลอยขึ้นจากล่างขึ้นบน' },
    { key: 'sparkles', label: '✨ ดาวระยิบ', description: 'ดาวกระพริบทั่วหน้าจอ' },
];

/**
 * Feature options for Admin UI
 */
export const FEATURE_OPTIONS = [
    { key: 'passwordProtected', label: '🔒 ล็อกรหัสผ่าน', description: 'ต้องกรอกรหัสก่อนเข้าดู', hasInput: true, inputKey: 'password', inputLabel: 'รหัสผ่าน' },
    { key: 'hiddenMessage', label: '💌 ข้อความลับ', description: 'กดปุ่มเพื่อเปิดข้อความ', hasInput: true, inputKey: 'hiddenMessageText', inputLabel: 'ข้อความลับ', inputType: 'textarea' },
];

/**
 * Theme presets for quick selection
 */
export const THEME_PRESETS = [
    { name: 'Classic', primaryColor: '#E8A08A', backgroundColor: '#F5F5F0' },
    { name: 'Romantic Pink', primaryColor: '#FF6B9D', backgroundColor: '#FFF0F5' },
    { name: 'Ocean Blue', primaryColor: '#4A90D9', backgroundColor: '#F0F8FF' },
    { name: 'Forest Green', primaryColor: '#4CAF50', backgroundColor: '#F1F8E9' },
    { name: 'Royal Gold', primaryColor: '#FFD700', backgroundColor: '#1A1A2E' },
    { name: 'Dark Mode', primaryColor: '#E8A08A', backgroundColor: '#1A1A2E' },
];

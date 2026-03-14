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

/**
 * Tier duration in days
 */
export const TIER_DURATIONS = {
    1: 3,   // 3 days
    2: 7,   // 7 days
    3: 15,  // 15 days
    4: 30   // 30 days
};

/**
 * All available templates
 */
export const ALL_TEMPLATES = [
    { id: 't1-1', name: 'Tier 1 - Sunrise Glow' },
    { id: 't1-2', name: 'Tier 1 - Moonlight' },
    { id: 't1-3', name: 'Tier 1 - Cherry Blossom' },

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

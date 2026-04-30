import { lazy } from 'react';

/**
 * Template Registry — Single Source of Truth
 * 
 * เพิ่ม template ใหม่ = เพิ่ม 1 entry ที่นี่ + สร้าง PageComponent + สร้าง FormComponent
 * ไม่ต้องไปแก้ไฟล์อื่นอีกเลย
 * 
 * fields array กำหนดว่า template นี้ต้องการ field อะไรบ้างในขั้นตอน checkout
 * ใช้สำหรับ: validation (frontend+backend), dynamic form rendering, order data saving
 */
export const TEMPLATE_REGISTRY = {
    // ═══════════════════════════════════
    // TIER 1 — Trial (฿59, 3 วัน)
    // ═══════════════════════════════════
    't1-1': {
        id: 't1-1',
        tierId: 1,
        number: '01',
        name: 'Love Card',
        description: 'ข้อความลับพร้อม PIN',
        usage: 'ใส่รหัส PIN ล็อกหน้าเว็บ เมื่อกรอกรหัสถูกจะแสดงการ์ดอวยพร',
        disabled: false,
        maxImages: 0,
        hasMusic: false,
        tags: ['PIN', 'Card'],
        fields: ['pin', 'targetName', 'message', 'signOff'],
        FormComponent: lazy(() => import('../components/checkout/forms/tier1/T1_1_Fields')),
        PageComponent: lazy(() => import('../components/templates/tier1/Tier1Template1')),
    },
    't1-2': {
        id: 't1-2',
        tierId: 1,
        number: '02',
        name: 'Chat View',
        description: 'แชทจำลอง',
        usage: 'หน้าแชทจำลอง โชว์ข้อความสนทนา',
        disabled: false,
        maxImages: 0,
        hasMusic: false,
        tags: ['Chat', 'Message'],
        fields: ['message', 'targetName', 'shortMessage', 'customMessage'],
        FormComponent: lazy(() => import('../components/checkout/forms/tier1/T1_2_Fields')),
        PageComponent: lazy(() => import('../components/templates/tier1/Tier1Template2')),
    },
    't1-3': {
        id: 't1-3',
        tierId: 1,
        number: '03',
        name: 'Soon',
        description: '',
        disabled: true,
    },

    // ═══════════════════════════════════
    // TIER 2 — Standard (฿129, 7 วัน)
    // ═══════════════════════════════════
    't2-1': {
        id: 't2-1',
        tierId: 2,
        number: '01',
        name: 'Standard Love',
        description: 'อนิเมชั่นอัพเกรด',
        usage: 'ล็อกรหัส PIN อัปโหลดรูปได้ 5 รูป ตามด้วยการ์ดอวยพรพร้อมอนิเมชั่น',
        disabled: false,
        maxImages: 5,
        hasMusic: true,
        tags: ['PIN', '5 Photos', 'Animation'],
        fields: ['pin', 'targetName', 'message', 'signOff'],
        FormComponent: lazy(() => import('../components/checkout/forms/tier2/T2_1_Fields')),
        PageComponent: lazy(() => import('../components/templates/tier2/Tier2Template1')),
    },
    't2-2': {
        id: 't2-2',
        tierId: 2,
        number: '02',
        name: 'Soon',
        description: '',
        disabled: true,
    },
    // 't2-3': {
    //     id: 't2-3',
    //     tierId: 2,
    //     number: '03',
    //     name: 'Soon',
    //     description: '',
    //     disabled: true,
    // },

    // ═══════════════════════════════════
    // TIER 3 — Premium (฿249, 15 วัน)
    // ═══════════════════════════════════
    't3-1': {
        id: 't3-1',
        tierId: 3,
        number: '01',
        name: 'Premium Story',
        description: 'หรูหราอลังการ',
        usage: 'อัปโหลดรูปได้ 10 รูป ไทม์ไลน์เล่าเรื่องราว พร้อมการ์ดอวยพร',
        disabled: false,
        maxImages: 10,
        hasMusic: true,
        tags: ['10 Photos', 'Timeline', 'Music'],
        fields: ['timelines', 'finaleMessage', 'finaleSignOff'],
        FormComponent: lazy(() => import('../components/checkout/forms/tier3/T3_1_Fields')),
        PageComponent: lazy(() => import('../components/templates/tier3/Tier3Template1')),
    },
    't3-2': {
        id: 't3-2',
        tierId: 3,
        number: '02',
        name: 'Soon',
        description: '',
        disabled: true,
    },
};

// ─── Helper Functions ───

/** Get a single template config by ID */
export const getTemplate = (id) => TEMPLATE_REGISTRY[id] || null;

/** Get all templates for a tier (including disabled) */
export const getTemplatesByTier = (tierId) =>
    Object.values(TEMPLATE_REGISTRY).filter(t => t.tierId === Number(tierId));

/** Get the lazy-loaded page component for a template */
export const getTemplateComponent = (id) => TEMPLATE_REGISTRY[id]?.PageComponent || null;

/** Get the required fields array for a template */
export const getTemplateFields = (id) => TEMPLATE_REGISTRY[id]?.fields || [];

/** Get max images for a template */
export const getTemplateMaxImages = (id) => TEMPLATE_REGISTRY[id]?.maxImages ?? 0;

/** Check if template has music support */
export const getTemplateHasMusic = (id) => TEMPLATE_REGISTRY[id]?.hasMusic ?? false;

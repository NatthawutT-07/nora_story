import { Heart, Sparkles, Star, Crown } from 'lucide-react';

export const TR_DATA = {
    1: {
        name: 'Trial',
        description: 'ทดลองใช้สั้นๆ',
        price: '59',
        features: ['3 Days', 'Basic Animations'],
        icon: Heart,
    },
    2: {
        name: 'Standard',
        description: 'สำหรับคนพิเศษ',
        price: '129',
        features: ['15 Days', 'Premium Theme', 'Music'],
        icon: Star,
    },
    3: {
        name: 'Premium',
        description: 'สำหรับโอกาสพิเศษ',
        price: '249',
        features: ['15 Days', 'Luxury Theme', 'Gallery'],
        icon: Star,
    },
};

export const TEMPLATE_DATA = {
    // Tier 1 (Trial)
    't1-1': {
        id: 't1-1',
        name: 'Love Card',
        // description: 'ข้อความลับพร้อม PIN',
        preview: '',
        usage: 'ใส่รหัส PIN ล็อกหน้าเว็บ เมื่อกรอกรหัสถูกจะแสดงการ์ดอวยพร'
    },
    't1-2': {
        id: 't1-2',
        name: 'Ordination',
        description: 'การ์ดงานบวช',
        preview: '',
        usage: 'เชิญร่วมงานบุญ งานอุปสมบท เรียบง่ายและศักดิ์สิทธิ์',
        disabled: true
    },
    't1-3': {
        id: 't1-3',
        name: 'Wedding',
        description: 'การ์ดงานแต่ง',
        preview: '',
        usage: 'การ์ดเชิญงานแต่งงานออนไลน์ ส่งต่อง่าย ประหยัดกระดาษ',
        disabled: true
    },

    // Tier 2 (Standard)
    't2-1': {
        id: 't2-1',
        name: 'Standard Love',
        // description: 'อนิเมชั่นพร้อมแกลเลอรี่รูป',
        preview: '',
        usage: 'ล็อกรหัส PIN อัปโหลดรูปได้ 5 รูป ตามด้วยการ์ดอวยพรพร้อมอนิเมชั่น'
    },
    't2-2': {
        id: 't2-2',
        name: 'Ordination',
        description: 'การ์ดงานบวช',
        preview: '',
        usage: 'การ์ดงานบวชแบบทางการ สวยงาม สมเกียรติ',
        disabled: true
    },
    't2-3': {
        id: 't2-3',
        name: 'Wedding',
        description: 'การ์ดงานแต่ง',
        preview: '',
        usage: 'รวบรวมรูปถ่ายความทรงจำ (สูงสุด 5 รูป) ใส่เพลงได้',
        disabled: true
    },

    // Tier 3 (Premium)
    't3-1': {
        id: 't3-1',
        name: 'Love Story',
        // description: 'หรูหราอลังการ',
        preview: '',
        usage: 'อัปโหลดรูปได้ 10 รูป ไทม์ไลน์เล่าเรื่องราว พร้อมการ์ดอวยพร'
    },
    't3-2': {
        id: 't3-2',
        name: 'Ordination',
        description: 'การ์ดงานบวช',
        preview: '',
        usage: 'ธีมคริสตัล สว่างไสว เหมาะกับโอกาสพิเศษมากๆ',
        disabled: true
    },
    't3-3': {
        id: 't3-3',
        name: 'Wedding',
        description: 'การ์ดงานแต่ง',
        preview: '',
        usage: 'แจ้งกำหนดการงานแต่งงานแบบไทม์ไลน์ ดูง่าย สวยงาม',
        disabled: true
    },

};

export const getTemplatesByTier = (tierId) => {
    return Object.values(TEMPLATE_DATA).filter(t => t.id.startsWith(`t${tierId}`));
};

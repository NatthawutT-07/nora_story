export const TIERS = [
    {
        id: '1',
        slug: 't1',
        name: 'Trial',
        price: '59',
        // originalPrice: '99',
        description: 'ทดลองใช้สั้นๆ',
        tagline: 'ทดลองใช้สั้นๆ',
        duration: '3 วัน',
        features: [
            'Template สำเร็จรูปพร้อมใช้',
            'มีลูกเล่นน่ารักๆ',
            'Random Link + QR Code',
            'รองรับทุกอุปกรณ์',
            'ดูแลหลังการขาย',
            '100 ตัวอักษร',
            'เเก้ไขข้อความได้ 1 ครั้ง'
        ],
        gradient: 'from-slate-500 to-slate-600',
        bgGradient: 'from-slate-50 to-white',
        bgColor: 'bg-white',
        accentColor: 'slate',
        demos: ['t1-1', 't1-2', 't1-3'],
        extensionTiers: [
            { days: 3, price: 39, label: 'ต่ออายุ 3 วัน' },
            { days: 7, price: 79, label: 'ต่ออายุ 7 วัน', popular: true }
        ]
    },
    {
        id: '2',
        slug: 't2',
        name: 'Standard',
        price: '129',
        description: 'มาตรฐานยอดนิยม',
        tagline: 'สำหรับคนพิเศษ',
        duration: '7 วัน',
        features: [
            'animation เพิ่มเติม',
            'สีสันสวยงาม',
            'อัปโหลดรูป 5 รูป',
            'Background Music',
            'Random Link + QR Code',
            'ดูแลหลังการขาย',
            '100 ตัวอักษร',
            'เเก้ไขข้อความได้ 1 ครั้ง',
            'เเก้ไขรูปภาพได้ 1 ครั้ง'
        ],

        gradient: 'from-[#6E8898] to-[#4B616E]', // More elegant muted blue/teal
        bgGradient: 'from-[#F0F4F8] to-white',
        bgColor: 'bg-white',
        accentColor: 'blue',
        demos: ['t2-1', 't2-2', 't2-3'],
        extensionTiers: [
            { days: 7, price: 99, label: 'ต่ออายุ 7 วัน' },
            { days: 15, price: 169, label: 'ต่ออายุ 15 วัน' },
            { days: 30, price: 299, label: 'ต่ออายุ 30 วัน', best: true },
        ]
    },
    {
        id: '3',
        slug: 't3',
        name: 'Premium',
        price: '249',
        description: 'สำหรับโอกาสพิเศษ',
        tagline: 'สำหรับโอกาสพิเศษ',
        duration: '15 วัน',
        features: [
            'ทุกอย่างใน Standard',
            'อัปโหลดรูป 10 รูป',
            'Custom Link เลือกชื่อเอง',
            'Background Music',
            'Priority Support',
            '100 ตัวอักษร',
            'เเก้ไขข้อความได้ 2 ครั้ง',
            'เเก้ไขรูปภาพได้ 1 ครั้ง'
        ],
        highlight: true,
        tag: 'POPULAR',
        gradient: 'from-[#FF8FAB] to-[#FB6F92]', // Vibrant pastel pink
        bgGradient: 'from-rose-50 via-pink-50 to-white',
        bgColor: 'bg-white',
        accentColor: 'rose',
        demos: ['t3-1', 't3-2', 't3-3'],
        extensionTiers: [
            { days: 15, price: 199, label: 'ต่ออายุ 15 วัน' },
            { days: 30, price: 349, label: 'ต่ออายุ 30 วัน', popular: true },
            { days: 60, price: 599, label: 'ต่ออายุ 60 วัน', best: true },
        ]
    }
];

export const getTierById = (id) => TIERS.find(t => t.id === id.toString() || t.slug === id);

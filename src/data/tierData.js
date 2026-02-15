export const TIERS = [
    {
        id: '1',
        slug: 't1',
        name: 'Trial',
        price: '79',
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
            '100 ตัวอักษร'
        ],
        gradient: 'from-slate-400 to-slate-500',
        bgGradient: 'from-slate-50 to-white',
        bgColor: 'bg-slate-50',
        accentColor: 'slate',
        demos: ['t1-1', 't1-2', 't1-3']
    },
    {
        id: '2',
        slug: 't2',
        name: 'Standard',
        price: '149',
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
            '100 ตัวอักษร'
        ],

        gradient: 'from-blue-400 to-blue-500',
        bgGradient: 'from-blue-50 to-white',
        bgColor: 'bg-blue-50',
        accentColor: 'blue',
        demos: ['t2-1', 't2-2', 't2-3']
    },
    {
        id: '3',
        slug: 't3',
        name: 'Premium',
        price: '299',
        description: 'สำหรับโอกาสพิเศษ',
        tagline: 'สำหรับโอกาสพิเศษ',
        duration: '15 วัน',
        features: [
            'ทุกอย่างใน Standard',
            'อัปโหลดรูป 10 รูป',
            'Custom Link เลือกชื่อเอง',
            'Background Music',
            'Priority Support'
        ],
        highlight: true,
        tag: 'POPULAR',
        gradient: 'from-[#E8A08A] to-[#d4917b]',
        bgGradient: 'from-rose-50 via-pink-50 to-amber-50',
        bgColor: 'bg-rose-50',
        accentColor: 'rose',
        demos: ['t3-1', 't3-2', 't3-3']
    },
    {
        id: '4',
        slug: 't4',
        name: 'Archive',
        tagline: 'เก็บความทรงจำอย่างพรีเมียม',
        description: 'แพ็คเกจสูงสุดสำหรับคนพิเศษ พร้อม Custom Subdomain และ Priority Support',
        price: '499+',

        gradient: 'from-amber-400 via-orange-400 to-amber-500',
        bgGradient: 'from-amber-50 via-orange-50 to-yellow-50',
        bgColor: 'bg-amber-50',
        accentColor: 'amber',
        highlight: false,
        demos: ['t4-1', 't4-2', 't4-3'],
        subTiers: [
            { days: 30, price: 499, perDay: 16, label: '30 วัน' },
            { days: 60, price: 799, perDay: 13, label: '60 วัน', discount: '20%' },
            { days: 90, price: 999, perDay: 11, label: '90 วัน', discount: '33%', popular: true },
            { days: 180, price: 1490, perDay: 8, label: '180 วัน', discount: '50%', best: true },
        ],
        customDomainPrice: 990,
        features: [
            { text: 'อัปโหลดรูปสูงสุด 20 รูป' },
            { text: 'Custom Link / Subdomain' },
            { text: 'Priority Support 24/7' },
            { text: 'Background Music' },
            { text: 'Premium Templates' },
        ]
    }
];

export const getTierById = (id) => TIERS.find(t => t.id === id.toString() || t.slug === id);

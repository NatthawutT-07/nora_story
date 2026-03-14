/**
 * Color Palettes per Tier
 * T1: Pastel / Soft — เบาบาง อ่อนโยน
 * T2: Vivid / Rich — ชัดสวย สีสันสดใส
 * T3: Premium / Gradient — พรีเมียม หรูหรา
 */

export const TIER_PALETTES = {
    // ─── Tier 1: Pastel & Soft ───
    1: [
        {
            id: 'rose-soft',
            name: 'Rose Soft',
            preview: ['#fdf2f8', '#fecdd3', '#f43f5e'],
            colors: {
                bg: '#fdf2f8', bgAlt: '#fff1f2',
                primary: '#f43f5e', secondary: '#fb7185', accent: '#fda4af',
                text: '#881337', textLight: '#9f1239',
                gradient: ['#fdf2f8', '#fff1f2', '#fef3c7'],
                confetti: ['#f43f5e', '#ec4899', '#f97316', '#fbbf24'],
            }
        },
        {
            id: 'lavender',
            name: 'Lavender',
            preview: ['#f5f3ff', '#ddd6fe', '#8b5cf6'],
            colors: {
                bg: '#f5f3ff', bgAlt: '#ede9fe',
                primary: '#8b5cf6', secondary: '#a78bfa', accent: '#c4b5fd',
                text: '#4c1d95', textLight: '#6d28d9',
                gradient: ['#f5f3ff', '#ede9fe', '#fae8ff'],
                confetti: ['#8b5cf6', '#a78bfa', '#c084fc', '#e879f9'],
            }
        },
        {
            id: 'peach',
            name: 'Peach',
            preview: ['#fff7ed', '#fed7aa', '#f97316'],
            colors: {
                bg: '#fff7ed', bgAlt: '#ffedd5',
                primary: '#f97316', secondary: '#fb923c', accent: '#fdba74',
                text: '#7c2d12', textLight: '#9a3412',
                gradient: ['#fff7ed', '#ffedd5', '#fef3c7'],
                confetti: ['#f97316', '#fb923c', '#fbbf24', '#f59e0b'],
            }
        },
        {
            id: 'sky',
            name: 'Sky',
            preview: ['#f0f9ff', '#bae6fd', '#0ea5e9'],
            colors: {
                bg: '#f0f9ff', bgAlt: '#e0f2fe',
                primary: '#0ea5e9', secondary: '#38bdf8', accent: '#7dd3fc',
                text: '#0c4a6e', textLight: '#075985',
                gradient: ['#f0f9ff', '#e0f2fe', '#e0f2fe'],
                confetti: ['#0ea5e9', '#38bdf8', '#06b6d4', '#22d3ee'],
            }
        },
        {
            id: 'mint',
            name: 'Mint',
            preview: ['#ecfdf5', '#a7f3d0', '#10b981'],
            colors: {
                bg: '#ecfdf5', bgAlt: '#d1fae5',
                primary: '#10b981', secondary: '#34d399', accent: '#6ee7b7',
                text: '#064e3b', textLight: '#065f46',
                gradient: ['#ecfdf5', '#d1fae5', '#ccfbf1'],
                confetti: ['#10b981', '#34d399', '#2dd4bf', '#14b8a6'],
            }
        },
        {
            id: 'lemon',
            name: 'Lemon',
            preview: ['#fefce8', '#fde047', '#eab308'],
            colors: {
                bg: '#fefce8', bgAlt: '#fef9c3',
                primary: '#eab308', secondary: '#facc15', accent: '#fde047',
                text: '#713f12', textLight: '#854d0e',
                gradient: ['#fefce8', '#fef9c3', '#fef3c7'],
                confetti: ['#eab308', '#facc15', '#f59e0b', '#fbbf24'],
            }
        },
        {
            id: 'blush',
            name: 'Blush',
            preview: ['#fdf2f8', '#f9a8d4', '#ec4899'],
            colors: {
                bg: '#fdf2f8', bgAlt: '#fce7f3',
                primary: '#ec4899', secondary: '#f472b6', accent: '#f9a8d4',
                text: '#831843', textLight: '#9d174d',
                gradient: ['#fdf2f8', '#fce7f3', '#fae8ff'],
                confetti: ['#ec4899', '#f472b6', '#e879f9', '#d946ef'],
            }
        },
        {
            id: 'coral',
            name: 'Coral',
            preview: ['#fff1f2', '#fecaca', '#ef4444'],
            colors: {
                bg: '#fff1f2', bgAlt: '#fee2e2',
                primary: '#ef4444', secondary: '#f87171', accent: '#fca5a5',
                text: '#7f1d1d', textLight: '#991b1b',
                gradient: ['#fff1f2', '#fee2e2', '#ffedd5'],
                confetti: ['#ef4444', '#f87171', '#fb923c', '#f97316'],
            }
        },
        {
            id: 'ivory',
            name: 'Ivory',
            preview: ['#fefdf8', '#f5f0e1', '#b8860b'],
            colors: {
                bg: '#fefdf8', bgAlt: '#faf5e4',
                primary: '#b8860b', secondary: '#d4a843', accent: '#e8cc7a',
                text: '#5c4304', textLight: '#78580a',
                gradient: ['#fefdf8', '#faf5e4', '#fef3c7'],
                confetti: ['#b8860b', '#d4a843', '#fbbf24', '#f59e0b'],
            }
        },
        {
            id: 'lilac',
            name: 'Lilac',
            preview: ['#faf5ff', '#e9d5ff', '#a855f7'],
            colors: {
                bg: '#faf5ff', bgAlt: '#f3e8ff',
                primary: '#a855f7', secondary: '#c084fc', accent: '#d8b4fe',
                text: '#581c87', textLight: '#6b21a8',
                gradient: ['#faf5ff', '#f3e8ff', '#fdf2f8'],
                confetti: ['#a855f7', '#c084fc', '#e879f9', '#d946ef'],
            }
        },
    ],

    // ─── Tier 2: Vivid & Rich ───
    2: [
        {
            id: 'ruby',
            name: 'Ruby',
            preview: ['#4a0011', '#be123c', '#fda4af'],
            colors: {
                bg: '#1a0005', bgAlt: '#2d000d',
                primary: '#be123c', secondary: '#e11d48', accent: '#fb7185',
                text: '#fff1f2', textLight: '#fecdd3',
                gradient: ['#1a0005', '#2d000d', '#4a0011'],
                confetti: ['#e11d48', '#f43f5e', '#fb7185', '#fda4af'],
            }
        },
        {
            id: 'sapphire',
            name: 'Sapphire',
            preview: ['#0c1445', '#1d4ed8', '#93c5fd'],
            colors: {
                bg: '#0c1445', bgAlt: '#0f1a5e',
                primary: '#1d4ed8', secondary: '#3b82f6', accent: '#60a5fa',
                text: '#dbeafe', textLight: '#bfdbfe',
                gradient: ['#0c1445', '#0f1a5e', '#1e1b4b'],
                confetti: ['#3b82f6', '#60a5fa', '#38bdf8', '#22d3ee'],
            }
        },
        {
            id: 'amethyst',
            name: 'Amethyst',
            preview: ['#2e1065', '#7c3aed', '#c4b5fd'],
            colors: {
                bg: '#1a0533', bgAlt: '#2e1065',
                primary: '#7c3aed', secondary: '#8b5cf6', accent: '#a78bfa',
                text: '#ede9fe', textLight: '#ddd6fe',
                gradient: ['#1a0533', '#2e1065', '#3b0764'],
                confetti: ['#7c3aed', '#8b5cf6', '#a78bfa', '#c084fc'],
            }
        },
        {
            id: 'emerald',
            name: 'Emerald',
            preview: ['#022c22', '#059669', '#6ee7b7'],
            colors: {
                bg: '#022c22', bgAlt: '#064e3b',
                primary: '#059669', secondary: '#10b981', accent: '#34d399',
                text: '#d1fae5', textLight: '#a7f3d0',
                gradient: ['#022c22', '#064e3b', '#14532d'],
                confetti: ['#10b981', '#34d399', '#6ee7b7', '#2dd4bf'],
            }
        },
        {
            id: 'gold',
            name: 'Gold',
            preview: ['#1c1408', '#b8860b', '#fde68a'],
            colors: {
                bg: '#1c1408', bgAlt: '#2d210e',
                primary: '#b8860b', secondary: '#d4a843', accent: '#fbbf24',
                text: '#fef3c7', textLight: '#fde68a',
                gradient: ['#1c1408', '#2d210e', '#3d2e12'],
                confetti: ['#fbbf24', '#f59e0b', '#d4a843', '#eab308'],
            }
        },
        {
            id: 'sunset',
            name: 'Sunset',
            preview: ['#1a0510', '#c2410c', '#fdba74'],
            colors: {
                bg: '#1a0510', bgAlt: '#2d0a1a',
                primary: '#c2410c', secondary: '#ea580c', accent: '#f97316',
                text: '#ffedd5', textLight: '#fed7aa',
                gradient: ['#1a0510', '#2d0a1a', '#451a03'],
                confetti: ['#ea580c', '#f97316', '#fb923c', '#fbbf24'],
            }
        },
        {
            id: 'berry',
            name: 'Berry',
            preview: ['#1a0020', '#9333ea', '#e9d5ff'],
            colors: {
                bg: '#1a0020', bgAlt: '#2d0040',
                primary: '#9333ea', secondary: '#a855f7', accent: '#c084fc',
                text: '#f3e8ff', textLight: '#e9d5ff',
                gradient: ['#1a0020', '#2d0040', '#3b0764'],
                confetti: ['#9333ea', '#a855f7', '#c084fc', '#e879f9'],
            }
        },
        {
            id: 'teal',
            name: 'Teal',
            preview: ['#042f2e', '#0d9488', '#5eead4'],
            colors: {
                bg: '#042f2e', bgAlt: '#134e4a',
                primary: '#0d9488', secondary: '#14b8a6', accent: '#2dd4bf',
                text: '#ccfbf1', textLight: '#99f6e4',
                gradient: ['#042f2e', '#134e4a', '#1a3c40'],
                confetti: ['#14b8a6', '#2dd4bf', '#5eead4', '#34d399'],
            }
        },
        {
            id: 'burgundy',
            name: 'Burgundy',
            preview: ['#1a0008', '#9f1239', '#fda4af'],
            colors: {
                bg: '#1a0008', bgAlt: '#2d0010',
                primary: '#9f1239', secondary: '#be123c', accent: '#e11d48',
                text: '#fff1f2', textLight: '#fecdd3',
                gradient: ['#1a0008', '#2d0010', '#4c0519'],
                confetti: ['#be123c', '#e11d48', '#f43f5e', '#fb7185'],
            }
        },
        {
            id: 'copper',
            name: 'Copper',
            preview: ['#1c0f04', '#b45309', '#fcd34d'],
            colors: {
                bg: '#1c0f04', bgAlt: '#2d1a08',
                primary: '#b45309', secondary: '#d97706', accent: '#f59e0b',
                text: '#fef3c7', textLight: '#fde68a',
                gradient: ['#1c0f04', '#2d1a08', '#451a03'],
                confetti: ['#d97706', '#f59e0b', '#fbbf24', '#fcd34d'],
            }
        },
        // Bright checkout palettes - must be findable by findPaletteById
        {
            id: 'bright-rose',
            name: 'Bright Rose',
            preview: ['#fdf2f8', '#f472b6', '#f43f5e'],
            colors: {
                bg: '#fdf2f8', bgAlt: '#fff1f2',
                primary: '#f43f5e', secondary: '#fb7185', accent: '#fda4af',
                text: '#881337', textLight: '#9f1239',
                gradient: ['#4c1d95', '#be185d', '#f43f5e'],
                confetti: ['#f43f5e', '#ec4899', '#f97316', '#fbbf24'],
            }
        },
        {
            id: 'bright-lavender',
            name: 'Bright Lavender',
            preview: ['#f5f3ff', '#a78bfa', '#8b5cf6'],
            colors: {
                bg: '#f5f3ff', bgAlt: '#ede9fe',
                primary: '#8b5cf6', secondary: '#a78bfa', accent: '#c4b5fd',
                text: '#4c1d95', textLight: '#6d28d9',
                gradient: ['#5b21b6', '#7c3aed', '#8b5cf6'],
                confetti: ['#8b5cf6', '#a78bfa', '#c084fc', '#e879f9'],
            }
        },
        {
            id: 'bright-peach',
            name: 'Bright Peach',
            preview: ['#fff7ed', '#fb923c', '#f97316'],
            colors: {
                bg: '#fff7ed', bgAlt: '#ffedd5',
                primary: '#f97316', secondary: '#fb923c', accent: '#fdba74',
                text: '#7c2d12', textLight: '#9a3412',
                gradient: ['#c2410c', '#ea580c', '#f97316'],
                confetti: ['#f97316', '#fb923c', '#fbbf24', '#f59e0b'],
            }
        },
        {
            id: 'bright-sky',
            name: 'Bright Sky',
            preview: ['#f0f9ff', '#38bdf8', '#0ea5e9'],
            colors: {
                bg: '#f0f9ff', bgAlt: '#e0f2fe',
                primary: '#0ea5e9', secondary: '#38bdf8', accent: '#7dd3fc',
                text: '#0c4a6e', textLight: '#075985',
                gradient: ['#0369a1', '#0ea5e9', '#38bdf8'],
                confetti: ['#0ea5e9', '#38bdf8', '#06b6d4', '#22d3ee'],
            }
        },
        {
            id: 'bright-mint',
            name: 'Bright Mint',
            preview: ['#ecfdf5', '#34d399', '#10b981'],
            colors: {
                bg: '#ecfdf5', bgAlt: '#d1fae5',
                primary: '#10b981', secondary: '#34d399', accent: '#6ee7b7',
                text: '#064e3b', textLight: '#065f46',
                gradient: ['#047857', '#10b981', '#34d399'],
                confetti: ['#10b981', '#34d399', '#2dd4bf', '#14b8a6'],
            }
        },
        {
            id: 'bright-lemon',
            name: 'Bright Lemon',
            preview: ['#fefce8', '#facc15', '#eab308'],
            colors: {
                bg: '#fefce8', bgAlt: '#fef9c3',
                primary: '#eab308', secondary: '#facc15', accent: '#fde047',
                text: '#713f12', textLight: '#854d0e',
                gradient: ['#a16207', '#eab308', '#facc15'],
                confetti: ['#eab308', '#facc15', '#f59e0b', '#fbbf24'],
            }
        },
        {
            id: 'bright-blush',
            name: 'Bright Blush',
            preview: ['#fdf2f8', '#f472b6', '#ec4899'],
            colors: {
                bg: '#fdf2f8', bgAlt: '#fce7f3',
                primary: '#ec4899', secondary: '#f472b6', accent: '#f9a8d4',
                text: '#831843', textLight: '#9d174d',
                gradient: ['#be185d', '#ec4899', '#f472b6'],
                confetti: ['#ec4899', '#f472b6', '#e879f9', '#d946ef'],
            }
        },
        {
            id: 'bright-coral',
            name: 'Bright Coral',
            preview: ['#fff1f2', '#f87171', '#ef4444'],
            colors: {
                bg: '#fff1f2', bgAlt: '#fee2e2',
                primary: '#ef4444', secondary: '#f87171', accent: '#fca5a5',
                text: '#7f1d1d', textLight: '#991b1b',
                gradient: ['#b91c1c', '#ef4444', '#f87171'],
                confetti: ['#ef4444', '#f87171', '#fb923c', '#f97316'],
            }
        },
    ],

    // ─── Tier 3: Premium & Gradient ───
    3: [
        {
            id: 'nebula',
            name: 'Nebula',
            preview: ['#050510', '#1a103c', '#e879f9'],
            colors: {
                bg: '#050510', bgAlt: '#0a0a1a',
                primary: '#c084fc', secondary: '#e879f9', accent: '#a78bfa',
                text: '#f3e8ff', textLight: '#e9d5ff',
                gradient: ['#050510', '#1a103c', '#0c0520'],
                confetti: ['#c084fc', '#e879f9', '#a78bfa', '#f0abfc'],
            }
        },
        {
            id: 'aurora',
            name: 'Aurora',
            preview: ['#021020', '#06b6d4', '#a7f3d0'],
            colors: {
                bg: '#021020', bgAlt: '#041c32',
                primary: '#06b6d4', secondary: '#34d399', accent: '#22d3ee',
                text: '#ecfdf5', textLight: '#a7f3d0',
                gradient: ['#021020', '#041c32', '#022c22'],
                confetti: ['#06b6d4', '#34d399', '#22d3ee', '#2dd4bf'],
            }
        },
        {
            id: 'midnight-gold',
            name: 'Midnight Gold',
            preview: ['#0a0a14', '#b8860b', '#fde68a'],
            colors: {
                bg: '#0a0a14', bgAlt: '#12121e',
                primary: '#b8860b', secondary: '#d4a843', accent: '#fbbf24',
                text: '#fef3c7', textLight: '#fde68a',
                gradient: ['#0a0a14', '#12121e', '#1a1a2e'],
                confetti: ['#b8860b', '#d4a843', '#fbbf24', '#fde68a'],
            }
        },
        {
            id: 'rose-gold',
            name: 'Rose Gold',
            preview: ['#1a0a10', '#e8a08a', '#fecdd3'],
            colors: {
                bg: '#1a0a10', bgAlt: '#2d1520',
                primary: '#e8a08a', secondary: '#f9a8d4', accent: '#fda4af',
                text: '#fdf2f8', textLight: '#fce7f3',
                gradient: ['#1a0a10', '#2d1520', '#3d1f2e'],
                confetti: ['#e8a08a', '#f9a8d4', '#fda4af', '#fecdd3'],
            }
        },
        {
            id: 'diamond',
            name: 'Diamond',
            preview: ['#0a0e14', '#94a3b8', '#e2e8f0'],
            colors: {
                bg: '#0a0e14', bgAlt: '#0f172a',
                primary: '#94a3b8', secondary: '#cbd5e1', accent: '#e2e8f0',
                text: '#f1f5f9', textLight: '#e2e8f0',
                gradient: ['#0a0e14', '#0f172a', '#1e293b'],
                confetti: ['#94a3b8', '#cbd5e1', '#e2e8f0', '#f1f5f9'],
            }
        },
        {
            id: 'eclipse',
            name: 'Eclipse',
            preview: ['#0a0005', '#7c2d12', '#fdba74'],
            colors: {
                bg: '#0a0005', bgAlt: '#140a0f',
                primary: '#c2410c', secondary: '#ea580c', accent: '#f97316',
                text: '#ffedd5', textLight: '#fed7aa',
                gradient: ['#0a0005', '#140a0f', '#1c1008'],
                confetti: ['#c2410c', '#ea580c', '#f97316', '#fdba74'],
            }
        },
        {
            id: 'celestial',
            name: 'Celestial',
            preview: ['#020818', '#3b82f6', '#bfdbfe'],
            colors: {
                bg: '#020818', bgAlt: '#0c1833',
                primary: '#3b82f6', secondary: '#60a5fa', accent: '#93c5fd',
                text: '#dbeafe', textLight: '#bfdbfe',
                gradient: ['#020818', '#0c1833', '#1e1b4b'],
                confetti: ['#3b82f6', '#60a5fa', '#93c5fd', '#38bdf8'],
            }
        },
        {
            id: 'obsidian',
            name: 'Obsidian',
            preview: ['#09090b', '#3f3f46', '#a1a1aa'],
            colors: {
                bg: '#09090b', bgAlt: '#18181b',
                primary: '#a1a1aa', secondary: '#d4d4d8', accent: '#e4e4e7',
                text: '#fafafa', textLight: '#e4e4e7',
                gradient: ['#09090b', '#18181b', '#27272a'],
                confetti: ['#a1a1aa', '#d4d4d8', '#e4e4e7', '#fafafa'],
            }
        },
        {
            id: 'champagne',
            name: 'Champagne',
            preview: ['#0f0a05', '#c2956b', '#fde68a'],
            colors: {
                bg: '#0f0a05', bgAlt: '#1a1408',
                primary: '#c2956b', secondary: '#dbb896', accent: '#f5deb3',
                text: '#fef3c7', textLight: '#fde68a',
                gradient: ['#0f0a05', '#1a1408', '#2d210e'],
                confetti: ['#c2956b', '#dbb896', '#f5deb3', '#fde68a'],
            }
        },
        {
            id: 'royal',
            name: 'Royal',
            preview: ['#0a0020', '#4c1d95', '#c4b5fd'],
            colors: {
                bg: '#0a0020', bgAlt: '#140040',
                primary: '#6d28d9', secondary: '#7c3aed', accent: '#8b5cf6',
                text: '#ede9fe', textLight: '#ddd6fe',
                gradient: ['#0a0020', '#140040', '#1e1b4b'],
                confetti: ['#6d28d9', '#7c3aed', '#8b5cf6', '#a78bfa'],
            }
        },
    ],
};

/**
 * Get palettes for a given tier
 */
export const getPalettesForTier = (tierId) => {
    return TIER_PALETTES[String(tierId)] || TIER_PALETTES[1];
};

/**
 * Find a specific palette by ID across all tiers
 */
export const findPaletteById = (paletteId) => {
    for (const tiers of Object.values(TIER_PALETTES)) {
        const found = tiers.find(p => p.id === paletteId);
        if (found) return found;
    }
    return TIER_PALETTES[1][0]; // fallback to first T1 palette
};

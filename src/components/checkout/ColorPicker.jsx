import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';
import { useCheckout } from './CheckoutContext';
import { getPalettesForTier } from '../../lib/colorPalettes';

const ColorPicker = () => {
    const { tier, selectedColorTheme, setSelectedColorTheme } = useCheckout();
    
    // For Tier 2, use bright checkout-friendly colors instead of dark theme colors
    const palettes = String(tier?.id) === '2' 
        ? [
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
        ]
        : getPalettesForTier(tier?.id);

    return (
        <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
                <Palette size={14} className="text-[#1A3C40]" />
                <span className="text-xs font-medium text-[#1A3C40] tracking-wide uppercase">เลือกเฉดสี</span>
                {selectedColorTheme && (
                    <span className="text-[10px] text-gray-400 ml-auto">{selectedColorTheme.name}</span>
                )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
                {palettes.map((palette) => {
                    const isSelected = selectedColorTheme?.id === palette.id;

                    return (
                        <motion.button
                            key={palette.id}
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedColorTheme(palette)}
                            className={`relative w-9 h-9 rounded-full overflow-hidden shadow-sm transition-all duration-200 ${
                                isSelected
                                    ? 'ring-2 ring-[#1A3C40] ring-offset-2 shadow-md'
                                    : 'ring-1 ring-gray-200 hover:ring-gray-300'
                            }`}
                            title={palette.name}
                        >
                            {/* 3-color gradient swatch */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: `linear-gradient(135deg, ${palette.preview[0]} 0%, ${palette.preview[1]} 50%, ${palette.preview[2]} 100%)`
                                }}
                            />

                            {/* Selected indicator */}
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <div className="w-3.5 h-3.5 rounded-full bg-white shadow-md flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.preview[2] }} />
                                    </div>
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default ColorPicker;

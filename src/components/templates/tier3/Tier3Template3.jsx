import { motion } from 'framer-motion';
import { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';

const Tier3Template3 = ({ customMessage, customImage }) => {
    const [code, setCode] = useState(['', '', '', '']);
    const correctCode = ['1', '4', '0', '2']; // Valentine's?
    const isUnlocked = code.join('') === correctCode.join('');

    const handleInput = (idx, val) => {
        if (!/^\d*$/.test(val)) return;
        const newCode = [...code];
        newCode[idx] = val.slice(-1);
        setCode(newCode);

        // Auto focus next
        if (val && idx < 3) {
            document.getElementById(`code-${idx + 1}`).focus();
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            {!isUnlocked ? (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-slate-800 p-8 rounded-3xl shadow-2xl text-center max-w-md w-full border border-slate-700"
                >
                    <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-8 text-blue-400">
                        <Lock size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Secret Vault</h2>
                    <p className="text-slate-400 mb-8">Enter our anniversary date (DDMM) to unlock.</p>

                    <div className="flex justify-center gap-4 mb-8">
                        {code.map((digit, idx) => (
                            <input
                                key={idx}
                                id={`code-${idx}`}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleInput(idx, e.target.value)}
                                className="w-14 h-16 bg-slate-900 border-2 border-slate-600 rounded-xl text-center text-2xl font-bold text-white focus:border-blue-500 focus:outline-none transition-colors"
                            />
                        ))}
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 text-white shadow-[0_0_50px_rgba(34,197,94,0.5)]">
                        <Unlock size={48} />
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-6">{customMessage || "Happy Anniversary!"}</h1>
                    <img
                        src={customImage || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600"}
                        alt="Us"
                        className="rounded-2xl shadow-2xl max-w-sm mx-auto border-4 border-slate-800"
                    />
                    <button
                        onClick={() => setCode(['', '', '', ''])}
                        className="mt-8 text-slate-500 hover:text-white"
                    >
                        Lock Again
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default Tier3Template3;

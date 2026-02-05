import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Tier1Template3 = ({ customMessage }) => {
    const [timeLeft, setTimeLeft] = useState(10);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {timeLeft > 0 ? (
                <div className="text-center z-10">
                    <motion.div
                        key={timeLeft}
                        initial={{ scale: 2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-[10rem] font-bold font-mono text-red-500 leading-none"
                    >
                        {timeLeft}
                    </motion.div>
                    <p className="text-gray-500 mt-4 uppercase tracking-widest">Seconds remaining</p>
                    <div className="mt-12 max-w-md mx-auto text-center border border-white/10 p-6 rounded-lg backdrop-blur-sm">
                        <p className="text-lg">"{customMessage || "รีบบอกรักก่อนเวลาจะหมดไป..."}"</p>
                    </div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <h1 className="text-4xl font-bold mb-4">Time's Up.</h1>
                    <button onClick={() => setTimeLeft(10)} className="text-sm underline text-gray-500 hover:text-white">Replay Memory</button>
                </motion.div>
            )}

            <div className="absolute inset-0 bg-red-900/10 pointer-events-none animate-pulse"></div>
        </div>
    );
};

export default Tier1Template3;

import { motion } from 'framer-motion';
import { Heart, Calendar, MapPin, Star } from 'lucide-react';

const Tier4Template6 = ({ customTitle }) => {
    const timeline = [
        { date: "Day 1", title: "We Met", icon: Star, color: "from-pink-500 to-rose-500", description: "The moment that changed everything..." },
        { date: "Day 100", title: "First Kiss", icon: Heart, color: "from-red-500 to-pink-500", description: "Butterflies and fireworks!" },
        { date: "Day 365", title: "One Year", icon: Calendar, color: "from-purple-500 to-violet-500", description: "365 days of pure happiness." },
        { date: "Forever", title: "Our Future", icon: MapPin, color: "from-blue-500 to-cyan-500", description: "The journey continues..." },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center p-6 font-sans text-white overflow-hidden">
            {/* Stars Background */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, delay: Math.random() * 2, repeat: Infinity }}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8 z-10"
            >
                <h1 className="text-2xl md:text-4xl font-playfair mb-2">{customTitle || "Our Journey Together"}</h1>
                <p className="text-slate-400 text-sm">A timeline of our love story</p>
            </motion.div>

            {/* Timeline */}
            <div className="relative w-full max-w-sm z-10">
                {/* Vertical Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500" />

                {timeline.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.3 }}
                        className="relative flex items-start mb-8 last:mb-0"
                    >
                        {/* Icon */}
                        <motion.div
                            whileHover={{ scale: 1.2 }}
                            className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center z-10 shadow-lg`}
                        >
                            <item.icon size={20} className="text-white" />
                        </motion.div>

                        {/* Content Card */}
                        <motion.div
                            whileHover={{ x: 5 }}
                            className="ml-4 flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all"
                        >
                            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{item.date}</div>
                            <h3 className="text-lg font-bold mb-1 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                {item.title}
                            </h3>
                            <p className="text-sm text-slate-400">{item.description}</p>
                        </motion.div>
                    </motion.div>
                ))}

                {/* Infinity Symbol at Bottom */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.5, type: "spring" }}
                    className="absolute -bottom-4 left-6 -translate-x-1/2 text-3xl"
                >
                    ∞
                </motion.div>
            </div>

            {/* Footer */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="mt-12 text-slate-500 text-xs text-center"
            >
                Every moment with you is a milestone worth celebrating 💫
            </motion.p>
        </div>
    );
};

export default Tier4Template6;

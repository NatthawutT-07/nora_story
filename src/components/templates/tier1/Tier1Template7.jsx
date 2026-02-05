import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const Tier1Template7 = ({ customImage, customTitle, customMessage }) => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-200"
            >
                {/* Header */}
                <div className="bg-[#f0f2f5] p-4 flex items-center gap-3 border-b border-gray-200">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                        {customImage ? <img src={customImage} className="w-full h-full object-cover" /> : "N"}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-sm leading-tight">{customTitle || "My Favorite Person"}</h3>
                        <p className="text-xs text-green-500 font-medium">Active Now</p>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="p-6 min-h-[400px] flex flex-col justify-end gap-4 bg-white relative">
                    <p className="text-center text-xs text-gray-400 mb-auto mt-4">Today 11:11 PM</p>

                    <motion.div
                        initial={{ scale: 0, originX: 0, originY: 1 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="self-start bg-[#f0f2f5] text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 max-w-[85%] text-sm"
                    >
                        Hey... just wanted to say something 🙈
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0, originX: 0, originY: 1 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1 }}
                        className="self-start bg-[#f0f2f5] text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 max-w-[90%] text-sm leading-relaxed"
                    >
                        {customMessage || "You make my world so much brighter just by being in it. Thank you for everything."}
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0, originX: 1, originY: 1 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 2 }}
                        className="self-end bg-blue-500 text-white rounded-2xl rounded-br-none px-4 py-3 max-w-[80%] text-sm flex items-center gap-2"
                    >
                        Love you! ❤️
                    </motion.div>
                </div>

                {/* Input Area (Fake) */}
                <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="flex-1 bg-[#f0f2f5] h-9 rounded-full px-3 flex items-center text-xs text-gray-400">
                        Type a message...
                    </div>
                    <Send size={20} className="text-blue-500" />
                </div>
            </motion.div>
        </div>
    );
};

export default Tier1Template7;

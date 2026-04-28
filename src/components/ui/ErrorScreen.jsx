import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Standardized Error Screen for Nora Story
 */
const ErrorScreen = ({ 
    title = "เกิดข้อผิดพลาด", 
    message = "ขออภัย ไม่พบหน้าที่คุณกำลังมองหา หรือลิงก์อาจไม่ถูกต้อง",
    icon = "💔"
}) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1A3C40] to-[#0F2A2E] flex flex-col items-center justify-center text-white p-6 text-center">
            <div className="text-6xl mb-6 animate-bounce">{icon}</div>
            <h1 className="text-2xl font-playfair mb-3">{title}</h1>
            <p className="text-white/60 mb-8 max-w-md mx-auto leading-relaxed">
                {message}
            </p>
            <button
                onClick={() => navigate('/')}
                className="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-xl transition-all duration-300 border border-white/10 hover:border-white/30 backdrop-blur-sm"
            >
                กลับหน้าหลัก
            </button>
        </div>
    );
};

export default ErrorScreen;

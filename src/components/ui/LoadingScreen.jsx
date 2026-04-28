import React from 'react';

/**
 * Standardized Loading Screen for Nora Story
 */
const LoadingScreen = ({ message = "กำลังโหลดเรื่องราวของคุณ..." }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1A3C40] to-[#0F2A2E] flex flex-col items-center justify-center text-white p-6">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
            </div>
            <p className="mt-6 text-white/60 font-medium tracking-wide animate-pulse">
                {message}
            </p>
        </div>
    );
};

export default LoadingScreen;

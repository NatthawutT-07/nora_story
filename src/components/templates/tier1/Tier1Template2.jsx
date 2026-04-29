import React from 'react';
import { ChevronLeft, Phone, Video, Battery, Wifi, Signal, Mic } from 'lucide-react';

const ChatMessage = ({ text, isSender, senderName, avatarUrl, showAvatar, isFirstInGroup, isPurple }) => {
    return (
        <div className={`flex w-full ${isSender ? 'justify-end' : 'justify-start'} mb-1.5 relative`}>
            {!isSender && (
                <div className="w-8 h-8 mr-2 flex-shrink-0 self-end mb-1">
                    {showAvatar && (
                        <img
                            src={avatarUrl || `https://ui-avatars.com/api/?name=${senderName || 'U'}&background=random`}
                            alt={senderName}
                            className="w-full h-full rounded-full object-cover"
                        />
                    )}
                </div>
            )}

            <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} max-w-[75%]`}>
                {!isSender && isFirstInGroup && senderName && (
                    <span className="text-[11px] text-gray-500 mb-1 ml-3 font-medium">{senderName}</span>
                )}
                <div
                    className={`px-4 py-2.5 text-[15px] ${isSender
                        ? (isPurple ? 'bg-gradient-to-br from-rose-100 to-pink-100 text-rose-900 shadow-sm' : 'bg-blue-100 text-blue-900 shadow-sm')
                        : 'bg-[#F4F4F5] text-gray-700 shadow-sm'
                        } ${isSender
                            ? 'rounded-[20px] rounded-br-sm'
                            : 'rounded-[20px] rounded-bl-sm'
                        }`}
                    style={{ lineHeight: '1.4' }}
                >
                    {text}
                </div>
            </div>
        </div>
    );
};

const Tier1Template2 = ({
    shortMessage: shortMsgProp,
    customMessage: customMsgProp,
    targetName: targetNameProp
}) => {
    // Fallback logic to handle null/undefined/empty string
    const targetName = targetNameProp || 'Honey ❤️';
    const shortMessage = shortMsgProp || 'Baby';
    const customMessage = customMsgProp || 'Thank you for being in my life and making me smile every day. Through thick and thin, having you by my side gives me the strength to keep going. I love you.';

    return (
        <div className="w-full min-h-screen bg-[#FFF8F8] flex flex-col items-center py-12 px-4 sm:px-8 font-sans">
            {/* Phone Mockup Frame */}
            <div className="w-full max-w-[340px] h-[680px] flex-shrink-0 bg-white rounded-[40px] shadow-2xl relative overflow-hidden border-[10px] border-gray-900 flex flex-col my-auto">

                {/* Notch & Status Bar */}
                <div className="h-12 w-full flex justify-between items-center px-5 pt-1 text-black z-20 relative bg-white">
                    {/* Notch simulation */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[28px] bg-gray-900 rounded-b-[20px] z-30"></div>

                    <span className="text-[14px] font-semibold tracking-tight ml-2 mt-1 z-40"></span>
                    <div className="flex items-center gap-1.5 mt-1 z-40">
                        <Signal size={16} strokeWidth={2.5} />
                        <Wifi size={16} strokeWidth={2.5} />
                        <Battery size={22} strokeWidth={1.5} />
                    </div>
                </div>

                {/* Chat Header */}
                <div className="px-2 py-3 flex items-center justify-between border-b border-gray-100 bg-white/95 backdrop-blur-md relative z-10 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center text-rose-400 w-1/4">
                        <ChevronLeft size={34} strokeWidth={2} className="-ml-1" />
                    </div>

                    <div className="flex flex-col items-center flex-1">

                        <span className="font-semibold text-[15px] text-gray-800 flex items-center gap-1">
                            {targetName}
                        </span>
                    </div>

                    <div className="flex items-center justify-end gap-4 text-rose-400 w-1/4 pr-3">
                        <Video size={26} strokeWidth={1.5} />
                        <Phone size={22} strokeWidth={1.5} />
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-white overflow-y-auto px-4 py-6 flex flex-col pb-24">
                    <ChatMessage
                        text={shortMessage}
                        isSender={true}
                        isPurple={true}
                    />

                    <div className="h-6"></div>

                    <ChatMessage
                        text="?"
                        isSender={false}
                        senderName={targetName}
                        isFirstInGroup={true}
                        showAvatar={true}
                    />

                    <div className="h-6"></div>

                    <ChatMessage
                        text={customMessage}
                        isSender={true}
                        isPurple={true}
                    />
                </div>

                {/* Bottom Input Area */}
                <div className="absolute bottom-0 w-full pb-8 pt-3 px-3 bg-[#FCFCFC] border-t border-gray-100 flex items-end gap-3 z-20">
                    <div className="w-8 h-8 rounded-full bg-[#F0F0F0] flex items-center justify-center text-gray-400 flex-shrink-0 mb-1 ml-1 cursor-pointer hover:bg-gray-200 transition-colors">
                        <span className="text-2xl leading-none font-light mb-0.5">+</span>
                    </div>
                    <div className="flex-1 min-h-[38px] bg-white border border-gray-200 rounded-[20px] px-4 py-1.5 flex items-center mb-0.5 shadow-sm">
                        <span className="text-gray-400 text-[15px]">iMessage</span>
                    </div>
                    <div className="flex gap-3 mb-1.5 items-center text-rose-400 mr-2 cursor-pointer">
                        <Mic size={24} strokeWidth={1.5} />
                    </div>
                </div>

                {/* Home indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[130px] h-[5px] bg-black rounded-full z-30"></div>
            </div>
        </div>
    );
};

export default Tier1Template2;

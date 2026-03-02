import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Music, Play, Pause } from 'lucide-react';
import { useCheckout } from '../CheckoutContext';

const MusicSelection = () => {
    const { formData, updateFormData } = useCheckout();
    const [musicList, setMusicList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playingId, setPlayingId] = useState(null);
    const audioRef = useRef(null);

    useEffect(() => {
        const fetchMusic = async () => {
            setLoading(true);
            try {
                const musicRef = collection(db, 'music');
                const q = query(musicRef, orderBy('number', 'asc'));
                const snapshot = await getDocs(q);
                const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMusicList(list);
            } catch (error) {
                console.error("Error fetching music:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMusic();

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    const togglePlay = (e, music) => {
        e.preventDefault();
        e.stopPropagation();

        if (playingId === music.id) {
            audioRef.current.pause();
            setPlayingId(null);
        } else {
            if (audioRef.current) {
                audioRef.current.src = music.url;
                audioRef.current.play().catch(err => console.error("Playback error:", err));
                setPlayingId(music.id);
            }
        }
    };

    const handleSelect = (musicUrl) => {
        updateFormData({ musicUrl });
    };

    if (loading) {
        return (
            <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                <Music size={16} className="animate-pulse" /> กำลังโหลดคลังเพลง...
            </div>
        );
    }

    if (musicList.length === 0) {
        return null; // Don't show if no music available
    }

    return (
        <div className="mt-6 pt-6 border-t border-gray-100">
            <audio
                ref={audioRef}
                onEnded={() => setPlayingId(null)}
                className="hidden"
            />

            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#E8A08A]/10 flex items-center justify-center text-[#E8A08A]">
                    <Music size={14} />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-800">เลือกเพลงประกอบ</h3>
                    <p className="text-xs text-gray-500">เพลงพื้นหลังสำหรับเรื่องราวของคุณ</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
                {/* Option for No Music */}
                <button
                    type="button"
                    onClick={() => handleSelect('')}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left ${!formData.musicUrl
                        ? 'border-[#E8A08A] bg-[#E8A08A]/5'
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                        }`}
                >
                    <span className={`text-sm ${!formData.musicUrl ? 'font-medium text-[#1A3C40]' : 'text-gray-600'}`}>ไม่มีเพลงประกอบ</span>
                    {!formData.musicUrl && (
                        <div className="w-4 h-4 rounded-full bg-[#E8A08A] flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                    )}
                </button>

                {/* Music List */}
                {musicList.map((music) => {
                    const isSelected = formData.musicUrl === music.url;
                    return (
                        <div
                            key={music.id}
                            className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${isSelected
                                ? 'border-[#E8A08A] bg-[#E8A08A]/5'
                                : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                }`}
                            onClick={() => handleSelect(music.url)}
                        >
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={(e) => togglePlay(e, music)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${playingId === music.id
                                        ? 'bg-[#E8A08A] text-white shadow-sm'
                                        : 'bg-white border border-gray-200 text-gray-400 hover:text-[#1A3C40] hover:border-[#1A3C40]'
                                        }`}
                                >
                                    {playingId === music.id ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
                                </button>
                                <span className={`text-sm ${isSelected ? 'font-medium text-[#1A3C40]' : 'text-gray-600'}`}>
                                    เพลงที่ {music.number || 1} : {music.name}
                                </span>
                            </div>

                            {isSelected && (
                                <div className="w-4 h-4 rounded-full bg-[#E8A08A] flex items-center justify-center mr-1 text-white">
                                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MusicSelection;

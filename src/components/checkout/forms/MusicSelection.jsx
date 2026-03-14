import React, { useState, useEffect, useRef, useMemo } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Music, Play, Pause, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useCheckout } from '../CheckoutContext';

const MusicSelection = () => {
    const { formData, updateFormData } = useCheckout();
    const [musicList, setMusicList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playingId, setPlayingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
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

    // Filter music based on search query
    const filteredMusic = useMemo(() => {
        if (!searchQuery.trim()) return musicList;
        const query = searchQuery.toLowerCase();
        return musicList.filter(music => 
            music.name?.toLowerCase().includes(query) ||
            String(music.number).includes(query)
        );
    }, [musicList, searchQuery]);

    // Show only first 5 songs when collapsed, or all when expanded/searching
    const displayedMusic = useMemo(() => {
        if (searchQuery.trim() || isExpanded) return filteredMusic;
        return filteredMusic.slice(0, 5);
    }, [filteredMusic, isExpanded, searchQuery]);

    const hasMore = filteredMusic.length > 5;

    if (loading) {
        return (
            <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                <Music size={16} className="animate-pulse" /> กำลังโหลดคลังเพลง...
            </div>
        );
    }

    if (musicList.length === 0) {
        return null;
    }

    const selectedMusic = musicList.find(m => m.url === formData.musicUrl);

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
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-800">เลือกเพลงประกอบ</h3>
                    <p className="text-xs text-gray-500">เพลงพื้นหลังสำหรับเรื่องราวของคุณ</p>
                </div>
            </div>

            {/* Search Bar
            <div className="relative mb-3">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="ค้นหาเพลง..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8A08A]/30 focus:border-[#E8A08A] transition-all"
                />
            </div> */}

            {/* Selected Music Preview */}
            {/* {selectedMusic && (
                <div className="mb-3 p-3 bg-[#E8A08A]/10 rounded-xl border border-[#E8A08A]/20">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#E8A08A] flex items-center justify-center">
                            <Music size={12} className="text-white" />
                        </div>
                        <span className="text-sm font-medium text-[#1A3C40] truncate">
                            เพลงที่ {selectedMusic.number}: {selectedMusic.name}
                        </span>
                    </div>
                </div>
            )} */}

            {/* Music List */}
            <div className={`space-y-1.5 ${!searchQuery && !isExpanded ? 'max-h-[280px]' : 'max-h-[400px]'} overflow-y-auto pr-1 custom-scrollbar`}>
                {/* Option for No Music */}
                <button
                    type="button"
                    onClick={() => handleSelect('')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${!formData.musicUrl
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

                {/* Music Items */}
                {displayedMusic.map((music) => {
                    const isSelected = formData.musicUrl === music.url;
                    const isPlaying = playingId === music.id;
                    return (
                        <div
                            key={music.id}
                            className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer ${isSelected
                                ? 'border-[#E8A08A] bg-[#E8A08A]/5'
                                : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                }`}
                            onClick={() => handleSelect(music.url)}
                        >
                            <button
                                onClick={(e) => togglePlay(e, music)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isPlaying
                                    ? 'bg-[#E8A08A] text-white shadow-sm'
                                    : 'bg-white border border-gray-200 text-gray-400 hover:text-[#1A3C40] hover:border-[#1A3C40]'
                                    }`}
                            >
                                {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
                            </button>
                            <span className={`text-sm flex-1 truncate ${isSelected ? 'font-medium text-[#1A3C40]' : 'text-gray-600'}`}>
                                {music.number}. {music.name}
                            </span>
                            {isSelected && (
                                <div className="w-4 h-4 rounded-full bg-[#E8A08A] flex items-center justify-center text-white shrink-0">
                                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Show More/Less Button */}
            {hasMore && !searchQuery && (
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full mt-2 py-2 text-xs text-[#E8A08A] font-medium hover:text-[#1A3C40] transition-colors flex items-center justify-center gap-1"
                >
                    {isExpanded ? (
                        <>แสดงน้อยลง <ChevronUp size={14} /></>
                    ) : (
                        <>ดูเพลงทั้งหมด ({filteredMusic.length}) <ChevronDown size={14} /></>
                    )}
                </button>
            )}

            {/* No results message */}
            {searchQuery && filteredMusic.length === 0 && (
                <div className="text-center py-4 text-sm text-gray-400">
                    ไม่พบเพลงที่ตรงกับ "{searchQuery}"
                </div>
            )}
        </div>
    );
};

export default MusicSelection;

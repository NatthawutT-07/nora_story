import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../../firebase';
import { Music, Upload, Trash2, Edit2, Play, Pause, X, Save, Plus } from 'lucide-react';

const MusicManager = () => {
    const [musicList, setMusicList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // New Music State
    const [newFile, setNewFile] = useState(null);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState(1);

    // Edit State
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editNumber, setEditNumber] = useState(1);

    // Audio Player State
    const [playingId, setPlayingId] = useState(null);
    const audioRef = useRef(null);

    const fetchMusic = async () => {
        setLoading(true);
        try {
            const musicRef = collection(db, 'music');
            const q = query(musicRef, orderBy('number', 'asc'));
            const snapshot = await getDocs(q);
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMusicList(list);

            // Auto-increment new number based on existing
            if (list.length > 0) {
                const maxNum = Math.max(...list.map(m => m.number || 0));
                setNewNumber(maxNum + 1);
            }
        } catch (error) {
            console.error("Error fetching music:", error);
            alert("ดึงข้อมูลเพลงล้มเหลว");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMusic();
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('audio/')) {
                alert('กรุณาเลือกไฟล์เสียง (mp3, wav) เท่านั้น');
                return;
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                alert('ไฟล์เสียงต้องมีขนาดไม่เกิน 10MB');
                return;
            }
            setNewFile(file);
            if (!newName) {
                // Remove extension for default name
                setNewName(file.name.replace(/\.[^/.]+$/, ""));
            }
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!newFile || !newName) {
            alert('กรุณาเลือกไฟล์และตั้งชื่อเพลง');
            return;
        }

        setUploading(true);
        try {
            // 1. Upload to Storage
            const fileExt = newFile.name.split('.').pop();
            const fileName = `music_${Date.now()}.${fileExt}`;
            const storageRef = ref(storage, `music/${fileName}`);
            await uploadBytes(storageRef, newFile);
            const url = await getDownloadURL(storageRef);

            // 2. Save to Firestore
            await addDoc(collection(db, 'music'), {
                name: newName,
                number: parseInt(newNumber, 10),
                url: url,
                fileName: fileName,
                created_at: serverTimestamp()
            });

            // 3. Reset and Refresh
            setNewFile(null);
            setNewName('');
            setNewNumber(prev => prev + 1);
            // Reset file input
            const fileInput = document.getElementById('music-upload-input');
            if (fileInput) fileInput.value = '';

            await fetchMusic();
            alert('อัปโหลดเพลงสำเร็จ!');
        } catch (error) {
            console.error("Upload error:", error);
            alert('เกิดข้อผิดพลาดในการอัปโหลด: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (music) => {
        if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบเพลง "${music.name}"?`)) return;

        try {
            // Stop playing if it's the deleted song
            if (playingId === music.id) {
                audioRef.current.pause();
                setPlayingId(null);
            }

            // 1. Delete from Firestore
            await deleteDoc(doc(db, 'music', music.id));

            // 2. Delete from Storage (if applicable)
            if (music.fileName) {
                const storageRef = ref(storage, `music/${music.fileName}`);
                try {
                    await deleteObject(storageRef);
                } catch (storageErr) {
                    console.error("Storage delete error (might be external URL):", storageErr);
                }
            }

            await fetchMusic();
        } catch (error) {
            console.error("Delete error:", error);
            alert('ลบข้อมูลไม่สำเร็จ');
        }
    };

    const startEdit = (music) => {
        setEditingId(music.id);
        setEditName(music.name);
        setEditNumber(music.number || 1);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName('');
        setEditNumber(1);
    };

    const saveEdit = async (id) => {
        if (!editName.trim()) {
            alert('กรุณาระบุชื่อเพลง');
            return;
        }

        try {
            const musicRef = doc(db, 'music', id);
            await updateDoc(musicRef, {
                name: editName,
                number: parseInt(editNumber, 10)
            });

            setEditingId(null);
            await fetchMusic();
        } catch (error) {
            console.error("Edit error:", error);
            alert('บันทึกการแก้ไขไม่สำเร็จ');
        }
    };

    const togglePlay = (music) => {
        if (playingId === music.id) {
            audioRef.current.pause();
            setPlayingId(null);
        } else {
            if (audioRef.current) {
                audioRef.current.src = music.url;
                audioRef.current.play().catch(e => console.error("Playback failed", e));
                setPlayingId(music.id);
            }
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Hidden Audio Player */}
            <audio
                ref={audioRef}
                onEnded={() => setPlayingId(null)}
                className="hidden"
            />

            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1A3C40]/10 rounded-lg flex items-center justify-center text-[#1A3C40]">
                        <Music size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">จัดการเพลง (Background Music)</h2>
                        <p className="text-sm text-gray-500">เพิ่ม ลบ หรือแก้ไขเพลงประกอบสำหรับแพ็กเกจ</p>
                    </div>
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* UPOLAD SECTION */}
                <div className="lg:col-span-1 border border-gray-100 rounded-xl p-5 bg-gray-50/30 self-start">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Upload size={18} className="text-[#E8A08A]" /> อัปโหลดเพลงใหม่
                    </h3>

                    <form onSubmit={handleUpload} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">ไฟล์เสียง (.mp3)</label>
                            <input
                                id="music-upload-input"
                                type="file"
                                accept="audio/*"
                                onChange={handleFileSelect}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1A3C40]/5 file:text-[#1A3C40] hover:file:bg-[#1A3C40]/10 cursor-pointer"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">หมายเลขลำดับ</label>
                            <input
                                type="number"
                                min="1"
                                value={newNumber}
                                onChange={(e) => setNewNumber(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#E8A08A] text-sm"
                                placeholder="เช่น 1, 2, 3"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">ชื่อเพลงแสดงให้ลูกค้าเห็น</label>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#E8A08A] text-sm"
                                placeholder="เช่น Classical Piano"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!newFile || uploading}
                            className={`w-full py-2.5 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-colors ${!newFile || uploading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#1A3C40] hover:bg-[#1A3C40]/90'
                                }`}
                        >
                            {uploading ? (
                                <>กำลังอัปโหลด...</>
                            ) : (
                                <><Plus size={18} /> เพิ่มเพลง</>
                            )}
                        </button>
                    </form>
                </div>

                {/* LIST SECTION */}
                <div className="lg:col-span-2">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center justify-between">
                        รายการเพลงทั้งหมด
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {musicList.length} รายการ
                        </span>
                    </h3>

                    {loading ? (
                        <div className="text-center py-10 text-gray-400">กำลังโหลดข้อมูล...</div>
                    ) : musicList.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl text-gray-400">
                            ยังไม่มีเพลงในระบบ กรุณาอัปโหลด
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {musicList.map((music) => (
                                <div key={music.id} className="flex items-center justify-between p-3 sm:p-4 border border-gray-100 rounded-xl hover:border-[#E8A08A]/30 hover:bg-orange-50/30 transition-all group">

                                    {/* Play/Pause Button */}
                                    <button
                                        onClick={() => togglePlay(music)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mr-4 transition-colors ${playingId === music.id
                                                ? 'bg-[#E8A08A] text-white shadow-md'
                                                : 'bg-gray-100 text-gray-600 hover:bg-[#1A3C40] hover:text-white'
                                            }`}
                                    >
                                        {playingId === music.id ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
                                    </button>

                                    {/* Content (Edit vs View) */}
                                    {editingId === music.id ? (
                                        <div className="flex-1 flex flex-col sm:flex-row gap-2 mr-4">
                                            <div className="w-20">
                                                <input
                                                    type="number"
                                                    value={editNumber}
                                                    onChange={(e) => setEditNumber(e.target.value)}
                                                    className="w-full text-sm border border-gray-300 rounded px-2 py-1 outline-none"
                                                    placeholder="ลำดับ"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="w-full text-sm border border-gray-300 rounded px-2 py-1 outline-none"
                                                    placeholder="ชื่อเพลง"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 min-w-0 pr-4">
                                            <p className="text-sm font-semibold text-gray-800 truncate">
                                                <span className="text-xs text-gray-400 font-normal mr-2">#{music.number}</span>
                                                {music.name}
                                            </p>
                                            <p className="text-[10px] text-gray-400 truncate mt-0.5" title={music.url}>
                                                {music.fileName || 'External URL'}
                                            </p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        {editingId === music.id ? (
                                            <>
                                                <button onClick={() => saveEdit(music.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Save">
                                                    <Save size={16} />
                                                </button>
                                                <button onClick={cancelEdit} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded" title="Cancel">
                                                    <X size={16} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => startEdit(music)}
                                                    className="p-1.5 text-gray-400 hover:text-[#1A3C40] hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(music)}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MusicManager;

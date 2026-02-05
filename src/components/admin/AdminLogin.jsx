import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const ADMIN_PASSWORD = '123456';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate a small delay for UX
        setTimeout(() => {
            if (password === ADMIN_PASSWORD) {
                // Store auth state in sessionStorage
                sessionStorage.setItem('adminAuth', 'true');
                navigate('/jimdev/dashboard');
            } else {
                setError('รหัสผ่านไม่ถูกต้อง');
                setIsLoading(false);
            }
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0F2A2E] to-[#1A3C40] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo Area */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#E8A08A] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-playfair text-white mb-2">Admin Access</h1>
                    <p className="text-white/50 text-sm">NoraStory Management System</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-white/70 text-sm mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#E8A08A]/50 focus:border-transparent transition-all"
                                    placeholder="Enter admin password"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 flex items-center gap-2 text-red-400 text-sm bg-red-400/10 px-4 py-3 rounded-xl">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !password}
                            className="w-full bg-[#E8A08A] hover:bg-[#d89279] text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Verifying...
                                </>
                            ) : (
                                'เข้าสู่ระบบ'
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-white/30 text-xs mt-6">
                    Protected Area • Authorized Personnel Only
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;

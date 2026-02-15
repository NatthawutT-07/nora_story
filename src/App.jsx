import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { TIERS } from './data/tierData';
import Hero from './components/Hero';
import Pricing from './components/Pricing';
import CheckoutModal from './components/checkout/CheckoutModal';
import InteractiveDemos from './components/InteractiveDemos';
import DigitalCover from './components/DigitalCover';
import QRCodeDemo from './components/QRCodeDemo';
import TierGallery from './components/TierGallery';
import StoryPage from './components/StoryPage';

// Admin
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

// Templates
import Tier1Template1 from './components/templates/tier1/Tier1Template1';
import Tier1Template2 from './components/templates/tier1/Tier1Template2';
import Tier1Template3 from './components/templates/tier1/Tier1Template3';

import Tier2Template1 from './components/templates/tier2/Tier2Template1';
import Tier2Template2 from './components/templates/tier2/Tier2Template2';
import Tier2Template3 from './components/templates/tier2/Tier2Template3';

import Tier3Template1 from './components/templates/tier3/Tier3Template1';
import Tier3Template2 from './components/templates/tier3/Tier3Template2';
import Tier3Template3 from './components/templates/tier3/Tier3Template3';

import Tier4Template1 from './components/templates/tier4/Tier4Template1';
import ExtensionPage from './components/ExtensionPage';

// Demo Wrapper Component
const DemoWrapper = ({ children }) => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-[100] bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-md text-sm font-medium transition-all flex items-center gap-2"
      >
        ← กลับ
      </button>
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 right-4 z-[100] bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-md text-sm font-medium transition-all"
      >
        ✕ ปิด
      </button>
      {children}
    </div>
  );
};

function MainPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTier, setSelectedTier] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const checkoutId = searchParams.get('checkout');
    if (checkoutId) {
      const tier = TIERS.find(t => t.id === checkoutId);
      if (tier) {
        setSelectedTier(tier);
        setIsModalOpen(true);
        // Clean up URL
        navigate('/', { replace: true });
      }
    }
  }, [location, navigate]);

  const handleSelectTier = (tier) => {
    setSelectedTier(tier);
    setIsModalOpen(true);
  };

  const handleViewDemos = (tierId) => {
    navigate('/gallery', { state: { tierId: `t${tierId}` } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTier(null), 300); // Clear after animation
  };



  return (
    <div className="font-sans antialiased bg-white min-h-screen text-[#1A3C40] selection:bg-[#E8A08A] selection:text-white">
      <Hero />
      <InteractiveDemos />
      <DigitalCover />
      <QRCodeDemo />
      <Pricing onSelectTier={handleSelectTier} onViewDemos={handleViewDemos} />
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        tier={selectedTier}
      />

      {/* Footer */}
      <footer className="bg-gradient-to-b from-[#0F2A2E] to-[#051113] text-white py-6 sm:py-8 px-4" id="contact">
        <div className="max-w-5xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-4 sm:gap-12 mb-6">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-2 lg:col-span-3 text-center">
              <h3 className="font-playfair text-2xl sm:text-3xl mb-3">Nora Story</h3>
              <p className="text-white/50 text-xs sm:text-sm leading-relaxed max-w-xs sm:max-w-none mx-auto">
                เปลี่ยนความทรงจำของคุณให้กลายเป็นเรื่องราวที่อยู่ตลอดไป
              </p>
            </div>

            {/* Quick Links */}


            {/* Contact */}
            {/* <div className="text-right sm:text-right lg:text-right pr-4 sm:pr-0">
              <h4 className="text-white/80 font-medium mb-4">ติดต่อเรา</h4>
              <div className="flex justify-end gap-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1877F2] transition-all duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                <a href="https://line.me" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#06C755] transition-all duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" /></svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] transition-all duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </a>
              </div>
            </div> */}
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10  text-center">
            <p className="text-white/30 text-xs sm:text-sm">© 2026 Nora Story. Made with for lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/gallery" element={<TierGallery />} />

      {/* Tier 1 Demos */}
      <Route path="/demo/t1/1" element={<DemoWrapper><Tier1Template1 /></DemoWrapper>} />
      <Route path="/demo/t1/2" element={<DemoWrapper><Tier1Template2 /></DemoWrapper>} />
      <Route path="/demo/t1/3" element={<DemoWrapper><Tier1Template3 /></DemoWrapper>} />

      {/* Tier 2 Demos */}
      <Route path="/demo/t2/1" element={<DemoWrapper><Tier2Template1 /></DemoWrapper>} />
      <Route path="/demo/t2/2" element={<DemoWrapper><Tier2Template2 /></DemoWrapper>} />
      <Route path="/demo/t2/3" element={<DemoWrapper><Tier2Template3 /></DemoWrapper>} />

      {/* Tier 3 Demos */}
      <Route path="/demo/t3/1" element={<DemoWrapper><Tier3Template1 /></DemoWrapper>} />
      <Route path="/demo/t3/2" element={<DemoWrapper><Tier3Template2 /></DemoWrapper>} />
      <Route path="/demo/t3/3" element={<DemoWrapper><Tier3Template3 /></DemoWrapper>} />

      {/* Tier 4 Demos */}
      <Route path="/demo/t4/1" element={<DemoWrapper><Tier4Template1 /></DemoWrapper>} />

      {/* Admin Routes */}
      <Route path="/jimdev" element={<AdminLogin />} />
      <Route path="/jimdev/dashboard" element={<AdminDashboard />} />

      {/* Dynamic Story Page (MUST be last - catch-all) */}
      <Route path="/extend/:id" element={<ExtensionPage />} />
      <Route path="/:id" element={<StoryPage />} />
    </Routes>
  )
}

export default App

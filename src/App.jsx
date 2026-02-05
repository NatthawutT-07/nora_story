import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Hero from './components/Hero';
import Pricing from './components/Pricing';
import CheckoutModal from './components/CheckoutModal';
import InteractiveDemos from './components/InteractiveDemos';
import DigitalCover from './components/DigitalCover';
import TierGallery from './components/TierGallery';
import TemplatePlayground from './components/TemplatePlayground';

// Admin
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

// Templates
// Templates
import Tier1Template1 from './components/templates/tier1/Tier1Template1';
import Tier1Template2 from './components/templates/tier1/Tier1Template2';
import Tier1Template3 from './components/templates/tier1/Tier1Template3';
import Tier1Template4 from './components/templates/tier1/Tier1Template4';
import Tier1Template5 from './components/templates/tier1/Tier1Template5';
import Tier1Template6 from './components/templates/tier1/Tier1Template6';
import Tier1Template7 from './components/templates/tier1/Tier1Template7';

import Tier2Template1 from './components/templates/tier2/Tier2Template1';
import Tier2Template2 from './components/templates/tier2/Tier2Template2';
import Tier2Template3 from './components/templates/tier2/Tier2Template3';
import Tier2Template4 from './components/templates/tier2/Tier2Template4';
import Tier2Template5 from './components/templates/tier2/Tier2Template5';
import Tier2Template6 from './components/templates/tier2/Tier2Template6';

import Tier3Template1 from './components/templates/tier3/Tier3Template1';
import Tier3Template2 from './components/templates/tier3/Tier3Template2';
import Tier3Template3 from './components/templates/tier3/Tier3Template3';
import Tier3Template4 from './components/templates/tier3/Tier3Template4';
import Tier3Template5 from './components/templates/tier3/Tier3Template5';
import Tier3Template6 from './components/templates/tier3/Tier3Template6';

import Tier4Template1 from './components/templates/tier4/Tier4Template1';
import Tier4Template2 from './components/templates/tier4/Tier4Template2';
import Tier4Template3 from './components/templates/tier4/Tier4Template3';
import Tier4Template4 from './components/templates/tier4/Tier4Template4';
import Tier4Template5 from './components/templates/tier4/Tier4Template5';
import Tier4Template6 from './components/templates/tier4/Tier4Template6';

function MainPage() {
  const [selectedTier, setSelectedTier] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [galleryTierId, setGalleryTierId] = useState(null);
  const [selectedDemo, setSelectedDemo] = useState(null);

  const handleSelectTier = (tier) => {
    setSelectedTier(tier);
    setIsModalOpen(true);
  };

  const handleViewDemos = (tierId) => {
    setGalleryTierId(`t${tierId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTier(null), 300); // Clear after animation
  };

  // --- Dynamic Demo Rendering ---
  const renderDemo = () => {
    const { tier, id } = selectedDemo;
    const key = `${tier}-${id}`;

    // Map keys to components
    const demos = {
      't1-1': <Tier1Template1 />, 't1-2': <Tier1Template2 />, 't1-3': <Tier1Template3 />,
      't1-4': <Tier1Template4 />, 't1-5': <Tier1Template5 />, 't1-6': <Tier1Template6 />, 't1-7': <Tier1Template7 />,
      't2-1': <Tier2Template1 />, 't2-2': <Tier2Template2 />, 't2-3': <Tier2Template3 />,
      't2-4': <Tier2Template4 />, 't2-5': <Tier2Template5 />, 't2-6': <Tier2Template6 />,
      't3-1': <Tier3Template1 />, 't3-2': <Tier3Template2 />, 't3-3': <Tier3Template3 />,
      't3-4': <Tier3Template4 />, 't3-5': <Tier3Template5 />, 't3-6': <Tier3Template6 />,
      't4-1': <Tier4Template1 />, 't4-2': <Tier4Template2 />, 't4-3': <Tier4Template3 />,
      't4-4': <Tier4Template4 />, 't4-5': <Tier4Template5 />, 't4-6': <Tier4Template6 />,
    };

    return (
      <div className="relative z-50 bg-white min-h-screen">
        {/* Floating Close Button */}
        <button
          onClick={() => setSelectedDemo(null)}
          className="fixed top-4 right-4 z-[100] bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-md text-sm font-medium transition-all"
        >
          ✕ Close Demo
        </button>
        {demos[key] || <div className="p-10 text-center">Demo Not Found</div>}
      </div>
    );
  };

  // 1. Show Demo if active
  if (selectedDemo) {
    return renderDemo();
  }

  // 2. Show Gallery if active
  if (galleryTierId) {
    return (
      <TierGallery
        tierIdProp={galleryTierId}
        onBack={() => setGalleryTierId(null)}
        onSelectDemo={(demoId) => setSelectedDemo({ tier: galleryTierId, id: demoId })}
      />
    );
  }

  return (
    <div className="font-sans antialiased bg-white min-h-screen text-[#1A3C40] selection:bg-[#E8A08A] selection:text-white">
      <Hero />
      <InteractiveDemos />
      <DigitalCover />
      <Pricing onSelectTier={handleSelectTier} onViewDemos={handleViewDemos} />
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        tier={selectedTier}
      />

      {/* Footer */}
      <footer className="bg-gradient-to-b from-[#0F2A2E] to-[#051113] text-white py-16 px-4" id="contact">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="font-playfair text-3xl mb-4">NoraStory</h3>
          <p className="text-white/60 mb-8 max-w-md mx-auto">เปลี่ยนความทรงจำของคุณให้กลายเป็นเรื่องราวที่อยู่ตลอดไป</p>

          <div className="flex justify-center gap-6 mb-8">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E8A08A] hover:scale-110 transition-all duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>
            <a href="https://line.me" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#06C755] hover:scale-110 transition-all duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" /></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:scale-110 transition-all duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
            </a>
          </div>

          <div className="border-t border-white/10 pt-8">
            <p className="text-white/40 text-sm">&copy; 2025 NoraStory. Made with 💖 for lovers.</p>
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
      <Route path="/gallery/:tierId" element={<TierGallery />} />
      <Route path="/create" element={<TemplatePlayground />} />

      {/* Tier 1 Demos */}
      <Route path="/demo/t1/1" element={<Tier1Template1 />} />
      <Route path="/demo/t1/2" element={<Tier1Template2 />} />
      <Route path="/demo/t1/3" element={<Tier1Template3 />} />
      <Route path="/demo/t1/4" element={<Tier1Template4 />} />
      <Route path="/demo/t1/5" element={<Tier1Template5 />} />
      <Route path="/demo/t1/6" element={<Tier1Template6 />} />
      <Route path="/demo/t1/7" element={<Tier1Template7 />} />

      {/* Tier 2 Demos */}
      <Route path="/demo/t2/1" element={<Tier2Template1 />} />
      <Route path="/demo/t2/2" element={<Tier2Template2 />} />
      <Route path="/demo/t2/3" element={<Tier2Template3 />} />
      <Route path="/demo/t2/4" element={<Tier2Template4 />} />
      <Route path="/demo/t2/5" element={<Tier2Template5 />} />
      <Route path="/demo/t2/6" element={<Tier2Template6 />} />

      {/* Tier 3 Demos */}
      <Route path="/demo/t3/1" element={<Tier3Template1 />} />
      <Route path="/demo/t3/2" element={<Tier3Template2 />} />
      <Route path="/demo/t3/3" element={<Tier3Template3 />} />
      <Route path="/demo/t3/4" element={<Tier3Template4 />} />
      <Route path="/demo/t3/5" element={<Tier3Template5 />} />
      <Route path="/demo/t3/6" element={<Tier3Template6 />} />

      {/* Tier 4 Demos */}
      <Route path="/demo/t4/1" element={<Tier4Template1 />} />
      <Route path="/demo/t4/2" element={<Tier4Template2 />} />
      <Route path="/demo/t4/3" element={<Tier4Template3 />} />
      <Route path="/demo/t4/4" element={<Tier4Template4 />} />
      <Route path="/demo/t4/5" element={<Tier4Template5 />} />
      <Route path="/demo/t4/6" element={<Tier4Template6 />} />

      {/* Admin Routes */}
      <Route path="/jimdev" element={<AdminLogin />} />
      <Route path="/jimdev/dashboard" element={<AdminDashboard />} />
    </Routes>
  )
}

export default App

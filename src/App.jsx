import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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

import ExtensionPage from './components/ExtensionPage';

// Template map for dynamic rendering
const TEMPLATE_COMPONENTS = {
  't1-1': Tier1Template1,
  't1-2': Tier1Template2,
  't1-3': Tier1Template3,
  't2-1': Tier2Template1,
  't2-2': Tier2Template2,
  't2-3': Tier2Template3,
  't3-1': Tier3Template1,
  't3-2': Tier3Template2,
  't3-3': Tier3Template3,
};

function MainPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTier, setSelectedTier] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Gallery & Demo overlay state
  const [showGallery, setShowGallery] = useState(false);
  const [galleryTierId, setGalleryTierId] = useState('t1');
  const [showDemo, setShowDemo] = useState(false);
  const [demoTemplateId, setDemoTemplateId] = useState(null);

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
    setGalleryTierId(`t${tierId}`);
    setShowGallery(true);
    setShowDemo(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTier(null), 300);
  };

  const handleSelectDemo = (tierId, numericId) => {
    setDemoTemplateId(`${tierId}-${numericId}`);
    setShowDemo(true);
  };

  const handleCloseDemo = () => {
    setShowDemo(false);
    setDemoTemplateId(null);
  };

  const handleCloseGallery = () => {
    setShowGallery(false);
    setShowDemo(false);
    setDemoTemplateId(null);
  };

  const DemoComponent = demoTemplateId ? TEMPLATE_COMPONENTS[demoTemplateId] : null;

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

      {/* Gallery Overlay */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] bg-white overflow-auto"
          >
            <TierGallery
              tierIdProp={galleryTierId}
              onBack={handleCloseGallery}
              onSelectDemo={handleSelectDemo}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Overlay */}
      <AnimatePresence>
        {showDemo && DemoComponent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[300] bg-white overflow-auto"
          >
            <div className="relative min-h-screen">
              <button
                onClick={handleCloseDemo}
                className="fixed top-4 left-4 z-[100] bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-md text-sm font-medium transition-all flex items-center gap-2"
              >
                ← กลับ
              </button>
              <button
                onClick={handleCloseGallery}
                className="fixed top-4 right-4 z-[100] bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-md text-sm font-medium transition-all"
              >
                ✕ ปิด
              </button>
              <DemoComponent />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-[#0F2A2E] to-[#051113] text-white py-10 sm:py-14 px-5" id="contact">
        <div className="max-w-7xl mx-auto">

          {/* Desktop: side-by-side | Mobile: stacked center */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8 sm:gap-12 mb-8">

            {/* Brand */}
            <div className="text-center sm:text-left">
              <h3 className="font-playfair text-2xl sm:text-3xl mb-2">Nora Story</h3>
              <p className="text-white/50 text-xs sm:text-sm leading-relaxed max-w-[260px] mx-auto sm:mx-0">
                เปลี่ยนความทรงจำของคุณให้กลายเป็น<br className="hidden sm:inline" />เรื่องราวที่อยู่ตลอดไป
              </p>
            </div>

            {/* Contact */}
            <div className="text-center sm:text-right">
              <h4 className="text-white/80 font-medium text-sm mb-3">ติดต่อเรา</h4>
              <div className="flex flex-col items-center sm:items-end gap-2.5">
                <a href="mailto:norastory26@gmail.com" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  norastory26@gmail.com
                </a>
                <a href="https://line.me/ti/p/-" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596a.626.626 0 01-.71-.219l-2.442-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595a.62.62 0 01.69.221l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                  </svg>
                  LINE: -
                </a>
              </div>
            </div>
          </div>

          {/* Divider + Copyright */}
          <div className="border-t border-white/10 pt-5 text-center">
            <p className="text-white/30 text-[11px] sm:text-xs tracking-wide">© 2026 Nora Story · Made with ♥ for lovers</p>
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

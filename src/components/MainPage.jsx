import { useState, useEffect, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { TIERS } from '../data/tierData';
import { getTemplateComponent } from '../lib/templates';

import Hero from './Hero';
import Pricing from './Pricing';
import CheckoutModal from './checkout/CheckoutModal';
import InteractiveDemos from './InteractiveDemos';
import DigitalCover from './DigitalCover';
import QRCodeDemo from './QRCodeDemo';
import TierGallery from './TierGallery';
import LoadingScreen from './ui/LoadingScreen';

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

  // Random Music for Demo
  const [demoMusicList, setDemoMusicList] = useState([]);
  const [currentDemoMusic, setCurrentDemoMusic] = useState(null);

  // Fetch Music for Demos
  useEffect(() => {
    const fetchDemoMusic = async () => {
      try {
        const musicRef = collection(db, 'music');
        const q = query(musicRef, limit(10));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => doc.data().url);
        if (list.length > 0) {
          setDemoMusicList(list);
        }
      } catch (error) {
        console.error("Error fetching demo music:", error);
      }
    };
    fetchDemoMusic();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const checkoutId = searchParams.get('checkout');
    if (checkoutId) {
      const tier = TIERS.find(t => t.id === checkoutId);
      if (tier) {
        setSelectedTier(tier);
        setIsModalOpen(true);
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
    if (demoMusicList.length > 0) {
      const randomIndex = Math.floor(Math.random() * demoMusicList.length);
      setCurrentDemoMusic(demoMusicList[randomIndex]);
    }
    setShowDemo(true);
  };

  const handleCloseDemo = () => {
    setShowDemo(false);
    setDemoTemplateId(null);
    setCurrentDemoMusic(null);
  };

  const handleCloseGallery = () => {
    setShowGallery(false);
    setShowDemo(false);
    setDemoTemplateId(null);
  };

  const DemoComponent = getTemplateComponent(demoTemplateId);

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
              <Suspense fallback={<LoadingScreen message="กำลังโหลดตัวอย่าง..." />}>
                <DemoComponent isDemo={true} demoMusicUrl={currentDemoMusic} />
              </Suspense>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-[#0F2A2E] to-[#051113] text-white py-10 sm:py-14 px-5" id="contact">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8 sm:gap-12 mb-8">
            <div className="text-center sm:text-left">
              <h3 className="font-playfair text-2xl sm:text-3xl mb-2">Nora Story</h3>
              <p className="text-white/50 text-xs sm:text-sm leading-relaxed max-w-[260px] mx-auto sm:mx-0">
                เปลี่ยนความทรงจำของคุณให้กลายเป็น<br className="hidden sm:inline" />เรื่องราวที่อยู่ตลอดไป
              </p>
            </div>
            <div className="text-center sm:text-right">
              <h4 className="text-white/80 font-medium text-sm mb-3">ติดต่อเรา</h4>
              <div className="flex flex-col items-center sm:items-end gap-2.5">
                <a href="mailto:norastory26@gmail.com" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  norastory26@gmail.com
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-5 text-center">
            <p className="text-white/30 text-[11px] sm:text-xs tracking-wide">© 2026 Nora Story · Made with ♥ for lovers</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainPage;

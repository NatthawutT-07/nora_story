import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import LoadingScreen from './components/ui/LoadingScreen';

// Lazy load other page components
const StoryPage = lazy(() => import('./components/StoryPage'));
const ExtensionPage = lazy(() => import('./components/ExtensionPage'));
const AdminLogin = lazy(() => import('./components/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<MainPage />} />

        {/* Admin Routes */}
        <Route path="/jimdev" element={<AdminLogin />} />
        <Route path="/jimdev/dashboard" element={<AdminDashboard />} />

        {/* Dynamic Story Page (MUST be last - catch-all) */}
        <Route path="/extend/:id" element={<ExtensionPage />} />
        <Route path="/:id" element={<StoryPage />} />
      </Routes>
    </Suspense>
  )
}

export default App;

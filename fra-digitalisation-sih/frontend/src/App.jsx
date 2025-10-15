import { AnimatePresence } from 'framer-motion';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Sidebar from './communityUserDashboard/components/Sidebar';
import './index.css';
// import SignupForm from './components/SignupForm';
import { useEffect, useState } from 'react';
import CommunityUsersDashboard from './communityUserDashboard/components/CommunityUsersDashboard';
import Feedback from './communityUserDashboard/pages/Feedback';
import MyClaim from './communityUserDashboard/pages/MyClaim';
import Profile from './communityUserDashboard/pages/Profile';
import Schemes from './communityUserDashboard/pages/Schemes';
import VillageAssets from './communityUserDashboard/pages/VillageAssets';
import AuthModule from './components/AuthModule';
import BlockOfficerDashboard from './components/blockOfficer/BlockOfficerDashboard';
import DistrictOfficerDashboard from './components/districtOfficer/DistrictOfficerDashboard';
import FloatingChatbot from './components/FloatingChatbot';
import HomePage from './homepage/HomePage';
import GramSabhaDashboard from './pages/gramSabhaDashboard/Dashboard';
import SubdivisionDashboard from './pages/subdivisionDashboard/Dashboard';
import SubdivisionClaimManagement from './pages/subdivisionDashboard/ClaimManagement';
import SubdivisionLogin from './pages/SubdivisionLogin';

function AppContent() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // On desktop, sidebar should be open by default
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check if we're on the Gram Sabha Dashboard or Block Officer Dashboard route
  const isGramSabhaRoute = location.pathname === '/gram-sabha-dashboard';
  const isBlockOfficerRoute = location.pathname === '/block-officer-dashboard';
  const isDistrictOfficerRoute = location.pathname === '/district-officer-dashboard';
  const isSubdivisionRoute = location.pathname.startsWith('/subdivision-dashboard');
  const isSubdivisionLoginRoute = location.pathname === '/subdivision-login';
  const isAuthRoute = location.pathname === '/auth';
  const isHomeRoute = location.pathname === '/';

  // If we're on the Gram Sabha Dashboard, render it directly without the community layout
  if (isGramSabhaRoute) {
    return (
      <>
        <GramSabhaDashboard />
        <FloatingChatbot />
      </>
    );
  }

  // If we're on the Block Officer Dashboard, render it directly without the community layout
  if (isBlockOfficerRoute) {
    return (
      <>
        <BlockOfficerDashboard />
        <FloatingChatbot />
      </>
    );
  }

  // If we're on the District Officer Dashboard, render it directly without the community layout
  if (isDistrictOfficerRoute) {
    return (
      <>
        <DistrictOfficerDashboard />
        <FloatingChatbot />
      </>
    );
  }

  // If we're on the Subdivision Dashboard, render it directly without the community layout
  if (isSubdivisionRoute) {
    return (
      <>
        <SubdivisionDashboard />
        <FloatingChatbot />
      </>
    );
  }

  // If we're on the Subdivision Login, render it directly without the community layout
  if (isSubdivisionLoginRoute) {
    return (
      <>
        <SubdivisionLogin />
        <FloatingChatbot />
      </>
    );
  }

  // If we're on the Auth Page, render it directly without the community layout
  if (isAuthRoute) {
    return (
      <>
        <AuthModule />
        <FloatingChatbot />
      </>
    );
  }

  // If we're on the Home Page, render it directly without the community layout
  if (isHomeRoute) {
    return (
      <>
        <HomePage />
        <FloatingChatbot />
      </>
    );
  }

  // Otherwise, use the community users layout
  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            <div key={location.pathname}>
              <Routes location={location}>
                <Route path="/auth" element={<AuthModule />} />
                <Route path="/communityUsersDashboard" element={<CommunityUsersDashboard />} />
                <Route path="/my-claim" element={<MyClaim />} />
                <Route path="/village-assets" element={<VillageAssets />} />
                <Route path="/schemes" element={<Schemes />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/gram-sabha-dashboard" element={<GramSabhaDashboard />} />
                <Route path="/block-officer-dashboard" element={<BlockOfficerDashboard />} />
                <Route path="/district-officer-dashboard" element={<DistrictOfficerDashboard />} />
              </Routes>
            </div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Floating Chatbot */}
      <FloatingChatbot />
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  );
}

export default App;

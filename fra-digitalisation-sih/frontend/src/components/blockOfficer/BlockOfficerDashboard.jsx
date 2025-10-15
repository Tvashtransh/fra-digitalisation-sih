import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlockOfficerAnalyticsCards from './components/BlockOfficerAnalyticsCards';
import BlockOfficerAnalyticsCharts from './components/BlockOfficerAnalyticsCharts';
import BlockOfficerClaimsTable from './components/BlockOfficerClaimsTable';
import BlockOfficerClaimStatusPipeline from './components/BlockOfficerClaimStatusPipeline';
import BlockOfficerFooter from './components/BlockOfficerFooter';
import BlockOfficerGISMiniMap from './components/BlockOfficerGISMiniMap';
import BlockOfficerHeader from './components/BlockOfficerHeader';
import BlockOfficerQuickActions from './components/BlockOfficerQuickActions';
import BlockOfficerSidebar from './components/BlockOfficerSidebar';
import ClaimManagement from './pages/ClaimManagement';
import GISLandMapping from './pages/GISLandMapping';
import MessagesCommunication from './pages/MessagesCommunication';
import NotificationsTasks from './pages/NotificationsTasks';
import ReportsAnalytics from './pages/ReportsAnalytics';
import ResolutionsDocuments from './pages/ResolutionsDocuments';
import SettingsUserGuide from './pages/SettingsUserGuide';

const BlockOfficerDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/block-officer/profile', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setIsAuthenticated(true);
          } else {
            // Not authenticated, redirect to login
            navigate('/auth');
          }
        } else {
          // Not authenticated, redirect to login
          navigate('/auth');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    // On desktop, sidebar should be open by default
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePageChange = (page) => {
    setActivePage(page);
    // On mobile, close sidebar after navigation
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Analytics Cards */}
            <BlockOfficerAnalyticsCards />

            {/* Claim Status Pipeline */}
            <BlockOfficerClaimStatusPipeline
              onStatusFilter={handleStatusFilter}
            />

            {/* Quick Actions */}
            <BlockOfficerQuickActions
              onPageChange={handlePageChange}
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Claims Table */}
              <div className="lg:col-span-2">
                <BlockOfficerClaimsTable
                  statusFilter={statusFilter}
                  onPageChange={handlePageChange}
                />
              </div>

              {/* GIS Mini Map */}
              <div className="lg:col-span-1">
                <BlockOfficerGISMiniMap />
              </div>
            </div>

            {/* Analytics Charts */}
            <BlockOfficerAnalyticsCharts />
          </motion.div>
        );

      case 'claims':
      case 'claim-management':
        return <ClaimManagement />;

      case 'gis':
      case 'gis-land-mapping':
        return <GISLandMapping />;

      case 'resolutions':
        return <ResolutionsDocuments />;

      case 'reports':
        return <ReportsAnalytics />;

      case 'notifications':
        return <NotificationsTasks />;

      case 'messages':
        return <MessagesCommunication />;

      case 'settings':
        return <SettingsUserGuide />;

      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center h-64"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Page Under Development
              </h2>
              <p className="text-gray-600">
                This feature is currently being developed.
              </p>
            </div>
          </motion.div>
        );
    }
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#044e2b] mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Show dashboard only if authenticated
  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <BlockOfficerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onPageChange={handlePageChange}
        activePage={activePage}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <BlockOfficerHeader
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Page Content */}
        <main className="p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <BlockOfficerFooter />
      </div>
    </div>
  );
};

export default BlockOfficerDashboard;
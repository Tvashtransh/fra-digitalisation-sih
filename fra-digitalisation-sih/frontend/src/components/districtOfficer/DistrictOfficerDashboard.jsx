import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import DistrictOfficerFooter from './components/DistrictOfficerFooter';
import DistrictOfficerHeader from './components/DistrictOfficerHeader';
import DistrictOfficerSidebar from './components/DistrictOfficerSidebar';

// Import page components
import ApprovedByDistrict from './pages/ApprovedByDistrict';
import ClaimManagement from './pages/ClaimManagement';
import Dashboard from './pages/Dashboard';
import GISMappingMonitoring from './pages/GISMappingMonitoring';
import PendingAtDistrict from './pages/PendingAtDistrict';
import ReportsAnalytics from './pages/ReportsAnalytics';
import SearchClaim from './pages/SearchClaim';

const DistrictOfficerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

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
        return <Dashboard onPageChange={handlePageChange} />;

      case 'claim-management':
        return <ClaimManagement />;

      case 'pending-district':
        return <PendingAtDistrict />;

      case 'approved-district':
        return <ApprovedByDistrict />;

      case 'search-claim':
        return <SearchClaim />;

      case 'gis-mapping':
        return <GISMappingMonitoring />;

      case 'reports-analytics':
        return <ReportsAnalytics />;

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <DistrictOfficerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onPageChange={handlePageChange}
        activePage={activePage}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <DistrictOfficerHeader
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />

        {/* Page Content */}
        <main className="p-6 overflow-auto min-h-[calc(100vh-160px)]">
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
        <DistrictOfficerFooter />
      </div>
    </div>
  );
};

export default DistrictOfficerDashboard;
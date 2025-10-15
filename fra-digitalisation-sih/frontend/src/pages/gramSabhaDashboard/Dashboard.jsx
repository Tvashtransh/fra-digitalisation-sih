import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AnalyticsCards from '../../components/gramSabhaDashboard/AnalyticsCards';
import AnalyticsCharts from '../../components/gramSabhaDashboard/AnalyticsCharts';
import ClaimsTable from '../../components/gramSabhaDashboard/ClaimsTable';
import ClaimStatusPipeline from '../../components/gramSabhaDashboard/ClaimStatusPipeline';
import Footer from '../../components/gramSabhaDashboard/Footer';
import GISMiniMap from '../../components/gramSabhaDashboard/GISMiniMap';
import Header from '../../components/gramSabhaDashboard/Header';
import QuickActions from '../../components/gramSabhaDashboard/QuickActions';
import Sidebar from '../../components/gramSabhaDashboard/Sidebar';

// Import new page components
import ClaimManagement from '../../components/gramSabhaDashboard/pages/ClaimManagement';
import DocumentResolution from '../../components/gramSabhaDashboard/pages/DocumentResolution';
import GISLandMapping from '../../components/gramSabhaDashboard/pages/GISLandMapping';
import Notifications from '../../components/gramSabhaDashboard/pages/Notifications';
import Settings from '../../components/gramSabhaDashboard/pages/Settings';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [activePage, setActivePage] = useState('dashboard');

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

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handlePageChange = (pageId) => {
    setActivePage(pageId);
  };

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onPageChange={handlePageChange}
        activePage={activePage}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <Header onMenuClick={handleMenuClick} />

        {/* Dashboard Content */}
        <AnimatePresence mode="wait">
          <motion.main
            key={activePage}
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="p-6"
          >
            {activePage === 'dashboard' && (
              <>
                {/* Analytics Cards */}
                <motion.div variants={sectionVariants}>
                  <AnalyticsCards />
                </motion.div>

                {/* Middle Section */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                  {/* Claim Status Pipeline - Takes 2 columns on xl screens */}
                  <motion.div variants={sectionVariants} className="xl:col-span-2">
                    <ClaimStatusPipeline onStatusFilter={handleStatusFilter} />
                  </motion.div>

                  {/* Quick Actions - Takes 1 column on xl screens */}
                  <motion.div variants={sectionVariants}>
                    <QuickActions onPageChange={handlePageChange} />
                  </motion.div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Claims Table - Takes 2 columns on xl screens */}
                  <motion.div variants={sectionVariants} className="xl:col-span-2">
                    <ClaimsTable statusFilter={statusFilter} />
                  </motion.div>

                  {/* GIS Mini Map - Takes 1 column on xl screens */}
                  <motion.div variants={sectionVariants}>
                    <GISMiniMap />
                  </motion.div>
                </div>

                {/* Analytics Charts - Full Width */}
                <motion.div variants={sectionVariants} className="mt-6">
                  <AnalyticsCharts />
                </motion.div>
              </>
            )}

            {activePage === 'claims' && (
              <motion.div variants={sectionVariants}>
                <ClaimManagement />
              </motion.div>
            )}

            {activePage === 'documents' && (
              <motion.div variants={sectionVariants}>
                <DocumentResolution />
              </motion.div>
            )}

            {activePage === 'gis' && (
              <motion.div variants={sectionVariants}>
                <GISLandMapping />
              </motion.div>
            )}

            {activePage === 'notifications' && (
              <motion.div variants={sectionVariants}>
                <Notifications />
              </motion.div>
            )}

            {activePage === 'settings' && (
              <motion.div variants={sectionVariants}>
                <Settings />
              </motion.div>
            )}
          </motion.main>
        </AnimatePresence>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
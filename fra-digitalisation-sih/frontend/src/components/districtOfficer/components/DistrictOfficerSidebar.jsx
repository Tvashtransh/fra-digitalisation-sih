import { motion } from 'framer-motion';
import {
    BarChart3,
    FileCheck,
    FileText,
    Home,
    LogOut,
    Map,
    Search,
    X
} from 'lucide-react';

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'claim-management', name: 'Claim Management', icon: FileText },
  { id: 'pending-district', name: 'Pending at District', icon: FileText, badge: '24' },
  { id: 'approved-district', name: 'Approved by District', icon: FileCheck, badge: '156' },
  { id: 'search-claim', name: 'Search Claim', icon: Search },
  { id: 'gis-mapping', name: 'GIS Mapping & Monitoring', icon: Map },
  { id: 'reports-analytics', name: 'Reports & Analytics', icon: BarChart3 },
];

const DistrictOfficerSidebar = ({ isOpen, onClose, onPageChange, activePage }) => {
  const handleMenuClick = (itemId) => {
    if (itemId === 'logout') {
      if (window.confirm('Are you sure you want to logout?')) {
        alert('Logged out successfully');
      }
    } else {
      onPageChange(itemId);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#044e2b] to-[#0a5a35] shadow-xl z-50 flex flex-col border-r-2 border-[#d4c5a9]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#d4c5a9]/30 bg-[#044e2b]/90">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-[#d4c5a9] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-[#044e2b] font-bold text-lg">DO</span>
            </div>
            <div>
              <h2 className="text-[#d4c5a9] font-bold text-lg leading-tight">
                District Officer
              </h2>
              <p className="text-[#d4c5a9]/80 text-sm">
                Ratlam District
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-lg bg-[#d4c5a9]/20 text-[#d4c5a9] hover:bg-[#d4c5a9]/30 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? 'bg-[#d4c5a9] text-[#044e2b] shadow-md'
                        : 'text-[#d4c5a9]/80 hover:bg-[#d4c5a9]/15 hover:text-[#d4c5a9]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-5 w-5 transition-colors ${
                        isActive
                          ? 'text-[#044e2b]'
                          : 'text-[#d4c5a9]/70 group-hover:text-[#d4c5a9]'
                      }`} />
                      <span className={`font-medium ${isActive ? 'text-[#044e2b]' : 'text-[#d4c5a9]/90'}`}>
                        {item.name}
                      </span>
                    </div>

                    {item.badge && (
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        isActive
                          ? 'bg-[#044e2b]/20 text-[#044e2b]'
                          : 'bg-[#d4c5a9] text-[#044e2b]'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-[#044e2b] rounded-full"></div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#d4c5a9]/20 bg-[#044e2b]/90">
          <button
            onClick={() => handleMenuClick('logout')}
            className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-red-200 rounded-lg transition-colors border border-red-500/30 mb-3"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>

          <div className="text-center">
            <p className="text-[#d4c5a9] text-sm font-bold mb-1">
              Forest Rights Act, 2006
            </p>
            <p className="text-[#d4c5a9]/80 text-xs">
              District Level Authority
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default DistrictOfficerSidebar;
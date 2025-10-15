import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    BarChart3,
    Bell,
    FileText,
    Home,
    LogOut,
    Map,
    MessageSquare,
    Settings,
    X
} from 'lucide-react';
import { performLogout } from '../../../utils/authUtils';

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'claims', name: 'Claim Management', icon: FileText },
  { id: 'gis', name: 'GIS Land Mapping', icon: Map },
  { id: 'resolutions', name: 'Resolutions & Documents', icon: FileText },
  { id: 'reports', name: 'Reports & Analytics', icon: BarChart3 },
  { id: 'messages', name: 'Messages & Communication', icon: MessageSquare },
  { id: 'settings', name: 'Settings & User Guide', icon: Settings },
];

const BlockOfficerSidebar = ({ isOpen, onClose, onPageChange, activePage }) => {
  const navigate = useNavigate();
  const [subdivisionName, setSubdivisionName] = useState('Loading...');

  // Fetch officer profile to get subdivision name
  useEffect(() => {
    const fetchOfficerProfile = async () => {
      try {
        const response = await fetch('/api/block-officer/profile', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.officer) {
            // Determine subdivision name based on districtId
            if (data.officer.districtId === 'PHN001') {
              setSubdivisionName('Phanda Subdivision');
            } else if (data.officer.districtId === 'BRS001') {
              setSubdivisionName('Berasia Subdivision');
            } else {
              setSubdivisionName('Subdivision');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching officer profile:', error);
        setSubdivisionName('Subdivision');
      }
    };

    fetchOfficerProfile();
  }, []);
  
  const handleMenuClick = async (itemId) => {
    if (itemId === 'logout') {
      try {
        await performLogout('block_officer', true);
      } catch (error) {
        console.error('Logout error:', error);
        // Fallback: clear storage and redirect
        localStorage.clear();
        sessionStorage.clear();
        document.cookie = 'block_officer_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        navigate('/auth?role=block');
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
              <span className="text-[#044e2b] font-bold text-lg">BO</span>
            </div>
            <div>
              <h2 className="text-[#d4c5a9] font-bold text-lg leading-tight">
                Block Officer
              </h2>
              <p className="text-[#d4c5a9]/80 text-sm">
                {subdivisionName}
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
          <ul className="space-y-2">
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
                    <Icon className={`h-5 w-5 transition-colors ${
                      isActive
                        ? 'text-[#044e2b]'
                        : 'text-[#d4c5a9]/70 group-hover:text-[#d4c5a9]'
                    } mr-3`} />
                    <span className={`font-medium ${isActive ? 'text-[#044e2b]' : 'text-[#d4c5a9]/90'}`}>
                      {item.name}
                    </span>
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
              Block Level Authority
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default BlockOfficerSidebar;
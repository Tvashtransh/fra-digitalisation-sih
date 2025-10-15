import { motion } from 'framer-motion';
import {
  Bell,
  ChevronDown,
  Filter,
  Globe,
  HelpCircle,
  LogOut,
  Menu,
  Search,
  Settings,
  User
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { performLogout } from '../../../utils/authUtils';

const DistrictOfficerHeader = ({
  onMenuClick,
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [districtOfficer, setDistrictOfficer] = useState(null);

  // Fetch district officer profile
  useEffect(() => {
    const fetchOfficerProfile = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/district/profile', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setDistrictOfficer(data.officer);
          }
        }
      } catch (error) {
        console.error('Error fetching officer profile:', error);
      }
    };

    fetchOfficerProfile();
  }, []);

  // Generate real notifications based on district officer data
  const notifications = [
    {
      id: 1,
      title: 'New Claims Forwarded',
      message: `Subdivision officers forwarded claims for review`,
      time: '2 min ago',
      unread: true,
      type: 'info'
    },
    {
      id: 2,
      title: 'Approval Required',
      message: `Claims pending district officer approval`,
      time: '1 hour ago',
      unread: true,
      type: 'warning'
    },
    {
      id: 3,
      title: 'Title Granted',
      message: `Individual Forest Rights approved and titles granted`,
      time: '3 hours ago',
      unread: false,
      type: 'success'
    },
    {
      id: 4,
      title: 'System Update',
      message: `${districtOfficer ? districtOfficer.district : 'District'} officer dashboard updated`,
      time: '5 hours ago',
      unread: false,
      type: 'info'
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const filters = [
    { value: 'all', label: 'All Claims' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'block', label: 'By Block' },
    { value: 'gram-sabha', label: 'By Gram Sabha' }
  ];

  return (
    <header className="bg-[#044e2b] shadow-lg border-b border-[#d4c5a9]">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Menu Button & Welcome */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-lg bg-[#d4c5a9] text-[#044e2b] hover:bg-[#e8d5b7] transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="hidden md:block">
              <h1 className="text-[#d4c5a9] text-xl font-bold">
                District Officer Dashboard
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className="bg-[#d4c5a9] text-[#044e2b] px-3 py-1 rounded-full text-xs font-semibold">
                  {districtOfficer ? `${districtOfficer.district} District Authority` : 'Loading...'}
                </span>
                <span className="text-[#d4c5a9]/80 text-sm">
                  Madhya Pradesh
                </span>
              </div>
            </div>
          </div>

          {/* Center Section - Search & Filter */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <div className="flex">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#d4c5a9]/60 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search claims by ID, applicant name, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-[#d4c5a9]/30 rounded-l-lg text-[#d4c5a9] placeholder-[#d4c5a9]/60 focus:outline-none focus:ring-2 focus:ring-[#d4c5a9] focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="appearance-none bg-white/10 border-l-0 border border-[#d4c5a9]/30 rounded-r-lg px-4 py-3 text-[#d4c5a9] focus:outline-none focus:ring-2 focus:ring-[#d4c5a9] focus:border-transparent min-w-[150px]"
                  >
                    {filters.map(filter => (
                      <option key={filter.value} value={filter.value} className="bg-[#044e2b] text-[#d4c5a9]">
                        {filter.label}
                      </option>
                    ))}
                  </select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#d4c5a9]/60 h-4 w-4 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Notifications, Language, Profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfile(false);
                  setShowLanguage(false);
                }}
                className="relative p-2 rounded-lg bg-[#d4c5a9]/20 text-[#d4c5a9] hover:bg-[#d4c5a9]/30 transition-colors"
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                >
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                    <p className="text-sm text-gray-600">You have {unreadCount} unread notifications</p>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          notification.unread ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === 'warning' ? 'bg-yellow-400' :
                            notification.type === 'success' ? 'bg-green-400' : 'bg-blue-400'
                          }`}></div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-800">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 text-center">
                    <button className="text-[#5a1c2d] hover:text-[#4a1825] font-medium text-sm">
                      View All Notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Language Toggle */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowLanguage(!showLanguage);
                  setShowNotifications(false);
                  setShowProfile(false);
                }}
                className="flex items-center space-x-2 p-2 rounded-lg bg-[#d4c5a9]/20 text-[#d4c5a9] hover:bg-[#d4c5a9]/30 transition-colors"
              >
                <Globe className="h-5 w-5" />
                <span className="hidden md:block text-sm font-medium">EN</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Language Dropdown */}
              {showLanguage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                >
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-lg">
                    English
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-b-lg">
                    हिंदी
                  </button>
                </motion.div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfile(!showProfile);
                  setShowNotifications(false);
                  setShowLanguage(false);
                }}
                className="flex items-center space-x-3 p-2 rounded-lg bg-[#d4c5a9]/20 text-[#d4c5a9] hover:bg-[#d4c5a9]/30 transition-colors"
              >
                <div className="w-8 h-8 bg-[#d4c5a9] rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-[#044e2b]" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-white text-sm font-medium">
                    {districtOfficer ? districtOfficer.name : 'Loading...'}
                  </p>
                  <p className="text-[#d4af37]/80 text-xs">Bhopal District Officer</p>
                </div>
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Profile Dropdown */}
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                >
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-800">
                      {districtOfficer ? districtOfficer.name : 'Loading...'}
                    </p>
                    <p className="text-xs text-gray-600">
                      Bhopal District Officer
                    </p>
                    <p className="text-xs text-gray-500">
                      {districtOfficer ? districtOfficer.email : 'Loading...'}
                    </p>
                  </div>

                  <div className="py-2">
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2">
                      <HelpCircle className="h-4 w-4" />
                      <span>Help & Support</span>
                    </button>
                  </div>

                  <div className="border-t border-gray-200 py-2">
                    <button 
                      className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center space-x-2"
                      onClick={async () => {
                        try {
                          setIsProfileOpen(false);
                          await performLogout('district_officer', true);
                        } catch (error) {
                          console.error('Logout error:', error);
                          // Fallback: clear storage and redirect
                          localStorage.clear();
                          sessionStorage.clear();
                          window.location.href = '/auth?role=district';
                        }
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DistrictOfficerHeader;
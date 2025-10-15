import {
    Bell,
    ChevronDown,
    Globe,
    Menu,
    Search,
    User
} from 'lucide-react';
import { useState, useEffect } from 'react';

const BlockOfficerHeader = ({ onMenuClick, searchTerm, setSearchTerm, selectedFilter, setSelectedFilter }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [language, setLanguage] = useState('en');
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
              setSubdivisionName('Phanda Subdivision | Madhya Pradesh');
            } else if (data.officer.districtId === 'BRS001') {
              setSubdivisionName('Berasia Subdivision | Madhya Pradesh');
            } else {
              setSubdivisionName('Subdivision | Madhya Pradesh');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching officer profile:', error);
        setSubdivisionName('Subdivision | Madhya Pradesh');
      }
    };

    fetchOfficerProfile();
  }, []);

  const notifications = [
    { id: 1, title: 'New Claim Submitted', message: 'A new forest rights claim has been submitted in Village A', time: '2 min ago', unread: true },
    { id: 2, title: 'Document Verification', message: 'Documents for Claim #1234 require verification', time: '15 min ago', unread: true },
    { id: 3, title: 'District Review Pending', message: '5 claims are pending district review', time: '1 hour ago', unread: false },
    { id: 4, title: 'Meeting Scheduled', message: 'Block officer meeting scheduled for tomorrow', time: '2 hours ago', unread: false },
    { id: 5, title: 'Report Generated', message: 'Monthly block report has been generated', time: '3 hours ago', unread: true },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  ];

  return (
    <header className="bg-[#044e2b] shadow-lg border-b border-[#d4c5a9]">
      <div className="px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg bg-[#d4c5a9] text-[#044e2b] hover:bg-[#e8d5b7]"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden lg:block">
              <h1 className="text-xl font-bold text-[#d4c5a9]">
                Block Officer Dashboard
              </h1>
              <p className="text-sm text-[#d4c5a9] opacity-80">
                {subdivisionName}
              </p>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-2xl mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#044e2b]" />
              <input
                type="text"
                placeholder="Search by Applicant, Claim ID, Gram Sabha..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#d4c5a9] text-[#044e2b] placeholder-[#044e2b]/70 rounded-lg focus:ring-2 focus:ring-[#d4c5a9] focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Filter Dropdown */}
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 bg-[#d4c5a9] text-[#044e2b] rounded-lg border border-[#d4c5a9] focus:ring-2 focus:ring-[#d4c5a9] focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 days</option>
              <option value="month">This Month</option>
              <option value="custom">Custom</option>
            </select>

            {/* Language Toggle */}
            <div className="relative">
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center space-x-2 px-3 py-2 bg-[#d4c5a9] text-[#044e2b] rounded-lg hover:bg-[#e8d5b7] transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">{language === 'en' ? 'EN' : 'HI'}</span>
              </button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 bg-[#d4c5a9] text-[#044e2b] rounded-lg hover:bg-[#e8d5b7] transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${notification.unread ? 'bg-blue-50' : ''}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-800">{notification.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                          </div>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 text-center">
                    <button className="text-[#044e2b] hover:text-[#0a5a35] font-medium text-sm">
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 bg-[#d4c5a9] text-[#044e2b] rounded-lg hover:bg-[#e8d5b7] transition-colors"
              >
                <div className="w-8 h-8 bg-[#044e2b] rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-[#d4c5a9]" />
                </div>
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#044e2b] rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-[#d4c5a9]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Block Officer</p>
                        <p className="text-sm text-gray-600">Phanda Subdivision</p>
                        <p className="text-xs text-gray-500">Bhopal District</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Profile Settings
                    </button>
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Change Password
                    </button>
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Help & Support
                    </button>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BlockOfficerHeader;
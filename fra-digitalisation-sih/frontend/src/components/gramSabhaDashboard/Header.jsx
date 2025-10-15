import {
    Bell,
    ChevronDown,
    Filter,
    Globe,
    Menu,
    Search,
    User
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { performLogout } from '../../utils/authUtils';
import NotificationBell from './NotificationBell';

const Header = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [language, setLanguage] = useState('en');
  const [officerData, setOfficerData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  ];

  // Fetch officer profile data
  useEffect(() => {
    const fetchOfficerProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const response = await fetch('/api/gs/profile', {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (response.ok && data.success) {
          setOfficerData(data.officer);
        } else {
          console.error('Failed to fetch officer profile:', data.message);
        }
      } catch (error) {
        console.error('Error fetching officer profile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchOfficerProfile();
  }, []);

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
                Gram Sabha Dashboard
              </h1>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[#044e2b]" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-[#d4c5a9] rounded-lg bg-white text-[#044e2b] placeholder-[#044e2b] focus:outline-none focus:ring-2 focus:ring-[#d4c5a9]"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Filters */}
            <button className="p-2 rounded-lg bg-[#d4c5a9] text-[#044e2b] hover:bg-[#e8d5b7]">
              <Filter className="h-4 w-4" />
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center space-x-2 p-2 rounded-lg bg-[#d4c5a9] text-[#044e2b] hover:bg-[#e8d5b7]"
            >
              <Globe className="h-4 w-4" />
              <span>{languages.find(lang => lang.code === language)?.flag}</span>
            </button>

            {/* Notifications */}
            <div className="p-2 rounded-lg bg-[#d4c5a9] text-[#044e2b] hover:bg-[#e8d5b7]">
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg bg-[#d4c5a9] text-[#044e2b] hover:bg-[#e8d5b7]"
              >
                <div className="w-8 h-8 bg-[#044e2b] rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-[#d4c5a9]" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold text-[#044e2b]">
                    {isLoadingProfile ? 'Loading...' : officerData ? `${officerData.gpName} Gram Sabha Officer` : 'Gram Sabha Officer'}
                  </p>
                  <p className="text-xs text-[#044e2b] opacity-80">
                    {officerData ? `${officerData.subdivision} • ${officerData.district}` : ''}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-[#044e2b]" />
              </button>

              {/* Profile Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-[#d4c5a9] z-50">
                  <div className="bg-[#044e2b] p-3">
                    <p className="text-sm font-bold text-[#d4c5a9]">
                      {isLoadingProfile ? 'Loading...' : officerData ? `${officerData.gpName} Gram Sabha Officer` : 'Gram Sabha Officer'}
                    </p>
                    {officerData && (
                      <div className="mt-2 text-xs text-[#d4c5a9] opacity-80">
                        <p>Officer: {officerData.name || 'Not provided'}</p>
                        <p>GP Code: {officerData.gpCode}</p>
                        <p>Village: {officerData.gpName}</p>
                        <p>Subdivision: {officerData.subdivision}</p>
                        <p>District: {officerData.district}</p>
                      </div>
                    )}
                  </div>
                  <div className="py-2">
                    <button className="w-full text-left px-4 py-2 text-sm text-[#044e2b] hover:bg-gray-50">
                      Profile Settings
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-[#044e2b] hover:bg-gray-50">
                      Help & Support
                    </button>
                    <div className="border-t border-[#d4c5a9] my-1"></div>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={async () => {
                        try {
                          setShowProfileMenu(false);
                          await performLogout('gram_sabha', true);
                        } catch (error) {
                          console.error('Logout error:', error);
                          // Fallback: clear storage and redirect
                          localStorage.clear();
                          sessionStorage.clear();
                          window.location.href = '/auth?role=gs';
                        }
                      }}
                    >
                      Sign Out
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

export default Header;
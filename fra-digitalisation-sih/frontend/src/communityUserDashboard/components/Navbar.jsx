import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Bell, Globe, LogOut, Menu, Search, Settings, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { performLogout } from '../../utils/authUtils';

const navigation = [
  { name: 'Home', to: '/' },
  { name: 'My Claim', to: '/my-claim' },
  { name: 'Village Assets', to: '/village-assets' },
  { name: 'Schemes', to: '/schemes' },
  { name: 'Feedback', to: '/feedback' },
];

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 }
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [language, setLanguage] = useState('en');
  const location = useLocation();

  const notifications = [
    { id: 1, title: 'Claim Status Update', message: 'Your claim #FRA2024001 has been approved', time: '2 min ago', unread: true },
    { id: 2, title: 'Document Required', message: 'Please submit additional documents for claim verification', time: '1 hour ago', unread: true },
    { id: 3, title: 'Meeting Notice', message: 'Gram Sabha meeting scheduled for next week', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-bg-1 shadow-md border-b border-heading/20"
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between h-16 items-center">

          {/* Logo and Welcome Message */}
          <motion.div
            className="flex items-center space-x-4"
            variants={itemVariants}
          >
            <div className="w-8 h-8 bg-bg-heading rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">FRA</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-fra-font">
                Welcome back, Community User
              </h1>
              <p className="text-sm text-fra-font/70">
                Forest Rights Act Digital Platform
              </p>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            className="hidden md:flex flex-1 max-w-md mx-8"
            variants={itemVariants}
          >
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search claims, documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-heading/30 rounded-lg bg-bg-2 text-fra-font placeholder-fra-font/50 focus:outline-none focus:ring-2 focus:ring-bg-heading focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-fra-font/50" />
              </div>
            </form>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-2 lg:space-x-4">
            <nav className="flex space-x-1 lg:space-x-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className={`px-4 py-2 rounded-md text-sm lg:text-base font-medium tracking-wide transition-all duration-200 ${
                    location.pathname === item.to
                      ? 'bg-bg-heading text-white shadow-md'
                      : 'text-fra-font hover:bg-bg-heading/80 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right section */}
          <motion.div
            className="flex items-center space-x-2 lg:space-x-4"
            variants={itemVariants}
          >
            {/* Language Toggle */}
            <div className="relative">
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="p-2 text-fra-font hover:bg-bg-heading hover:text-white transition-colors rounded-lg"
                title="Change Language"
              >
                <Globe className="h-5 w-5" />
              </button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-fra-font hover:bg-bg-heading hover:text-white transition-colors relative"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 text-center">
                    <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-fra-font hover:bg-bg-heading hover:text-white transition-colors"
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
              >
                <User className="h-5 w-5" />
              </Button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Community User</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">user@example.com</p>
                  </div>
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User className="h-4 w-4 mr-3" />
                      Profile Settings
                    </Link>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Settings className="h-4 w-4 mr-3" />
                      Preferences
                    </button>
                    <button 
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={async () => {
                        try {
                          setShowProfileMenu(false);
                          await performLogout('claimant', true);
                        } catch (error) {
                          console.error('Logout error:', error);
                          // Fallback: clear storage and redirect
                          localStorage.clear();
                          sessionStorage.clear();
                          window.location.href = '/auth';
                        }
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-fra-font hover:bg-bg-heading hover:text-white transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        className="md:hidden overflow-hidden"
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { height: 'auto', opacity: 1 },
          closed: { height: 0, opacity: 0 }
        }}
      >
        <div className="px-4 pt-3 pb-4 space-y-2 bg-bg-1 shadow-inner">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-heading/30 rounded-lg bg-bg-2 text-fra-font placeholder-fra-font/50 focus:outline-none focus:ring-2 focus:ring-bg-heading"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-fra-font/50" />
            </div>
          </form>

          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className={`block px-4 py-2 rounded-lg text-base font-medium tracking-wide transition-all duration-200 ${
                location.pathname === item.to
                  ? 'bg-bg-heading text-white shadow-md'
                  : 'text-fra-font hover:bg-bg-heading/80 hover:text-white'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
}

import { motion, useScroll, useTransform } from 'framer-motion';
import {
  BookOpen,
  FileText,
  Globe,
  Home,
  LogIn,
  Map,
  Menu,
  TreePine,
  Users,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 100], [0, -10]);
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);

  const navItems = [
    { name: 'Home', href: '#home', icon: Home },
    { name: 'About FRA 2006', href: '#about', icon: BookOpen },
    { name: 'FRA Atlas', href: '#atlas', icon: Map },
    { name: 'Claims & Rights', href: '#claims', icon: FileText },
    { name: 'Community Stories', href: '#stories', icon: Users },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.header
      style={{ y: headerY, opacity: headerOpacity }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled
          ? 'bg-[#044e2b]/98 backdrop-blur-2xl shadow-2xl border-b-2 border-[#d4c5a9]/40'
          : 'bg-[#044e2b]/95 backdrop-blur-xl shadow-xl border-b-2 border-[#d4c5a9]/30'
      }`}
    >
      <div className="container mx-auto px-6">
        <div
          className={`flex items-center justify-between transition-all duration-500 min-h-[64px] ${
            isScrolled ? 'py-2' : 'py-4'
          }`}
        >
          {/* Logo Section */}
          <motion.div
            className="flex items-center space-x-3 group cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-[#d4c5a9] to-[#e8d5b7] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <TreePine className="w-6 h-6 text-[#044e2b]" />
            </motion.div>
            <div className="hidden sm:block">
              <motion.h1
                className="text-xl font-bold bg-gradient-to-r from-[#d4c5a9] to-[#e8d5b7] bg-clip-text text-transparent drop-shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                FRA Atlas
              </motion.h1>
              <motion.p
                className="text-xs text-[#d4c5a9]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Forest Rights Act Digital Atlas
              </motion.p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Link
                  to={item.href}
                  className="flex items-center space-x-2 text-[#d4c5a9] hover:text-white transition-all duration-300 font-medium relative group px-3 py-2 rounded-lg hover:bg-[#d4c5a9]/20"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#d4c5a9] group-hover:w-full transition-all duration-300"></span>
                </Link>
              </motion.div>
            ))}

            {/* Login/Register Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link
                to="/auth"
                className="relative flex items-center space-x-2 bg-gradient-to-r from-[#d4c5a9] to-[#e8d5b7] hover:from-[#e8d5b7] hover:to-[#d4c5a9] text-[#044e2b] px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-xl"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </Link>
            </motion.div>

            {/* Language Switcher */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-2 text-[#d4c5a9] hover:text-white transition-all duration-300 px-3 py-2 rounded-lg hover:bg-[#d4c5a9]/20"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden xl:inline">EN</span>
              </button>

              {isLanguageMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-[#d4c5a9]/20 transition-colors duration-200"
                      onClick={() => setIsLanguageMenuOpen(false)}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-[#044e2b]">{lang.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden text-[#d4c5a9] hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#044e2b] border-t-2 border-[#d4c5a9]/30"
          >
            <div className="px-6 py-4 space-y-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <a
                    href={item.href}
                    className="flex items-center space-x-3 text-[#d4c5a9] hover:text-white transition-colors duration-300 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </a>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <Link
                  to="/auth"
                  className="flex items-center space-x-3 bg-gradient-to-r from-[#d4c5a9] to-[#e8d5b7] text-[#044e2b] px-4 py-3 rounded-xl font-semibold w-full justify-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login / Register</span>
                </Link>
              </motion.div>

              <div className="pt-4 border-t-2 border-[#d4c5a9]/30">
                <p className="text-sm font-medium text-[#d4c5a9] mb-2">Language</p>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className="flex items-center space-x-2 text-[#d4c5a9] hover:text-white transition-colors duration-200 py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>{lang.flag}</span>
                      <span className="text-sm">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;

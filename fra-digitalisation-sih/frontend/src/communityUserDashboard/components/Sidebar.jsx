import { Award, ChevronLeft, ChevronRight, FileText, Home, LogOut, Map, Menu, MessageSquare, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { performLogout } from '../../utils/authUtils';

const navigation = [
  { name: 'Home', to: '/', icon: Home },
  { name: 'My Claim', to: '/my-claim', icon: FileText },
  { name: 'Village Assets', to: '/village-assets', icon: Map },
  { name: 'Schemes', to: '/schemes', icon: Award },
  { name: 'Feedback', to: '/feedback', icon: MessageSquare },
  { name: 'Profile', to: '/profile', icon: User },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    if (window.innerWidth >= 768) {
      setIsCollapsed(!isCollapsed);
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Hamburger for mobile */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-bg-heading text-white p-3 rounded-lg shadow-lg hover:bg-bg-heading/90 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-all duration-300 ease-in-out fixed md:relative z-40 h-screen ${
          isCollapsed ? 'md:w-[70px]' : 'w-64 md:w-[250px]'
        } bg-bg-2 border-r-2 border-heading flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-heading/20 bg-bg-1 flex-shrink-0">
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'md:justify-center' : ''}`}>
            <div className="w-8 h-8 bg-heading rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">FRA</span>
            </div>
            {!isCollapsed && <span className="text-xl font-bold text-white">Atlas</span>}
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="hidden md:block p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={toggleCollapse}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
            <button
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.to}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    location.pathname === item.to
                      ? 'bg-bg-heading text-white shadow-md'
                      : 'text-fra-font hover:bg-bg-heading/10 hover:text-bg-heading'
                  } ${isCollapsed ? 'md:justify-center md:px-2' : ''}`}
                  onClick={() => setIsOpen(false)}
                  title={isCollapsed ? item.name : ''}
                >
                  <item.icon className={`h-5 w-5 transition-colors ${
                    location.pathname === item.to
                      ? 'text-white'
                      : 'text-numbering group-hover:text-bg-heading'
                  } ${isCollapsed ? 'md:mr-0' : 'mr-3'}`} />
                  {!isCollapsed && (
                    <>
                      <span className="font-medium">{item.name}</span>
                      {location.pathname === item.to && (
                        <div className="ml-auto w-2 h-2 bg-heading rounded-full"></div>
                      )}
                    </>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className={`p-4 border-t border-heading/20 bg-bg-1/50 flex-shrink-0 ${isCollapsed ? 'md:text-center' : ''}`}>
          {/* Logout Button */}
          <div className={`mb-3 ${isCollapsed ? 'md:flex md:justify-center' : ''}`}>
            <button
              className={`flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors ${
                isCollapsed ? 'md:px-2 md:justify-center' : 'w-full'
              }`}
              onClick={async () => {
                try {
                  await performLogout('claimant', true);
                } catch (error) {
                  console.error('Logout error:', error);
                  // Fallback: clear storage and redirect
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.href = '/auth';
                }
              }}
              title={isCollapsed ? 'Logout' : ''}
            >
              <LogOut className={`h-4 w-4 ${isCollapsed ? 'md:mr-0' : 'mr-2'}`} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>

          {/* Branding */}
          <div className={`text-xs text-fra-font/70 ${isCollapsed ? 'md:hidden' : 'text-center'}`}>
            FRA Digital Platform
          </div>
          {isCollapsed && (
            <div className="hidden md:block text-xs text-fra-font/70 text-center">
              FRA
            </div>
          )}
        </div>
      </div>
    </>
  );
}
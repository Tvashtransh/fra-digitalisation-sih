import { motion } from 'framer-motion';
import {
    Bell,
    FileCheck,
    FileText,
    Home,
    Map,
    Settings,
    X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, onPageChange, activePage }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'claims', label: 'Claim Management', icon: FileText },
    { id: 'documents', label: 'Document Resolution', icon: FileCheck },
    { id: 'gis', label: 'GIS Land Mapping', icon: Map },
    { id: 'settings', label: 'Settings / Logout', icon: Settings }
  ];

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
        transition={{ type: 'tween' }}
        className="fixed left-0 top-0 h-full w-64 bg-[#044e2b] shadow-lg z-50 flex flex-col border-r border-[#d4c5a9]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#d4c5a9]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#d4c5a9] rounded-lg flex items-center justify-center">
              <span className="text-[#044e2b] font-bold text-sm">GS</span>
            </div>
            <div>
              <h2 className="text-[#d4c5a9] font-bold text-lg">
                Gram Sabha
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-lg bg-[#d4c5a9] text-[#044e2b] hover:bg-[#e8d5b7]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => onPageChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activePage === item.id
                        ? 'bg-[#d4c5a9] text-[#044e2b]'
                        : 'text-[#d4c5a9] hover:bg-[#0a5a35]'
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#d4c5a9]">
          <div className="bg-[#d4c5a9] rounded-lg p-4">
            <div className="text-center">
              <p className="text-[#044e2b] text-sm font-bold">
                Forest Rights Act, 2006
              </p>
              <p className="text-[#044e2b] text-xs opacity-80 mt-1">
                Gram Sabha Portal
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
import { Globe, Heart, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Helpdesk Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Helpdesk Support</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Toll Free Helpline</p>
                  <p className="text-sm text-gray-300">1800-XXX-XXXX</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Email Support</p>
                  <p className="text-sm text-gray-300">helpdesk@gov.in</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-400">
                Available: Mon-Fri, 9:00 AM - 6:00 PM IST
              </p>
            </div>
          </div>

          {/* Language & Accessibility */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Language & Accessibility</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Multi-language Support</p>
                  <p className="text-sm text-gray-300">English, हिंदी, मराठी</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Heart className="h-5 w-5 text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Accessibility</p>
                  <p className="text-sm text-gray-300">Screen reader compatible</p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Important Links</h3>
            <div className="space-y-2">
              <a
                href="#"
                className="block text-sm text-gray-300 hover:text-green-400 transition-colors"
              >
                Forest Rights Act, 2006
              </a>
              <a
                href="#"
                className="block text-sm text-gray-300 hover:text-green-400 transition-colors"
              >
                Gram Sabha Guidelines
              </a>
              <a
                href="#"
                className="block text-sm text-gray-300 hover:text-green-400 transition-colors"
              >
                Claim Process Manual
              </a>
              <a
                href="#"
                className="block text-sm text-gray-300 hover:text-green-400 transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm text-gray-400">
                © {currentYear} Ministry of Tribal Affairs, Government of India
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Forest Rights Act Digital Portal - Gram Sabha Officer Module
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-xs text-gray-500">
                Version 2.1.0
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
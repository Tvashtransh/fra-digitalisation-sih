import { Clock, Globe, Heart, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-2 text-white border-t border-heading/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Helpdesk Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-bg-heading">Helpdesk Support</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-bg-heading flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Toll Free Helpline</p>
                  <p className="text-sm text-fra-font/80">1800-XXX-XXXX</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-bg-heading flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Email Support</p>
                  <p className="text-sm text-fra-font/80">support@forestrights.gov.in</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-fra-font/60">
                Available: Mon-Fri, 9:00 AM - 6:00 PM IST
              </p>
            </div>
          </div>

          {/* Services & Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-bg-heading">Services & Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-bg-heading flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Forest Rights Claims</p>
                  <p className="text-sm text-fra-font/80">Individual & Community Claims</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-bg-heading flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Processing Time</p>
                  <p className="text-sm text-fra-font/80">30-45 days average</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-fra-font/60">
                Track your claims and get updates
              </p>
            </div>
          </div>

          {/* Language & Accessibility */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-bg-heading">Language & Accessibility</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-bg-heading flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Multi-language Support</p>
                  <p className="text-sm text-fra-font/80">English, हिंदी, मराठी</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Heart className="h-5 w-5 text-bg-heading flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Accessibility</p>
                  <p className="text-sm text-fra-font/80">Screen reader friendly</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-fra-font/60">
                Committed to digital inclusion
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-heading/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-bg-heading rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">FRA</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Forest Rights Act Digital Platform</p>
                <p className="text-xs text-fra-font/60">Empowering Forest Communities</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-fra-font/80">
                © {currentYear} Government of India. All rights reserved.
              </p>
              <div className="flex items-center justify-center md:justify-end space-x-4 mt-2">
                <span className="text-xs text-fra-font/60">System Status:</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
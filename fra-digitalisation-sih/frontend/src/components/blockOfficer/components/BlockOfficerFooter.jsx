import { BookOpen, Globe, Mail, Phone, Shield } from 'lucide-react';

const BlockOfficerFooter = () => {
  return (
    <footer className="bg-[#044e2b] text-[#d4c5a9] border-t border-[#d4c5a9]">
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Section - Copyright */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold">Forest Rights Act, 2006</h3>
            <p className="text-sm text-[#d4c5a9]/80">
              Ministry of Tribal Affairs
            </p>
            <p className="text-sm text-[#d4c5a9]/80">
              Block Level Authority Portal
            </p>
            <p className="text-xs text-[#d4c5a9]/60 mt-4">
              © 2025 FRA Monitoring System. All rights reserved.
            </p>
          </div>

          {/* Center Section - Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact & Support</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-[#d4c5a9]/80" />
                <div>
                  <p className="text-sm font-medium">Helpline</p>
                  <p className="text-sm text-[#d4c5a9]/80">1800-XXXX-XXX</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-[#d4c5a9]/80" />
                <div>
                  <p className="text-sm font-medium">Email Support</p>
                  <p className="text-sm text-[#d4c5a9]/80">fra-block-support@gov.in</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#d4c5a9]/20">
              <p className="text-xs text-[#d4c5a9]/60">
                Available 24/7 for assistance
              </p>
            </div>
          </div>

          {/* Right Section - Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="grid grid-cols-1 gap-3">
              <button className="flex items-center space-x-2 text-sm hover:text-white transition-colors group">
                <Globe className="h-4 w-4 group-hover:text-[#d4c5a9]" />
                <span>Language Options</span>
              </button>
              <button className="flex items-center space-x-2 text-sm hover:text-white transition-colors group">
                <BookOpen className="h-4 w-4 group-hover:text-[#d4c5a9]" />
                <span>User Guide</span>
              </button>
              <button className="flex items-center space-x-2 text-sm hover:text-white transition-colors group">
                <Shield className="h-4 w-4 group-hover:text-[#d4c5a9]" />
                <span>Privacy & Terms</span>
              </button>
            </div>

            <div className="pt-4 border-t border-[#d4c5a9]/20">
              <div className="flex items-center space-x-4">
                <span className="text-xs text-[#d4c5a9]/60">Version 2.1.0</span>
                <span className="text-xs text-[#d4c5a9]/60">•</span>
                <span className="text-xs text-[#d4c5a9]/60">Last updated: Jan 2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-[#d4c5a9]/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="flex items-center space-x-6 text-xs text-[#d4c5a9]/60">
              <span>Terms of Service</span>
              <span>•</span>
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Accessibility</span>
            </div>
            <div className="text-xs text-[#d4c5a9]/60">
              Powered by Ministry of Tribal Affairs, Government of India
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BlockOfficerFooter;
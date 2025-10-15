import {
    FileText,
    Globe,
    Heart,
    HelpCircle,
    Mail,
    MapPin,
    Phone,
    Shield
} from 'lucide-react';

const DistrictOfficerFooter = () => {
  return (
    <footer className="bg-[#044e2b] text-[#d4c5a9] border-t border-[#d4c5a9]/20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* District Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#d4c5a9] rounded-lg flex items-center justify-center">
                <span className="text-[#044e2b] font-bold text-lg">DO</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#d4c5a9]">District Officer</h3>
                <p className="text-[#d4c5a9]/80 text-sm">Ratlam District</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-[#d4c5a9]/80">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-[#d4c5a9]" />
                <span>Ratlam, Madhya Pradesh - 457001</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-[#d4c5a9]" />
                <span>+91-7412-XXXXXX</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-[#d4c5a9]" />
                <span>do.ratlam@mp.gov.in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#d4c5a9]">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-white/80 hover:text-[#d4af37] transition-colors flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>FRA Guidelines</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-[#d4af37] transition-colors flex items-center space-x-2">
                  <HelpCircle className="h-4 w-4" />
                  <span>Help & Support</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-[#d4af37] transition-colors flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-[#d4af37] transition-colors flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>Terms of Service</span>
                </a>
              </li>
            </ul>
          </div>

          {/* District Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#d4af37]">District Support</h4>
            <div className="space-y-3 text-sm">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Phone className="h-4 w-4 text-[#d4af37]" />
                  <span className="font-medium">Helpline</span>
                </div>
                <p className="text-white/80 text-xs">1800-XXX-XXXX</p>
                <p className="text-white/60 text-xs">Mon-Fri, 9AM-6PM</p>
              </div>

              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="h-4 w-4 text-[#d4af37]" />
                  <span className="font-medium">Email Support</span>
                </div>
                <p className="text-white/80 text-xs">support.fra@mp.gov.in</p>
                <p className="text-white/60 text-xs">Response within 24hrs</p>
              </div>
            </div>
          </div>

          {/* Language & Copyright */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#d4af37]">Language</h4>
            <div className="flex space-x-2">
              <button className="px-3 py-2 bg-[#d4af37] text-[#5a1c2d] rounded-lg text-sm font-medium hover:bg-[#d4af37]/80 transition-colors">
                English
              </button>
              <button className="px-3 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition-colors">
                हिंदी
              </button>
            </div>

            <div className="pt-4 border-t border-white/20">
              <div className="flex items-center space-x-2 text-sm text-white/60">
                <Heart className="h-4 w-4 text-red-400" />
                <span>Made with care for tribal communities</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-white/60">
              <span>© 2024 Forest Rights Act Digital Platform</span>
              <span>•</span>
              <span>District Administration, Madhya Pradesh</span>
              <span>•</span>
              <span>Ministry of Tribal Affairs, GoI</span>
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <button className="text-white/60 hover:text-[#d4af37] transition-colors">
                Privacy
              </button>
              <span className="text-white/40">•</span>
              <button className="text-white/60 hover:text-[#d4af37] transition-colors">
                Terms
              </button>
              <span className="text-white/40">•</span>
              <button className="text-white/60 hover:text-[#d4af37] transition-colors">
                Accessibility
              </button>
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl font-bold text-[#d4af37] mb-2">FRA</div>
              <div className="text-xl text-[#d4af37]">Forest Rights Act, 2006</div>
              <div className="text-sm text-[#d4af37] mt-2">District Level Authority</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DistrictOfficerFooter;
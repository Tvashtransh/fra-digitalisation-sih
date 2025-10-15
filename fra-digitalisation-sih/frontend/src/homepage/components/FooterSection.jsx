import { motion } from "framer-motion";
import {
  ArrowUp,
  ExternalLink,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
  Heart,
} from "lucide-react";

const FooterSection = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = {
    platform: [
      { name: "File Claim", href: "/claim" },
      { name: "Track Status", href: "/track" },
      { name: "FRA Atlas", href: "/atlas" },
      { name: "Community Portal", href: "/community" },
      { name: "Dashboard", href: "/dashboard" },
    ],
    resources: [
      { name: "FRA Guidelines", href: "/guidelines" },
      { name: "Training Materials", href: "/training" },
      { name: "FAQ", href: "/faq" },
      { name: "Support Center", href: "/support" },
    ],
    about: [
      { name: "About FRA", href: "/about" },
      { name: "Our Mission", href: "/mission" },
      { name: "Team", href: "/team" },
      { name: "Contact Us", href: "/contact" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Disclaimer", href: "/disclaimer" },
    ],
  };

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#", color: "hover:text-blue-600" },
    { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-sky-500" },
    { name: "Instagram", icon: Instagram, href: "#", color: "hover:text-pink-600" },
    { name: "YouTube", icon: Youtube, href: "#", color: "hover:text-red-600" },
  ];

  return (
    <footer className="bg-gradient-to-br from-[#044e2b] via-[#0a5a35] to-[#044e2b] text-[#d4c5a9] relative">
      <div className="container mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Brand Section */}
          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-2">
              FRA{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                Digital Platform
              </span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering communities across India with secure, transparent, and
              efficient Forest Rights Act implementation through digital
              solutions.
            </p>
          </motion.div>

          {/* Links Sections */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(footerLinks).map(([category, links], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="font-semibold text-white mb-3 capitalize">
                  {category}
                </h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-white text-sm flex items-center group"
                      >
                        {link.name}
                        <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact + Social (Single Row) */}
        <motion.div
          className="py-6 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Contact Info in a row */}
          <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-400" />
              New Delhi, India
            </span>
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-400" />
              +91 1800-FRA-HELP
            </span>
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-green-400" />
              support@fra.gov.in
            </span>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className={`w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center ${social.color}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          className="py-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center text-gray-400 text-sm space-x-2">
            <span>© 2024 FRA Digital Platform.</span>
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <span>for Indian Communities</span>
          </div>

          <motion.button
            onClick={scrollToTop}
            className="flex items-center space-x-1 text-gray-400 hover:text-white text-sm mt-3 md:mt-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Back to Top</span>
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterSection;

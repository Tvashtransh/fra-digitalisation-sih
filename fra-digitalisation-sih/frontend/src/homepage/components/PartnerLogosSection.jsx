import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';

const PartnerLogosSection = () => {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  // Partner logos data
  const partners = [
    {
      name: 'Ministry of Tribal Affairs',
      logo: '🎯',
      category: 'Government',
      description: 'Lead implementing agency for FRA'
    },
    {
      name: 'Ministry of Environment, Forest and Climate Change',
      logo: '🌿',
      category: 'Government',
      description: 'Forest conservation and management'
    },
    {
      name: 'National Informatics Centre',
      logo: '💻',
      category: 'Technology',
      description: 'Digital infrastructure provider'
    },
    {
      name: 'Indian Space Research Organisation',
      logo: '🚀',
      category: 'Technology',
      description: 'Satellite imagery and GIS support'
    },
    {
      name: 'Forest Survey of India',
      logo: '🌲',
      category: 'Research',
      description: 'Forest inventory and monitoring'
    },
    {
      name: 'Tribal Research Institutes',
      logo: '📚',
      category: 'Research',
      description: 'Tribal culture and rights research'
    },
    {
      name: 'State Forest Departments',
      logo: '🏛️',
      category: 'Government',
      description: 'State-level implementation partners'
    },
    {
      name: 'NGO Networks',
      logo: '🤝',
      category: 'Civil Society',
      description: 'Community support organizations'
    },
    {
      name: 'Technology Partners',
      logo: '⚡',
      category: 'Technology',
      description: 'Digital solution providers'
    },
    {
      name: 'Academic Institutions',
      logo: '🎓',
      category: 'Education',
      description: 'Research and capacity building'
    }
  ];

  // Duplicate partners for seamless loop
  const duplicatedPartners = [...partners, ...partners];

  useEffect(() => {
    if (!isHovered) {
      controls.start({
        x: [0, -100 * partners.length],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        },
      });
    } else {
      controls.stop();
    }
  }, [isHovered, controls, partners.length]);

  return (
    <section className="py-16 bg-white dark:bg-gray-900 border-t border-gray-200/50 dark:border-gray-700/50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">Partners</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Collaborating with leading organizations across government, technology, and civil society
            to strengthen FRA implementation nationwide.
          </p>
        </motion.div>

        {/* Partner Categories */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {['Government', 'Technology', 'Research', 'Civil Society', 'Education'].map((category) => (
            <motion.span
              key={category}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-300 transition-all duration-300 cursor-default"
              whileHover={{ scale: 1.05 }}
            >
              {category}
            </motion.span>
          ))}
        </motion.div>

        {/* Auto-scrolling Logos */}
        <div className="relative overflow-hidden">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />

          {/* Logos Container */}
          <motion.div
            className="flex items-center space-x-8 py-8"
            animate={controls}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ width: `${duplicatedPartners.length * 200}px` }}
          >
            {duplicatedPartners.map((partner, index) => (
              <motion.div
                key={`${partner.name}-${index}`}
                className="flex-shrink-0 w-48 group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center justify-center text-center group-hover:border-green-200 dark:group-hover:border-green-700"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Logo */}
                  <motion.div
                    className="text-4xl mb-4"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {partner.logo}
                  </motion.div>

                  {/* Partner Name */}
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm leading-tight">
                    {partner.name}
                  </h3>

                  {/* Category Badge */}
                  <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium mb-2">
                    {partner.category}
                  </span>

                  {/* Description */}
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {partner.description}
                  </p>

                  {/* Hover Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    initial={false}
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Partner Stats */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {[
            { value: '15+', label: 'Government Agencies' },
            { value: '25+', label: 'Technology Partners' },
            { value: '50+', label: 'NGO Collaborations' },
            { value: '100+', label: 'Academic Institutions' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center group"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-blue-600 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500 dark:text-gray-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Government Approved</span>
          </span>
          <span className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>ISO Certified</span>
          </span>
          <span className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span>Secure & Compliant</span>
          </span>
          <span className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span>24/7 Support</span>
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default PartnerLogosSection;
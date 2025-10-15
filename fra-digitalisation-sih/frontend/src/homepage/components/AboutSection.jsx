import { motion } from 'framer-motion';
import { Cpu, Database, Map, Play, Shield, Users } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: Users,
      title: "Recognition of Rights",
      subtitle: "IFR, CR, CFR",
      description: "Recognition of Individual Forest Rights, Community Rights, and Community Forest Rights under FRA 2006 framework.",
      color: "from-green-500 to-emerald-600",
      bgColor: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
    },
    {
      icon: Database,
      title: "Integration of Records",
      subtitle: "Unified Database",
      description: "Centralized integration of forest rights records, land records, and community data for comprehensive management.",
      color: "from-blue-500 to-cyan-600",
      bgColor: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
    },
    {
      icon: Map,
      title: "GIS-based Monitoring",
      subtitle: "Spatial Analysis",
      description: "Advanced Geographic Information System for real-time monitoring of forest areas and rights implementation.",
      color: "from-purple-500 to-indigo-600",
      bgColor: "from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20"
    },
    {
      icon: Cpu,
      title: "DSS for Development",
      subtitle: "Decision Support",
      description: "AI-powered Decision Support System for sustainable development planning and forest governance.",
      color: "from-orange-500 to-red-600",
      bgColor: "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50/95 via-white/90 to-blue-50/60 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/80">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">FRA 2006</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            The Forest Rights Act 2006 recognizes and vests forest rights in forest dwelling communities,
            ensuring sustainable forest governance and community empowerment through digital innovation.
          </p>
        </motion.div>

        {/* Main Content - Split Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Video Section */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Understanding FRA 2006</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Watch this comprehensive explainer video to understand how the Forest Rights Act 2006
                empowers forest dwelling communities and transforms forest governance through digital technology.
              </p>
            </div>

            {/* Video Placeholder */}
            <motion.div
              className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="aspect-video relative">
                {/* Video Thumbnail Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-emerald-800 to-teal-800">
                  {/* Forest Pattern Overlay */}
                  <div className="absolute inset-0 opacity-20">
                    <svg width="100%" height="100%" className="absolute inset-0">
                      <defs>
                        <pattern id="forest-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                          <circle cx="10" cy="10" r="2" fill="rgba(34, 197, 94, 0.6)" />
                          <circle cx="30" cy="30" r="1.5" fill="rgba(34, 197, 94, 0.4)" />
                          <circle cx="20" cy="35" r="1" fill="rgba(34, 197, 94, 0.5)" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#forest-pattern)" />
                    </svg>
                  </div>

                  {/* FRA Text Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-white/20 mb-4">FRA</div>
                      <div className="text-2xl font-semibold text-white/30">2006</div>
                    </div>
                  </div>
                </div>

                {/* Play Button Overlay */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                  </motion.div>
                </motion.div>

                {/* Video Duration */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-white text-sm font-medium">3:45</span>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-6">
                <h4 className="text-lg font-semibold text-white mb-2">FRA 2006: Rights & Recognition</h4>
                <p className="text-gray-300 text-sm">Learn about the implementation process and community benefits</p>
              </div>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Legal Framework</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    FRA 2006 provides a comprehensive legal framework for recognizing and protecting
                    the rights of forest dwelling communities across India.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Features Grid */}
          <motion.div
            className="grid gap-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className={`bg-gradient-to-r ${feature.bgColor} border border-gray-200/50 dark:border-gray-700/50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                {/* Ripple Effect Background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 rounded-2xl"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />

                <div className="flex items-start space-x-4 relative z-10">
                  <motion.div
                    className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                      {feature.subtitle}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Hover Indicator */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-b-2xl"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Stats or Additional Info */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Impact & Reach</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Since its implementation, FRA 2006 has empowered millions of forest dwelling families
              across India, creating a foundation for sustainable forest governance and community development.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
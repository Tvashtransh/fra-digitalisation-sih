import { motion } from 'framer-motion';
import {
    ArrowRight,
    Award,
    BarChart3,
    CheckCircle,
    FileText,
    MapPin,
    Shield,
    Star,
    Users
} from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      title: 'Online Claim Filing',
      description: 'Secure digital platform for submitting forest rights claims with real-time validation and document management.',
      icon: FileText,
      color: 'from-blue-500 to-cyan-600',
      features: ['Digital forms', 'Document upload', 'Auto-validation', 'Secure storage'],
      stats: '10K+ Claims Filed',
      popular: true
    },
    {
      id: 2,
      title: 'GIS Mapping & Survey',
      description: 'Advanced geographic information system for accurate forest boundary mapping and land survey services.',
      icon: MapPin,
      color: 'from-green-500 to-emerald-600',
      features: ['Boundary mapping', 'Satellite imagery', 'GPS integration', '3D visualization'],
      stats: '500K+ Hectares Mapped',
      popular: false
    },
    {
      id: 3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics and reporting dashboard for monitoring FRA implementation progress and outcomes.',
      icon: BarChart3,
      color: 'from-purple-500 to-indigo-600',
      features: ['Real-time metrics', 'Progress tracking', 'Custom reports', 'Data visualization'],
      stats: '1M+ Data Points',
      popular: false
    },
    {
      id: 4,
      title: 'Community Management',
      description: 'Tools for gram sabha management, community engagement, and participatory governance processes.',
      icon: Users,
      color: 'from-orange-500 to-red-600',
      features: ['Meeting management', 'Decision tracking', 'Community portal', 'Digital signatures'],
      stats: '2K+ Communities',
      popular: true
    },
    {
      id: 5,
      title: 'Compliance Monitoring',
      description: 'Automated compliance tracking and monitoring system to ensure adherence to FRA guidelines and regulations.',
      icon: Shield,
      color: 'from-teal-500 to-blue-600',
      features: ['Automated checks', 'Compliance alerts', 'Audit trails', 'Regulatory updates'],
      stats: '99.5% Compliance Rate',
      popular: false
    },
    {
      id: 6,
      title: 'Capacity Building',
      description: 'Training programs and capacity building initiatives for stakeholders and community members.',
      icon: Award,
      color: 'from-pink-500 to-rose-600',
      features: ['Online training', 'Workshop modules', 'Certification', 'Resource library'],
      stats: '15K+ Trained Users',
      popular: false
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
        <section id="claims" className="py-20 bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-[#d4c5a9] mb-6">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8d5b7] to-[#d4c5a9]">Services</span>
          </h2>
          <p className="text-xl text-[#d4c5a9]/80 max-w-3xl mx-auto leading-relaxed">
            Comprehensive digital solutions for Forest Rights Act implementation,
            designed to streamline processes and empower communities across India.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.id}
                className="relative group"
                variants={cardVariants}
              >
                {/* Popular Badge */}
                {service.popular && (
                  <motion.div
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                  >
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>Popular</span>
                    </div>
                  </motion.div>
                )}

                {/* Service Card */}
                <motion.div
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 h-full flex flex-col"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Icon & Title */}
                  <div className="flex items-start justify-between mb-4">
                    <motion.div
                      className={`w-14 h-14 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <IconComponent className="w-7 h-7 text-white" />
                    </motion.div>
                    <motion.div
                      className="text-right"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        {service.stats}
                      </div>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-blue-600 transition-all duration-300">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <motion.div
                          key={featureIndex}
                          className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-500"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: featureIndex * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <motion.div
                            className={`w-2 h-2 bg-gradient-to-r ${service.color} rounded-full`}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: featureIndex * 0.2 }}
                          />
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    className="mt-6 w-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-900 dark:text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center group/btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </motion.button>

                  {/* Hover Effect Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    initial={false}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="mt-20 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Impact at Scale
            </h3>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Our comprehensive FRA digital platform has transformed forest rights management across India
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '50K+', label: 'Claims Processed', icon: FileText },
              { value: '2K+', label: 'Communities Served', icon: Users },
              { value: '500K+', label: 'Hectares Mapped', icon: MapPin },
              { value: '99.5%', label: 'Success Rate', icon: CheckCircle }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className="text-center group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="text-2xl lg:text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-blue-100">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
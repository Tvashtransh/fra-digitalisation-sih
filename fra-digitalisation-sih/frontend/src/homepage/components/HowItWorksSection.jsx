import { motion } from 'framer-motion';
import { ArrowRight, Award, BarChart3, CheckCircle, FileText, MapPin, Users } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      id: 1,
      title: 'File Your Claim',
      description: 'Submit your forest rights claim through our secure online portal with all necessary documentation.',
      icon: FileText,
      color: 'from-blue-500 to-cyan-600',
      details: ['Digital form submission', 'Document upload', 'Real-time validation', 'Secure storage']
    },
    {
      id: 2,
      title: 'Community Verification',
      description: 'Local community and gram sabha members verify your claim through participatory process.',
      icon: Users,
      color: 'from-green-500 to-emerald-600',
      details: ['Gram Sabha review', 'Community consensus', 'Local verification', 'Traditional knowledge']
    },
    {
      id: 3,
      title: 'Forest Department Review',
      description: 'Forest department officials conduct field verification and technical assessment.',
      icon: MapPin,
      color: 'from-purple-500 to-indigo-600',
      details: ['Field inspection', 'Boundary verification', 'Forest assessment', 'Legal compliance']
    },
    {
      id: 4,
      title: 'Claim Approval & Titling',
      description: 'Approved claims receive official recognition and land titles are issued.',
      icon: CheckCircle,
      color: 'from-orange-500 to-red-600',
      details: ['Official approval', 'Title issuance', 'Legal documentation', 'Rights recognition']
    },
    {
      id: 5,
      title: 'Monitoring & Support',
      description: 'Continuous monitoring and support services to ensure sustainable forest management.',
      icon: BarChart3,
      color: 'from-teal-500 to-blue-600',
      details: ['Progress tracking', 'Capacity building', 'Technical support', 'Sustainable practices']
    },
    {
      id: 6,
      title: 'Recognition & Benefits',
      description: 'Receive official recognition and access to various forest-based livelihood benefits.',
      icon: Award,
      color: 'from-pink-500 to-rose-600',
      details: ['Legal recognition', 'Livelihood benefits', 'Forest products', 'Community rights']
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const stepVariants = {
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

  const lineVariants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: {
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
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
            How FRA <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Works</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Follow our streamlined process to secure your forest rights and access sustainable livelihood opportunities
            through the Forest Rights Act 2006 implementation.
          </p>
        </motion.div>

        {/* Process Flow */}
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="relative"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                variants={lineVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              />
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <motion.div
                    key={step.id}
                    className="relative group"
                    variants={stepVariants}
                  >
                    {/* Step Card */}
                    <motion.div
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Step Number & Icon */}
                      <div className="flex items-center justify-between mb-4">
                        <motion.div
                          className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center shadow-lg`}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <IconComponent className="w-6 h-6 text-white" />
                        </motion.div>
                        <div className="text-2xl font-bold text-gray-300 dark:text-gray-600">
                          {String(step.id).padStart(2, '0')}
                        </div>
                      </div>

                      {/* Step Content */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {step.description}
                        </p>

                        {/* Step Details */}
                        <div className="space-y-2">
                          {step.details.map((detail, detailIndex) => (
                            <motion.div
                              key={detailIndex}
                              className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-500"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: detailIndex * 0.1 }}
                              viewport={{ once: true }}
                            >
                              <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                              <span>{detail}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Hover Arrow */}
                      <motion.div
                        className="absolute -right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ x: -10 }}
                        whileHover={{ x: 0 }}
                      >
                        <ArrowRight className="w-6 h-6 text-purple-500" />
                      </motion.div>
                    </motion.div>

                    {/* Connecting Arrow for Mobile */}
                    {index < steps.length - 1 && (
                      <motion.div
                        className="lg:hidden flex justify-center my-6"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        viewport={{ once: true }}
                      >
                        <motion.div
                          className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
                          animate={{ y: [0, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <ArrowRight className="w-4 h-4 text-white" />
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Process Timeline */}
          <motion.div
            className="mt-16 bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Process Timeline
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Typical timeline for FRA claim processing and approval
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { phase: 'Filing', duration: '1-2 weeks', color: 'from-blue-500 to-cyan-600' },
                { phase: 'Verification', duration: '4-6 weeks', color: 'from-green-500 to-emerald-600' },
                { phase: 'Approval', duration: '2-4 weeks', color: 'from-purple-500 to-indigo-600' },
                { phase: 'Implementation', duration: 'Ongoing', color: 'from-orange-500 to-red-600' }
              ].map((item, index) => (
                <motion.div
                  key={item.phase}
                  className="text-center group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className={`w-16 h-16 mx-auto mb-3 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                  >
                    <div className="text-white font-bold text-sm">{item.phase[0]}</div>
                  </motion.div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{item.phase}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.duration}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                Ready to Start Your FRA Journey?
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Join thousands of communities who have successfully secured their forest rights.
                Our expert team is here to guide you through every step of the process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Your Claim
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
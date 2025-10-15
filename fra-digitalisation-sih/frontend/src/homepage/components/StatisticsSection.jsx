import { motion, useAnimation, useInView } from 'framer-motion';
import {
    FileText,
    Globe,
    MapPin,
    Target,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';

const StatisticsSection = () => {
  const [counters, setCounters] = useState({
    communities: 0,
    claims: 0,
    area: 0,
    states: 0,
    success: 0,
    villages: 0
  });

  const controls = useAnimation();
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  const finalValues = {
    communities: 2500,
    claims: 75000,
    area: 650000,
    states: 12,
    success: 98.5,
    villages: 15000
  };

  useEffect(() => {
    if (inView) {
      controls.start("visible");

      // Animate counters
      const duration = 2000; // 2 seconds
      const steps = 60;
      const interval = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;

        setCounters({
          communities: Math.floor(finalValues.communities * progress),
          claims: Math.floor(finalValues.claims * progress),
          area: Math.floor(finalValues.area * progress),
          states: Math.min(finalValues.states, Math.floor(finalValues.states * progress) + 1),
          success: Math.min(finalValues.success, (finalValues.success * progress).toFixed(1)),
          villages: Math.floor(finalValues.villages * progress)
        });

        if (step >= steps) {
          clearInterval(timer);
          setCounters(finalValues);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [inView, controls]);

  const stats = [
    {
      id: 1,
      label: 'Communities Empowered',
      value: counters.communities,
      suffix: '+',
      icon: Users,
      color: 'from-teal-500 to-cyan-600',
      description: 'Forest-dependent communities across India'
    },
    {
      id: 2,
      label: 'Claims Processed',
      value: counters.claims,
      suffix: '+',
      icon: FileText,
      color: 'from-green-500 to-emerald-600',
      description: 'Individual and community claims filed'
    },
    {
      id: 3,
      label: 'Forest Area Secured',
      value: counters.area,
      suffix: ' ha',
      icon: MapPin,
      color: 'from-emerald-500 to-green-600',
      description: 'Hectares of forest land under community control'
    },
    {
      id: 4,
      label: 'States Covered',
      value: counters.states,
      suffix: '',
      icon: Globe,
      color: 'from-orange-500 to-red-600',
      description: 'States implementing FRA digitally'
    },
    {
      id: 5,
      label: 'Success Rate',
      value: counters.success,
      suffix: '%',
      icon: Target,
      color: 'from-teal-500 to-blue-600',
      description: 'Claims successfully processed and approved'
    },
    {
      id: 6,
      label: 'Villages Connected',
      value: counters.villages,
      suffix: '+',
      icon: Globe,
      color: 'from-green-500 to-emerald-600',
      description: 'Villages with active FRA implementation'
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

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
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
    <section className="py-20 bg-gradient-to-br from-[#044e2b] via-[#0a5a35] to-[#044e2b] text-[#d4c5a9] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#d4c5a9]/10 via-[#e8d5b7]/5 to-[#d4c5a9]/10"></div>
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="stats-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(212, 197, 169, 0.2)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stats-grid)" />
        </svg>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#d4c5a9]/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-24 h-24 bg-[#e8d5b7]/8 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-[#d4c5a9]/6 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Statistics Grid */}
        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.id}
                className="group relative"
                variants={itemVariants}
              >
                {/* Card Background */}
                <div className="bg-[#d4c5a9]/5 backdrop-blur-sm rounded-2xl p-6 border border-[#d4c5a9]/20 hover:border-[#d4c5a9]/40 transition-all duration-500 group-hover:bg-[#d4c5a9]/10 h-full">
                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:shadow-xl transition-all duration-300`}
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <IconComponent className="w-8 h-8 text-[#044e2b]" />
                  </motion.div>

                  {/* Counter */}
                  <div className="mb-4">
                    <motion.div
                      className="text-3xl lg:text-4xl font-bold mb-2"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {typeof stat.value === 'number' && stat.value > 1000
                        ? `${(stat.value / 1000).toFixed(0)}K`
                        : stat.value
                      }{stat.suffix}
                    </motion.div>
                    <h3 className="text-lg font-semibold text-[#d4c5a9] mb-2">
                      {stat.label}
                    </h3>
                    <p className="text-sm text-[#d4c5a9]/70 leading-relaxed">
                      {stat.description}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-[#d4c5a9]/20 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#d4c5a9]/10 via-[#e8d5b7]/5 to-[#d4c5a9]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    initial={false}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default StatisticsSection;
import { motion, useAnimation } from 'framer-motion';
import { ArrowRight, Eye, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const MiniMapSection = () => {
  const [zoom, setZoom] = useState(1);
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);
  const controls = useAnimation();

  // FRA Atlas states data
  const states = [
    {
      id: 1,
      name: 'Madhya Pradesh',
      shortName: 'MP',
      claims: '2,345,678',
      villages: '45,231',
      area: '3.08M ha',
      x: 35,
      y: 45,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 2,
      name: 'Odisha',
      shortName: 'OR',
      claims: '1,987,654',
      villages: '38,765',
      area: '1.94M ha',
      x: 65,
      y: 55,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 3,
      name: 'Tripura',
      shortName: 'TR',
      claims: '456,789',
      villages: '8,932',
      area: '0.37M ha',
      x: 75,
      y: 35,
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: 4,
      name: 'Telangana',
      shortName: 'TG',
      claims: '1,234,567',
      villages: '28,456',
      area: '1.12M ha',
      x: 45,
      y: 65,
      color: 'from-orange-500 to-red-600'
    }
  ];

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.2, 2));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.2, 0.5));
  const handleReset = () => setZoom(1);

  return (
    <section id="atlas" className="py-20 bg-gradient-to-br from-slate-50/95 via-white/90 to-green-50/60 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/80">
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
            FRA Atlas <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">Preview</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Explore our comprehensive Forest Rights Act coverage across key states in India.
            Interactive map with real-time FRA implementation data and statistics.
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Map Container */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 rounded-3xl overflow-hidden shadow-2xl group">
                {/* Map Background */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  {/* India Outline SVG */}
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 w-full h-full opacity-30"
                  >
                    <path
                      d="M25,20 Q30,15 35,20 L40,25 Q45,30 50,25 L55,30 Q60,35 65,30 L70,35 Q75,40 80,35 L75,50 Q70,55 65,50 L60,55 Q55,60 50,55 L45,50 Q40,45 35,50 L30,45 Q25,40 20,45 L25,35 Q30,30 25,25 Z"
                      fill="none"
                      stroke="rgba(34, 197, 94, 0.4)"
                      strokeWidth="0.8"
                      className="animate-pulse"
                    />
                    {/* State boundaries */}
                    <path d="M35,45 L40,40 L45,45 L40,50 Z" fill="none" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="0.5" />
                    <path d="M65,55 L70,50 L75,55 L70,60 Z" fill="none" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="0.5" />
                    <path d="M75,35 L80,30 L85,35 L80,40 Z" fill="none" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="0.5" />
                    <path d="M45,65 L50,60 L55,65 L50,70 Z" fill="none" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="0.5" />
                  </svg>

                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-blue-900/10 to-purple-900/10">
                    <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/5 via-green-500/5 to-emerald-500/5 animate-pulse"></div>
                  </div>

                  {/* Grid Overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%" className="absolute inset-0">
                      <defs>
                        <pattern id="atlas-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#atlas-grid)" />
                    </svg>
                  </div>

                  {/* State Markers */}
                  <div className="absolute inset-0" style={{transform: `scale(${zoom})`}}>
                    {states.map((state) => (
                      <motion.div
                        key={state.id}
                        className="absolute cursor-pointer group"
                        style={{ left: `${state.x}%`, top: `${state.y}%` }}
                        onMouseEnter={() => setHoveredState(state)}
                        onMouseLeave={() => setHoveredState(null)}
                        onClick={() => setSelectedState(state)}
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Main Marker */}
                        <motion.div
                          className={`w-6 h-6 bg-gradient-to-r ${state.color} rounded-full shadow-lg border-2 border-white/50 flex items-center justify-center text-white text-xs font-bold`}
                          animate={{
                            scale: hoveredState?.id === state.id ? [1, 1.2, 1] : 1,
                          }}
                          transition={{ duration: 0.6, repeat: hoveredState?.id === state.id ? Infinity : 0 }}
                        >
                          {state.shortName}
                        </motion.div>

                        {/* Pulsing Ring */}
                        <motion.div
                          className={`absolute inset-0 rounded-full border-2 border-white/30`}
                          animate={{
                            scale: [1, 2, 1],
                            opacity: [0.6, 0, 0.6],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: state.id * 0.3,
                          }}
                        />

                        {/* Hover Tooltip */}
                        {hoveredState?.id === state.id && (
                          <motion.div
                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap shadow-xl z-10"
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="font-semibold">{state.name}</div>
                            <div className="text-green-400 text-xs">{state.claims} claims</div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Floating Forest Elements */}
                  <motion.div
                    className="absolute top-1/4 left-1/4 w-8 h-8 bg-green-500/20 rounded-full blur-lg"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute top-1/3 right-1/3 w-6 h-6 bg-blue-500/20 rounded-full blur-lg"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  />
                  <motion.div
                    className="absolute bottom-1/4 left-1/3 w-10 h-10 bg-green-500/20 rounded-full blur-lg"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                  />
                </div>

                {/* Map Controls */}
                <motion.div
                  className="absolute top-4 right-4 flex flex-col space-y-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <motion.button
                    onClick={handleZoomIn}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/20"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ZoomIn className="w-5 h-5 text-white" />
                  </motion.button>
                  <motion.button
                    onClick={handleZoomOut}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/20"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ZoomOut className="w-5 h-5 text-white" />
                  </motion.button>
                  <motion.button
                    onClick={handleReset}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/20"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <RotateCcw className="w-5 h-5 text-white" />
                  </motion.button>
                </motion.div>

                {/* Map Title */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                  <h3 className="text-sm font-semibold text-white">FRA Atlas Preview</h3>
                  <p className="text-xs text-gray-300">Interactive GIS View</p>
                </div>

                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-white">High Coverage</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-white">Medium Coverage</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-white">Growing Coverage</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Panel */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {/* Selected State Info */}
              {selectedState && (
                <motion.div
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {selectedState.name}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Total Claims</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{selectedState.claims}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Villages Covered</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{selectedState.villages}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Forest Area</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{selectedState.area}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Implementation</span>
                      <span className="font-semibold text-green-600">87%</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* National Overview */}
              <motion.div
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  National Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-600 dark:text-gray-400">Total Claims</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">6.02M</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-600 dark:text-gray-400">States Covered</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">4</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-600 dark:text-gray-400">Forest Area</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">6.51M ha</span>
                  </div>
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <Link
                  to="/atlas"
                  className="w-full bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 hover:from-green-600 hover:via-emerald-700 hover:to-teal-700 text-white px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center group"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  View Full Atlas
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Additional Info */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Our interactive FRA Atlas provides comprehensive coverage of forest rights implementation
              across key states with real-time data visualization and analytics.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-500">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Real-time Updates</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>GIS Integration</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Multi-layer Data</span>
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MiniMapSection;
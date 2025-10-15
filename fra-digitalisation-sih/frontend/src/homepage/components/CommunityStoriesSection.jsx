import { AnimatePresence, motion } from 'framer-motion';
import { Award, ChevronLeft, ChevronRight, MapPin, Quote, Star, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

const CommunityStoriesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const stories = [
    {
      id: 1,
      name: 'Ravi Kumar',
      role: 'Gram Pradhan',
      village: 'Bastar, Chhattisgarh',
      image: '/api/placeholder/150/150',
      story: 'The digital FRA platform has transformed how we manage our forest rights. What used to take months now happens in weeks. Our community now has secure tenure over 500 hectares of forest land.',
      impact: '500 hectares secured',
      beneficiaries: '1,200 families',
      rating: 5,
      tags: ['Community Led', 'Digital Transformation', 'Sustainable Management']
    },
    {
      id: 2,
      name: 'Meera Bai',
      role: 'Forest Rights Activist',
      village: 'Similipal, Odisha',
      image: '/api/placeholder/150/150',
      story: 'As a woman from a tribal community, I faced many challenges in claiming our traditional forest rights. The online platform made the process transparent and accessible. Today, our women\'s collective manages 200 hectares of medicinal plant cultivation.',
      impact: '200 hectares restored',
      beneficiaries: '350 women',
      rating: 5,
      tags: ['Women Empowerment', 'Medicinal Plants', 'Tribal Rights']
    },
    {
      id: 3,
      name: 'Suresh Patel',
      role: 'Community Forest Manager',
      village: 'Wayanad, Kerala',
      image: '/api/placeholder/150/150',
      story: 'The GIS mapping feature helped us accurately demarcate our community forest boundaries. This has prevented encroachments and allowed us to implement sustainable harvesting practices. Our forest products cooperative now serves 800 households.',
      impact: '300 hectares protected',
      beneficiaries: '800 households',
      rating: 5,
      tags: ['GIS Mapping', 'Sustainable Harvesting', 'Forest Protection']
    },
    {
      id: 4,
      name: 'Priya Singh',
      role: 'Youth Leader',
      village: 'Palamu, Jharkhand',
      image: '/api/placeholder/150/150',
      story: 'The platform\'s training modules empowered our youth to become forest guardians. We\'ve planted 50,000 trees and created livelihood opportunities through NTFP collection. The digital monitoring helps us track our reforestation progress.',
      impact: '50,000 trees planted',
      beneficiaries: '500 youth',
      rating: 5,
      tags: ['Youth Engagement', 'Reforestation', 'NTFP Development']
    },
    {
      id: 5,
      name: 'Rajesh Verma',
      role: 'Traditional Healer',
      village: 'Araku Valley, Andhra Pradesh',
      image: '/api/placeholder/150/150',
      story: 'Our traditional medicinal knowledge is now protected and documented. The FRA recognition has helped us establish a community-owned enterprise for herbal products. This has created sustainable income for 150 families while preserving our cultural heritage.',
      impact: '150 families benefited',
      beneficiaries: 'Traditional knowledge preserved',
      rating: 5,
      tags: ['Traditional Knowledge', 'Herbal Medicine', 'Cultural Preservation']
    }
  ];

  const nextStory = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % stories.length);
  };

  const prevStory = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + stories.length) % stories.length);
  };

  const goToStory = (index) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(nextStory, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  const currentStory = stories[currentIndex];

  return (
    <section id="stories" className="py-20 bg-gradient-to-br from-green-50/80 via-white/90 to-blue-50/60 dark:from-gray-900/80 dark:via-gray-800/90 dark:to-gray-900/70">
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
            Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">Stories</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Real stories from communities across India who have transformed their lives
            through successful FRA implementation and digital empowerment.
          </p>
        </motion.div>

        {/* Stories Carousel */}
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Main Story Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
                initial={{ opacity: 0, x: 300, rotateY: 45 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -300, rotateY: -45 }}
                transition={{
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                  damping: 20
                }}
                style={{ perspective: "1000px" }}
              >
                <div className="grid lg:grid-cols-2 gap-0">
                  {/* Story Content */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    {/* Quote Icon */}
                    <motion.div
                      className="mb-6"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <Quote className="w-12 h-12 text-green-500 opacity-20" />
                    </motion.div>

                    {/* Story Text */}
                    <motion.blockquote
                      className="text-lg lg:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 italic"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      "{currentStory.story}"
                    </motion.blockquote>

                    {/* Author Info */}
                    <motion.div
                      className="flex items-center space-x-4 mb-6"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {currentStory.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                          {currentStory.name}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {currentStory.role}
                        </p>
                        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-500 mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{currentStory.village}</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Rating */}
                    <motion.div
                      className="flex items-center space-x-2 mb-6"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                    >
                      {[...Array(currentStory.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                      ))}
                      <span className="text-gray-600 dark:text-gray-400 ml-2">
                        Community Impact Rating
                      </span>
                    </motion.div>

                    {/* Tags */}
                    <motion.div
                      className="flex flex-wrap gap-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >
                      {currentStory.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </motion.div>
                  </div>

                  {/* Impact Stats & Image */}
                  <div className="bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10 p-8 lg:p-12 flex flex-col justify-center">
                    {/* Profile Image Placeholder */}
                    <motion.div
                      className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
                    >
                      {currentStory.name.split(' ').map(n => n[0]).join('')}
                    </motion.div>

                    {/* Impact Stats */}
                    <motion.div
                      className="space-y-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <div className="text-center">
                        <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          {currentStory.impact}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Forest Area Impact
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          {currentStory.beneficiaries}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Direct Beneficiaries
                        </div>
                      </div>

                      {/* Achievement Badges */}
                      <motion.div
                        className="flex justify-center space-x-4 mt-8"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                      >
                        <motion.div
                          className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Award className="w-6 h-6 text-white" />
                        </motion.div>
                        <motion.div
                          className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1, rotate: -5 }}
                        >
                          <Users className="w-6 h-6 text-white" />
                        </motion.div>
                        <motion.div
                          className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <MapPin className="w-6 h-6 text-white" />
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <motion.button
              onClick={prevStory}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </motion.button>

            <motion.button
              onClick={nextStory}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </motion.button>
          </div>

          {/* Story Indicators */}
          <motion.div
            className="flex justify-center space-x-3 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1 }}
          >
            {stories.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToStory(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 w-8'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </motion.div>

          {/* Auto-play Toggle */}
          <motion.div
            className="flex justify-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.2 }}
          >
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isAutoPlaying
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              {isAutoPlaying ? 'Auto-playing' : 'Paused'}
            </button>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Share Your Community Story
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Every community has a unique journey with FRA. Help inspire others by sharing
              your success story and contribute to the growing network of empowered communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Submit Your Story
                <Award className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
              </motion.button>
              <motion.button
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Stories
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunityStoriesSection;
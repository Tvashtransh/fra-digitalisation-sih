import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
  
const HeroSection = () => {  
  return (  
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">  
      <div className="container mx-auto px-6 text-center relative z-10">  
        <motion.div  
          initial={{ opacity: 0, y: 30 }}  
          animate={{ opacity: 1, y: 0 }}  
          transition={{ duration: 0.8 }}  
          className="max-w-4xl mx-auto"  
        >  
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">  
            Forest Rights  
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600">  
              Digitalised  
            </span>  
          </h1>  
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">  
            Empowering communities through transparent, efficient, and sustainable forest rights management.  
          </p>  
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">  
            <Link  
              to="/auth"  
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"  
            >  
              Get Started  
              <ArrowRight className="ml-2 w-5 h-5" />  
            </Link>  
          </div>  
        </motion.div>  
      </div>  
    </section>  
  );  
};  
  
export default HeroSection; 

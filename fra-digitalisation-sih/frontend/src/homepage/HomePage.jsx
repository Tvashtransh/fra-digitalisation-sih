// Import all homepage components
import CommunityStoriesSection from './components/CommunityStoriesSection';
import FooterSection from './components/FooterSection';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import HowItWorksSection from './components/HowItWorksSection';
import MiniMapSection from './components/MiniMapSection';
import PartnerLogosSection from './components/PartnerLogosSection';
import ServicesSection from './components/ServicesSection';
import StatisticsSection from './components/StatisticsSection';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden relative transition-colors duration-500">
      {/* 🌟 Modern Blurred Gradient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Base Background */}
        <div className="absolute inset-0 bg-white dark:bg-gray-900"></div>

        {/* Top Left Green Blob */}
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] md:w-[900px] md:h-[900px] lg:w-[1100px] lg:h-[1100px]">
          <div className="w-full h-full bg-green-400/30 dark:bg-green-500/20 rounded-full blur-[140px] opacity-70 mix-blend-multiply dark:mix-blend-normal animate-pulse"></div>
        </div>

        {/* Bottom Right Green Blob */}
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] md:w-[800px] md:h-[800px] lg:w-[1000px] lg:h-[1000px]">
          <div
            className="w-full h-full bg-green-500/25 dark:bg-green-400/15 rounded-full blur-[140px] opacity-70 mix-blend-multiply dark:mix-blend-normal animate-pulse"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>

        {/* Subtle Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent dark:via-gray-900/5 backdrop-blur-[1px]"></div>
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-20 relative z-10">
        <HeroSection />
        <MiniMapSection />
        <HowItWorksSection />
        <ServicesSection />
        {/* <StatisticsSection /> */}
        <CommunityStoriesSection />
        <PartnerLogosSection />
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default HomePage;

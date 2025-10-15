import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';

const ExplainerVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control the video
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    // In a real implementation, this would control video audio
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50/80 via-white/90 to-blue-50/60 dark:from-gray-800/80 dark:via-gray-900/60 dark:to-gray-800/70 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            See FRA in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Action</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Watch how our digital platform transforms forest rights management,
            empowering communities and ensuring sustainable development.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800">
            {/* Video Container */}
            <div className="aspect-video relative">
              {/* Video Placeholder */}
              <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 relative overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-green-500/20 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-green-500/20 via-cyan-500/20 to-blue-500/20 animate-pulse" style={{animationDelay: '1s'}}></div>
                </div>

                {/* FRA Logo Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                      <Play className="w-12 h-12 text-white ml-1" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">FRA Digital Atlas</h3>
                    <p className="text-blue-200">Interactive Demo Video</p>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-green-500/30 rounded-full blur-xl animate-bounce"></div>
                <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-green-500/30 rounded-full blur-xl animate-bounce" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-blue-500/30 rounded-full blur-xl animate-bounce" style={{animationDelay: '2s'}}></div>
                <div className="absolute bottom-1/3 right-1/4 w-14 h-14 bg-purple-500/30 rounded-full blur-xl animate-bounce" style={{animationDelay: '0.5s'}}></div>
              </div>

              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handlePlayPause}
                      className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
                    >
                      {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-1" />}
                    </button>

                    <div className="text-white">
                      <div className="text-sm font-medium">FRA Implementation Demo</div>
                      <div className="text-xs text-gray-300">2:34 / 5:12</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleMuteToggle}
                      className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                    </button>

                    <div className="w-32 h-2 bg-white/30 rounded-full overflow-hidden">
                      <div className="w-1/2 h-full bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info Cards */}
            <div className="p-8 bg-white dark:bg-gray-900">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Interactive Demo</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Experience our platform in action</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Volume2 className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Voice Narration</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Guided tour with expert insights</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Pause className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Pause & Explore</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Interactive elements throughout</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Don't have time to watch? <span className="text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline">Download our brochure</span> or <span className="text-green-600 dark:text-green-400 font-medium cursor-pointer hover:underline">schedule a demo</span>.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-500">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>5-minute overview</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Real implementation examples</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Success stories</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExplainerVideo;
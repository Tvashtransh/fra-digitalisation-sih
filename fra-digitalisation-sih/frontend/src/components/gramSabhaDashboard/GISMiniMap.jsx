import { AnimatePresence, motion } from 'framer-motion';
import { Filter, Info, RefreshCw, Search, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';

const GISMiniMap = () => {
  const [zoom, setZoom] = useState(1);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapLayer, setMapLayer] = useState('satellite');
  const [showLegend, setShowLegend] = useState(true);
  const [coordinates, setCoordinates] = useState({ lat: 19.0760, lng: 72.8777 }); // Mumbai coordinates as default

  // Enhanced plot data with more details
  const [plots, setPlots] = useState([
    { id: 1, x: 20, y: 30, status: 'approved', area: '2.5 acres', owner: 'Rajesh Kumar', village: 'Bamboo Village', coordinates: '19.0760°N, 72.8777°E', claimType: 'Individual Forest Rights', lastUpdated: '2024-01-15' },
    { id: 2, x: 40, y: 50, status: 'pending', area: '1.8 acres', owner: 'Priya Sharma', village: 'Teak Forest', coordinates: '19.0765°N, 72.8782°E', claimType: 'Community Forest Rights', lastUpdated: '2024-01-10' },
    { id: 3, x: 60, y: 25, status: 'rejected', area: '3.2 acres', owner: 'Amit Singh', village: 'Sal Forest', coordinates: '19.0768°N, 72.8785°E', claimType: 'Individual Forest Rights', lastUpdated: '2024-01-08' },
    { id: 4, x: 80, y: 60, status: 'approved', area: '4.1 acres', owner: 'Sunita Devi', village: 'Oak Grove', coordinates: '19.0770°N, 72.8790°E', claimType: 'Community Forest Resource Rights', lastUpdated: '2024-01-12' },
    { id: 5, x: 30, y: 70, status: 'pending', area: '2.9 acres', owner: 'Vikram Patel', village: 'Pine Valley', coordinates: '19.0772°N, 72.8792°E', claimType: 'Individual Forest Rights', lastUpdated: '2024-01-14' },
    { id: 6, x: 70, y: 40, status: 'approved', area: '5.5 acres', owner: 'Meera Joshi', village: 'Cedar Woods', coordinates: '19.0775°N, 72.8795°E', claimType: 'Community Forest Rights', lastUpdated: '2024-01-11' },
    { id: 7, x: 50, y: 80, status: 'rejected', area: '1.3 acres', owner: 'Ravi Kumar', village: 'Maple Ridge', coordinates: '19.0778°N, 72.8798°E', claimType: 'Individual Forest Rights', lastUpdated: '2024-01-09' },
    { id: 8, x: 90, y: 20, status: 'pending', area: '3.7 acres', owner: 'Kavita Singh', village: 'Birch Forest', coordinates: '19.0780°N, 72.8800°E', claimType: 'Community Forest Resource Rights', lastUpdated: '2024-01-13' }
  ]);

  const filteredPlots = plots.filter(plot => {
    const matchesStatus = filterStatus === 'all' || plot.status === filterStatus;
    const matchesSearch = searchQuery === '' ||
      plot.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plot.village.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getPlotColor = (status) => {
    switch (status) {
      case 'approved':
        return '#10B981'; // Green
      case 'pending':
        return '#F59E0B'; // Yellow
      case 'rejected':
        return '#EF4444'; // Red
      default:
        return '#6B7280'; // Gray
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Pending Review';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleRefresh = () => {
    setZoom(1);
    setSelectedPlot(null);
    setSearchQuery('');
    setFilterStatus('all');
  };

  const handlePlotClick = (plot) => {
    setSelectedPlot(plot);
    // Simulate updating coordinates based on plot
    setCoordinates({
      lat: parseFloat(plot.coordinates.split('°')[0].split('N')[0]),
      lng: parseFloat(plot.coordinates.split('°')[1].split('E')[0])
    });
  };

  const getLayerBackground = () => {
    switch (mapLayer) {
      case 'satellite':
        return 'bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20';
      case 'terrain':
        return 'bg-gradient-to-br from-green-100 to-brown-100 dark:from-green-900/20 dark:to-brown-900/20';
      case 'hybrid':
        return 'bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900/20 dark:to-blue-900/20';
      default:
        return 'bg-green-50 dark:bg-green-900/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          GIS Land Overview
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
            title="Toggle Legend"
          >
            <Info className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
            title="Filters"
          >
            <Filter className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
            title="Reset View"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by owner or village..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  value={mapLayer}
                  onChange={(e) => setMapLayer(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="satellite">Satellite View</option>
                  <option value="terrain">Terrain View</option>
                  <option value="hybrid">Hybrid View</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Container */}
      <div className={`relative rounded-lg p-4 mb-4 transition-all duration-300 ${getLayerBackground()}`}>
        <div
          className="relative bg-green-100 dark:bg-green-800/50 rounded border-2 border-green-200 dark:border-green-700 overflow-hidden"
          style={{
            width: '100%',
            height: '350px',
            transform: `scale(${zoom})`,
            transformOrigin: 'center',
            transition: 'transform 0.3s ease'
          }}
        >
          {/* Grid Lines */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <div
                key={`h-${i}`}
                className="absolute w-full border-t border-green-200 dark:border-green-600 opacity-20"
                style={{ top: `${i * 8.33}%` }}
              />
            ))}
            {[...Array(12)].map((_, i) => (
              <div
                key={`v-${i}`}
                className="absolute h-full border-l border-green-200 dark:border-green-600 opacity-20"
                style={{ left: `${i * 8.33}%` }}
              />
            ))}
          </div>

          {/* Village Boundaries (simulated) */}
          <div className="absolute inset-4 border-2 border-dashed border-blue-400 opacity-30 rounded-lg">
            <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
              Forest Reserve Boundary
            </div>
          </div>

          {/* Plots */}
          <AnimatePresence>
            {filteredPlots.map((plot) => (
              <motion.div
                key={plot.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ delay: plot.id * 0.05 }}
                className="absolute cursor-pointer group"
                style={{
                  left: `${plot.x}%`,
                  top: `${plot.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handlePlotClick(plot)}
              >
                <div
                  className="w-5 h-5 rounded-full border-3 border-white shadow-lg group-hover:scale-125 transition-all duration-200"
                  style={{ backgroundColor: getPlotColor(plot.status) }}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg">
                    {plot.owner} - {plot.area}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Selected Plot Highlight */}
          {selectedPlot && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute pointer-events-none z-20"
              style={{
                left: `${selectedPlot.x}%`,
                top: `${selectedPlot.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="w-8 h-8 border-3 border-blue-500 rounded-full animate-ping" />
              <div className="absolute inset-0 w-8 h-8 border-2 border-blue-400 rounded-full" />
            </motion.div>
          )}

          {/* Coordinates Display */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {coordinates.lat.toFixed(4)}°N, {coordinates.lng.toFixed(4)}°E
          </div>
        </div>
      </div>

      {/* Legend */}
      <AnimatePresence>
        {showLegend && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Approved</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Rejected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-dashed"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Forest Boundary</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plot Details */}
      <AnimatePresence>
        {selectedPlot && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Plot #{selectedPlot.id}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                selectedPlot.status === 'approved'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : selectedPlot.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }`}>
                {getStatusLabel(selectedPlot.status)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Owner:</span>
                <p className="font-medium text-gray-900 dark:text-white">{selectedPlot.owner}</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Area:</span>
                <p className="font-medium text-gray-900 dark:text-white">{selectedPlot.area}</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Village:</span>
                <p className="font-medium text-gray-900 dark:text-white">{selectedPlot.village}</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Claim Type:</span>
                <p className="font-medium text-gray-900 dark:text-white">{selectedPlot.claimType}</p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600 dark:text-gray-400">Coordinates:</span>
                <p className="font-medium text-gray-900 dark:text-white font-mono text-xs">{selectedPlot.coordinates}</p>
              </div>
            </div>
            <div className="mt-3 flex space-x-2">
              <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                View Details
              </button>
              <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
                Navigate Here
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {filteredPlots.filter(p => p.status === 'approved').length}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Approved Plots</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {filteredPlots.filter(p => p.status === 'pending').length}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Pending Review</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {filteredPlots.filter(p => p.status === 'rejected').length}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Rejected Plots</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {filteredPlots.length}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Total Plots</div>
        </div>
      </div>
    </motion.div>
  );
};

export default GISMiniMap;
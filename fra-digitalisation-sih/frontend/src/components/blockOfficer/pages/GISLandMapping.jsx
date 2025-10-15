import { motion } from 'framer-motion';
import { Download, Filter, Layers, Map, Navigation, Share2, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';

const GISLandMapping = () => {
  const [activeLayers, setActiveLayers] = useState({
    landUse: true,
    forestCover: true,
    roads: false,
    waterBodies: true,
    claimBoundaries: true,
    villages: true
  });

  const [mapView, setMapView] = useState('satellite');
  const [zoomLevel, setZoomLevel] = useState(12);

  const layers = [
    { id: 'landUse', name: 'Land Use Classification', color: 'bg-green-500', description: 'Agricultural, forest, and urban areas' },
    { id: 'forestCover', name: 'Forest Cover', color: 'bg-green-700', description: 'Dense and sparse forest areas' },
    { id: 'roads', name: 'Road Network', color: 'bg-gray-600', description: 'Highways, roads, and paths' },
    { id: 'waterBodies', name: 'Water Bodies', color: 'bg-blue-500', description: 'Rivers, lakes, and reservoirs' },
    { id: 'claimBoundaries', name: 'Claim Boundaries', color: 'bg-purple-500', description: 'Active and approved claims' },
    { id: 'villages', name: 'Village Boundaries', color: 'bg-orange-500', description: 'Gram Sabha village areas' }
  ];

  const claimStats = [
    { status: 'Approved', count: 1056, color: 'bg-green-500', percentage: 84.7 },
    { status: 'Pending', count: 89, color: 'bg-yellow-500', percentage: 7.1 },
    { status: 'Rejected', count: 102, color: 'bg-red-500', percentage: 8.2 }
  ];

  const toggleLayer = (layerId) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  };

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={sectionVariants} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">GIS Land Mapping</h1>
            <p className="text-gray-600 mt-1">Interactive mapping system for forest rights claims</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#044e2b]">1,247</p>
              <p className="text-sm text-gray-600">Total Claims Mapped</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">84.7%</p>
              <p className="text-sm text-gray-600">Approval Rate</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Map Area */}
        <motion.div variants={sectionVariants} className="xl:col-span-3">
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Interactive Map - Alot Block</h3>
                <div className="flex items-center space-x-2">
                  <select
                    value={mapView}
                    onChange={(e) => setMapView(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="satellite">Satellite</option>
                    <option value="terrain">Terrain</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                  <button className="p-2 bg-[#044e2b] text-[#d4c5a9] rounded hover:bg-[#0a5a35]">
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-[#044e2b] text-[#d4c5a9] rounded hover:bg-[#0a5a35]">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Map Container */}
            <div className="relative h-96 bg-gray-100">
              {/* Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-blue-100 to-yellow-100 opacity-50"></div>

              {/* Map Placeholder */}
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center">
                  <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Interactive GIS Map</p>
                  <p className="text-gray-400 text-sm">Map integration would be implemented here</p>
                  <p className="text-gray-400 text-xs mt-2">Zoom: {zoomLevel}x | View: {mapView}</p>
                </div>
              </div>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <button
                  onClick={() => setZoomLevel(prev => Math.min(prev + 1, 20))}
                  className="p-2 bg-white rounded shadow hover:shadow-md transition-shadow"
                >
                  <ZoomIn className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => setZoomLevel(prev => Math.max(prev - 1, 1))}
                  className="p-2 bg-white rounded shadow hover:shadow-md transition-shadow"
                >
                  <ZoomOut className="h-4 w-4 text-gray-600" />
                </button>
                <button className="p-2 bg-white rounded shadow hover:shadow-md transition-shadow">
                  <Navigation className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow p-3">
                <div className="text-xs font-medium text-gray-800 mb-2">Claim Status</div>
                <div className="space-y-1">
                  {claimStats.map((stat) => (
                    <div key={stat.status} className="flex items-center space-x-2">
                      <div className={`w-3 h-3 ${stat.color} rounded`}></div>
                      <span className="text-xs text-gray-600">{stat.status}</span>
                      <span className="text-xs text-gray-500">({stat.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coordinates Display */}
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow px-3 py-2">
                <div className="text-xs text-gray-600">
                  Lat: 23.4567° N | Lng: 76.8901° E
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar Controls */}
        <motion.div variants={sectionVariants} className="space-y-6">
          {/* Layer Controls */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Layers className="h-5 w-5 mr-2" />
                Map Layers
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {layers.map((layer) => (
                <div key={layer.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleLayer(layer.id)}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        activeLayers[layer.id]
                          ? 'bg-[#044e2b] border-[#044e2b]'
                          : 'border-gray-300'
                      }`}
                    >
                      {activeLayers[layer.id] && (
                        <div className="w-2 h-2 bg-[#d4c5a9] rounded-full"></div>
                      )}
                    </button>
                    <div className={`w-3 h-3 ${layer.color} rounded`}></div>
                    <span className="text-sm text-gray-700">{layer.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Controls */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Claim Status
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm">
                  <option>All Status</option>
                  <option>Approved</option>
                  <option>Pending</option>
                  <option>Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Claim Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm">
                  <option>All Types</option>
                  <option>IFR</option>
                  <option>CR</option>
                  <option>CFR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm">
                  <option>All Time</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                  <option>Last year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Block Statistics</h3>
            </div>
            <div className="p-4 space-y-3">
              {claimStats.map((stat) => (
                <div key={stat.status} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{stat.status}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{stat.count}</span>
                    <span className="text-xs text-gray-500">({stat.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GISLandMapping;
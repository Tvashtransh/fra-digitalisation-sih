import { motion } from 'framer-motion';
import { Layers, Map, Navigation, ZoomIn, ZoomOut } from 'lucide-react';

const BlockOfficerGISMiniMap = () => {
  const mapStats = [
    { label: 'Total Claims', value: '1,247', color: 'text-blue-600' },
    { label: 'Approved', value: '1,056', color: 'text-green-600' },
    { label: 'Pending', value: '89', color: 'text-yellow-600' },
    { label: 'Rejected', value: '102', color: 'text-red-600' }
  ];

  const layers = [
    { name: 'Land Use', active: true, color: 'bg-green-500' },
    { name: 'Forest Cover', active: true, color: 'bg-green-700' },
    { name: 'Roads', active: false, color: 'bg-gray-500' },
    { name: 'Water Bodies', active: true, color: 'bg-blue-500' },
    { name: 'Claim Boundaries', active: true, color: 'bg-purple-500' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">GIS Land Mapping</h3>
        <p className="text-sm text-gray-600 mt-1">Interactive map overview</p>
      </div>

      <div className="p-6">
        {/* Map Container */}
        <div className="relative bg-gray-100 rounded-lg h-64 mb-4 overflow-hidden">
          {/* Map Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-gradient-to-br from-green-200 to-blue-200"></div>
          </div>

          {/* Map Content Placeholder */}
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center">
              <Map className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Interactive GIS Map</p>
              <p className="text-gray-400 text-xs">Click to open full map view</p>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <button className="p-2 bg-white rounded shadow hover:shadow-md transition-shadow">
              <ZoomIn className="h-4 w-4 text-gray-600" />
            </button>
            <button className="p-2 bg-white rounded shadow hover:shadow-md transition-shadow">
              <ZoomOut className="h-4 w-4 text-gray-600" />
            </button>
            <button className="p-2 bg-white rounded shadow hover:shadow-md transition-shadow">
              <Navigation className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow p-3">
            <div className="text-xs font-medium text-gray-800 mb-2">Legend</div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs text-gray-600">Approved</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-xs text-gray-600">Pending</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-xs text-gray-600">Rejected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {mapStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-3 bg-gray-50 rounded-lg"
            >
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Layer Controls */}
        <div>
          <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
            <Layers className="h-4 w-4 mr-2" />
            Map Layers
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {layers.map((layer, index) => (
              <motion.button
                key={layer.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center space-x-2 p-2 rounded text-xs transition-all ${
                  layer.active
                    ? 'bg-[#044e2b] text-[#d4c5a9]'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${layer.color}`}></div>
                <span>{layer.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <button className="flex-1 bg-[#044e2b] text-[#d4c5a9] px-4 py-2 rounded text-sm font-medium hover:bg-[#0a5a35] transition-colors">
              Open Full Map
            </button>
            <button className="flex-1 border border-[#044e2b] text-[#044e2b] px-4 py-2 rounded text-sm font-medium hover:bg-[#044e2b] hover:text-[#d4c5a9] transition-colors">
              Export Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockOfficerGISMiniMap;
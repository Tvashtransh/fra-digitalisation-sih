import {
    Download,
    Eye,
    Filter,
    Map,
    Settings,
    ZoomIn
} from 'lucide-react';

const GISMappingMonitoring = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">GIS Mapping & Monitoring</h1>
            <p className="text-gray-600 mt-1">Comprehensive geographical monitoring of forest rights claims</p>
          </div>

          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-[#5a1c2d] text-white rounded-lg hover:bg-[#4a1825] transition-colors">
              <Download className="h-4 w-4" />
              <span>Export Map</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-[#5a1c2d] text-[#5a1c2d] rounded-lg hover:bg-[#5a1c2d] hover:text-white transition-colors">
              <Settings className="h-4 w-4" />
              <span>Map Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Layer Controls */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Map Layers</h3>

          <div className="space-y-3">
            {[
              { name: 'Claim Plots', color: '#ef4444', active: true },
              { name: 'Forest Cover', color: '#10b981', active: true },
              { name: 'Water Bodies', color: '#3b82f6', active: false },
              { name: 'Road Network', color: '#6b7280', active: true },
              { name: 'Block Boundaries', color: '#d4af37', active: true }
            ].map((layer, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: layer.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{layer.name}</span>
                </div>
                <button className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                  layer.active ? 'bg-[#5a1c2d] border-[#5a1c2d]' : 'border-gray-300'
                }`}>
                  <Eye className={`h-3 w-3 ${layer.active ? 'text-white' : 'text-gray-400'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Map Statistics */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Map Statistics</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Area</span>
              <span className="text-sm font-semibold text-gray-800">4,567 km²</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Forest Cover</span>
              <span className="text-sm font-semibold text-green-600">2,134 km²</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Claim Plots</span>
              <span className="text-sm font-semibold text-blue-600">1,247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Mapped Claims</span>
              <span className="text-sm font-semibold text-purple-600">1,089</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>

          <div className="space-y-3">
            <button className="w-full flex items-center space-x-2 px-4 py-2 bg-[#5a1c2d] text-white rounded-lg hover:bg-[#4a1825] transition-colors">
              <ZoomIn className="h-4 w-4" />
              <span className="text-sm">Zoom to District</span>
            </button>
            <button className="w-full flex items-center space-x-2 px-4 py-2 border border-[#5a1c2d] text-[#5a1c2d] rounded-lg hover:bg-[#5a1c2d] hover:text-white transition-colors">
              <Filter className="h-4 w-4" />
              <span className="text-sm">Filter Claims</span>
            </button>
            <button className="w-full flex items-center space-x-2 px-4 py-2 border border-[#5a1c2d] text-[#5a1c2d] rounded-lg hover:bg-[#5a1c2d] hover:text-white transition-colors">
              <Download className="h-4 w-4" />
              <span className="text-sm">Export Data</span>
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Legend</h3>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-700">Approved Claims</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm text-gray-700">Pending Claims</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-700">Rejected Claims</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-700">Forest Areas</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span className="text-sm text-gray-700">Road Network</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Map Area */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="h-96 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Interactive GIS Map</h3>
            <p className="text-gray-600">District-level geographical monitoring system</p>
            <p className="text-sm text-gray-500 mt-2">Map integration and real-time data visualization</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GISMappingMonitoring;
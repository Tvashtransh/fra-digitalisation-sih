import { motion } from 'framer-motion';
import {
    Droplets,
    Eye,
    EyeOff,
    Filter,
    Layers,
    Map,
    MapPin,
    RotateCcw,
    Route,
    TreePine,
    ZoomIn,
    ZoomOut
} from 'lucide-react';
import { useState } from 'react';

const DistrictOfficerGISMap = () => {
  const [selectedLayer, setSelectedLayer] = useState('claims');
  const [showFilters, setShowFilters] = useState(false);

  const layers = [
    { id: 'claims', name: 'Claim Plots', icon: MapPin, color: '#044e2b', active: true },
    { id: 'forest', name: 'Forest Cover', icon: TreePine, color: '#0a5a35', active: true },
    { id: 'water', name: 'Water Bodies', icon: Droplets, color: '#d4c5a9', active: false },
    { id: 'roads', name: 'Road Network', icon: Route, color: '#b8a383', active: true }
  ];

  const claimPlots = [
    { id: 1, lat: 23.5, lng: 75.0, status: 'approved', size: '2.5 acres', owner: 'Ram Prasad' },
    { id: 2, lat: 23.6, lng: 75.1, status: 'pending', size: '1.8 acres', owner: 'Sita Bai' },
    { id: 3, lat: 23.4, lng: 74.9, status: 'rejected', size: '3.2 acres', owner: 'Mohan Lal' },
    { id: 4, lat: 23.7, lng: 75.2, status: 'approved', size: '1.5 acres', owner: 'Ravi Kumar' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#044e2b';
      case 'pending': return '#d4c5a9';
      case 'rejected': return '#8b4513';
      default: return '#b8a383';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-[#d4c5a9]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Map className="h-5 w-5 text-[#044e2b]" />
            <h2 className="text-xl font-bold text-[#044e2b]">
              District GIS Map
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span className="text-sm">Filters</span>
            </button>

            <div className="flex items-center space-x-1">
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <ZoomIn className="h-4 w-4" />
              </button>
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <ZoomOut className="h-4 w-4" />
              </button>
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Map Container */}
        <div className="h-96 bg-gradient-to-br from-[#d4c5a9]/30 to-[#044e2b]/20 relative overflow-hidden">
          {/* Mock Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#d4c5a9]/40 to-[#044e2b]/30">
            {/* District Boundary */}
            <svg className="w-full h-full" viewBox="0 0 400 300">
              <path
                d="M50,50 L350,50 L350,250 L50,250 Z"
                fill="none"
                stroke="#044e2b"
                strokeWidth="3"
                opacity="0.5"
              />

              {/* Block Boundaries */}
              <path d="M50,50 L200,50 L200,150 L50,150 Z" fill="none" stroke="#d4c5a9" strokeWidth="2" opacity="0.6" />
              <path d="M200,50 L350,50 L350,150 L200,150 Z" fill="none" stroke="#d4c5a9" strokeWidth="2" opacity="0.6" />
              <path d="M50,150 L200,150 L200,250 L50,250 Z" fill="none" stroke="#d4c5a9" strokeWidth="2" opacity="0.6" />
              <path d="M200,150 L350,150 L350,250 L200,250 Z" fill="none" stroke="#d4c5a9" strokeWidth="2" opacity="0.6" />

              {/* Forest Areas */}
              <circle cx="100" cy="100" r="30" fill="#044e2b" opacity="0.4" />
              <circle cx="300" cy="200" r="25" fill="#044e2b" opacity="0.4" />
              <circle cx="150" cy="180" r="20" fill="#044e2b" opacity="0.4" />

              {/* Water Bodies */}
              <ellipse cx="250" cy="80" rx="15" ry="8" fill="#d4c5a9" opacity="0.5" />
              <ellipse cx="120" cy="220" rx="12" ry="6" fill="#d4c5a9" opacity="0.5" />

              {/* Roads */}
              <path d="M50,100 L350,100" stroke="#b8a383" strokeWidth="3" opacity="0.7" />
              <path d="M150,50 L150,250" stroke="#b8a383" strokeWidth="2" opacity="0.7" />
            </svg>
          </div>

          {/* Claim Plot Markers */}
          {claimPlots.map((plot) => (
            <motion.div
              key={plot.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute cursor-pointer"
              style={{
                left: `${20 + (plot.id * 15)}%`,
                top: `${20 + (plot.id * 10)}%`
              }}
              whileHover={{ scale: 1.2 }}
            >
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
                style={{ backgroundColor: getStatusColor(plot.status) }}
                title={`${plot.owner} - ${plot.size} (${plot.status})`}
              ></div>
            </motion.div>
          ))}

          {/* Block Labels */}
          <div className="absolute top-4 left-4 text-xs font-semibold text-gray-700 bg-white/80 px-2 py-1 rounded">
            Sailana Block
          </div>
          <div className="absolute top-4 right-4 text-xs font-semibold text-gray-700 bg-white/80 px-2 py-1 rounded">
            Ratlam Block
          </div>
          <div className="absolute bottom-4 left-4 text-xs font-semibold text-gray-700 bg-white/80 px-2 py-1 rounded">
            Alot Block
          </div>
          <div className="absolute bottom-4 right-4 text-xs font-semibold text-gray-700 bg-white/80 px-2 py-1 rounded">
            Jaora Block
          </div>
        </div>

        {/* Layer Controls */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center space-x-2 mb-3">
            <Layers className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-800">Layers</span>
          </div>

          <div className="space-y-2">
            {layers.map((layer) => {
              const Icon = layer.icon;
              return (
                <div
                  key={layer.id}
                  className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${
                    layer.active ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedLayer(layer.id)}
                >
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: layer.color }}
                  ></div>
                  <Icon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{layer.name}</span>
                  {layer.active ? (
                    <Eye className="h-4 w-4 text-gray-600 ml-auto" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400 ml-auto" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Legend</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#044e2b]"></div>
              <span className="text-xs text-[#044e2b]/80">Approved</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#d4c5a9]"></div>
              <span className="text-xs text-[#044e2b]/80">Pending</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#8b4513]"></div>
              <span className="text-xs text-[#044e2b]/80">Rejected</span>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 min-w-[250px]"
          >
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Filters</h4>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-[#044e2b]/80">Block</label>
                <select className="w-full mt-1 px-3 py-2 border border-[#d4c5a9]/50 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#044e2b] focus:border-transparent bg-white">
                  <option>All Blocks</option>
                  <option>Sailana</option>
                  <option>Ratlam</option>
                  <option>Alot</option>
                  <option>Jaora</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-[#044e2b]/80">Status</label>
                <select className="w-full mt-1 px-3 py-2 border border-[#d4c5a9]/50 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#044e2b] focus:border-transparent bg-white">
                  <option>All Status</option>
                  <option>Approved</option>
                  <option>Pending</option>
                  <option>Rejected</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-[#044e2b]/80">Claim Type</label>
                <select className="w-full mt-1 px-3 py-2 border border-[#d4c5a9]/50 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#044e2b] focus:border-transparent bg-white">
                  <option>All Types</option>
                  <option>IFR</option>
                  <option>CR</option>
                  <option>CFR</option>
                </select>
              </div>

              <button className="w-full bg-[#044e2b] text-white py-2 rounded text-sm hover:bg-[#0a5a35] transition-colors">
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Map Stats */}
      <div className="p-4 bg-[#d4c5a9]/20 border-t border-[#d4c5a9]/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-[#044e2b]">247</div>
            <div className="text-xs text-[#044e2b]/70">Total Plots</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[#044e2b]">189</div>
            <div className="text-xs text-[#044e2b]/70">Approved</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[#d4c5a9]">45</div>
            <div className="text-xs text-[#d4c5a9]/70">Pending</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[#8b4513]">13</div>
            <div className="text-xs text-[#8b4513]/70">Rejected</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistrictOfficerGISMap;
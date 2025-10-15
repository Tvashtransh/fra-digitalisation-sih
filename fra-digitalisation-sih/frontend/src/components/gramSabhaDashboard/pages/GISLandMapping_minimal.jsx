import { motion } from 'framer-motion';
import { Layers, Map } from 'lucide-react';
import { useState } from 'react';

const GISLandMapping = () => {
  const [selectedLayer, setSelectedLayer] = useState('satellite');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#044e2b]">GIS Land Mapping</h1>
          <p className="text-[#044e2b] opacity-80 mt-1">Interactive geographical mapping and land management</p>
        </div>
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-[#044e2b]" />
          <span className="text-sm text-gray-600">Layers</span>
        </div>
      </div>

      {/* Map Container Placeholder */}
      <div className="bg-white rounded-lg shadow-lg border-l-4 border-[#044e2b] p-6">
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
          <div className="text-center">
            <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">Interactive Map</h3>
            <p className="text-gray-500">Map functionality will be implemented here</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#044e2b] text-center">
          <h3 className="font-semibold text-[#044e2b] mb-2">Forest Analysis</h3>
          <p className="text-gray-600 text-sm">Analyze forest cover changes</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#044e2b] text-center">
          <h3 className="font-semibold text-[#044e2b] mb-2">Parcel Survey</h3>
          <p className="text-gray-600 text-sm">Conduct land parcel surveys</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#044e2b] text-center">
          <h3 className="font-semibold text-[#044e2b] mb-2">Terrain Mapping</h3>
          <p className="text-gray-600 text-sm">3D terrain visualization</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#044e2b] text-center">
          <h3 className="font-semibold text-[#044e2b] mb-2">Boundary Marking</h3>
          <p className="text-gray-600 text-sm">Mark land boundaries</p>
        </div>
      </div>
    </motion.div>
  );
};

export default GISLandMapping;
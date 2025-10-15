import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import { Layers, Map, Mountain, Satellite, TreePine } from 'lucide-react';
import { useRef, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const GISLandMapping = () => {
  const [selectedLayer, setSelectedLayer] = useState('satellite');
  const [zoomLevel, setZoomLevel] = useState(12);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Delhi coordinates
  const mapRef = useRef(null);

  // Map layers configuration
  const mapLayers = [
    {
      id: 'satellite',
      label: 'Satellite View',
      icon: Satellite,
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    },
    {
      id: 'terrain',
      label: 'Terrain Map',
      icon: Mountain,
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    },
    {
      id: 'osm',
      label: 'OpenStreetMap',
      icon: Map,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    {
      id: 'forest',
      label: 'Forest Cover',
      icon: TreePine,
      url: 'https://tiles.globalforestwatch.org/umd_tree_cover_loss/v1.7/tcd_30/{z}/{x}/{y}.png',
      attribution: 'Map data &copy; <a href="https://www.globalforestwatch.org/">Global Forest Watch</a>'
    }
  ];

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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Layer Controls */}
          <div className="bg-white rounded-lg shadow-lg border-l-4 border-[#044e2b]">
            <div className="bg-[#044e2b] text-[#d4c5a9] p-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Map Layers
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {mapLayers.map(layer => (
                <motion.button
                  key={layer.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedLayer(layer.id)}
                  className={`w-full p-3 rounded-lg font-semibold flex items-center gap-3 transition-colors ${
                    selectedLayer === layer.id
                      ? 'bg-[#044e2b] text-[#d4c5a9]'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <layer.icon className="h-4 w-4" />
                  {layer.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="lg:col-span-3">
        <div className="bg-[#044e2b] text-[#d4c5a9] p-4 flex justify-between items-center">
          <h3 className="font-semibold flex items-center gap-2">
            <Map className="h-5 w-5" />
            Interactive Map - {mapLayers.find(l => l.id === selectedLayer)?.label}
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <span>Zoom: {zoomLevel}</span>
          </div>
        </div>
        <div className="relative">
          <MapContainer
            center={mapCenter}
            zoom={zoomLevel}
            style={{ height: '600px', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              url={mapLayers.find(l => l.id === selectedLayer)?.url}
              attribution={mapLayers.find(l => l.id === selectedLayer)?.attribution}
            />
          </MapContainer>
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
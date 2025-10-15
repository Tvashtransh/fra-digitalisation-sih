import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map, Layers, ZoomIn, ZoomOut, RotateCcw, Download, Upload, Search, Filter, Satellite,
  TreePine, Home, Mountain, Edit, Trash2, Plus, Save, X, Ruler, Compass, Target,
  FileText, Settings, Eye, EyeOff, Navigation, Globe, MapPin, Square, Circle, Triangle
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, FeatureGroup, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const GISLandMapping = () => {
  const [selectedLayer, setSelectedLayer] = useState('satellite');
  const [searchLocation, setSearchLocation] = useState('');
  const [zoomLevel, setZoomLevel] = useState(12);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [showParcelForm, setShowParcelForm] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [measurementMode, setMeasurementMode] = useState(false);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Delhi coordinates
  const mapRef = useRef(null);

  // Land parcels state
  const [landParcels, setLandParcels] = useState([
    {
      id: 'LP001',
      owner: 'Rajesh Kumar',
      area: '2.5 acres',
      coordinates: [28.6139, 77.2090],
      polygon: [
        [28.6139, 77.2090],
        [28.6140, 77.2090],
        [28.6140, 77.2091],
        [28.6139, 77.2091]
      ],
      landType: 'Forest Land',
      status: 'claimed',
      village: 'Bamboo Village',
      description: 'Traditional forest land with bamboo groves',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: 'LP002',
      owner: 'Priya Sharma',
      area: '1.8 acres',
      coordinates: [28.6145, 77.2095],
      polygon: [
        [28.6145, 77.2095],
        [28.6146, 77.2095],
        [28.6146, 77.2096],
        [28.6145, 77.2096]
      ],
      landType: 'Agricultural Land',
      status: 'verified',
      village: 'Teak Forest',
      description: 'Agricultural land with teak plantation',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-12'
    },
    {
      id: 'LP003',
      owner: 'Amit Singh',
      area: '3.2 acres',
      coordinates: [28.6150, 77.2100],
      polygon: [
        [28.6150, 77.2100],
        [28.6151, 77.2100],
        [28.6151, 77.2101],
        [28.6150, 77.2101]
      ],
      landType: 'Forest Land',
      status: 'disputed',
      village: 'Sal Forest',
      description: 'Disputed forest land with sal trees',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-14'
    }
  ]);

  // Form state for new parcel
  const [parcelForm, setParcelForm] = useState({
    owner: '',
    area: '',
    landType: 'Forest Land',
    village: '',
    description: '',
    status: 'claimed'
  });

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

  // Drawing tools state
  const [drawMode, setDrawMode] = useState(null);
  const [drawnItems, setDrawnItems] = useState(new L.FeatureGroup());

  // Search results
  const [searchResults, setSearchResults] = useState([]);

  // Statistics
  const [stats, setStats] = useState({
    totalParcels: 0,
    verifiedLand: 0,
    disputedClaims: 0,
    totalArea: 0
  });

  // Update statistics
  useEffect(() => {
    const totalParcels = landParcels.length;
    const verifiedLand = landParcels.filter(p => p.status === 'verified').length;
    const disputedClaims = landParcels.filter(p => p.status === 'disputed').length;
    const totalArea = landParcels.reduce((sum, parcel) => {
      const area = parseFloat(parcel.area.split(' ')[0]);
      return sum + area;
    }, 0);

    setStats({
      totalParcels,
      verifiedLand,
      disputedClaims,
      totalArea: totalArea.toFixed(1)
    });
  }, [landParcels]);

  // Handle location search
  const handleSearch = async () => {
    if (!searchLocation.trim()) return;

    try {
      // Mock geocoding - in real app, use a geocoding service
      const mockResults = [
        { name: 'Bamboo Village', coordinates: [28.6139, 77.2090] },
        { name: 'Teak Forest', coordinates: [28.6145, 77.2095] },
        { name: 'Sal Forest', coordinates: [28.6150, 77.2100] }
      ].filter(result =>
        result.name.toLowerCase().includes(searchLocation.toLowerCase())
      );

      setSearchResults(mockResults);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  // Handle parcel creation
  const handleCreateParcel = () => {
    if (!parcelForm.owner || !parcelForm.area || !parcelForm.village) return;

    const newParcel = {
      id: `LP${String(landParcels.length + 1).padStart(3, '0')}`,
      ...parcelForm,
      coordinates: mapCenter,
      polygon: [
        [mapCenter[0], mapCenter[1]],
        [mapCenter[0] + 0.001, mapCenter[1]],
        [mapCenter[0] + 0.001, mapCenter[1] + 0.001],
        [mapCenter[0], mapCenter[1] + 0.001]
      ],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setLandParcels(prev => [...prev, newParcel]);
    setShowParcelForm(false);
    setParcelForm({
      owner: '',
      area: '',
      landType: 'Forest Land',
      village: '',
      description: '',
      status: 'claimed'
    });
  };

  // Handle parcel deletion
  const handleDeleteParcel = (parcelId) => {
    setLandParcels(prev => prev.filter(p => p.id !== parcelId));
  };

  // Export data
  const handleExport = (format) => {
    const data = landParcels.map(parcel => ({
      id: parcel.id,
      owner: parcel.owner,
      area: parcel.area,
      coordinates: parcel.coordinates,
      landType: parcel.landType,
      status: parcel.status,
      village: parcel.village,
      description: parcel.description
    }));

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      downloadFile(blob, 'land_parcels.json');
    } else if (format === 'csv') {
      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).map(val =>
          typeof val === 'object' ? JSON.stringify(val) : val
        ).join(','))
      ].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      downloadFile(blob, 'land_parcels.csv');
    }
  };

  // Import data
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setLandParcels(prev => [...prev, ...data]);
      } catch (error) {
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  };

  // Utility function to download files
  const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return '#10B981';
      case 'claimed': return '#F59E0B';
      case 'disputed': return '#EF4444';
      default: return '#6B7280';
    }
  };

  // Get land type icon
  const getLandTypeIcon = (type) => {
    switch (type) {
      case 'Forest Land': return TreePine;
      case 'Agricultural Land': return Home;
      default: return Square;
    }
  };

  // Map component
  const MapComponent = () => {
    const map = useMap();

    useEffect(() => {
      if (map) {
        mapRef.current = map;
        map.on('zoomend', () => {
          setZoomLevel(map.getZoom());
        });
        map.on('moveend', () => {
          setMapCenter([map.getCenter().lat, map.getCenter().lng]);
        });
      }
    }, [map]);

    return null;
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={sectionVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#044e2b]">GIS Land Mapping</h1>
          <p className="text-[#044e2b] opacity-80 mt-1">Interactive geographical mapping and land management</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowParcelForm(true)}
            className="bg-[#044e2b] text-[#d4c5a9] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#0a5a35] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Parcel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('import-file').click()}
            className="bg-[#d4c5a9] text-[#044e2b] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#c4b599] transition-colors"
          >
            <Upload className="h-4 w-4" />
            Import
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleExport('json')}
            className="bg-[#044e2b] text-[#d4c5a9] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#0a5a35] transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </motion.button>
          <input
            id="import-file"
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div variants={sectionVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#044e2b]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#044e2b] opacity-80 text-sm font-medium">Total Parcels</p>
              <p className="text-2xl font-bold text-[#044e2b]">{stats.totalParcels}</p>
            </div>
            <Home className="h-8 w-8 text-[#044e2b]" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 opacity-80 text-sm font-medium">Verified Land</p>
              <p className="text-2xl font-bold text-green-600">{stats.verifiedLand}</p>
            </div>
            <TreePine className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 opacity-80 text-sm font-medium">Disputed Claims</p>
              <p className="text-2xl font-bold text-red-600">{stats.disputedClaims}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 opacity-80 text-sm font-medium">Total Area</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalArea} acres</p>
            </div>
            <Square className="h-8 w-8 text-blue-600" />
          </div>
        </motion.div>
      </motion.div>

      {/* Map Controls */}
      <motion.div variants={sectionVariants} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#044e2b]">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search Location */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search location, village, or coordinates..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#044e2b] text-[#d4c5a9] p-2 rounded-lg hover:bg-[#0a5a35] transition-colors"
              >
                <Search className="h-4 w-4" />
              </motion.button>
            </div>
          </div>

          {/* Layer Selection */}
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-[#044e2b]" />
            <select
              value={selectedLayer}
              onChange={(e) => setSelectedLayer(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
            >
              {mapLayers.map(layer => (
                <option key={layer.id} value={layer.id}>{layer.label}</option>
              ))}
            </select>
          </div>

          {/* Drawing Tools */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDrawingMode(!isDrawingMode)}
              className={`p-2 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
                isDrawingMode
                  ? 'bg-[#044e2b] text-[#d4c5a9]'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Edit className="h-4 w-4" />
              Draw
            </motion.button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (mapRef.current) {
                  const currentZoom = mapRef.current.getZoom();
                  mapRef.current.setZoom(Math.min(currentZoom + 1, 20));
                }
              }}
              className="p-2 bg-[#044e2b] text-[#d4c5a9] rounded-lg hover:bg-[#0a5a35] transition-colors"
            >
              <ZoomIn className="h-4 w-4" />
            </motion.button>
            <span className="text-sm font-medium text-[#044e2b] min-w-[3rem] text-center">
              {zoomLevel}x
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (mapRef.current) {
                  const currentZoom = mapRef.current.getZoom();
                  mapRef.current.setZoom(Math.max(currentZoom - 1, 1));
                }
              }}
              className="p-2 bg-[#044e2b] text-[#d4c5a9] rounded-lg hover:bg-[#0a5a35] transition-colors"
            >
              <ZoomOut className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (mapRef.current) {
                  mapRef.current.setZoom(12);
                  mapRef.current.setView([28.6139, 77.2090]);
                }
              }}
              className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              title="Reset View"
            >
              <RotateCcw className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <motion.div variants={sectionVariants} className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-[#044e2b]">
            {/* Map Header */}
            <div className="bg-[#044e2b] text-[#d4c5a9] p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                <span className="font-semibold">Interactive Map</span>
              </div>
              <div className="text-sm opacity-80">
                Current Layer: {mapLayers.find(l => l.id === selectedLayer)?.label}
              </div>
            </div>

            {/* Interactive Map */}
            <div className="relative h-96">
              <MapContainer
                center={mapCenter}
                zoom={zoomLevel}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
              >
                <MapComponent />

                {/* Base Layer */}
                <TileLayer
                  url={mapLayers.find(l => l.id === selectedLayer)?.url}
                  attribution={mapLayers.find(l => l.id === selectedLayer)?.attribution}
                />

                {/* Land Parcels */}
                {landParcels.map((parcel) => (
                  <div key={parcel.id}>
                    <Polygon
                      positions={parcel.polygon}
                      pathOptions={{
                        color: getStatusColor(parcel.status),
                        fillColor: getStatusColor(parcel.status),
                        fillOpacity: 0.3,
                        weight: 2
                      }}
                    />
                    <Marker position={parcel.coordinates}>
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold text-[#044e2b]">{parcel.id}</h3>
                          <p className="text-sm text-gray-600">Owner: {parcel.owner}</p>
                          <p className="text-sm text-gray-600">Area: {parcel.area}</p>
                          <p className="text-sm text-gray-600">Type: {parcel.landType}</p>
                          <p className="text-sm text-gray-600">Village: {parcel.village}</p>
                          <div className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                            parcel.status === 'verified' ? 'bg-green-100 text-green-800' :
                            parcel.status === 'claimed' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {parcel.status}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  </div>
                ))}

                {/* Drawing Tools */}
                {isDrawingMode && (
                  <FeatureGroup>
                    <EditControl
                      position="topright"
                      onCreated={(e) => {
                        console.log('Drawing created:', e);
                      }}
                      draw={{
                        rectangle: true,
                        polygon: true,
                        circle: true,
                        marker: true,
                        polyline: false,
                        circlemarker: false
                      }}
                    />
                  </FeatureGroup>
                )}
              </MapContainer>
            </div>
          </div>
        </motion.div>

        {/* Sidebar Panel */}
        <motion.div variants={sectionVariants} className="space-y-6">
          {/* Land Parcels List */}
          <div className="bg-white rounded-lg shadow-lg border-l-4 border-[#044e2b]">
            <div className="bg-[#044e2b] text-[#d4c5a9] p-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Home className="h-5 w-5" />
                Land Parcels ({landParcels.length})
              </h3>
            </div>
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
              {landParcels.map((parcel, index) => {
                const LandIcon = getLandTypeIcon(parcel.landType);
                return (
                  <motion.div
                    key={parcel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedParcel(parcel)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <LandIcon className="h-4 w-4 text-[#044e2b]" />
                        <span className="font-semibold text-[#044e2b] text-sm">{parcel.id}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`text-xs px-2 py-1 rounded ${
                          parcel.status === 'verified' ? 'bg-green-100 text-green-800' :
                          parcel.status === 'claimed' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {parcel.status}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteParcel(parcel.id);
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </motion.button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div><strong>Owner:</strong> {parcel.owner}</div>
                      <div><strong>Area:</strong> {parcel.area}</div>
                      <div><strong>Type:</strong> {parcel.landType}</div>
                      <div><strong>Village:</strong> {parcel.village}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Search Results */}
          <AnimatePresence>
            {showSearchResults && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-lg shadow-lg border-l-4 border-[#044e2b]"
              >
                <div className="bg-[#044e2b] text-[#d4c5a9] p-4 flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Search Results
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowSearchResults(false)}
                    className="text-[#d4c5a9] hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                </div>
                <div className="p-4 space-y-2">
                  {searchResults.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={() => {
                        if (mapRef.current) {
                          mapRef.current.setView(result.coordinates, 15);
                        }
                        setShowSearchResults(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#044e2b]" />
                        <span className="text-sm font-medium">{result.name}</span>
                      </div>
                      <Navigation className="h-4 w-4 text-gray-400" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={sectionVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: TreePine, label: 'Forest Analysis', desc: 'Analyze forest cover changes', action: () => console.log('Forest analysis') },
          { icon: Ruler, label: 'Measure Distance', desc: 'Calculate distances on map', action: () => setMeasurementMode(!measurementMode) },
          { icon: Compass, label: 'Navigation', desc: 'Get directions and routes', action: () => console.log('Navigation') },
          { icon: FileText, label: 'Generate Report', desc: 'Export detailed land reports', action: () => handleExport('csv') }
        ].map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            onClick={action.action}
            className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#044e2b] text-center cursor-pointer"
          >
            <action.icon className="h-8 w-8 text-[#044e2b] mx-auto mb-3" />
            <h3 className="font-semibold text-[#044e2b] mb-2">{action.label}</h3>
            <p className="text-gray-600 text-sm">{action.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Add Parcel Modal */}
      <AnimatePresence>
        {showParcelForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-[#044e2b]">Add Land Parcel</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowParcelForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name *</label>
                  <input
                    type="text"
                    value={parcelForm.owner}
                    onChange={(e) => setParcelForm(prev => ({ ...prev, owner: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                    placeholder="Enter owner name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area *</label>
                  <input
                    type="text"
                    value={parcelForm.area}
                    onChange={(e) => setParcelForm(prev => ({ ...prev, area: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                    placeholder="e.g., 2.5 acres"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Land Type</label>
                  <select
                    value={parcelForm.landType}
                    onChange={(e) => setParcelForm(prev => ({ ...prev, landType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                  >
                    <option value="Forest Land">Forest Land</option>
                    <option value="Agricultural Land">Agricultural Land</option>
                    <option value="Residential Land">Residential Land</option>
                    <option value="Commercial Land">Commercial Land</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Village *</label>
                  <input
                    type="text"
                    value={parcelForm.village}
                    onChange={(e) => setParcelForm(prev => ({ ...prev, village: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                    placeholder="Enter village name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={parcelForm.description}
                    onChange={(e) => setParcelForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                    placeholder="Enter parcel description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={parcelForm.status}
                    onChange={(e) => setParcelForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                  >
                    <option value="claimed">Claimed</option>
                    <option value="verified">Verified</option>
                    <option value="disputed">Disputed</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowParcelForm(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateParcel}
                    disabled={!parcelForm.owner || !parcelForm.area || !parcelForm.village}
                    className="flex-1 bg-[#044e2b] text-[#d4c5a9] py-2 px-4 rounded-lg font-semibold hover:bg-[#0a5a35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Parcel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GISLandMapping;

      {/* Map Controls */}
      <motion.div variants={sectionVariants} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#044e2b]">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search Location */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search location, village, or coordinates..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
              />
            </div>
          </div>

          {/* Layer Selection */}
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-[#044e2b]" />
            <select
              value={selectedLayer}
              onChange={(e) => setSelectedLayer(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
            >
              {mapLayers.map(layer => (
                <option key={layer.id} value={layer.id}>{layer.label}</option>
              ))}
            </select>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setZoomLevel(Math.min(zoomLevel + 1, 20))}
              className="p-2 bg-[#044e2b] text-[#d4c5a9] rounded-lg hover:bg-[#0a5a35] transition-colors"
            >
              <ZoomIn className="h-4 w-4" />
            </motion.button>
            <span className="text-sm font-medium text-[#044e2b] min-w-[3rem] text-center">
              {zoomLevel}x
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setZoomLevel(Math.max(zoomLevel - 1, 1))}
              className="p-2 bg-[#044e2b] text-[#d4c5a9] rounded-lg hover:bg-[#0a5a35] transition-colors"
            >
              <ZoomOut className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setZoomLevel(12)}
              className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <motion.div variants={sectionVariants} className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-[#044e2b]">
            {/* Map Header */}
            <div className="bg-[#044e2b] text-[#d4c5a9] p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                <span className="font-semibold">Interactive Map</span>
              </div>
              <div className="text-sm opacity-80">
                Current Layer: {mapLayers.find(l => l.id === selectedLayer)?.label}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="relative h-96 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
              {/* Mock Map Content */}
              <div className="text-center">
                <div className="w-16 h-16 bg-[#044e2b] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Map className="h-8 w-8 text-[#d4c5a9]" />
                </div>
                <p className="text-[#044e2b] font-semibold">Interactive GIS Map</p>
                <p className="text-[#044e2b] opacity-70 text-sm mt-1">Forest land mapping visualization</p>
              </div>

              {/* Mock Land Parcels Overlay */}
              <div className="absolute top-4 left-4 space-y-2">
                {landParcels.slice(0, 2).map((parcel, index) => (
                  <motion.div
                    key={parcel.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white bg-opacity-90 rounded-lg p-3 shadow-lg border border-[#044e2b]"
                  >
                    <div className="text-xs font-semibold text-[#044e2b]">{parcel.id}</div>
                    <div className="text-xs text-gray-600">{parcel.area}</div>
                    <div className={`text-xs px-2 py-1 rounded mt-1 ${
                      parcel.status === 'verified' ? 'bg-green-100 text-green-800' :
                      parcel.status === 'claimed' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {parcel.status}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar Panel */}
        <motion.div variants={sectionVariants} className="space-y-6">
          {/* Land Parcels List */}
          <div className="bg-white rounded-lg shadow-lg border-l-4 border-[#044e2b]">
            <div className="bg-[#044e2b] text-[#d4c5a9] p-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Home className="h-5 w-5" />
                Land Parcels
              </h3>
            </div>
            <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
              {landParcels.map((parcel, index) => (
                <motion.div
                  key={parcel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-[#044e2b] text-sm">{parcel.id}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      parcel.status === 'verified' ? 'bg-green-100 text-green-800' :
                      parcel.status === 'claimed' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {parcel.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div><strong>Owner:</strong> {parcel.owner}</div>
                    <div><strong>Area:</strong> {parcel.area}</div>
                    <div><strong>Type:</strong> {parcel.landType}</div>
                    <div><strong>Village:</strong> {parcel.village}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Map Statistics */}
          <div className="bg-white rounded-lg shadow-lg border-l-4 border-[#044e2b]">
            <div className="bg-[#044e2b] text-[#d4c5a9] p-4">
              <h3 className="font-semibold">Map Statistics</h3>
            </div>
            <div className="p-4 space-y-4">
              {[
                { label: 'Total Parcels', value: landParcels.length, color: 'text-blue-600' },
                { label: 'Verified Land', value: landParcels.filter(p => p.status === 'verified').length, color: 'text-green-600' },
                { label: 'Forest Area', value: '45.2 acres', color: 'text-green-700' },
                { label: 'Disputed Claims', value: landParcels.filter(p => p.status === 'disputed').length, color: 'text-red-600' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex justify-between items-center"
                >
                  <span className="text-sm text-gray-600">{stat.label}</span>
                  <span className={'font-semibold ' + stat.color}>{stat.value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={sectionVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#044e2b] text-center cursor-pointer"
        >
          <TreePine className="h-8 w-8 text-[#044e2b] mx-auto mb-3" />
          <h3 className="font-semibold text-[#044e2b] mb-2">Forest Analysis</h3>
          <p className="text-gray-600 text-sm">Analyze forest cover changes</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#044e2b] text-center cursor-pointer"
        >
          <Home className="h-8 w-8 text-[#044e2b] mx-auto mb-3" />
          <h3 className="font-semibold text-[#044e2b] mb-2">Parcel Survey</h3>
          <p className="text-gray-600 text-sm">Conduct land parcel surveys</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#044e2b] text-center cursor-pointer"
        >
          <Mountain className="h-8 w-8 text-[#044e2b] mx-auto mb-3" />
          <h3 className="font-semibold text-[#044e2b] mb-2">Terrain Mapping</h3>
          <p className="text-gray-600 text-sm">3D terrain visualization</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#044e2b] text-center cursor-pointer"
        >
          <Map className="h-8 w-8 text-[#044e2b] mx-auto mb-3" />
          <h3 className="font-semibold text-[#044e2b] mb-2">Boundary Marking</h3>
          <p className="text-gray-600 text-sm">Mark land boundaries</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default GISLandMapping;
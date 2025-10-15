import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash2, MapPin, Ruler, CheckCircle, AlertTriangle } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';

// Set Mapbox access token - SIH public token
mapboxgl.accessToken = 'pk.eyJ1IjoicHJpeWFuc2h1cGV0aGFyaSIsImEiOiJjbWZyZHBvcnMwMHhhMm5zYTBmaGE0MHE0In0.iwH1AC8uf9DEPwMKZHWuTw';

// Alternative: Use a different token or fallback to OpenStreetMap
const FALLBACK_STYLE = {
  version: 8,
  sources: {
    'osm': {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors'
    }
  },
  layers: [{
    id: 'osm',
    type: 'raster',
    source: 'osm'
  }]
};

const ClaimMapDrawer = ({ 
  isOpen, 
  onClose, 
  claimData, 
  onSaveMap, 
  existingMapData = null,
  isViewMode = false
}) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const drawInstance = useRef(null);
  const [areas, setAreas] = useState([]);
  const [totalArea, setTotalArea] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [mapCenter] = useState([77.4126, 23.2599]); // Bhopal coordinates [lng, lat] for Mapbox
  const [mapZoom] = useState(12);

  useEffect(() => {
    if (isOpen && !mapInstance.current) {
      initializeMap();
    }
    
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [isOpen]);

  const initializeMap = () => {
    // Initialize Mapbox map with satellite imagery (now that we have a proper token)
    mapInstance.current = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12', // Start with satellite imagery
      center: mapCenter,
      zoom: mapZoom,
      attributionControl: false
    });

    // Add fallback to OpenStreetMap if Mapbox fails
    mapInstance.current.on('error', (e) => {
      console.error('Mapbox error:', e);
      if (e.error && e.error.message) {
        console.log('Falling back to OpenStreetMap due to error:', e.error.message);
        mapInstance.current.setStyle(FALLBACK_STYLE).catch(() => {
          console.log('All fallback styles failed');
        });
      }
    });

    // Add navigation controls
    mapInstance.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Initialize Mapbox Draw
    drawInstance.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        rectangle: true,
        circle: true,
        trash: true
      },
      styles: [
        // Polygon styles
        {
          id: 'gl-draw-polygon-fill-inactive',
          type: 'fill',
          filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          paint: {
            'fill-color': '#044e2b',
            'fill-outline-color': '#044e2b',
            'fill-opacity': 0.3
          }
        },
        {
          id: 'gl-draw-polygon-fill-active',
          type: 'fill',
          filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
          paint: {
            'fill-color': '#044e2b',
            'fill-outline-color': '#044e2b',
            'fill-opacity': 0.3
          }
        },
        {
          id: 'gl-draw-polygon-stroke-inactive',
          type: 'line',
          filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#044e2b',
            'line-width': 2
          }
        },
        {
          id: 'gl-draw-polygon-stroke-active',
          type: 'line',
          filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#044e2b',
            'line-width': 2
          }
        },
        // Rectangle styles
        {
          id: 'gl-draw-rectangle-fill-inactive',
          type: 'fill',
          filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
          paint: {
            'fill-color': '#044e2b',
            'fill-outline-color': '#044e2b',
            'fill-opacity': 0.3
          }
        },
        {
          id: 'gl-draw-rectangle-fill-active',
          type: 'fill',
          filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
          paint: {
            'fill-color': '#044e2b',
            'fill-outline-color': '#044e2b',
            'fill-opacity': 0.3
          }
        },
        {
          id: 'gl-draw-rectangle-stroke-inactive',
          type: 'line',
          filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#044e2b',
            'line-width': 2
          }
        },
        {
          id: 'gl-draw-rectangle-stroke-active',
          type: 'line',
          filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#044e2b',
            'line-width': 2
          }
        },
        // Circle styles
        {
          id: 'gl-draw-circle-fill-inactive',
          type: 'fill',
          filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
          paint: {
            'fill-color': '#044e2b',
            'fill-outline-color': '#044e2b',
            'fill-opacity': 0.3
          }
        },
        {
          id: 'gl-draw-circle-fill-active',
          type: 'fill',
          filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
          paint: {
            'fill-color': '#044e2b',
            'fill-outline-color': '#044e2b',
            'fill-opacity': 0.3
          }
        },
        {
          id: 'gl-draw-circle-stroke-inactive',
          type: 'line',
          filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#044e2b',
            'line-width': 2
          }
        },
        {
          id: 'gl-draw-circle-stroke-active',
          type: 'line',
          filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#044e2b',
            'line-width': 2
          }
        }
      ]
    });

    // Only add draw control if not in view mode
    if (!isViewMode) {
      // Add draw control to map
      mapInstance.current.addControl(drawInstance.current);

      // Add event listeners
      mapInstance.current.on('draw.create', handleDrawCreated);
      mapInstance.current.on('draw.update', handleDrawEdited);
      mapInstance.current.on('draw.delete', handleDrawDeleted);
    }

    // Add error handling for map loading
    mapInstance.current.on('error', (e) => {
      console.error('Mapbox error:', e);
      // Fallback to OpenStreetMap if Mapbox fails
      if (e.error && e.error.message) {
        console.log('Falling back to OpenStreetMap due to error:', e.error.message);
        mapInstance.current.setStyle(FALLBACK_STYLE).catch(() => {
          console.log('All fallback styles failed');
        });
      }
    });

    // Load existing map data if available
    if (existingMapData) {
      loadExistingMapData(existingMapData);
    } else if (isViewMode && claimData?.mapData) {
      // In view mode, load the claim's map data
      loadExistingMapData(claimData.mapData);
    }
  };

  const handleDrawCreated = (e) => {
    const features = e.features;
    features.forEach(feature => {
      const area = calculateAreaFromFeature(feature);
      const newArea = {
        id: feature.id,
        feature: feature,
        area: area,
        type: getFeatureType(feature),
        geojson: feature
      };
      
      setAreas(prev => {
        const updated = [...prev, newArea];
        updateTotalArea(updated);
        return updated;
      });
    });
  };

  const handleDrawEdited = (e) => {
    const features = e.features;
    features.forEach(feature => {
      const area = calculateAreaFromFeature(feature);
      setAreas(prev => {
        const updated = prev.map(area => 
          area.id === feature.id 
            ? { ...area, feature: feature, area: area, geojson: feature }
            : area
        );
        updateTotalArea(updated);
        return updated;
      });
    });
  };

  const handleDrawDeleted = (e) => {
    const features = e.features;
    features.forEach(feature => {
      setAreas(prev => {
        const updated = prev.filter(area => area.id !== feature.id);
        updateTotalArea(updated);
        return updated;
      });
    });
  };

  const calculateAreaFromFeature = (feature) => {
    if (feature.geometry.type === 'Polygon') {
      return turf.area(feature);
    } else if (feature.geometry.type === 'Point') {
      // For circles, we need to calculate from the radius
      const coordinates = feature.geometry.coordinates;
      const properties = feature.properties;
      if (properties && properties.radius) {
        const radiusInKm = properties.radius / 1000; // Convert meters to kilometers
        const circle = turf.circle(coordinates, radiusInKm, { units: 'kilometers' });
        return turf.area(circle);
      }
    }
    return 0;
  };

  const getFeatureType = (feature) => {
    if (feature.geometry.type === 'Point') {
      return 'circle';
    } else if (feature.geometry.type === 'Polygon') {
      const coordinates = feature.geometry.coordinates[0];
      if (coordinates.length === 5) {
        // Check if it's a rectangle (5 points including closing point)
        return 'rectangle';
      }
      return 'polygon';
    }
    return 'unknown';
  };

  const updateTotalArea = (areasList) => {
    const total = areasList.reduce((sum, area) => sum + area.area, 0);
    setTotalArea(total);
  };

  const loadExistingMapData = (mapData) => {
    if (mapData && mapData.areas) {
      mapData.areas.forEach(areaData => {
        drawInstance.current.add(areaData.geojson);
        
        setAreas(prev => [...prev, {
          id: areaData.id,
          feature: areaData.geojson,
          area: areaData.area,
          type: areaData.type,
          geojson: areaData.geojson
        }]);
      });
      
      if (mapData.areas.length > 0) {
        const total = mapData.areas.reduce((sum, area) => sum + area.area, 0);
        setTotalArea(total);
      }
    }
  };

  const clearAllAreas = () => {
    drawInstance.current.deleteAll();
    setAreas([]);
    setTotalArea(0);
  };

  const handleSaveMap = async () => {
    if (areas.length === 0) {
      alert('Please draw at least one area before saving.');
      return;
    }

    setIsSaving(true);
    try {
      const mapData = {
        areas: areas.map(area => ({
          id: area.id,
          area: area.area,
          type: area.type,
          geojson: area.geojson
        })),
        totalArea: totalArea
      };

      await onSaveMap(mapData);
      onClose();
    } catch (error) {
      console.error('Error saving map data:', error);
      alert('Error saving map data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (areas.length > 0) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-white rounded-lg shadow-xl w-full h-full max-w-7xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#044e2b] text-[#d4c5a9] p-4 flex items-center justify-between rounded-t-lg">
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6" />
                <div>
                  <h2 className="text-xl font-bold">
                    {isViewMode ? 'View Claimed Land Area' : 'Draw Claimed Land Area'}
                  </h2>
                  <p className="text-sm opacity-80">
                    Claim: {claimData?.id} - {claimData?.claimantName}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="text-[#d4c5a9] hover:text-white p-2"
              >
                <X className="h-6 w-6" />
              </motion.button>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative">
              <div ref={mapRef} className="w-full h-full rounded-b-lg" />
              
              {/* Area Summary Panel */}
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-10 min-w-[280px]">
                <h3 className="text-lg font-semibold text-[#044e2b] mb-3 flex items-center gap-2">
                  <Ruler className="h-5 w-5" />
                  Area Summary
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Area:</span>
                    <span className="font-semibold text-[#044e2b]">
                      {totalArea.toFixed(2)} m²
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Hectares:</span>
                    <span className="font-semibold text-[#044e2b]">
                      {(totalArea / 10000).toFixed(4)} ha
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Areas Count:</span>
                    <span className="font-semibold text-[#044e2b]">
                      {areas.length}
                    </span>
                  </div>
                </div>

                {!isViewMode && (
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearAllAreas}
                      className="flex-1 bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear All
                    </motion.button>
                  </div>
                )}
              </div>

              {/* Instructions Panel */}
              <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10 max-w-[300px]">
                <h4 className="font-semibold text-[#044e2b] mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {isViewMode ? 'Map Information' : 'Instructions'}
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {isViewMode ? (
                    <>
                      <li>• This map shows the marked land boundaries</li>
                      <li>• Blue areas represent the claimed land</li>
                      <li>• You can zoom and pan to explore</li>
                      <li>• Click on areas to see measurements</li>
                    </>
                  ) : (
                    <>
                      <li>• Use the drawing tools in the top-right corner</li>
                      <li>• Click "Polygon" to draw custom shapes</li>
                      <li>• Click "Rectangle" to draw rectangular areas</li>
                      <li>• Click "Circle" to draw circular areas</li>
                      <li>• Click "Trash" to delete selected areas</li>
                      <li>• Click on areas to see detailed measurements</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 p-4 flex items-center justify-between rounded-b-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4" />
                <span>
                  {isViewMode 
                    ? `Viewing ${areas.length} marked area${areas.length > 1 ? 's' : ''}`
                    : areas.length > 0 
                      ? `Ready to save ${areas.length} area${areas.length > 1 ? 's' : ''}` 
                      : 'Draw at least one area to save'
                  }
                </span>
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  {isViewMode ? 'Close' : 'Cancel'}
                </motion.button>
                
                {!isViewMode && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveMap}
                    disabled={areas.length === 0 || isSaving}
                    className="px-6 py-2 bg-[#044e2b] text-[#d4c5a9] rounded-lg font-medium hover:bg-[#0a5a35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#d4c5a9] border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Map
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClaimMapDrawer;

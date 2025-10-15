import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, AlertTriangle } from 'lucide-react';
import mapboxgl from 'mapbox-gl';

// Set Mapbox access token - Public token for SIH project
// Fallback to OpenStreetMap if token fails
mapboxgl.accessToken = 'pk.eyJ1IjoicHJpeWFuc2h1cGV0aGFyaSIsImEiOiJjbWZyZHBvcnMwMHhhMm5zYTBmaGE0MHE0In0.iwH1AC8uf9DEPwMKZHWuTw';

const MapViewModal = ({ isOpen, onClose, claim }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && claim && mapContainer.current && !map.current) {
      initializeMap();
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        setMapLoaded(false);
      }
    };
  }, [isOpen, claim]);

  const initializeMap = () => {
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [77.4126, 23.2599], // Bhopal coordinates
        zoom: 12
      });

      // Handle map load errors
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        // Fallback to OpenStreetMap style
        if (e.error && e.error.status === 401) {
          console.log('Falling back to OpenStreetMap style');
          map.current.setStyle({
            version: 8,
            sources: {
              'osm': {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '© OpenStreetMap contributors'
              }
            },
            layers: [
              {
                id: 'osm',
                type: 'raster',
                source: 'osm'
              }
            ]
          });
        }
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        setMapLoaded(true);
        
        // Load existing map data if available
        if (claim.mapData && claim.mapData.areas) {
          console.log('Map data found for claim:', claim.frapattaid, claim.mapData);
          
          // Check if areas is already parsed or needs parsing
          let areas = claim.mapData.areas;
          if (typeof areas === 'string') {
            try {
              areas = JSON.parse(areas);
            } catch (error) {
              console.error('Error parsing map data:', error);
              return;
            }
          }
          
          if (areas && areas.length > 0) {
            console.log('Displaying areas:', areas);
            displayClaimAreasNew(areas);
          } else {
            console.log('No areas found in map data');
          }
        } else {
          console.log('No map data found for claim:', claim.frapattaid);
        }
      });

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const displayClaimAreas = (areas) => {
    if (!map.current || !areas) return;

    // Add areas to map
    areas.forEach((area, index) => {
      const sourceId = `claim-area-${index}`;
      const layerId = `claim-area-layer-${index}`;

      // Add source
      map.current.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [area.coordinates]
          }
        }
      });

      // Add fill layer
      map.current.addLayer({
        id: layerId,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': area.color || '#ff6b6b',
          'fill-opacity': 0.3
        }
      });

      // Add outline layer
      map.current.addLayer({
        id: `${layerId}-outline`,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': area.color || '#ff6b6b',
          'line-width': 2
        }
      });

      // Add area label
      const center = getPolygonCenter(area.coordinates);
      new mapboxgl.Marker({
        element: createAreaLabel(area.area, area.label)
      })
        .setLngLat(center)
        .addTo(map.current);
    });

    // Fit map to show all areas
    if (areas.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      areas.forEach(area => {
        area.coordinates.forEach(coord => {
          bounds.extend(coord);
        });
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  };

  const displayClaimAreasNew = (areas) => {
    if (!map.current || !areas) {
      console.log('Map not ready or no areas:', { mapReady: !!map.current, areas });
      return;
    }

    console.log('Processing areas for display:', areas);
    let allCoordinates = [];

    // Add areas to map
    areas.forEach((area, index) => {
      console.log(`Processing area ${index}:`, area);
      if (area.geojson && area.geojson.geometry) {
        const sourceId = `claim-area-${index}`;
        const layerId = `claim-area-layer-${index}`;

        // Add source
        map.current.addSource(sourceId, {
          type: 'geojson',
          data: area.geojson
        });

        // Add fill layer with colors based on area type
        map.current.addLayer({
          id: layerId,
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': area.type === 'pond' ? '#0ea5e9' :
                         area.type === 'forest' ? '#16a34a' :
                         area.type === 'government' ? '#dc2626' :
                         '#f59e0b', // default claimed land color
            'fill-opacity': 0.5
          }
        });

        // Add outline layer
        map.current.addLayer({
          id: `${layerId}-outline`,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': area.type === 'pond' ? '#0ea5e9' :
                         area.type === 'forest' ? '#16a34a' :
                         area.type === 'government' ? '#dc2626' :
                         '#f59e0b',
            'line-width': 2
          }
        });

        // Collect coordinates for map bounds
        if (area.geojson.geometry.type === 'Polygon') {
          allCoordinates.push(...area.geojson.geometry.coordinates[0]);
        } else if (area.geojson.geometry.type === 'MultiPolygon') {
          area.geojson.geometry.coordinates.forEach(polygon => {
            allCoordinates.push(...polygon[0]);
          });
        }

        // Add popup on click
        map.current.on('click', layerId, (e) => {
          const areaInAcres = (area.area / 4046.86).toFixed(2);
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
              <div class="p-2">
                <h4 class="font-semibold text-sm mb-1">${area.type ? area.type.charAt(0).toUpperCase() + area.type.slice(1) : 'Claimed'} Land</h4>
                <p class="text-xs text-gray-600">Area: ${areaInAcres} acres</p>
                <p class="text-xs text-gray-600">Type: ${area.type || 'claimed'}</p>
              </div>
            `)
            .addTo(map.current);
        });
      }
    });

    // Fit map to show all areas
    if (allCoordinates.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      allCoordinates.forEach(coord => bounds.extend(coord));
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 16
      });
    }
  };

  const getPolygonCenter = (coordinates) => {
    let x = 0, y = 0;
    coordinates.forEach(coord => {
      x += coord[0];
      y += coord[1];
    });
    return [x / coordinates.length, y / coordinates.length];
  };

  const createAreaLabel = (area, label) => {
    const el = document.createElement('div');
    el.className = 'bg-white px-2 py-1 rounded shadow-lg text-xs font-medium border';
    el.innerHTML = `
      <div class="text-gray-800">${label}</div>
      <div class="text-gray-600">${(area / 4046.86).toFixed(2)} acres</div>
    `;
    return el;
  };

  if (!isOpen || !claim) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#044e2b] text-[#d4c5a9] px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Land Area Map - {claim.frapattaid}</h2>
              <p className="text-sm opacity-90">
                {claim.gramPanchayat} • {claim.applicantDetails?.claimantName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-[#d4c5a9] hover:text-white p-2 rounded-full hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Map Content */}
          <div className="h-[calc(90vh-80px)]">
            {claim.mapData ? (
              <div className="relative h-full">
                <div ref={mapContainer} className="w-full h-full" />
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#044e2b] mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading map...</p>
                    </div>
                  </div>
                )}
                
                {/* Map Info Panel */}
                <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Claim Information
                  </h3>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Claim ID:</span>
                      <span className="font-medium">{claim.frapattaid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Claimant:</span>
                      <span className="font-medium">{claim.applicantDetails?.claimantName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Village:</span>
                      <span className="font-medium">{claim.gramPanchayat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Area:</span>
                      <span className="font-medium">
                        {claim.mapData.totalArea 
                          ? `${(claim.mapData.totalArea / 4046.86).toFixed(2)} acres`
                          : 'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mapped On:</span>
                      <span className="font-medium">
                        {claim.mapData.createdAt 
                          ? new Date(claim.mapData.createdAt).toLocaleDateString()
                          : 'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">Legend</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-400 rounded mr-2"></div>
                      <span>Claimed Forest Land</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-400 rounded mr-2"></div>
                      <span>Water Bodies</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-400 rounded mr-2"></div>
                      <span>Agricultural Land</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-100">
                <div className="text-center text-gray-500">
                  <AlertTriangle className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Map Data Available</h3>
                  <p>This claim has not been mapped yet by the Gram Sabha officer.</p>
                  <p className="text-sm mt-2">Map data will be available after the GS officer completes the land mapping process.</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MapViewModal;

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Save, AlertCircle, CheckCircle } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoicHJpeWFuc2h1cGV0aGFyaSIsImEiOiJjbWZyZHBvcnMwMHhhMm5zYTBmaGE0MHE0In0.iwH1AC8uf9DEPwMKZHWuTw';

const GramSabhaMapView = ({ onClaimSubmit, claim = null, isViewMode = false }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const draw = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapData, setMapData] = useState(null);
  const [drawnPolygon, setDrawnPolygon] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Fetch user info and map data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const profileResponse = await fetch('/api/gs/profile', {
          credentials: 'include'
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          if (profileData.success) {
            setUserInfo(profileData.officer);
          }
        }

        // Fetch map data
        const mapResponse = await fetch('/api/map-data', {
          credentials: 'include'
        });
        
        if (mapResponse.ok) {
          const mapDataResponse = await mapResponse.json();
          if (mapDataResponse.success) {
            setMapData(mapDataResponse);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Initialize map
  useEffect(() => {
    if (mapContainer.current && !map.current && mapData) {
      initializeMap();
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapData]);

  const initializeMap = () => {
    try {
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: mapData.mapConfig.center,
        zoom: mapData.mapConfig.zoom
      });

      // Handle map load errors
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
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
        
        // Add existing claims to map
        if (mapData.data && mapData.data.features) {
          addExistingClaimsToMap(mapData.data.features);
        }

        // Initialize drawing tools
        initializeDrawingTools();
      });

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const addExistingClaimsToMap = (features) => {
    if (!map.current) return;

    // Add source for existing claims
    map.current.addSource('existing-claims', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: features
      }
    });

    // Add fill layer for existing claims
    map.current.addLayer({
      id: 'existing-claims-fill',
      type: 'fill',
      source: 'existing-claims',
      paint: {
        'fill-color': ['get', 'fillColor'],
        'fill-opacity': 0.3
      }
    });

    // Add outline layer for existing claims
    map.current.addLayer({
      id: 'existing-claims-outline',
      type: 'line',
      source: 'existing-claims',
      paint: {
        'line-color': ['get', 'strokeColor'],
        'line-width': 2
      }
    });

    // Add click handler for existing claims
    map.current.on('click', 'existing-claims-fill', (e) => {
      const feature = e.features[0];
      const properties = feature.properties;
      
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`
          <div class="p-3">
            <h4 class="font-semibold text-sm mb-2">Existing Claim</h4>
            <p class="text-xs text-gray-600 mb-1"><strong>Claim ID:</strong> ${properties.frapattaid}</p>
            <p class="text-xs text-gray-600 mb-1"><strong>Claimant:</strong> ${properties.claimantName}</p>
            <p class="text-xs text-gray-600 mb-1"><strong>Status:</strong> ${properties.status}</p>
            <p class="text-xs text-gray-600 mb-1"><strong>Village:</strong> ${properties.village}</p>
          </div>
        `)
        .addTo(map.current);
    });

    // Change cursor on hover
    map.current.on('mouseenter', 'existing-claims-fill', () => {
      map.current.getCanvas().style.cursor = 'pointer';
    });

    map.current.on('mouseleave', 'existing-claims-fill', () => {
      map.current.getCanvas().style.cursor = '';
    });
  };

  const initializeDrawingTools = () => {
    if (!map.current) return;

    // Only initialize drawing tools if not in view mode
    if (!isViewMode) {
      // Initialize MapboxDraw with polygon-only mode
      draw.current = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true
        },
        defaultMode: 'draw_polygon',
        styles: [
          // Polygon fill
          {
            id: 'gl-draw-polygon-fill-inactive',
            type: 'fill',
            filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
            paint: {
              'fill-color': '#f59e0b',
              'fill-outline-color': '#f59e0b',
              'fill-opacity': 0.3
            }
          },
          // Polygon outline
          {
            id: 'gl-draw-polygon-stroke-inactive',
            type: 'line',
            filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#f59e0b',
              'line-width': 2
            }
          }
        ]
      });

      // Add draw control to map
      map.current.addControl(draw.current);

      // Listen for draw events
      map.current.on('draw.create', (e) => {
        const feature = e.features[0];
        setDrawnPolygon(feature);
        setSubmitStatus(null);
      });

      map.current.on('draw.update', (e) => {
        const feature = e.features[0];
        setDrawnPolygon(feature);
      });

      map.current.on('draw.delete', () => {
        setDrawnPolygon(null);
        setSubmitStatus(null);
      });
    }

    // If in view mode and we have a claim with map data, display it
    if (isViewMode && claim && claim.mapData) {
      displayClaimMapData(claim.mapData);
    }
  };

  const displayClaimMapData = (mapData) => {
    if (!map.current || !mapData.areas) return;

    try {
      // Parse areas if it's a string
      const areas = typeof mapData.areas === 'string' ? JSON.parse(mapData.areas) : mapData.areas;
      
      // Add source for the claim's map data
      if (map.current.getSource('claim-map-data')) {
        map.current.removeSource('claim-map-data');
      }

      // Create GeoJSON features from the areas
      const features = areas.map((area, index) => ({
        type: 'Feature',
        properties: {
          id: `claim-area-${index}`,
          area: area.area || 0,
          label: area.label || `Area ${index + 1}`
        },
        geometry: {
          type: 'Polygon',
          coordinates: [area.coordinates]
        }
      }));

      map.current.addSource('claim-map-data', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: features
        }
      });

      // Add fill layer
      map.current.addLayer({
        id: 'claim-map-fill',
        type: 'fill',
        source: 'claim-map-data',
        paint: {
          'fill-color': '#3b82f6',
          'fill-opacity': 0.4
        }
      });

      // Add outline layer
      map.current.addLayer({
        id: 'claim-map-outline',
        type: 'line',
        source: 'claim-map-data',
        paint: {
          'line-color': '#1d4ed8',
          'line-width': 3
        }
      });

      // Add labels
      features.forEach((feature, index) => {
        const coordinates = feature.geometry.coordinates[0];
        const center = getPolygonCenter(coordinates);
        
        new mapboxgl.Marker({
          element: createAreaLabel(feature.properties.area, feature.properties.label)
        })
          .setLngLat(center)
          .addTo(map.current);
      });

      // Fit map to show the claim areas
      if (features.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        features.forEach(feature => {
          feature.geometry.coordinates[0].forEach(coord => {
            bounds.extend(coord);
          });
        });
        map.current.fitBounds(bounds, { padding: 50 });
      }

    } catch (error) {
      console.error('Error displaying claim map data:', error);
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

  const handleSubmitClaim = async () => {
    if (!drawnPolygon) {
      setSubmitStatus({ type: 'error', message: 'Please draw a polygon first' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/save-claim-geometry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          geometry: drawnPolygon.geometry,
          claimData: {
            // Add other claim data here as needed
            claimType: 'Individual',
            forestLandArea: calculateArea(drawnPolygon.geometry),
            applicantDetails: {
              claimantName: 'New Claimant', // This should come from a form
              village: userInfo?.gpName || 'Unknown Village'
            }
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({ 
          type: 'success', 
          message: 'Claim submitted successfully!' 
        });
        
        // Clear the drawn polygon
        draw.current.deleteAll();
        setDrawnPolygon(null);
        
        // Refresh map data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        
        // Call parent callback if provided
        if (onClaimSubmit) {
          onClaimSubmit(result.claim);
        }
      } else {
        setSubmitStatus({ 
          type: 'error', 
          message: result.message || 'Failed to submit claim' 
        });
      }
    } catch (error) {
      console.error('Error submitting claim:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: 'Network error. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateArea = (geometry) => {
    // Simple area calculation - in a real app, you'd use a proper geospatial library
    if (geometry.type === 'Polygon' && geometry.coordinates[0]) {
      const coords = geometry.coordinates[0];
      let area = 0;
      for (let i = 0; i < coords.length - 1; i++) {
        area += coords[i][0] * coords[i + 1][1] - coords[i + 1][0] * coords[i][1];
      }
      return Math.abs(area) / 2; // Approximate area in square degrees
    }
    return 0;
  };

  if (!mapData) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#044e2b] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-[#044e2b]" />
              {isViewMode ? 'Claim Map View' : 'Village Land Mapping'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {isViewMode 
                ? `Claim ID: ${claim?.id || 'N/A'} • ${claim?.claimantName || 'Unknown Claimant'}`
                : `${mapData.mapConfig.jurisdiction.name} • ${mapData.summary.totalClaims} existing claims`
              }
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Role: Gram Sabha Officer</p>
            <p className="text-xs text-gray-500">
              {isViewMode ? 'Viewing marked land boundaries' : 'Draw polygons to mark new claims'}
            </p>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="relative">
          <div 
            ref={mapContainer} 
            className="w-full h-96"
            style={{ minHeight: '400px' }}
          />
          
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#044e2b] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading map...</p>
              </div>
            </div>
          )}

          {/* Map Legend */}
          <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg max-w-xs">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm">Legend</h4>
            <div className="space-y-1 text-xs">
              {isViewMode ? (
                <>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-400 rounded mr-2"></div>
                    <span>Claimed Land Area</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded mr-2 border-2 border-blue-800"></div>
                    <span>Land Boundary</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-400 rounded mr-2"></div>
                    <span>Submitted Claims</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded mr-2"></div>
                    <span>Approved Claims</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-400 rounded mr-2"></div>
                    <span>Under Review</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-400 rounded mr-2 border-2 border-yellow-600"></div>
                    <span>New Claim (Drawn)</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Drawing Controls - Only show in edit mode */}
      {!isViewMode && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Drawing Tools</h4>
              <p className="text-sm text-gray-600">
                Use the polygon tool to draw the boundary of the claimed land area.
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {drawnPolygon && (
                <div className="text-sm text-gray-600">
                  <p>Polygon drawn ✓</p>
                  <p className="text-xs">Area: ~{calculateArea(drawnPolygon.geometry).toFixed(4)} sq units</p>
                </div>
              )}
              
              <button
                onClick={handleSubmitClaim}
                disabled={!drawnPolygon || isSubmitting}
                className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 ${
                  drawnPolygon && !isSubmitting
                    ? 'bg-[#044e2b] text-white hover:bg-[#033a1f]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Submit Claim</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Status Messages */}
          {submitStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-3 p-3 rounded-lg flex items-center space-x-2 ${
                submitStatus.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {submitStatus.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span className="text-sm">{submitStatus.message}</span>
            </motion.div>
          )}
        </div>
      )}

      {/* View Mode Info */}
      {isViewMode && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Claim Map Information</h4>
              <p className="text-sm text-gray-600">
                This map shows the land boundaries marked for this claim. The blue areas represent the claimed land.
              </p>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Map Data Available ✓</p>
              <p className="text-xs">Viewing saved boundaries</p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">Instructions</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          {isViewMode ? (
            <>
              <li>• This map shows the land boundaries that were marked for this claim</li>
              <li>• Blue areas represent the claimed land</li>
              <li>• You can zoom and pan to explore the marked areas</li>
              <li>• The map displays the exact boundaries as drawn by the Gram Sabha officer</li>
            </>
          ) : (
            <>
              <li>• Click the polygon tool in the map controls to start drawing</li>
              <li>• Click on the map to create points for your polygon</li>
              <li>• Double-click to finish drawing the polygon</li>
              <li>• Use the trash tool to delete your drawing if needed</li>
              <li>• Click "Submit Claim" to save the new claim with the drawn boundary</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default GramSabhaMapView;

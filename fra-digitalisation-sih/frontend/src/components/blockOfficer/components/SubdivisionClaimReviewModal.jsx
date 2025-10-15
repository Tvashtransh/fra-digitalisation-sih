import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MapPin, 
  User, 
  FileText, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Send,
  Eye,
  AlertTriangle
} from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

// Set Mapbox access token - Public token for SIH project
// Fallback to OpenStreetMap if token fails
mapboxgl.accessToken = 'pk.eyJ1IjoicHJpeWFuc2h1cGV0aGFyaSIsImEiOiJjbWZyZHBvcnMwMHhhMm5zYTBmaGE0MHE0In0.iwH1AC8uf9DEPwMKZHWuTw';

const SubdivisionClaimReviewModal = ({ 
  isOpen, 
  onClose, 
  claim, 
  onReject, 
  onForwardToDistrict, 
  subdivisionOfficer 
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const draw = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionType, setActionType] = useState(''); // 'approve', 'reject', 'forward'

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

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        setMapLoaded(true);
        
        // Load existing map data if available
        if (claim.mapData && claim.mapData.areasJson) {
          try {
            const areas = JSON.parse(claim.mapData.areasJson);
            if (areas && areas.length > 0) {
              displayClaimAreas(areas);
            }
          } catch (error) {
            console.error('Error parsing map data:', error);
          }
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

  const handleAction = async (action) => {
    if (!reviewNotes.trim()) {
      alert('Please add review notes before proceeding.');
      return;
    }

    const actionData = {
      claimId: claim._id,
      notes: reviewNotes,
      subdivisionOfficer: subdivisionOfficer?.name || 'Subdivision Officer',
      timestamp: new Date().toISOString()
    };

    try {
      switch (action) {
        case 'reject':
          await onReject(actionData);
          break;
        case 'forward':
          await onForwardToDistrict(actionData);
          break;
      }
      onClose();
    } catch (error) {
      console.error('Error performing action:', error);
      alert('Error performing action. Please try again.');
    }
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
          className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#044e2b] text-[#d4c5a9] px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Claim Review - {claim.frapattaid}</h2>
              <p className="text-sm opacity-90">Subdivision Officer Review</p>
            </div>
            <button
              onClick={onClose}
              className="text-[#d4c5a9] hover:text-white p-2 rounded-full hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex h-[calc(90vh-80px)]">
            {/* Left Panel - Claim Details */}
            <div className="w-1/2 p-6 overflow-y-auto border-r">
              <div className="space-y-6">
                {/* Claimant Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Claimant Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <p className="font-medium">{claim.applicantDetails?.claimantName || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Village:</span>
                      <p className="font-medium">{claim.gramPanchayat || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Tehsil:</span>
                      <p className="font-medium">{claim.tehsil || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">District:</span>
                      <p className="font-medium">{claim.district || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Land Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Land Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Claim Type:</span>
                      <p className="font-medium">{claim.claimType || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Area:</span>
                      <p className="font-medium">
                        {claim.mapData?.totalArea 
                          ? `${(claim.mapData.totalArea / 4046.86).toFixed(2)} acres`
                          : 'N/A'
                        }
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Forest Land Area:</span>
                      <p className="font-medium">{claim.forestLandArea || 'N/A'} hectares</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <p className="font-medium">{claim.status || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Map Data Info */}
                {claim.mapData && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Map Data Available
                    </h3>
                    <div className="text-sm text-gray-600">
                      <p>✅ Land area mapping completed by Gram Sabha</p>
                      <p>📅 Mapped on: {claim.mapData.createdAt ? new Date(claim.mapData.createdAt).toLocaleDateString() : 'N/A'}</p>
                      <p>📏 Total mapped area: {claim.mapData.totalArea ? `${(claim.mapData.totalArea / 4046.86).toFixed(2)} acres` : 'N/A'}</p>
                    </div>
                  </div>
                )}

                {/* Review Notes */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Subdivision Review Notes
                  </h3>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add your review notes, observations, and recommendations..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent resize-none"
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleAction('forward')}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Forward to District Officer
                  </button>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={() => handleAction('reject')}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Map View */}
            <div className="w-1/2 p-6">
              <div className="h-full">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Claimed Land Area Map
                </h3>
                
                {claim.mapData ? (
                  <div className="h-[calc(100%-40px)] bg-gray-100 rounded-lg overflow-hidden">
                    <div ref={mapContainer} className="w-full h-full" />
                    {!mapLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#044e2b] mx-auto mb-2"></div>
                          <p className="text-gray-600">Loading map...</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-[calc(100%-40px)] bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
                      <p>No map data available</p>
                      <p className="text-sm">This claim has not been mapped yet</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SubdivisionClaimReviewModal;

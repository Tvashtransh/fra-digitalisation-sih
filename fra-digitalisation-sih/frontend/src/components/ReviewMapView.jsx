import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Eye, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import mapboxgl from 'mapbox-gl';

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoicHJpeWFuc2h1cGV0aGFyaSIsImEiOiJjbWZyZHBvcnMwMHhhMm5zYTBmaGE0MHE0In0.iwH1AC8uf9DEPwMKZHWuTw';

const ReviewMapView = ({ level = 'block', onClaimClick }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapData, setMapData] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [hoveredClaim, setHoveredClaim] = useState(null);

  // Fetch map data
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const response = await fetch('/api/map-data', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setMapData(data);
          }
        }
      } catch (error) {
        console.error('Error fetching map data:', error);
      }
    };

    fetchMapData();
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
        addClaimsToMap(mapData.data.features);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const addClaimsToMap = (features) => {
    if (!map.current) return;

    // Add source for claims
    map.current.addSource('claims', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: features
      }
    });

    // Add fill layer for claims
    map.current.addLayer({
      id: 'claims-fill',
      type: 'fill',
      source: 'claims',
      paint: {
        'fill-color': ['get', 'fillColor'],
        'fill-opacity': 0.4
      }
    });

    // Add outline layer for claims
    map.current.addLayer({
      id: 'claims-outline',
      type: 'line',
      source: 'claims',
      paint: {
        'line-color': ['get', 'strokeColor'],
        'line-width': 2
      }
    });

    // Add click handler for claims
    map.current.on('click', 'claims-fill', (e) => {
      const feature = e.features[0];
      const properties = feature.properties;
      
      // Create popup
      const popup = new mapboxgl.Popup({
        maxWidth: '300px'
      })
        .setLngLat(e.lngLat)
        .setHTML(`
          <div class="p-3">
            <h4 class="font-semibold text-sm mb-2 text-gray-800">Claim Details</h4>
            <div class="space-y-1 text-xs">
              <p><strong>Claim ID:</strong> ${properties.frapattaid}</p>
              <p><strong>Claimant:</strong> ${properties.claimantName}</p>
              <p><strong>Status:</strong> 
                <span class="px-2 py-1 rounded text-xs ${getStatusBadgeClass(properties.status)}">
                  ${properties.status}
                </span>
              </p>
              <p><strong>Village:</strong> ${properties.village}</p>
              <p><strong>Tehsil:</strong> ${properties.tehsil}</p>
              <p><strong>Submitted:</strong> ${new Date(properties.createdAt).toLocaleDateString()}</p>
            </div>
            <div class="mt-3 pt-2 border-t border-gray-200">
              <button 
                onclick="window.openClaimDetails('${properties.claimId}')"
                class="w-full bg-[#044e2b] text-white text-xs py-2 px-3 rounded hover:bg-[#033a1f] transition-colors"
              >
                View Full Details
              </button>
            </div>
          </div>
        `)
        .addTo(map.current);

      // Call parent callback if provided
      if (onClaimClick) {
        onClaimClick(properties);
      }
    });

    // Change cursor on hover
    map.current.on('mouseenter', 'claims-fill', () => {
      map.current.getCanvas().style.cursor = 'pointer';
    });

    map.current.on('mouseleave', 'claims-fill', () => {
      map.current.getCanvas().style.cursor = '';
    });
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'Submitted': 'bg-blue-100 text-blue-800',
      'MappedByGramSabha': 'bg-green-100 text-green-800',
      'ForwardedToSubdivision': 'bg-yellow-100 text-yellow-800',
      'UnderSubdivisionReview': 'bg-orange-100 text-orange-800',
      'ApprovedBySubdivision': 'bg-green-100 text-green-800',
      'RejectedBySubdivision': 'bg-red-100 text-red-800',
      'ForwardedToDistrict': 'bg-purple-100 text-purple-800',
      'UnderDistrictReview': 'bg-purple-100 text-purple-800',
      'ApprovedByDistrict': 'bg-green-100 text-green-800',
      'RejectedByDistrict': 'bg-red-100 text-red-800',
      'FinalApproved': 'bg-emerald-100 text-emerald-800',
      'FinalRejected': 'bg-red-100 text-red-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    if (status.includes('Approved') || status.includes('FinalApproved')) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else if (status.includes('Rejected') || status.includes('FinalRejected')) {
      return <XCircle className="h-4 w-4 text-red-600" />;
    } else {
      return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const filteredFeatures = mapData?.data?.features?.filter(feature => {
    if (selectedStatus === 'all') return true;
    return feature.properties.status === selectedStatus;
  }) || [];

  const statusOptions = [
    { value: 'all', label: 'All Claims', count: mapData?.data?.features?.length || 0 },
    ...Object.entries(mapData?.summary?.statusBreakdown || {}).map(([status, count]) => ({
      value: status,
      label: status,
      count: count
    }))
  ];

  // Make openClaimDetails available globally for popup buttons
  useEffect(() => {
    window.openClaimDetails = (claimId) => {
      if (onClaimClick) {
        onClaimClick({ claimId });
      }
    };
  }, [onClaimClick]);

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
              {level === 'district' ? 'District' : 'Block'} Claims Overview
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {mapData.mapConfig.jurisdiction.name} • {mapData.summary.totalClaims} total claims
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Role: {level === 'district' ? 'District' : 'Block'} Officer</p>
            <p className="text-xs text-gray-500">Click on claims to view details</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {filteredFeatures.length} of {mapData.summary.totalClaims} claims
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="relative">
          <div 
            ref={mapContainer} 
            className="w-full h-96"
            style={{ minHeight: '500px' }}
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
            <h4 className="font-semibold text-gray-800 mb-2 text-sm">Status Legend</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-400 rounded mr-2"></div>
                <span>Submitted</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded mr-2"></div>
                <span>Approved</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded mr-2"></div>
                <span>Under Review</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-400 rounded mr-2"></div>
                <span>Rejected</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-400 rounded mr-2"></div>
                <span>District Review</span>
              </div>
            </div>
          </div>

          {/* Statistics Panel */}
          <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg max-w-xs">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm">Quick Stats</h4>
            <div className="space-y-1 text-xs">
              {Object.entries(mapData.summary.statusBreakdown).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(status)}
                    <span className="ml-1">{status}</span>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
          <Eye className="h-4 w-4 mr-2" />
          How to Use This Map
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Click on any colored area to view claim details</li>
          <li>• Use the filter dropdown to show only specific claim statuses</li>
          <li>• Use map controls to zoom and pan around the area</li>
          <li>• Hover over claims to see basic information</li>
          <li>• Click "View Full Details" in popups to open detailed claim information</li>
        </ul>
      </div>
    </div>
  );
};

export default ReviewMapView;

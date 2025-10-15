import React, { useEffect, useRef, useState } from 'react';
import { XCircle, MapPin, Target, Layers } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';

// Use environment variables or fallback to SIH project token
// Fallback to OpenStreetMap if token fails
const MAPBOX_PUBLIC_TOKEN = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN || 'pk.eyJ1IjoicHJpeWFuc2h1cGV0aGFyaSIsImEiOiJjbWZyZHBvcnMwMHhhMm5zYTBmaGE0MHE0In0.iwH1AC8uf9DEPwMKZHWuTw';

mapboxgl.accessToken = MAPBOX_PUBLIC_TOKEN;

const MapViewModal = ({ isOpen, onClose, claim }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [mapStats, setMapStats] = useState({ totalArea: 0, polygonCount: 0 });

  useEffect(() => {
    if (!isOpen || !claim || map.current) return;

    try {
      setIsLoading(true);
      setMapError(null);

      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [77.4126, 23.2599], // Default to Bhopal, MP
        zoom: 12,
        attributionControl: false
      });

      map.current.addControl(new mapboxgl.AttributionControl(), 'bottom-right');
      
      map.current.on('load', () => {
        setIsLoading(false);
        
        // Add map data if available
        if (claim.mapData && claim.mapData.areas && claim.mapData.areas.length > 0) {
          addClaimPolygons(claim.mapData.areas, claim.mapData.totalArea);
        }
      });

      map.current.on('error', (error) => {
        console.error('Mapbox error:', error);
        setMapError('Failed to load map. Please check your internet connection.');
        setIsLoading(false);
      });

    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError('Failed to initialize map.');
      setIsLoading(false);
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isOpen, claim]);

  const addClaimPolygons = (areas, totalArea) => {
    if (!map.current || !areas || areas.length === 0) return;

    try {
      let allCoordinates = [];
      let polygonCount = 0;
      let calculatedTotalArea = 0;

      areas.forEach((area, index) => {
        if (area.geojson && area.geojson.geometry && area.geojson.geometry.coordinates) {
          const sourceId = `claim-area-${index}`;
          const layerId = `claim-layer-${index}`;
          
          // Add source
          map.current.addSource(sourceId, {
            type: 'geojson',
            data: area.geojson
          });

          // Add fill layer
          map.current.addLayer({
            id: layerId,
            type: 'fill',
            source: sourceId,
            paint: {
              'fill-color': area.type === 'pond' ? '#0ea5e9' :
                           area.type === 'forest' ? '#16a34a' :
                           area.type === 'government' ? '#dc2626' :
                           '#f59e0b', // default claimed land color
              'fill-opacity': 0.6
            }
          });

          // Add outline
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

          // Calculate area using Turf.js
          const areaInSquareMeters = turf.area(area.geojson);
          calculatedTotalArea += areaInSquareMeters;
          polygonCount++;

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
            const areaInAcres = (areaInSquareMeters / 4046.86).toFixed(2);
            const popup = new mapboxgl.Popup()
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

          // Change cursor on hover
          map.current.on('mouseenter', layerId, () => {
            map.current.getCanvas().style.cursor = 'pointer';
          });

          map.current.on('mouseleave', layerId, () => {
            map.current.getCanvas().style.cursor = '';
          });
        }
      });

      // Update stats
      setMapStats({
        totalArea: calculatedTotalArea,
        polygonCount: polygonCount
      });

      // Fit map to show all polygons
      if (allCoordinates.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        allCoordinates.forEach(coord => bounds.extend(coord));
        
        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 16
        });
      }

    } catch (error) {
      console.error('Error adding claim polygons:', error);
      setMapError('Failed to display claim areas on map.');
    }
  };

  const formatArea = (areaInSquareMeters) => {
    const acres = (areaInSquareMeters / 4046.86).toFixed(2);
    const hectares = (areaInSquareMeters / 10000).toFixed(2);
    return { acres, hectares };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <MapPin className="h-6 w-6 text-[#044e2b]" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Map View - {claim.frapattaid}
              </h3>
              <p className="text-sm text-gray-600">
                {claim.claimantName} • {claim.gramPanchayat}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        {/* Map Stats */}
        {claim.mapData && claim.mapData.areas && (
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-[#044e2b]" />
                  <span className="text-sm font-medium">
                    {mapStats.polygonCount} Area{mapStats.polygonCount !== 1 ? 's' : ''} Mapped
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Layers className="h-4 w-4 text-[#044e2b]" />
                  <span className="text-sm font-medium">
                    Total: {formatArea(mapStats.totalArea).acres} acres
                    ({formatArea(mapStats.totalArea).hectares} hectares)
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Mapped by GS Officer on {new Date(claim.mapData.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}

        {/* Map Container */}
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#044e2b] mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading map...</p>
              </div>
            </div>
          )}

          {mapError && (
            <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-800 mb-2">Map Error</h4>
                <p className="text-gray-600">{mapError}</p>
              </div>
            </div>
          )}

          {!claim.hasMap && !isLoading && !mapError && (
            <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-800 mb-2">No Map Available</h4>
                <p className="text-gray-600">No map data has been provided for this claim</p>
                <p className="text-sm text-gray-500 mt-2">
                  GS Officer needs to map the claimed area first
                </p>
              </div>
            </div>
          )}

          <div
            ref={mapContainer}
            className="w-full h-full"
            style={{ display: isLoading || mapError || !claim.hasMap ? 'none' : 'block' }}
          />
        </div>

        {/* Legend */}
        {claim.hasMap && claim.mapData && claim.mapData.areas && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <h4 className="text-sm font-semibold text-gray-800">Legend:</h4>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-xs">Claimed Land</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-600 rounded"></div>
                    <span className="text-xs">Forest Area</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-xs">Pond/Water</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-600 rounded"></div>
                    <span className="text-xs">Government Land</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Click on any area for details
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapViewModal;

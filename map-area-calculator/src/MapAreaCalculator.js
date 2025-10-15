import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';

// Fix for default markers in Leaflet with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapAreaCalculator = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const drawnItems = useRef(null);
  const drawControl = useRef(null);
  const [areas, setAreas] = useState([]);
  const [totalArea, setTotalArea] = useState(0);

  useEffect(() => {
    // Initialize map
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5); // Center on India

      // Add Esri World Imagery tiles
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }).addTo(mapInstance.current);

      // Initialize drawn items layer
      drawnItems.current = new L.FeatureGroup();
      mapInstance.current.addLayer(drawnItems.current);

      // Initialize draw control
      drawControl.current = new L.Control.Draw({
        position: 'topright',
        draw: {
          polygon: {
            allowIntersection: false,
            showArea: true,
            drawError: {
              color: '#e1e100',
              message: '<strong>Oh snap!</strong> you can\'t draw that!'
            },
            shapeOptions: {
              color: '#bada55'
            }
          },
          polyline: false,
          rectangle: {
            shapeOptions: {
              color: '#bada55'
            }
          },
          circle: {
            shapeOptions: {
              color: '#bada55'
            }
          },
          marker: false,
          circlemarker: false
        },
        edit: {
          featureGroup: drawnItems.current,
          remove: true
        }
      });

      mapInstance.current.addControl(drawControl.current);

      // Event listeners
      mapInstance.current.on(L.Draw.Event.CREATED, handleDrawCreated);
      mapInstance.current.on(L.Draw.Event.EDITED, handleDrawEdited);
      mapInstance.current.on(L.Draw.Event.DELETED, handleDrawDeleted);

      // Load saved areas from localStorage
      loadSavedAreas();
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const handleDrawCreated = (e) => {
    const { layerType, layer } = e;
    const area = calculateArea(layer);
    
    // Add popup with area information
    layer.bindPopup(`
      <div>
        <strong>Area: ${area.toFixed(2)} m²</strong><br/>
        <strong>Area: ${(area / 10000).toFixed(4)} hectares</strong><br/>
        <strong>Area: ${(area / 1000000).toFixed(6)} km²</strong>
      </div>
    `);

    // Add to drawn items
    drawnItems.current.addLayer(layer);

    // Update areas state
    const newArea = {
      id: Date.now(),
      layer: layer,
      area: area,
      type: layerType
    };
    
    setAreas(prev => [...prev, newArea]);
    updateTotalArea([...areas, newArea]);
    
    // Save to localStorage
    saveAreasToStorage([...areas, newArea]);
  };

  const handleDrawEdited = (e) => {
    const layers = e.layers;
    layers.eachLayer((layer) => {
      const area = calculateArea(layer);
      layer.setPopupContent(`
        <div>
          <strong>Area: ${area.toFixed(2)} m²</strong><br/>
          <strong>Area: ${(area / 10000).toFixed(4)} hectares</strong><br/>
          <strong>Area: ${(area / 1000000).toFixed(6)} km²</strong>
        </div>
      `);
    });
    
    // Recalculate all areas
    recalculateAllAreas();
  };

  const handleDrawDeleted = (e) => {
    const layers = e.layers;
    const deletedIds = [];
    
    layers.eachLayer((layer) => {
      const areaIndex = areas.findIndex(area => area.layer === layer);
      if (areaIndex !== -1) {
        deletedIds.push(areas[areaIndex].id);
      }
    });
    
    // Remove from areas state
    const updatedAreas = areas.filter(area => !deletedIds.includes(area.id));
    setAreas(updatedAreas);
    updateTotalArea(updatedAreas);
    
    // Save to localStorage
    saveAreasToStorage(updatedAreas);
  };

  const calculateArea = (layer) => {
    let geojson;
    
    if (layer instanceof L.Polygon) {
      const coords = layer.getLatLngs()[0].map(latlng => [latlng.lng, latlng.lat]);
      // Ensure the polygon is closed (first and last coordinates are the same)
      if (coords.length > 0 && (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1])) {
        coords.push([coords[0][0], coords[0][1]]);
      }
      geojson = turf.polygon([coords]);
    } else if (layer instanceof L.Rectangle) {
      const bounds = layer.getBounds();
      // Create a polygon from rectangle bounds
      const coords = [
        [bounds.getWest(), bounds.getSouth()],
        [bounds.getEast(), bounds.getSouth()],
        [bounds.getEast(), bounds.getNorth()],
        [bounds.getWest(), bounds.getNorth()],
        [bounds.getWest(), bounds.getSouth()]
      ];
      geojson = turf.polygon([coords]);
    } else if (layer instanceof L.Circle) {
      geojson = turf.circle([layer.getLatLng().lng, layer.getLatLng().lat], layer.getRadius() / 1000, {
        units: 'kilometers'
      });
    }
    
    return turf.area(geojson);
  };

  const recalculateAllAreas = () => {
    const updatedAreas = areas.map(area => ({
      ...area,
      area: calculateArea(area.layer)
    }));
    setAreas(updatedAreas);
    updateTotalArea(updatedAreas);
    saveAreasToStorage(updatedAreas);
  };

  const updateTotalArea = (areasList) => {
    const total = areasList.reduce((sum, area) => sum + area.area, 0);
    setTotalArea(total);
  };

  const saveAreasToStorage = (areasList) => {
    const areasData = areasList.map(area => ({
      id: area.id,
      area: area.area,
      type: area.type,
      geojson: area.layer.toGeoJSON()
    }));
    localStorage.setItem('mapAreas', JSON.stringify(areasData));
  };

  const loadSavedAreas = () => {
    const savedAreas = localStorage.getItem('mapAreas');
    if (savedAreas) {
      try {
        const areasData = JSON.parse(savedAreas);
        areasData.forEach(areaData => {
          const layer = L.geoJSON(areaData.geojson).getLayers()[0];
          if (layer) {
            layer.bindPopup(`
              <div>
                <strong>Area: ${areaData.area.toFixed(2)} m²</strong><br/>
                <strong>Area: ${(areaData.area / 10000).toFixed(4)} hectares</strong><br/>
                <strong>Area: ${(areaData.area / 1000000).toFixed(6)} km²</strong>
              </div>
            `);
            drawnItems.current.addLayer(layer);
            
            setAreas(prev => [...prev, {
              id: areaData.id,
              layer: layer,
              area: areaData.area,
              type: areaData.type
            }]);
          }
        });
        
        if (areasData.length > 0) {
          const total = areasData.reduce((sum, area) => sum + area.area, 0);
          setTotalArea(total);
        }
      } catch (error) {
        console.error('Error loading saved areas:', error);
      }
    }
  };

  const clearAllAreas = () => {
    drawnItems.current.clearLayers();
    setAreas([]);
    setTotalArea(0);
    localStorage.removeItem('mapAreas');
  };

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      
      {/* Area Summary Panel */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000,
        minWidth: '250px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Area Calculator</h3>
        <div style={{ marginBottom: '10px' }}>
          <strong>Total Area: {totalArea.toFixed(2)} m²</strong><br/>
          <strong>Total Area: {(totalArea / 10000).toFixed(4)} hectares</strong><br/>
          <strong>Total Area: {(totalArea / 1000000).toFixed(6)} km²</strong>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>Areas Count: {areas.length}</strong>
        </div>
        <button 
          onClick={clearAllAreas}
          style={{
            background: '#ff4444',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Clear All Areas
        </button>
      </div>

      {/* Instructions Panel */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        background: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000,
        maxWidth: '300px'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>How to Use:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#666' }}>
          <li>Use drawing tools on the right to mark areas</li>
          <li>Click on areas to see detailed measurements</li>
          <li>Edit or delete areas using the edit tools</li>
          <li>Areas are automatically saved to your browser</li>
        </ul>
      </div>
    </div>
  );
};

export default MapAreaCalculator;

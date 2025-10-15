import { AdjustmentsHorizontalIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { GeoJSON, LayersControl, MapContainer, TileLayer, useMap } from 'react-leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Enhanced dummy data with more features
const dummyData = {
  claimedLand: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          type: 'claimed',
          id: 'CL001',
          claimant: 'Ram Prasad',
          area: '2.5 hectares',
          status: 'Approved',
          village: 'Banjara Tola'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[[78.5, 21.5], [78.52, 21.5], [78.52, 21.52], [78.5, 21.52], [78.5, 21.5]]]
        }
      },
      {
        type: 'Feature',
        properties: {
          type: 'claimed',
          id: 'CL002',
          claimant: 'Sita Devi',
          area: '1.8 hectares',
          status: 'Under Review',
          village: 'Kushwah Tola'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[[78.53, 21.53], [78.55, 21.53], [78.55, 21.55], [78.53, 21.55], [78.53, 21.53]]]
        }
      }
    ]
  },
  forestCover: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          type: 'forest',
          name: 'Dense Forest Area A',
          area: '45 hectares',
          type_detail: 'Dense Mixed Forest'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[[78.52, 21.52], [78.58, 21.52], [78.58, 21.58], [78.52, 21.58], [78.52, 21.52]]]
        }
      }
    ]
  },
  waterBodies: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          type: 'water',
          name: 'Community Pond',
          area: '2 acres',
          usage: 'Drinking & Irrigation'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[[78.56, 21.54], [78.57, 21.54], [78.57, 21.55], [78.56, 21.55], [78.56, 21.54]]]
        }
      }
    ]
  },
  homesteads: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          type: 'homestead',
          id: 'HS001',
          owner: 'Ram Prasad',
          area: '0.2 hectares'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[[78.51, 21.51], [78.512, 21.51], [78.512, 21.512], [78.51, 21.512], [78.51, 21.51]]]
        }
      }
    ]
  }
};

const layerStyles = {
  claimedLand: {
    color: '#f58369',
    weight: 2,
    fillOpacity: 0.4
  },
  forestCover: {
    color: '#046353',
    weight: 2,
    fillOpacity: 0.4
  },
  waterBodies: {
    color: '#4299e1',
    weight: 2,
    fillOpacity: 0.4
  },
  homesteads: {
    color: '#9f7aea',
    weight: 2,
    fillOpacity: 0.4
  }
};

// Search component for the map
function MapSearch({ onLocationSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    // Simulate search API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock search results
    const mockResults = [
      { id: 'CL001', name: 'Ram Prasad Claim', type: 'Claim', coordinates: [78.51, 21.51] },
      { id: 'CL002', name: 'Sita Devi Claim', type: 'Claim', coordinates: [78.54, 21.54] },
      { id: 'forest1', name: 'Dense Forest Area A', type: 'Forest', coordinates: [78.55, 21.55] },
      { id: 'pond1', name: 'Community Pond', type: 'Water Body', coordinates: [78.565, 21.545] }
    ].filter(result =>
      result.name.toLowerCase().includes(query.toLowerCase()) ||
      result.type.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(mockResults);
    setIsSearching(false);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <div className="absolute top-4 left-4 z-[1000] w-80">
      <div className="relative">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search locations, claims, resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-bg-1 focus:border-bg-1"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
            {searchResults.map((result) => (
              <button
                key={result.id}
                onClick={() => {
                  onLocationSelect(result.coordinates);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900">{result.name}</div>
                <div className="text-sm text-gray-500">{result.type}</div>
              </button>
            ))}
          </div>
        )}

        {isSearching && (
          <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10">
            <div className="text-center text-gray-500">Searching...</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Map controller component
function MapController({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 15);
    }
  }, [center, zoom, map]);

  return null;
}

export default function MapViewer() {
  const [activeLayer, setActiveLayer] = useState('claimedLand');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([21.55, 78.55]);
  const [mapZoom, setMapZoom] = useState(13);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    village: 'all',
    area: 'all'
  });

  const handleLocationSelect = (coordinates) => {
    setMapCenter(coordinates);
    setMapZoom(16);
  };

  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      let popupContent = '<div class="p-2">';

      if (feature.properties.type === 'claimed') {
        popupContent += `
          <h3 class="font-bold text-lg mb-2">${feature.properties.claimant}</h3>
          <div class="space-y-1 text-sm">
            <p><strong>Claim ID:</strong> ${feature.properties.id}</p>
            <p><strong>Area:</strong> ${feature.properties.area}</p>
            <p><strong>Status:</strong> <span class="px-2 py-1 rounded-full text-xs ${
              feature.properties.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }">${feature.properties.status}</span></p>
            <p><strong>Village:</strong> ${feature.properties.village}</p>
          </div>
        `;
      } else if (feature.properties.type === 'forest') {
        popupContent += `
          <h3 class="font-bold text-lg mb-2">${feature.properties.name}</h3>
          <div class="space-y-1 text-sm">
            <p><strong>Area:</strong> ${feature.properties.area}</p>
            <p><strong>Type:</strong> ${feature.properties.type_detail}</p>
          </div>
        `;
      } else if (feature.properties.type === 'water') {
        popupContent += `
          <h3 class="font-bold text-lg mb-2">${feature.properties.name}</h3>
          <div class="space-y-1 text-sm">
            <p><strong>Area:</strong> ${feature.properties.area}</p>
            <p><strong>Usage:</strong> ${feature.properties.usage}</p>
          </div>
        `;
      }

      popupContent += '</div>';
      layer.bindPopup(popupContent);
    }
  };

  const filteredData = (dataKey) => {
    if (!dummyData[dataKey]) return dummyData[dataKey];

    return {
      ...dummyData[dataKey],
      features: dummyData[dataKey].features.filter(feature => {
        const props = feature.properties;

        // Status filter
        if (filters.status !== 'all' && props.status && props.status !== filters.status) {
          return false;
        }

        // Village filter
        if (filters.village !== 'all' && props.village && props.village !== filters.village) {
          return false;
        }

        return true;
      })
    };
  };

  return (
    <div className="card relative">
      <div className="section-heading mb-4 -mx-6 -mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Land Overview Map</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-bg-1 focus:ring-bg-1"
              >
                <option value="all">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Under Review">Under Review</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
              <select
                value={filters.village}
                onChange={(e) => setFilters(prev => ({ ...prev, village: e.target.value }))}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-bg-1 focus:ring-bg-1"
              >
                <option value="all">All Villages</option>
                <option value="Banjara Tola">Banjara Tola</option>
                <option value="Kushwah Tola">Kushwah Tola</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area Range</label>
              <select
                value={filters.area}
                onChange={(e) => setFilters(prev => ({ ...prev, area: e.target.value }))}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-bg-1 focus:ring-bg-1"
              >
                <option value="all">All Areas</option>
                <option value="small">0-1 hectare</option>
                <option value="medium">1-3 hectares</option>
                <option value="large">3+ hectares</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg overflow-hidden relative">
        <MapSearch onLocationSelect={handleLocationSelect} />

        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '400px' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LayersControl position="topright">
            <LayersControl.Overlay checked name="Claimed Land">
              <GeoJSON
                data={filteredData('claimedLand')}
                style={layerStyles.claimedLand}
                onEachFeature={onEachFeature}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay name="Forest Cover">
              <GeoJSON
                data={filteredData('forestCover')}
                style={layerStyles.forestCover}
                onEachFeature={onEachFeature}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay name="Water Bodies">
              <GeoJSON
                data={filteredData('waterBodies')}
                style={layerStyles.waterBodies}
                onEachFeature={onEachFeature}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay name="Homesteads">
              <GeoJSON
                data={filteredData('homesteads')}
                style={layerStyles.homesteads}
                onEachFeature={onEachFeature}
              />
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      </div>

      {/* Layer Toggle Buttons */}
      <div className="flex flex-wrap gap-3 mt-6">
        {Object.entries(layerStyles).map(([key]) => (
          <button
            key={key}
            className={`px-5 py-2 rounded-full text-sm font-medium shadow-sm transition
              ${activeLayer === key
                ? 'bg-bg-1 text-fra-font ring-2 ring-offset-2 ring-bg-1'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            onClick={() => setActiveLayer(key)}
          >
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </button>
        ))}
      </div>

      {/* Map Statistics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-bg-1">
            {filteredData('claimedLand').features.length}
          </div>
          <div className="text-sm text-gray-600">Active Claims</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {filteredData('forestCover').features.length}
          </div>
          <div className="text-sm text-gray-600">Forest Areas</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {filteredData('waterBodies').features.length}
          </div>
          <div className="text-sm text-gray-600">Water Bodies</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {filteredData('homesteads').features.length}
          </div>
          <div className="text-sm text-gray-600">Homesteads</div>
        </div>
      </div>
    </div>
  );
}
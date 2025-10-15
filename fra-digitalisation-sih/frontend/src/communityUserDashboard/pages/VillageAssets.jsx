import {
    ChartBarIcon,
    FunnelIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    MapIcon,
    TableCellsIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import AssetCharts from '../components/AssetCharts';
import MapViewer from '../components/MapViewer';

const villageStats = [
  {
    id: 1,
    title: 'Total Land Area',
    value: '1,250 hectares',
    change: '+2.5%',
    type: 'positive'
  },
  {
    id: 2,
    title: 'Forest Cover',
    value: '45%',
    change: '-0.8%',
    type: 'negative'
  },
  {
    id: 3,
    title: 'Water Bodies',
    value: '85 acres',
    change: '+1.2%',
    type: 'positive'
  },
  {
    id: 4,
    title: 'Total Claims',
    value: '156',
    change: '+12',
    type: 'positive'
  }
];

const tabs = [
  { id: 'overview', name: 'Overview', icon: HomeIcon },
  { id: 'map', name: 'Interactive Map', icon: MapIcon },
  { id: 'charts', name: 'Analytics', icon: ChartBarIcon },
  { id: 'resources', name: 'Resources', icon: TableCellsIcon }
];

const resources = [
  { type: 'Grazing Land', location: 'North Village', area: '25 hectares', status: 'Active', category: 'Land' },
  { type: 'Community Pond', location: 'East Village', area: '2 acres', status: 'Seasonal', category: 'Water' },
  { type: 'Sacred Grove', location: 'West Forest', area: '5 hectares', status: 'Protected', category: 'Forest' },
  { type: 'Agricultural Land', location: 'South Fields', area: '45 hectares', status: 'Cultivated', category: 'Land' },
  { type: 'Forest Reserve', location: 'Central Forest', area: '120 hectares', status: 'Protected', category: 'Forest' },
  { type: 'Irrigation Canal', location: 'East Boundary', area: '3 km', status: 'Functional', category: 'Water' }
];

export default function VillageAssets() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || resource.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {villageStats.map((stat) => (
                <div key={stat.id} className="card">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-bg-heading">
                      {stat.value}
                    </p>
                    <span
                      className={`ml-2 text-sm font-medium ${
                        stat.type === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card text-center">
                <MapIcon className="h-12 w-12 text-bg-1 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Explore Map</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">View interactive land overview</p>
                <button
                  onClick={() => setActiveTab('map')}
                  className="btn-primary w-full"
                >
                  View Map
                </button>
              </div>

              <div className="card text-center">
                <ChartBarIcon className="h-12 w-12 text-bg-1 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">View Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Analyze land use patterns</p>
                <button
                  onClick={() => setActiveTab('charts')}
                  className="btn-primary w-full"
                >
                  View Charts
                </button>
              </div>

              <div className="card text-center">
                <TableCellsIcon className="h-12 w-12 text-bg-1 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Browse Resources</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Explore community assets</p>
                <button
                  onClick={() => setActiveTab('resources')}
                  className="btn-primary w-full"
                >
                  View Resources
                </button>
              </div>
            </div>
          </div>
        );

      case 'map':
        return (
          <div className="space-y-6">
            <MapViewer />

            {/* Map Legend */}
            <div className="card">
              <div className="section-heading mb-4 -mx-6 -mt-6">
                <h2 className="text-lg font-semibold">Map Legend</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-[#f58369] rounded mr-2"></span>
                  <span className="text-sm">Claimed Land</span>
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-[#046353] rounded mr-2"></span>
                  <span className="text-sm">Forest Cover</span>
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-[#4299e1] rounded mr-2"></span>
                  <span className="text-sm">Water Bodies</span>
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-[#9f7aea] rounded mr-2"></span>
                  <span className="text-sm">Homesteads</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'charts':
        return (
          <div className="space-y-6">
            <AssetCharts />

            {/* Additional Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Land Use Trends</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Forest Cover Change</span>
                    <span className="text-sm font-medium text-red-600">-0.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Agricultural Expansion</span>
                    <span className="text-sm font-medium text-green-600">+3.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Water Body Conservation</span>
                    <span className="text-sm font-medium text-green-600">+1.2%</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Community Impact</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Claims</span>
                    <span className="text-sm font-medium">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Beneficiaries</span>
                    <span className="text-sm font-medium">892</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Protected Areas</span>
                    <span className="text-sm font-medium">125 ha</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'resources':
        return (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="card">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bg-1 focus:border-bg-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FunnelIcon className="h-5 w-5 text-gray-400" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-bg-1 focus:border-bg-1"
                  >
                    <option value="all">All Categories</option>
                    <option value="Land">Land</option>
                    <option value="Forest">Forest</option>
                    <option value="Water">Water</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Resources Table */}
            <div className="card">
              <div className="section-heading mb-4 -mx-6 -mt-6">
                <h2 className="text-lg font-semibold">Community Resources</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {filteredResources.length} of {resources.length} resources
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Area/Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredResources.map((resource, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {resource.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {resource.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {resource.area}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            resource.category === 'Land' ? 'bg-green-100 text-green-800' :
                            resource.category === 'Forest' ? 'bg-blue-100 text-blue-800' :
                            'bg-cyan-100 text-cyan-800'
                          }`}>
                            {resource.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            resource.status === 'Active' ? 'bg-green-100 text-green-800' :
                            resource.status === 'Protected' ? 'bg-blue-100 text-blue-800' :
                            resource.status === 'Functional' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {resource.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredResources.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No resources found matching your criteria.
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-bg-1 px-4 sm:px-6 py-6 sm:py-8 rounded-b-lg shadow-md mb-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Village Assets Overview
          </h1>
          <p className="text-white/90">
            Explore and analyze community resources
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-bg-1 text-bg-1'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {renderTabContent()}
      </div>
    </div>
  );
}
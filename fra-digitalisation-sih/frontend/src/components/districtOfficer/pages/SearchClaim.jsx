import { motion } from 'framer-motion';
import {
    Calendar,
    Download,
    Eye,
    FileText,
    Mail,
    MapPin,
    Phone,
    Search,
    SlidersHorizontal,
    X
} from 'lucide-react';
import { useState } from 'react';

const SearchClaim = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    village: '',
    block: '',
    dateFrom: '',
    dateTo: '',
    claimantType: 'all'
  });

  const sampleClaims = [
    {
      id: 'FRA-2024-001',
      claimantName: 'Rajesh Kumar',
      village: 'Banjara Tola',
      block: 'Block A',
      area: '2.5 hectares',
      status: 'approved',
      submittedDate: '2024-01-15',
      approvedDate: '2024-01-25',
      claimantType: 'individual',
      contact: {
        phone: '+91-9876543210',
        email: 'rajesh.kumar@example.com'
      }
    },
    {
      id: 'FRA-2024-002',
      claimantName: 'Meera Bai',
      village: 'Gondpura',
      block: 'Block B',
      area: '1.8 hectares',
      status: 'pending',
      submittedDate: '2024-01-18',
      approvedDate: null,
      claimantType: 'individual',
      contact: {
        phone: '+91-9876543211',
        email: 'meera.bai@example.com'
      }
    },
    {
      id: 'FRA-2024-003',
      claimantName: 'Suresh Singh',
      village: 'Baiga Colony',
      block: 'Block C',
      area: '3.2 hectares',
      status: 'rejected',
      submittedDate: '2024-01-20',
      approvedDate: null,
      claimantType: 'community',
      contact: {
        phone: '+91-9876543212',
        email: 'suresh.singh@example.com'
      }
    }
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = sampleClaims.filter(claim =>
      claim.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.claimantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.village.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    let filtered = sampleClaims;

    if (filters.status !== 'all') {
      filtered = filtered.filter(claim => claim.status === filters.status);
    }
    if (filters.village) {
      filtered = filtered.filter(claim =>
        claim.village.toLowerCase().includes(filters.village.toLowerCase())
      );
    }
    if (filters.block) {
      filtered = filtered.filter(claim =>
        claim.block.toLowerCase().includes(filters.block.toLowerCase())
      );
    }
    if (filters.claimantType !== 'all') {
      filtered = filtered.filter(claim => claim.claimantType === filters.claimantType);
    }

    setSearchResults(filtered);
    setShowFilters(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return '✓';
      case 'pending': return '⏳';
      case 'rejected': return '✗';
      default: return '?';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Search Claims</h1>
            <p className="text-gray-600 mt-1">Search and filter forest rights claims by various criteria</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-[#5a1c2d] text-[#5a1c2d] rounded-lg hover:bg-[#5a1c2d] hover:text-white transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Claim ID, Claimant Name, or Village..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a1c2d] focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-[#5a1c2d] text-white rounded-lg hover:bg-[#4a1825] transition-colors flex items-center space-x-2"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a1c2d] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
              <input
                type="text"
                placeholder="Enter village name"
                value={filters.village}
                onChange={(e) => handleFilterChange('village', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a1c2d] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Block</label>
              <input
                type="text"
                placeholder="Enter block name"
                value={filters.block}
                onChange={(e) => handleFilterChange('block', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a1c2d] focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Claimant Type</label>
              <select
                value={filters.claimantType}
                onChange={(e) => handleFilterChange('claimantType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a1c2d] focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="individual">Individual</option>
                <option value="community">Community</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a1c2d] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a1c2d] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setFilters({
                  status: 'all',
                  village: '',
                  block: '',
                  dateFrom: '',
                  dateTo: '',
                  claimantType: 'all'
                });
                setSearchResults([]);
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-[#5a1c2d] text-white rounded-lg hover:bg-[#4a1825] transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </motion.div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Search Results ({searchResults.length})
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {searchResults.map((claim, index) => (
              <motion.div
                key={claim.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedClaim(claim)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getStatusIcon(claim.status)}</span>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{claim.id}</h4>
                        <p className="text-sm text-gray-600">{claim.claimantName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{claim.village}</p>
                      <p className="text-sm text-gray-500">{claim.area}</p>
                    </div>

                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                      {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </span>

                    <div className="flex items-center space-x-2">
                      <button className="text-[#5a1c2d] hover:text-[#4a1825] transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {searchQuery && searchResults.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No claims found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters</p>
        </div>
      )}

      {/* Claim Details Modal */}
      {selectedClaim && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedClaim(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Claim Details</h2>
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl">{getStatusIcon(selectedClaim.status)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedClaim.id}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedClaim.status)}`}>
                      {selectedClaim.status.charAt(0).toUpperCase() + selectedClaim.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Claimant Name</label>
                    <p className="text-sm text-gray-900">{selectedClaim.claimantName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Claimant Type</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedClaim.claimantType}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location Details</label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{selectedClaim.village}, {selectedClaim.block}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Area: {selectedClaim.area}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Important Dates</label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Submitted: {selectedClaim.submittedDate}</span>
                    </div>
                    {selectedClaim.approvedDate && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Approved: {selectedClaim.approvedDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Information</label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{selectedClaim.contact.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{selectedClaim.contact.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    View Documents
                  </button>
                  <button className="px-4 py-2 bg-[#5a1c2d] text-white rounded-lg hover:bg-[#4a1825] transition-colors">
                    Download Report
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchClaim;
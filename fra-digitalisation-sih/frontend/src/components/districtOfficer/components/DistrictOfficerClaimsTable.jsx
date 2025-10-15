import { AnimatePresence, motion } from 'framer-motion';
import {
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Eye,
    FileText,
    MapPin,
    User,
    XCircle,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import MapViewModal from './MapViewModal';

const DistrictOfficerClaimsTable = ({ statusFilter, onStatusFilter }) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedClaims, setSelectedClaims] = useState([]);
  const [claims, setClaims] = useState([]);
  const [claimsBySubdivision, setClaimsBySubdivision] = useState({ Phanda: [], Berasia: [], Unknown: [] });
  const [selectedSubdivision, setSelectedSubdivision] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [districtOfficer, setDistrictOfficer] = useState(null);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isClaimDetailsModalOpen, setIsClaimDetailsModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Fetch claims data from backend
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8000/api/district/claims', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch claims');
        }
        
        const data = await response.json();
        if (data.success) {
          setClaims(data.claims || []);
          setClaimsBySubdivision(data.claimsBySubdivision || { Phanda: [], Berasia: [], Unknown: [] });
          setDistrictOfficer(data.officer || null);
        } else {
          throw new Error(data.message || 'Failed to fetch claims');
        }
      } catch (error) {
        console.error('Error fetching claims:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClaims();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#044e2b]"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Claims</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Using real claims data from API - no mock data needed

  // Filter claims based on status and subdivision
  const filteredClaims = claims.filter(claim => {
    // Status filter
    let statusMatch = true;
    if (statusFilter !== 'all') {
      switch (statusFilter) {
        case 'district-review':
          statusMatch = claim.status === 'forwarded_to_district' || claim.status === 'UnderDistrictReview';
          break;
        case 'approved':
          statusMatch = claim.status === 'Title Granted';
          break;
        case 'rejected':
          statusMatch = claim.status === 'FinalRejected';
          break;
        default:
          statusMatch = true;
      }
    }

    // Subdivision filter
    let subdivisionMatch = true;
    if (selectedSubdivision !== 'all') {
      subdivisionMatch = claim.subdivision === selectedSubdivision;
    }

    return statusMatch && subdivisionMatch;
  });

  const toggleRowExpansion = (claimId) => {
    setExpandedRows(prev => ({
      ...prev,
      [claimId]: !prev[claimId]
    }));
  };

  const handleClaimAction = async (claimId, action) => {
    try {
      // Handle view and map actions
      if (action === 'view') {
        const claim = claims.find(c => c.id === claimId);
        if (claim) {
          setSelectedClaim(claim);
          setIsClaimDetailsModalOpen(true);
        }
        return;
      }
      
      if (action === 'gis') {
        const claim = claims.find(c => c.id === claimId);
        if (claim) {
          setSelectedClaim(claim);
          setIsMapModalOpen(true);
        }
        return;
      }

      // Handle approve and reject actions
      let endpoint = '';
      let remarks = '';
      
      if (action === 'approve') {
        remarks = prompt('Enter remarks for approval (optional):') || 'Individual Forest Right approved by District Officer';
        endpoint = `http://localhost:8000/api/district/claims/${claimId}/approve`;
      } else if (action === 'reject') {
        remarks = prompt('Enter reason for rejection:');
        if (!remarks) {
          alert('Rejection reason is required');
          return;
        }
        endpoint = `http://localhost:8000/api/district/claims/${claimId}/reject`;
      } else {
        console.log(`Action: ${action} for claim: ${claimId}`);
        return;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ remarks })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Claim ${action}d successfully!`);
        // Refresh claims data
        window.location.reload();
      } else {
        alert(`Failed to ${action} claim: ${data.message}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing claim:`, error);
      alert(`Error ${action}ing claim. Please try again.`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'forwarded_to_district': 
      case 'UnderDistrictReview': 
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'Title Granted': 
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'FinalRejected': 
        return 'bg-red-100 text-red-800 border border-red-300';
      default: 
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-[#8b4513]/10 text-[#8b4513] border border-[#8b4513]/30';
      case 'medium': return 'bg-[#d4c5a9]/20 text-[#044e2b] border border-[#d4c5a9]/50';
      case 'low': return 'bg-[#044e2b]/10 text-[#044e2b] border border-[#044e2b]/30';
      default: return 'bg-[#d4c5a9]/10 text-[#044e2b] border border-[#d4c5a9]/30';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-[#d4c5a9]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-[#044e2b]" />
            <h2 className="text-xl font-bold text-[#044e2b]">
              Claims Management
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={selectedSubdivision}
              onChange={(e) => setSelectedSubdivision(e.target.value)}
              className="px-4 py-2 border border-[#d4c5a9]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#044e2b] focus:border-transparent bg-white"
            >
              <option value="all">All Subdivisions</option>
              <option value="Phanda">Phanda ({claimsBySubdivision.Phanda.length})</option>
              <option value="Berasia">Berasia ({claimsBySubdivision.Berasia.length})</option>
              {claimsBySubdivision.Unknown.length > 0 && (
                <option value="Unknown">Unknown ({claimsBySubdivision.Unknown.length})</option>
              )}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => onStatusFilter(e.target.value)}
              className="px-4 py-2 border border-[#d4c5a9]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#044e2b] focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="district-review">Pending Review</option>
              <option value="approved">Title Granted</option>
              <option value="rejected">Rejected</option>
            </select>

            <div className="text-sm text-gray-600">
              Showing {filteredClaims.length} of {claims.length} claims
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredClaims.length === 0 ? (
          <div className="text-center py-12 bg-white">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Claims Found</h3>
            <p className="text-gray-600">
              {claims.length === 0 
                ? 'No claims have been forwarded to district level yet.' 
                : 'No claims match the current filters.'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Total claims in system: {claims.length}
            </p>
          </div>
        ) : (
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Claim Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type & Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source & Map
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClaims.map((claim) => (
              <React.Fragment key={claim.id}>
                <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleRowExpansion(claim.id)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <button className="mr-3">
                        {expandedRows[claim.id] ? (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {claim.frapattaid}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {claim.claimantName}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{claim.gramPanchayat}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {claim.subdivision} Subdivision
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{claim.claimType}</div>
                    <div className="text-sm text-gray-500">{claim.forestLandArea} acres</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                      {claim.status === 'forwarded_to_district' ? 'Pending Review' : 
                       claim.status === 'UnderDistrictReview' ? 'Under Review' :
                       claim.status === 'Title Granted' ? 'Title Granted' : 
                       claim.status === 'FinalRejected' ? 'Rejected' : claim.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      From: {claim.subdivision}
                    </div>
                    <div className="text-sm text-gray-500">
                      {claim.hasMap ? '📍 Map Available' : '📍 No Map'}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClaimAction(claim.id, 'approve');
                        }}
                        className="text-[#044e2b] hover:text-[#0a5a35] p-1 rounded hover:bg-[#044e2b]/10"
                        title="Approve"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClaimAction(claim.id, 'reject');
                        }}
                        className="text-[#8b4513] hover:text-[#654321] p-1 rounded hover:bg-[#8b4513]/10"
                        title="Reject"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClaimAction(claim.id, 'view');
                        }}
                        className="text-[#044e2b] hover:text-[#0a5a35] p-1 rounded hover:bg-[#044e2b]/10"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClaimAction(claim.id, 'gis');
                        }}
                        className="text-[#d4c5a9] hover:text-[#b8a383] p-1 rounded hover:bg-[#d4c5a9]/20"
                        title="Open GIS"
                      >
                        <MapPin className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded Row */}
                <AnimatePresence>
                  {expandedRows[claim.id] && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-50"
                    >
                      <td colSpan="6" className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Claim Timeline */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-800 mb-3">Claim Journey</h4>
                            <div className="space-y-2">
                              {claim.timeline.map((step, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                  <div className={`w-3 h-3 rounded-full ${
                                    step.status === 'completed' ? 'bg-[#044e2b]' :
                                    step.status === 'current' ? 'bg-[#d4c5a9]' : 'bg-[#d4c5a9]/50'
                                  }`}></div>
                                  <div className="flex-1">
                                    <div className="text-sm text-gray-800">{step.stage}</div>
                                    <div className="text-xs text-gray-500">{step.date}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Documents & Actions */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-800 mb-3">Documents</h4>
                            <div className="space-y-2 mb-4">
                              {claim.documents.map((doc, index) => (
                                <div key={index} className="flex items-center space-x-2 text-sm">
                                  <FileText className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-700">{doc.replace('_', ' ').toUpperCase()}</span>
                                </div>
                              ))}
                            </div>

                            <div className="border-t pt-4">
                              <h4 className="text-sm font-semibold text-gray-800 mb-2">Remarks</h4>
                              <p className="text-sm text-gray-600">{claim.remarks}</p>
                            </div>

                            <div className="mt-4 flex space-x-2">
                              <button className="bg-[#044e2b] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#0a5a35] transition-colors">
                                View Full Details
                              </button>
                              <button className="border border-[#044e2b] text-[#044e2b] px-4 py-2 rounded-lg text-sm hover:bg-[#044e2b] hover:text-white transition-colors">
                                Open GIS Map
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing 1 to {filteredClaims.length} of {claims.length} claims
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
              Previous
            </button>
            <button className="px-3 py-1 text-sm bg-[#044e2b] text-white rounded">
              1
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
              2
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Claim Details Modal */}
      {isClaimDetailsModalOpen && selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Claim Details</h3>
                <button
                  onClick={() => setIsClaimDetailsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Claimant Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {selectedClaim.claimantName}</div>
                    <div><span className="font-medium">FRA ID:</span> {selectedClaim.frapattaid}</div>
                    <div><span className="font-medium">Village:</span> {selectedClaim.gramPanchayat}</div>
                    <div><span className="font-medium">Subdivision:</span> {selectedClaim.subdivision}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Land Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Claim Type:</span> {selectedClaim.claimType}</div>
                    <div><span className="font-medium">Forest Land Area:</span> {selectedClaim.forestLandArea} acres</div>
                    <div><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedClaim.status)}`}>
                        {selectedClaim.status === 'forwarded_to_district' ? 'Pending Review' : 
                         selectedClaim.status === 'UnderDistrictReview' ? 'Under Review' :
                         selectedClaim.status === 'Title Granted' ? 'Title Granted' : 
                         selectedClaim.status === 'FinalRejected' ? 'Rejected' : selectedClaim.status}
                      </span>
                    </div>
                    <div><span className="font-medium">Map Available:</span> {selectedClaim.hasMap ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      <MapViewModal 
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        claim={selectedClaim}
      />
    </div>
  );
};

export default DistrictOfficerClaimsTable;
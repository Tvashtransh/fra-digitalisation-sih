import { motion } from 'framer-motion';
import { CheckCircle, Eye, FileText, MapPin, XCircle, AlertCircle, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import SubdivisionClaimReviewModal from './SubdivisionClaimReviewModal';
import ClaimDetailsModal from './ClaimDetailsModal';
import MapViewModal from './MapViewModal';

const BlockOfficerClaimsTable = ({ statusFilter, searchTerm }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [subdivisionOfficer, setSubdivisionOfficer] = useState(null);
  const [selectedClaims, setSelectedClaims] = useState(new Set());
  const itemsPerPage = 10;

  // Fetch claims data and subdivision officer info
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch claims
      const claimsResponse = await fetch('http://localhost:8000/api/block-officer/claims', {
        credentials: 'include'
      });
      
      if (!claimsResponse.ok) {
        throw new Error('Failed to fetch claims');
      }
      
      const claimsData = await claimsResponse.json();
      if (claimsData.success) {
        setClaims(claimsData.claims);
      } else {
        throw new Error(claimsData.message || 'Failed to fetch claims');
      }

      // Fetch subdivision officer profile
      const profileResponse = await fetch('http://localhost:8000/api/block-officer/profile', {
        credentials: 'include'
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        if (profileData.success) {
          setSubdivisionOfficer(profileData.officer);
        }
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter claims based on status and search
  const filteredClaims = claims.filter(claim => {
    const matchesStatus = !statusFilter || statusFilter === 'all' || claim.status === statusFilter;
    const matchesSearch = !searchTerm ||
      claim.applicantDetails?.claimantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.frapattaid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.gramPanchayat?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClaims = filteredClaims.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'ForwardedToDistrict': { color: 'bg-blue-100 text-blue-800', label: 'Under Review' },
      'UnderDistrictReview': { color: 'bg-blue-100 text-blue-800', label: 'Under Review' },
      'ApprovedByDistrict': { color: 'bg-green-100 text-green-800', label: 'Approved' },
      'RejectedByDistrict': { color: 'bg-red-100 text-red-800', label: 'Rejected' },
      'FinalApproved': { color: 'bg-green-100 text-green-800', label: 'Final Approved' },
      'FinalRejected': { color: 'bg-red-100 text-red-800', label: 'Final Rejected' },
      'MappedByGramSabha': { color: 'bg-yellow-100 text-yellow-800', label: 'Mapped by GS' },
      'ForwardedToSubdivision': { color: 'bg-orange-100 text-orange-800', label: 'Forwarded to Subdivision' },
      'ApprovedBySubdivision': { color: 'bg-green-100 text-green-800', label: 'Approved by Subdivision' },
      'RejectedBySubdivision': { color: 'bg-red-100 text-red-800', label: 'Rejected by Subdivision' },
      'ForwardedToDistrict': { color: 'bg-blue-100 text-blue-800', label: 'Forwarded to District' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${priorityConfig[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  // Handle claim review (for review modal with map)
  const handleReviewClaim = (claim) => {
    setSelectedClaim(claim);
    setIsReviewModalOpen(true);
  };

  // Handle view claim details (eye button)
  const handleViewDetails = (claim) => {
    setSelectedClaim(claim);
    setIsDetailsModalOpen(true);
  };

  // Handle view map only (map button)
  const handleViewMap = (claim) => {
    setSelectedClaim(claim);
    setIsMapModalOpen(true);
  };

  // Handle claim selection
  const handleClaimSelection = (claimId, isSelected) => {
    const newSelectedClaims = new Set(selectedClaims);
    if (isSelected) {
      newSelectedClaims.add(claimId);
    } else {
      newSelectedClaims.delete(claimId);
    }
    setSelectedClaims(newSelectedClaims);
  };

  // Handle select all claims
  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      const allClaimIds = new Set(paginatedClaims.map(claim => claim._id));
      setSelectedClaims(allClaimIds);
    } else {
      setSelectedClaims(new Set());
    }
  };

  // Handle claim approval
  const handleApproveClaim = async (actionData) => {
    try {
      const response = await fetch(`http://localhost:8000/api/block-officer/claims/${actionData.claimId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(actionData)
      });

      if (response.ok) {
        // Refresh claims from server to get updated status
        await fetchData();
        alert('Claim approved successfully!');
      } else {
        throw new Error('Failed to approve claim');
      }
    } catch (error) {
      console.error('Error approving claim:', error);
      throw error;
    }
  };

  // Handle claim rejection
  const handleRejectClaim = async (actionData) => {
    try {
      const response = await fetch(`http://localhost:8000/api/block-officer/claims/${actionData.claimId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(actionData)
      });

      if (response.ok) {
        // Refresh claims from server to get updated status
        await fetchData();
        alert('Claim rejected successfully!');
      } else {
        throw new Error('Failed to reject claim');
      }
    } catch (error) {
      console.error('Error rejecting claim:', error);
      throw error;
    }
  };

  // Handle forward to district
  const handleForwardToDistrict = async (actionData) => {
    try {
      const response = await fetch(`http://localhost:8000/api/block-officer/claims/${actionData.claimId}/forward-to-district`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(actionData)
      });

      if (response.ok) {
        // Refresh claims
        const updatedClaims = claims.map(claim => 
          claim._id === actionData.claimId 
            ? { ...claim, status: 'forwarded_to_district' }
            : claim
        );
        setClaims(updatedClaims);
        alert('Claim forwarded to District Officer successfully!');
      } else {
        throw new Error('Failed to forward claim');
      }
    } catch (error) {
      console.error('Error forwarding claim:', error);
      throw error;
    }
  };

  // Handle bulk forward to district
  const handleBulkForwardToDistrict = async () => {
    if (selectedClaims.size === 0) {
      alert('Please select claims to forward.');
      return;
    }

    const confirmForward = window.confirm(`Forward ${selectedClaims.size} selected claims to District Officer?`);
    if (!confirmForward) return;

    try {
      const promises = Array.from(selectedClaims).map(claimId => 
        fetch(`http://localhost:8000/api/block-officer/claims/${claimId}/forward-to-district`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            notes: 'Bulk forwarded to district officer for review.',
            subdivisionOfficer: subdivisionOfficer?.name || 'Subdivision Officer',
            timestamp: new Date().toISOString()
          })
        })
      );

      const results = await Promise.all(promises);
      const successCount = results.filter(r => r.ok).length;
      
      if (successCount > 0) {
        // Refresh claims
        const updatedClaims = claims.map(claim => 
          selectedClaims.has(claim._id) 
            ? { ...claim, status: 'forwarded_to_district' }
            : claim
        );
        setClaims(updatedClaims);
        setSelectedClaims(new Set());
        alert(`${successCount} claims forwarded to District Officer successfully!`);
      }
    } catch (error) {
      console.error('Error in bulk forward:', error);
      alert('Error forwarding claims. Please try again.');
    }
  };

  // Handle bulk approve - REMOVED: Block Officers can only reject and forward

  // Handle bulk reject
  const handleBulkReject = async () => {
    if (selectedClaims.size === 0) {
      alert('Please select claims to reject.');
      return;
    }

    const confirmReject = window.confirm(`Reject ${selectedClaims.size} selected claims?`);
    if (!confirmReject) return;

    try {
      const promises = Array.from(selectedClaims).map(claimId => 
        fetch(`http://localhost:8000/api/block-officer/claims/${claimId}/reject`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            notes: 'Bulk rejected by subdivision officer.',
            subdivisionOfficer: subdivisionOfficer?.name || 'Subdivision Officer',
            timestamp: new Date().toISOString()
          })
        })
      );

      const results = await Promise.all(promises);
      const successCount = results.filter(r => r.ok).length;
      
      if (successCount > 0) {
        // Refresh claims from server to get updated status
        await fetchData();
        setSelectedClaims(new Set());
        alert(`${successCount} claims rejected successfully!`);
      }
    } catch (error) {
      console.error('Error in bulk reject:', error);
      alert('Error rejecting claims. Please try again.');
    }
  };

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

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Claims Management</h3>
            <p className="text-sm text-gray-600 mt-1">
              {filteredClaims.length} claims found
              {statusFilter && statusFilter !== 'all' && ` • Filtered by ${statusFilter}`}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Show:</span>
            <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedClaims.size === paginatedClaims.length && paginatedClaims.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-[#044e2b] focus:ring-[#044e2b]"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Claim ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applicant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gram Sabha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Land Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documents
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedClaims.map((claim, index) => (
              <motion.tr
                key={claim._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedClaims.has(claim._id)}
                    onChange={(e) => handleClaimSelection(claim._id, e.target.checked)}
                    className="rounded border-gray-300 text-[#044e2b] focus:ring-[#044e2b]"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {claim.frapattaid || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {claim.applicantDetails?.claimantName || 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {claim.gramPanchayat || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {claim.mapData?.totalArea ? `${(claim.mapData.totalArea / 4046.86).toFixed(2)} acres` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                    {claim.claimType || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPriorityBadge('medium')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(claim.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-gray-400 mr-1" />
                    {claim.documents?.length || 0}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {/* View Details Button (Eye) - Shows claim details */}
                  <button 
                    onClick={() => handleViewDetails(claim)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                    title="View Claim Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  {/* Map View Button - Shows map only */}
                  {claim.mapData && (
                    <button 
                      onClick={() => handleViewMap(claim)}
                      className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                      title="View Map"
                    >
                      <MapPin className="h-4 w-4" />
                    </button>
                  )}
                  
                  {/* Quick Forward Button - for claims ready to forward */}
                  {(claim.status === 'MappedByGramSabha' || claim.status === 'forwarded_to_subdivision' || claim.status === 'ForwardedToSubdivision') && (
                    <button 
                      onClick={() => handleReviewClaim(claim)}
                      className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                      title="Review & Forward to District"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  )}
                  
                  {/* Status indicator for already processed claims */}
                  {claim.status === 'forwarded_to_district' && (
                    <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                      Forwarded
                    </span>
                  )}
                  {claim.status === 'ApprovedBySubdivision' && (
                    <span className="text-xs text-green-600 px-2 py-1 bg-green-100 rounded">
                      Approved
                    </span>
                  )}
                  {claim.status === 'RejectedBySubdivision' && (
                    <span className="text-xs text-red-600 px-2 py-1 bg-red-100 rounded">
                      Rejected
                    </span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredClaims.length)} of {filteredClaims.length} claims
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-3 py-1 border rounded text-sm ${
                    currentPage === pageNumber
                      ? 'bg-[#044e2b] text-[#d4c5a9] border-[#044e2b]'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedClaims.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium text-blue-800">
                {selectedClaims.size} claim{selectedClaims.size > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBulkApprove}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Approve Selected
              </button>
              <button
                onClick={handleBulkReject}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Reject Selected
              </button>
              <button
                onClick={handleBulkForwardToDistrict}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Forward to District
              </button>
              <button
                onClick={() => setSelectedClaims(new Set())}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subdivision Claim Review Modal */}
      <SubdivisionClaimReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedClaim(null);
        }}
        claim={selectedClaim}
        onReject={handleRejectClaim}
        onForwardToDistrict={handleForwardToDistrict}
        subdivisionOfficer={subdivisionOfficer}
      />

      {/* Claim Details Modal */}
      <ClaimDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedClaim(null);
        }}
        claim={selectedClaim}
      />

      {/* Map View Modal */}
      <MapViewModal
        isOpen={isMapModalOpen}
        onClose={() => {
          setIsMapModalOpen(false);
          setSelectedClaim(null);
        }}
        claim={selectedClaim}
      />
    </div>
  );
};

export default BlockOfficerClaimsTable;
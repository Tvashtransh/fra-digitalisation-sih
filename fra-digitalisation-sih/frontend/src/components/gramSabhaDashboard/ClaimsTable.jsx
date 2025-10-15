import { motion } from 'framer-motion';
import {
    CheckCircle,
    Clock,
    Eye,
    FileText,
    XCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';

const ClaimsTable = ({ statusFilter = 'all', userLocation = null }) => {
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [officerData, setOfficerData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [claims, setClaims] = useState([]);
  const [isLoadingClaims, setIsLoadingClaims] = useState(true);

  // Fetch officer profile data
  useEffect(() => {
    const fetchOfficerProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const response = await fetch('/api/gs/profile', {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (response.ok && data.success) {
          setOfficerData(data.officer);
        } else {
          console.error('Failed to fetch officer profile:', data.message);
        }
      } catch (error) {
        console.error('Error fetching officer profile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchOfficerProfile();
  }, []);

  // Fetch claims data
  const fetchClaims = async () => {
    try {
      setIsLoadingClaims(true);
      const response = await fetch('/api/gs/claims', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setClaims(data.claims);
      } else {
        console.error('Failed to fetch claims:', data.message);
      }
    } catch (error) {
      console.error('Error fetching claims:', error);
    } finally {
      setIsLoadingClaims(false);
    }
  };

  useEffect(() => {
    fetchClaims();
    
    // Poll for new claims every 30 seconds
    const interval = setInterval(fetchClaims, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Submitted':
        return 'text-yellow-600 bg-yellow-100';
      case 'RecommendedByGramSabha':
        return 'text-blue-600 bg-blue-100';
      case 'ApprovedBySDLC':
        return 'text-purple-600 bg-purple-100';
      case 'ApprovedByDLC':
        return 'text-green-600 bg-green-100';
      case 'Rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Helper function to format status text
  const formatStatus = (status) => {
    return status.replace(/([A-Z])/g, ' $1').trim();
  };

  // Filter claims based on status
  const filteredClaims = statusFilter === 'all'
    ? claims
    : claims.filter(claim => {
        if (statusFilter === 'pending') {
          return claim.status === 'Submitted' || claim.status === 'RecommendedByGramSabha';
        } else if (statusFilter === 'approved') {
          return claim.status === 'ApprovedBySDLC' || claim.status === 'ApprovedByDLC';
        } else if (statusFilter === 'rejected') {
          return claim.status === 'Rejected';
        }
        return claim.status === statusFilter;
      });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ApprovedByDLC':
      case 'ApprovedBySDLC':
        return <CheckCircle className="h-4 w-4" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4" />;
      case 'Submitted':
      case 'RecommendedByGramSabha':
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const handleApprove = (claimId) => {
    console.log('Approving claim:', claimId);
    // Here you would typically make an API call
  };

  const handleReject = (claimId) => {
    console.log('Rejecting claim:', claimId);
    // Here you would typically make an API call
  };

  const handleViewDetails = async (claim) => {
    try {
      const response = await fetch(`/api/gs/claim/${claim._id}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSelectedClaim(data.claim);
        setShowDetailsModal(true);
      } else {
        console.error('Failed to fetch claim details:', data.message);
        // Fallback to using the claim data we already have
        setSelectedClaim(claim);
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error('Error fetching claim details:', error);
      // Fallback to using the claim data we already have
      setSelectedClaim(claim);
      setShowDetailsModal(true);
    }
  };

  const handleViewMap = (claim) => {
    console.log('Viewing map for claim:', claim.id);
    // Here you would typically open a map modal or redirect to GIS view
  };

  const handleViewDocuments = (claim) => {
    console.log('Viewing documents for claim:', claim.id);
    // Here you would typically open a documents modal or redirect to documents view
  };

  const handleAddMap = (claim) => {
    console.log('Adding map for claim:', claim.id);
    // Here you would typically open a map drawing modal
  };

  const handleForwardToSubdivision = async (claimId) => {
    try {
      const response = await fetch(`/api/gs/claim/${claimId}/forward`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: 'ForwardedToSubdivision',
          remarks: 'Forwarded to subdivision officer for review'
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Refresh claims list
        fetchClaims();
        console.log('Claim forwarded successfully');
      } else {
        console.error('Failed to forward claim:', data.message);
      }
    } catch (error) {
      console.error('Error forwarding claim:', error);
    }
  };

  // Check if claim can be edited (not forwarded to subdivision or beyond)
  const canEditClaim = (claim) => {
    const nonEditableStatuses = [
      'ForwardedToSubdivision',
      'UnderSubdivisionReview',
      'ApprovedBySubdivision',
      'RejectedBySubdivision',
      'ForwardedToDistrict',
      'UnderDistrictReview',
      'ApprovedByDistrict',
      'RejectedByDistrict',
      'FinalApproved',
      'FinalRejected'
    ];
    return !nonEditableStatuses.includes(claim.status);
  };

  // Check if claim has map data
  const hasMapData = (claim) => {
    return claim.mapData && claim.mapData.areasJson || claim.geometry;
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Claims Management
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredClaims.length} of {claims.length} claims
            </div>
          </div>
          {isLoadingProfile ? (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Loading jurisdiction information...
              </p>
            </div>
          ) : officerData && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Your Jurisdiction:</strong> {officerData.gpName} Gram Panchayat, {officerData.subdivision} Subdivision, {officerData.district} District
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                GP Code: {officerData.gpCode} | You can only view and manage claims from your assigned Gram Panchayat.
              </p>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Claim ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Applicant Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Land Area
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoadingClaims ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">Loading claims...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center">
                      <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        No claims found
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No claims found for your Gram Panchayat.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredClaims.map((claim, index) => (
                  <motion.tr
                    key={claim._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {claim.frapattaid}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {claim.claimant?.name || claim.applicantDetails?.claimantName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {claim.landDetails?.totalAreaClaimed ? `${claim.landDetails.totalAreaClaimed} hectares` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {claim.claimType === 'Individual' ? 'IFR' : 'CFR'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                        {getStatusIcon(claim.status)}
                        <span className="ml-1">{formatStatus(claim.status)}</span>
                      </span>
                    </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(claim)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {/* Map Actions */}
                      {hasMapData(claim) ? (
                        <button
                          onClick={() => handleViewMap(claim)}
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                          title="View Map"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      ) : canEditClaim(claim) ? (
                        <button
                          onClick={() => handleAddMap(claim)}
                          className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                          title="Add Map"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      ) : null}

                      {/* Edit Actions - Only for editable claims */}
                      {canEditClaim(claim) && (
                        <>
                          <button
                            onClick={() => handleApprove(claim._id)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReject(claim._id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}

                      {/* Forward Action - Only for approved claims without map */}
                      {claim.status === 'MappedByGramSabha' && canEditClaim(claim) && (
                        <button
                          onClick={() => handleForwardToSubdivision(claim._id)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          title="Forward to Subdivision"
                        >
                          <Clock className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Claim Details Modal */}
      {showDetailsModal && selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Claim Details - {selectedClaim.frapattaid || selectedClaim.id}
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Claim ID
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedClaim.frapattaid || selectedClaim._id}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Claimant Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedClaim.claimant?.name || selectedClaim.applicantDetails?.claimantName || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Village
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedClaim.claimant?.village || selectedClaim.applicantDetails?.village || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Land Area
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedClaim.landDetails?.totalAreaClaimed ? `${selectedClaim.landDetails.totalAreaClaimed} hectares` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Claim Type
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedClaim.claimType === 'Individual' ? 'Individual Forest Rights (IFR)' : 'Community Forest Rights (CFR)'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(selectedClaim.status)}`}>
                      {formatStatus(selectedClaim.status)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Submitted Date
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedClaim.createdAt ? new Date(selectedClaim.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedClaim.claimant?.phone || selectedClaim.applicantDetails?.phone || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedClaim.claimant?.email || selectedClaim.applicantDetails?.email || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Aadhaar Number
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedClaim.claimant?.aadhaarNumber || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Address
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedClaim.claimant?.address || selectedClaim.applicantDetails?.address || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Coordinates
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedClaim.landCoordinates && selectedClaim.landCoordinates.length > 0 
                        ? `${selectedClaim.landCoordinates[0]?.lat}, ${selectedClaim.landCoordinates[0]?.lng}` 
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Family Details */}
              {selectedClaim.applicantDetails?.familyMembers && selectedClaim.applicantDetails.familyMembers.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Family Members</h4>
                  <div className="space-y-3">
                    {selectedClaim.applicantDetails.familyMembers.map((member, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Name
                            </label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-white">
                              {member.name || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Age
                            </label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-white">
                              {member.age || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Relation
                            </label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-white">
                              {member.relation || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Description</h4>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedClaim.landDetails?.landDescription || selectedClaim.description || 'No description provided'}
                  </p>
                </div>
              </div>

              {/* Eligibility Status */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Eligibility Status</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Scheduled Tribe
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedClaim.eligibilityStatus?.isST ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Other Traditional Forest Dweller
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedClaim.eligibilityStatus?.isOTFD ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Spouse is Scheduled Tribe
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedClaim.eligibilityStatus?.isSpouseST ? 'Yes' : 'No'}
                    </p>
                  </div>
                  {selectedClaim.eligibilityStatus?.otfdJustification && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        OTFD Justification
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {selectedClaim.eligibilityStatus.otfdJustification}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Land Details */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Land Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Extent for Habitation
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedClaim.landDetails?.extentHabitation ? `${selectedClaim.landDetails.extentHabitation} hectares` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Extent for Self-cultivation
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedClaim.landDetails?.extentSelfCultivation ? `${selectedClaim.landDetails.extentSelfCultivation} hectares` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Compartment Number
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedClaim.landDetails?.compartmentNumber || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Total Area Claimed
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedClaim.landDetails?.totalAreaClaimed ? `${selectedClaim.landDetails.totalAreaClaimed} hectares` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Claim Basis */}
              {selectedClaim.claimBasis && (
                <div className="border-t pt-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Claim Basis</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Has Disputes
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {selectedClaim.claimBasis.hasDisputes ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Has Old Titles
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {selectedClaim.claimBasis.hasOldTitles ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Was Displaced
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {selectedClaim.claimBasis.wasDisplaced ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Is Forest Village
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {selectedClaim.claimBasis.isForestVillage ? 'Yes' : 'No'}
                      </p>
                    </div>
                    {selectedClaim.claimBasis.disputeDescription && (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Dispute Description
                        </label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {selectedClaim.claimBasis.disputeDescription}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Rights Requested */}
              {selectedClaim.rightsRequested && selectedClaim.rightsRequested.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Rights Requested</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedClaim.rightsRequested.map((right, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      >
                        {right.type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Evidence Submitted */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Evidence Submitted</h4>
                <div className="space-y-4">
                  {selectedClaim.evidence?.governmentDocuments && selectedClaim.evidence.governmentDocuments.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Government Documents
                      </label>
                      <div className="space-y-2">
                        {selectedClaim.evidence.governmentDocuments.map((doc, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {doc.docType}
                              </span>
                              {doc.fileUrl && (
                                <a
                                  href={doc.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                                >
                                  View Document
                                </a>
                              )}
                            </div>
                            {doc.details && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {doc.details}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedClaim.evidence?.elderTestimonies && selectedClaim.evidence.elderTestimonies.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Elder Testimonies
                      </label>
                      <div className="space-y-2">
                        {selectedClaim.evidence.elderTestimonies.map((testimony, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {testimony.elderName}
                              </span>
                              {testimony.fileUrl && (
                                <a
                                  href={testimony.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                                >
                                  View Testimony
                                </a>
                              )}
                            </div>
                            {testimony.testimonyDetails && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {testimony.testimonyDetails}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedClaim.evidence?.physicalProof && selectedClaim.evidence.physicalProof.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Physical Proof
                      </label>
                      <div className="space-y-2">
                        {selectedClaim.evidence.physicalProof.map((proof, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <p className="text-sm text-gray-900 dark:text-white">
                              {proof.description}
                            </p>
                            {proof.fileUrls && proof.fileUrls.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {proof.fileUrls.map((url, urlIndex) => (
                                  <a
                                    key={urlIndex}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs"
                                  >
                                    View File {urlIndex + 1}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!selectedClaim.evidence?.governmentDocuments?.length && 
                    !selectedClaim.evidence?.elderTestimonies?.length && 
                    !selectedClaim.evidence?.physicalProof?.length) && (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">No documents attached</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
                
                {/* Map Actions */}
                {hasMapData(selectedClaim) ? (
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleViewMap(selectedClaim);
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    View Map
                  </button>
                ) : canEditClaim(selectedClaim) ? (
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleAddMap(selectedClaim);
                    }}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Add Map
                  </button>
                ) : null}

                {/* Edit Actions - Only for editable claims */}
                {canEditClaim(selectedClaim) && (
                  <>
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        handleApprove(selectedClaim._id);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        handleReject(selectedClaim._id);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}

                {/* Forward Action - Only for approved claims with map */}
                {selectedClaim.status === 'MappedByGramSabha' && canEditClaim(selectedClaim) && (
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleForwardToSubdivision(selectedClaim._id);
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Forward to Subdivision
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ClaimsTable;
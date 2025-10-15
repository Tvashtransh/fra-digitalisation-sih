import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  FileText, 
  Calendar, 
  MapPin,
  Phone,
  Mail,
  Home,
  TreePine,
  Users
} from 'lucide-react';

const ClaimDetailsModal = ({ isOpen, onClose, claim }) => {
  if (!isOpen || !claim) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#044e2b] text-[#d4c5a9] px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Claim Details - {claim.frapattaid}</h2>
              <p className="text-sm opacity-90">Complete claim information</p>
            </div>
            <button
              onClick={onClose}
              className="text-[#d4c5a9] hover:text-white p-2 rounded-full hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column */}
              <div className="space-y-6">
                
                {/* Basic Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Claim ID:</span>
                      <p className="font-medium">{claim.frapattaid || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Claim Type:</span>
                      <p className="font-medium">{claim.claimType || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <p className="font-medium">
                        <span className={`px-2 py-1 rounded text-xs ${
                          claim.status === 'Submitted' ? 'bg-yellow-100 text-yellow-800' :
                          claim.status === 'ForwardedToSubdivision' ? 'bg-blue-100 text-blue-800' :
                          claim.status === 'forwarded_to_district' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {claim.status}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Submitted On:</span>
                      <p className="font-medium">{formatDate(claim.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Applicant Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Applicant Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <p className="font-medium">{claim.applicantDetails?.claimantName || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Father/Mother Name:</span>
                        <p className="font-medium">{claim.applicantDetails?.fatherOrMotherName || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-gray-600">Spouse Name:</span>
                        <p className="font-medium">{claim.applicantDetails?.spouseName || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Village:</span>
                        <p className="font-medium">{claim.applicantDetails?.village || 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Address:</span>
                      <p className="font-medium">{claim.applicantDetails?.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Family Members */}
                {claim.applicantDetails?.familyMembers && claim.applicantDetails.familyMembers.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Family Members ({claim.applicantDetails.familyMembers.length})
                    </h3>
                    <div className="space-y-2 text-sm">
                      {claim.applicantDetails.familyMembers.map((member, index) => (
                        <div key={index} className="flex justify-between items-center bg-white p-2 rounded">
                          <span className="font-medium">{member.name}</span>
                          <div className="text-gray-600">
                            <span>{member.relation}</span>
                            {member.age && <span className="ml-2">({member.age} years)</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Eligibility Status */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Eligibility Status
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Scheduled Tribe:</span>
                      <p className="font-medium">
                        <span className={`px-2 py-1 rounded text-xs ${
                          claim.eligibilityStatus?.isST ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {claim.eligibilityStatus?.isST ? 'Yes' : 'No'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">OTFD:</span>
                      <p className="font-medium">
                        <span className={`px-2 py-1 rounded text-xs ${
                          claim.eligibilityStatus?.isOTFD ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {claim.eligibilityStatus?.isOTFD ? 'Yes' : 'No'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Spouse ST:</span>
                      <p className="font-medium">
                        <span className={`px-2 py-1 rounded text-xs ${
                          claim.eligibilityStatus?.isSpouseST ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {claim.eligibilityStatus?.isSpouseST ? 'Yes' : 'No'}
                        </span>
                      </p>
                    </div>
                  </div>
                  {claim.eligibilityStatus?.otfdJustification && (
                    <div className="mt-3">
                      <span className="text-gray-600">OTFD Justification:</span>
                      <p className="font-medium mt-1">{claim.eligibilityStatus.otfdJustification}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                
                {/* Location Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Location Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Gram Panchayat:</span>
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
                    <div>
                      <span className="text-gray-600">GP Code:</span>
                      <p className="font-medium">{claim.gpCode || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Land Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <TreePine className="h-4 w-4 mr-2" />
                    Land Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Forest Land Area:</span>
                      <p className="font-medium">{claim.forestLandArea || 'N/A'} hectares</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Area Claimed:</span>
                      <p className="font-medium">{claim.landDetails?.totalAreaClaimed || 'N/A'} hectares</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Habitation:</span>
                      <p className="font-medium">{claim.landDetails?.extentHabitation || 'N/A'} hectares</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Self Cultivation:</span>
                      <p className="font-medium">{claim.landDetails?.extentSelfCultivation || 'N/A'} hectares</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">Compartment Number:</span>
                      <p className="font-medium">{claim.landDetails?.compartmentNumber || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Map Information */}
                {claim.mapData && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Map Information
                    </h3>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Map Status:</span>
                        <span className="font-medium text-green-600">✅ Available</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Mapped Area:</span>
                        <span className="font-medium">
                          {claim.mapData.totalArea ? `${(claim.mapData.totalArea / 4046.86).toFixed(2)} acres` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mapped On:</span>
                        <span className="font-medium">{formatDate(claim.mapData.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="font-medium">{formatDate(claim.mapData.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rights Requested */}
                {claim.rightsRequested && claim.rightsRequested.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Rights Requested
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {claim.rightsRequested.map((right, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          {right}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Documents ({claim.documents?.length || 0})
                  </h3>
                  {claim.documents && claim.documents.length > 0 ? (
                    <div className="space-y-2 text-sm">
                      {claim.documents.map((doc, index) => (
                        <div key={index} className="flex justify-between items-center bg-white p-2 rounded">
                          <span className="font-medium">{doc.docType || `Document ${index + 1}`}</span>
                          <span className="text-gray-600">{formatDate(doc.uploadedAt)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm">No documents uploaded</p>
                  )}
                </div>

                {/* Subdivision Review */}
                {claim.subdivisionReview && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Subdivision Review
                    </h3>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Officer:</span>
                        <span className="font-medium">{claim.subdivisionReview.officer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Action:</span>
                        <span className={`font-medium px-2 py-1 rounded text-xs ${
                          claim.subdivisionReview.action === 'approved' ? 'bg-green-100 text-green-800' :
                          claim.subdivisionReview.action === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {claim.subdivisionReview.action}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{formatDate(claim.subdivisionReview.timestamp)}</span>
                      </div>
                      {claim.subdivisionReview.notes && (
                        <div className="mt-2">
                          <span className="text-gray-600">Notes:</span>
                          <p className="font-medium mt-1 bg-white p-2 rounded">{claim.subdivisionReview.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Remarks */}
                {claim.remarks && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Remarks
                    </h3>
                    <p className="text-sm">{claim.remarks}</p>
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

export default ClaimDetailsModal;

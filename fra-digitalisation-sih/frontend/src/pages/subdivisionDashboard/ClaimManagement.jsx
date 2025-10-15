import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Grid3X3,
  List,
  MapPin,
  Search,
  Square,
  Trash2,
  X,
  XCircle,
  Map,
  ArrowRight,
  CheckSquare,
  Ban,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RemarksModal from '../../components/gramSabhaDashboard/components/RemarksModal';
import NotificationToast from '../../components/gramSabhaDashboard/components/NotificationToast';

const SubdivisionClaimManagement = () => {
  const navigate = useNavigate();
  
  // State management
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedClaims, setSelectedClaims] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(18);
  const [sortBy, setSortBy] = useState('submittedDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('cards');

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  
  // Notification state
  const [notification, setNotification] = useState({
    isVisible: false,
    type: 'success',
    title: '',
    message: ''
  });

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [officerData, setOfficerData] = useState(null);

  // Helper function to show notifications
  const showNotification = (type, title, message) => {
    setNotification({
      isVisible: true,
      type,
      title,
      message
    });
  };

  // Fetch officer profile data
  useEffect(() => {
    const fetchOfficerData = async () => {
      try {
        const response = await fetch('/api/subdivision/profile', {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.success) {
          setOfficerData(data.officer);
        }
      } catch (error) {
        console.error('Error fetching officer data:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchOfficerData();
  }, []);

  // Fetch claims data
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await fetch('/api/subdivision/claims', {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.success) {
          setClaims(data.claims);
        }
      } catch (error) {
        console.error('Error fetching claims:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClaims();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...claims];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(claim =>
        claim.frapattaid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.applicantDetails?.claimantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.gramPanchayat?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(claim => claim.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(claim => claim.claimType === typeFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(claim => new Date(claim.createdAt) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(claim => new Date(claim.createdAt) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(claim => new Date(claim.createdAt) >= filterDate);
          break;
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'submittedDate':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'claimantName':
          aValue = a.applicantDetails?.claimantName || '';
          bValue = b.applicantDetails?.claimantName || '';
          break;
        case 'frapattaid':
          aValue = a.frapattaid || '';
          bValue = b.frapattaid || '';
          break;
        default:
          aValue = a[sortBy] || '';
          bValue = b[sortBy] || '';
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredClaims(filtered);
  }, [claims, searchTerm, statusFilter, typeFilter, dateFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClaims = filteredClaims.slice(startIndex, endIndex);

  // Status configuration
  const getStatusConfig = (status) => {
    const statusMap = {
      'forwarded_to_subdivision': {
        label: 'Under Review',
        color: 'bg-orange-100 text-orange-800',
        icon: Clock
      },
      'approved_by_subdivision': {
        label: 'Approved',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle
      },
      'rejected_by_subdivision': {
        label: 'Rejected',
        color: 'bg-red-100 text-red-800',
        icon: XCircle
      },
      'forwarded_to_district': {
        label: 'Forwarded to District',
        color: 'bg-blue-100 text-blue-800',
        icon: ArrowRight
      }
    };
    return statusMap[status] || {
      label: status,
      color: 'bg-gray-100 text-gray-800',
      icon: Clock
    };
  };

  // Handle claim actions
  const handleViewDetails = (claim) => {
    setSelectedClaim(claim);
    setShowDetailModal(true);
  };

  const handleApproveClaim = (claim) => {
    setSelectedClaim(claim);
    setPendingAction('approve');
    setShowRemarksModal(true);
  };

  const handleRejectClaim = (claim) => {
    setSelectedClaim(claim);
    setPendingAction('reject');
    setShowRemarksModal(true);
  };

  const handleForwardToDistrict = (claim) => {
    setSelectedClaim(claim);
    setPendingAction('forward');
    setShowRemarksModal(true);
  };

  const handleRemarksSubmit = async (remarks) => {
    try {
      let endpoint = '';
      let successMessage = '';
      
      switch (pendingAction) {
        case 'approve':
          endpoint = `/api/subdivision/claims/${selectedClaim.id}/approve`;
          successMessage = 'Claim approved successfully';
          break;
        case 'reject':
          endpoint = `/api/subdivision/claims/${selectedClaim.id}/reject`;
          successMessage = 'Claim rejected successfully';
          break;
        case 'forward':
          endpoint = `/api/subdivision/claims/${selectedClaim.id}/forward`;
          successMessage = 'Claim forwarded to District Officer successfully';
          break;
        default:
          throw new Error('Invalid action');
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ remarks })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        // Update claim status in local state
        setClaims(prev => prev.map(c =>
          c.id === selectedClaim.id
            ? { ...c, status: data.claim.status }
            : c
        ));
        
        showNotification('success', 'Action Completed', successMessage);
      } else {
        throw new Error(data.message || 'Action failed');
      }
    } catch (error) {
      console.error('Error performing action:', error);
      showNotification('error', 'Action Failed', error.message);
      throw error;
    }
  };

  if (isLoading || isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#044e2b]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/subdivision-dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#044e2b] rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Claim Management</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {officerData?.name || 'Subdivision Officer'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search claims..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="forwarded_to_subdivision">Under Review</option>
              <option value="approved_by_subdivision">Approved</option>
              <option value="rejected_by_subdivision">Rejected</option>
              <option value="forwarded_to_district">Forwarded to District</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="Individual">Individual</option>
              <option value="Community">Community</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            Showing {currentClaims.length} of {filteredClaims.length} claims
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg ${viewMode === 'cards' ? 'bg-[#044e2b] text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-[#044e2b] text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Claims Grid/Table */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentClaims.map((claim, index) => {
              const statusConfig = getStatusConfig(claim.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <motion.div
                  key={claim.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {claim.frapattaid || 'N/A'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {claim.applicantDetails?.claimantName || 'Unknown Claimant'}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                        <div className="flex items-center space-x-1">
                          <StatusIcon className="h-3 w-3" />
                          <span>{statusConfig.label}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{claim.gramPanchayat || 'N/A'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date(claim.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(claim)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {claim.status === 'forwarded_to_subdivision' && (
                          <>
                            <button
                              onClick={() => handleApproveClaim(claim)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRejectClaim(claim)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        
                        {claim.status === 'approved_by_subdivision' && (
                          <button
                            onClick={() => handleForwardToDistrict(claim)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Forward to District"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      FRA ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Claimant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentClaims.map((claim) => {
                    const statusConfig = getStatusConfig(claim.status);
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                      <tr key={claim.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {claim.frapattaid || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {claim.applicantDetails?.claimantName || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {claim.gramPanchayat || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(claim.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewDetails(claim)}
                              className="text-gray-600 hover:text-gray-900"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            
                            {claim.status === 'forwarded_to_subdivision' && (
                              <>
                                <button
                                  onClick={() => handleApproveClaim(claim)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Approve"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleRejectClaim(claim)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Reject"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            
                            {claim.status === 'approved_by_subdivision' && (
                              <button
                                onClick={() => handleForwardToDistrict(claim)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Forward to District"
                              >
                                <ArrowRight className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Remarks Modal */}
      <RemarksModal
        isOpen={showRemarksModal}
        onClose={() => {
          setShowRemarksModal(false);
          setSelectedClaim(null);
          setPendingAction(null);
        }}
        onSubmit={handleRemarksSubmit}
        title={
          pendingAction === 'approve' ? 'Approve Claim' :
          pendingAction === 'reject' ? 'Reject Claim' :
          'Forward to District Officer'
        }
        placeholder={
          pendingAction === 'approve' ? 'Enter approval remarks...' :
          pendingAction === 'reject' ? 'Enter rejection reason...' :
          'Enter remarks for forwarding to District Officer...'
        }
        maxLength={1000}
      />

      {/* Notification Toast */}
      <NotificationToast
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </div>
  );
};

export default SubdivisionClaimManagement;

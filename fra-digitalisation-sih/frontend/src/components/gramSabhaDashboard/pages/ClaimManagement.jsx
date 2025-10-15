import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle, Calendar,
  CheckCircle,
  CheckSquare,
  ChevronLeft, ChevronRight,
  Clock,
  Download,
  Edit,
  Eye,
  FileText,
  Grid3X3,
  List,
  Mail,
  MapPin,
  Phone,
  Plus, Search,
  Square,
  Trash2,
  X,
  XCircle,
  Map
} from 'lucide-react';
import { useEffect, useState } from 'react';
import ClaimMapDrawer from '../components/ClaimMapDrawer';
import RemarksModal from '../components/RemarksModal';
import NotificationToast from '../components/NotificationToast';

const ClaimManagement = () => {
  // State management
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedClaims, setSelectedClaims] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(18); // Increased for smaller card view
  const [sortBy, setSortBy] = useState('submittedDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMapDrawer, setShowMapDrawer] = useState(false);
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

  // Helper function to show notifications
  const showNotification = (type, title, message) => {
    setNotification({
      isVisible: true,
      type,
      title,
      message
    });
  };

  // Form states
  const [claimForm, setClaimForm] = useState({
    claimantName: '',
    village: '',
    landArea: '',
    claimType: 'Individual Forest Rights',
    status: 'pending',
    description: '',
    documents: [],
    phone: '',
    email: ''
  });

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    today: 0
  });

  // Officer jurisdiction data
  const [officerData, setOfficerData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Fetch officer profile
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

  // Fetch claims from API
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await fetch('/api/gs/claims', {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (response.ok && data.success) {
          // Transform API data to match component format
          const transformedClaims = data.claims.map(claim => ({
            id: claim._id,
            claimantName: claim.applicantDetails?.claimantName || claim.claimant?.name || 'Unknown',
            village: claim.applicantDetails?.village || claim.claimant?.village || 'Unknown',
            landArea: claim.landDetails?.totalAreaClaimed?.toString() || claim.forestLandArea?.toString() || '0',
            claimType: claim.claimType === 'Individual' ? 'Individual Forest Rights' : 'Community Forest Rights',
            status: claim.status?.toLowerCase().replace(/([A-Z])/g, '_$1').replace(/^_/, '') || 'pending',
            submittedDate: new Date(claim.createdAt).toISOString().split('T')[0],
            description: claim.landDetails?.landDescription || 'No description provided',
            documents: [], // Will be populated from evidence if available
            phone: claim.claimant?.contactNumber || 'N/A',
            email: claim.claimant?.email || 'N/A',
            aadhaarNumber: claim.claimant?.aadhaarNumber || 'N/A',
            address: claim.applicantDetails?.address || claim.claimant?.address || 'N/A',
            coordinates: claim.landCoordinates?.length > 0 ? 
              `${claim.landCoordinates[0].lat}° N, ${claim.landCoordinates[0].lng}° E` : 'N/A',
            createdAt: claim.createdAt,
            updatedAt: claim.updatedAt || claim.createdAt
          }));
          
          setClaims(transformedClaims);
          setFilteredClaims(transformedClaims);
          updateStats(transformedClaims);
        } else {
          console.error('Failed to fetch claims:', data.message);
        }
      } catch (error) {
        console.error('Error fetching claims:', error);
      }
    };

    fetchClaims();
  }, []);

  // Update statistics
  const updateStats = (claimsData) => {
    const today = new Date().toISOString().split('T')[0];
    setStats({
      total: claimsData.length,
      pending: claimsData.filter(c => c.status === 'pending').length,
      approved: claimsData.filter(c => c.status === 'approved').length,
      rejected: claimsData.filter(c => c.status === 'rejected').length,
      today: claimsData.filter(c => c.submittedDate === today).length
    });
  };

  // Filter and search functionality
  useEffect(() => {
    let filtered = claims.filter(claim => {
      const matchesSearch = claim.claimantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           claim.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           claim.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
      const matchesType = typeFilter === 'all' || claim.claimType === typeFilter;
      const matchesDate = dateFilter === 'all' || checkDateFilter(claim.submittedDate, dateFilter);

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });

    // Sort claims
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'submittedDate' || sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortBy === 'landArea') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else {
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredClaims(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [claims, searchTerm, statusFilter, typeFilter, dateFilter, sortBy, sortOrder]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClaims = filteredClaims.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);

  // Date filter helper
  const checkDateFilter = (dateString, filter) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);

    switch (filter) {
      case 'today':
        return date.toDateString() === today.toDateString();
      case 'yesterday':
        return date.toDateString() === yesterday.toDateString();
      case 'lastWeek':
        return date >= lastWeek;
      case 'lastMonth':
        return date >= lastMonth;
      default:
        return true;
    }
  };

  // CRUD operations
  const handleCreate = () => {
    if (validateForm()) {
      const newClaim = {
        ...claimForm,
        id: `CLM${String(claims.length + 1).padStart(3, '0')}`,
        submittedDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setClaims(prev => [...prev, newClaim]);
      setShowCreateModal(false);
      setClaimForm({
        claimantName: '',
        village: '',
        landArea: '',
        claimType: 'Individual Forest Rights',
        status: 'pending',
        description: '',
        documents: [],
        phone: '',
        email: ''
      });
    }
  };

  const handleEdit = (claim) => {
    setSelectedClaim(claim);
    setClaimForm(claim);
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    if (!selectedClaim) return;
    
    if (validateForm()) {
      setClaims(prev => prev.map(c =>
        c.id === selectedClaim.id
          ? { ...claimForm, id: c.id, updatedAt: new Date().toISOString() }
          : c
      ));
      setShowEditModal(false);
      setSelectedClaim(null);
    }
  };

  const handleDelete = (claim) => {
    setSelectedClaim(claim);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!selectedClaim) return;
    
    setClaims(prev => prev.filter(c => c.id !== selectedClaim.id));
    setSelectedClaims(prev => prev.filter(id => id !== selectedClaim.id));
    setShowDeleteModal(false);
    setSelectedClaim(null);
  };

  const handleBulkDelete = () => {
    setClaims(prev => prev.filter(c => !selectedClaims.includes(c.id)));
    setSelectedClaims([]);
  };

  const handleViewDetails = (claim) => {
    setSelectedClaim(claim);
    setShowDetailModal(true);
  };

  const handleAddMap = (claim) => {
    setSelectedClaim(claim);
    setShowMapDrawer(true);
  };

  const handleViewMap = (claim) => {
    setSelectedClaim(claim);
    setShowMapDrawer(true);
  };

  const handleSaveMap = async (mapData) => {
    if (!selectedClaim) {
      console.error('No selected claim for saving map data');
      return;
    }
    
    try {
      const response = await fetch(`/api/gs/claims/${selectedClaim.id}/map`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ mapData })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Update claim status to indicate it has been mapped
        setClaims(prev => prev.map(claim => 
          claim.id === selectedClaim.id 
            ? { 
                ...claim, 
                status: 'mapped_by_gram_sabha', 
                hasMap: true,
                mapData: mapData
              }
            : claim
        ));
        
        showNotification(
          'success',
          'Map Data Saved',
          'The land area has been successfully mapped and saved.'
        );
      } else {
        throw new Error(data.message || 'Failed to save map data');
      }
    } catch (error) {
      console.error('Error saving map data:', error);
      alert('Error saving map data: ' + error.message);
      throw error;
    }
  };

  const handleForwardClaim = (claim) => {
    setSelectedClaim(claim);
    setPendingAction('forward');
    setShowRemarksModal(true);
  };

  const handleRemarksSubmit = async (remarks) => {
    if (!selectedClaim) return;
    
    if (pendingAction === 'forward') {
      try {
        const response = await fetch(`/api/gs/claims/${selectedClaim.id}/forward`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ remarks })
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setClaims(prev => prev.map(c =>
            c.id === selectedClaim.id
              ? { ...c, status: 'forwarded_to_subdivision' }
              : c
          ));
          showNotification(
            'success',
            'Claim Forwarded Successfully',
            'The claim has been forwarded to the Subdivision Officer for review.'
          );
        } else {
          throw new Error(data.message || 'Failed to forward claim');
        }
      } catch (error) {
        console.error('Error forwarding claim:', error);
        throw error; // Re-throw to let the modal handle the error
      }
    }
  };

  const handleExport = (format) => {
    const dataToExport = filteredClaims.map(claim => ({
      ID: claim.id,
      'Claimant Name': claim.claimantName,
      Village: claim.village,
      'Land Area': claim.landArea,
      'Claim Type': claim.claimType,
      Status: claim.status,
      'Submitted Date': claim.submittedDate,
      Description: claim.description
    }));

    if (format === 'csv') {
      const csv = [
        Object.keys(dataToExport[0]).join(','),
        ...dataToExport.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'claims_export.csv';
      a.click();
    }
  };

  // Form validation
  const validateForm = () => {
    return claimForm.claimantName && claimForm.village && claimForm.landArea && claimForm.description;
  };

  // Check if claim can be edited (not forwarded to subdivision or beyond)
  const canEditClaim = (claim) => {
    if (!claim) return false;
    const nonEditableStatuses = [
      'forwarded_to_subdivision',
      'under_subdivision_review',
      'approved_by_subdivision',
      'rejected_by_subdivision',
      'forwarded_to_district',
      'under_district_review',
      'approved_by_district',
      'rejected_by_district',
      'final_approved',
      'final_rejected'
    ];
    return !nonEditableStatuses.includes(claim.status);
  };

  // Check if claim has map data
  const hasMapData = (claim) => {
    return claim && (claim.mapData || claim.hasMap);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'under_review': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'under_review': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={sectionVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#044e2b]">Claim Management</h1>
          <p className="text-[#044e2b] opacity-80 mt-1">Manage and process forest rights claims</p>
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
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="bg-[#044e2b] text-[#d4c5a9] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#0a5a35] transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Claim
          </motion.button>
          {selectedClaims.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete ({selectedClaims.length})
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Statistics Cards */}
     <motion.div 
  variants={sectionVariants} 
  className="grid grid-cols-5 gap-3 w-full"
>
  {[
    { label: 'Total Claims', value: stats.total, color: 'text-blue-600', icon: FileText },
    { label: 'Pending', value: stats.pending, color: 'text-yellow-600', icon: Clock },
    { label: 'Approved', value: stats.approved, color: 'text-green-600', icon: CheckCircle },
    { label: 'Rejected', value: stats.rejected, color: 'text-red-600', icon: XCircle },
    { label: 'Today', value: stats.today, color: 'text-purple-600', icon: Calendar }
  ].map((stat, index) => (
    <motion.div
      key={stat.label}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-lg shadow p-3 border border-gray-200 text-center hover:shadow-md transition-shadow flex flex-col justify-center"
    >
      <stat.icon className={`h-6 w-6 ${stat.color} mx-auto mb-1`} />
      <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
      <div className="text-gray-600 text-sm mt-1">{stat.label}</div>
    </motion.div>
  ))}
</motion.div>



      {/* Filters and Search */}
      <motion.div variants={sectionVariants} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search claims..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent text-sm"
            >
              <option value="all">All Types</option>
              <option value="Individual Forest Rights">Individual</option>
              <option value="Community Forest Rights">Community</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent text-sm"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="lastWeek">Last Week</option>
              <option value="lastMonth">Last Month</option>
            </select>
          </div>

          {/* Export */}
          <div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExport('csv')}
              className="w-full bg-green-600 text-white px-3 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors text-sm"
            >
              <Download className="h-4 w-4" />
              Export
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* View Toggle and Actions */}
      <motion.div variants={sectionVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-[#044e2b]">Claims Overview</h2>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'cards'
                  ? 'bg-[#044e2b] text-[#d4c5a9]'
                  : 'text-gray-600 hover:text-[#044e2b]'
              }`}
            >
              <Grid3X3 className="h-4 w-4 inline mr-1" />
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-[#044e2b] text-[#d4c5a9]'
                  : 'text-gray-600 hover:text-[#044e2b]'
              }`}
            >
              <List className="h-4 w-4 inline mr-1" />
              Table
            </button>
          </div>
        </div>
      </motion.div>

      {/* Claims Display */}
      <AnimatePresence mode="wait">
        {viewMode === 'cards' ? (
          <motion.div
            key="cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3"
          >
            {currentClaims.map((claim, index) => (
              <motion.div
                key={claim.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                {/* Card Header */}
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={selectedClaims.includes(claim.id)}
                        onChange={() => {
                          if (selectedClaims.includes(claim.id)) {
                            setSelectedClaims(prev => prev.filter(id => id !== claim.id));
                          } else {
                            setSelectedClaims(prev => [...prev, claim.id]);
                          }
                        }}
                        className="rounded border-gray-300 text-[#044e2b] focus:ring-[#044e2b] w-3 h-3"
                      />
                      <span className="text-xs font-medium text-[#044e2b]">{claim.id}</span>
                    </div>
                    <div className={`px-1.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${
                      claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                      claim.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {getStatusIcon(claim.status)}
                      <span className="hidden sm:inline">{claim.status.replace('_', ' ').toUpperCase()}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-xs truncate">{claim.claimantName}</h3>
                  <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-2.5 w-2.5" />
                    <span className="truncate">{claim.village}</span>
                  </p>
                </div>

                {/* Card Content */}
                <div className="p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 text-xs">Area:</span>
                      <div className="font-medium text-gray-900 text-xs">{claim.landArea} acres</div>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs">Type:</span>
                      <div className="font-medium text-gray-900 text-xs truncate" title={claim.claimType}>
                        {claim.claimType}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs">
                    <span className="text-gray-500 text-xs">Submitted:</span>
                    <div className="font-medium text-gray-900 text-xs">{claim.submittedDate}</div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center justify-between text-xs text-gray-600 pt-1 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <Phone className="h-2.5 w-2.5" />
                      <span className="truncate max-w-[60px]" title={claim.phone}>
                        {claim.phone || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-2.5 w-2.5" />
                      <span className="truncate max-w-[60px]" title={claim.email}>
                        {claim.email || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-3 pb-3">
                  <div className="grid grid-cols-2 gap-1 mb-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewDetails(claim)}
                      className="bg-blue-50 text-blue-700 px-2 py-1.5 rounded text-xs font-medium hover:bg-blue-100 transition-colors flex items-center justify-center"
                      title="View Details"
                    >
                      <Eye className="h-3 w-3" />
                    </motion.button>
                    
                    {/* Map Actions */}
                    {hasMapData(claim) ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewMap(claim)}
                        className="bg-purple-50 text-purple-700 px-2 py-1.5 rounded text-xs font-medium hover:bg-purple-100 transition-colors flex items-center justify-center"
                        title="View Map"
                      >
                        <Map className="h-3 w-3" />
                      </motion.button>
                    ) : canEditClaim(claim) ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddMap(claim)}
                      className="bg-green-50 text-green-700 px-2 py-1.5 rounded text-xs font-medium hover:bg-green-100 transition-colors flex items-center justify-center"
                      title="Add Map"
                    >
                      <Map className="h-3 w-3" />
                    </motion.button>
                    ) : (
                      <div className="bg-gray-50 text-gray-400 px-2 py-1.5 rounded text-xs font-medium flex items-center justify-center">
                        <Map className="h-3 w-3" />
                      </div>
                    )}
                    
                    {claim.status === 'mapped_by_gram_sabha' && canEditClaim(claim) && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleForwardClaim(claim)}
                        className="bg-blue-50 text-blue-700 px-2 py-1.5 rounded text-xs font-medium hover:bg-blue-100 transition-colors flex items-center justify-center"
                        title="Forward to Subdivision"
                      >
                        <ChevronRight className="h-3 w-3" />
                      </motion.button>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {/* Edit Actions - Only for editable claims */}
                    {canEditClaim(claim) ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(claim)}
                      className="flex-1 bg-[#044e2b] text-[#d4c5a9] px-2 py-1.5 rounded text-xs font-medium hover:bg-[#0a5a35] transition-colors flex items-center justify-center"
                      title="Edit"
                    >
                      <Edit className="h-3 w-3" />
                    </motion.button>
                    ) : (
                      <div className="flex-1 bg-gray-100 text-gray-400 px-2 py-1.5 rounded text-xs font-medium flex items-center justify-center">
                        <Edit className="h-3 w-3" />
                      </div>
                    )}
                    
                    {canEditClaim(claim) ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(claim)}
                      className="bg-red-50 text-red-700 px-2 py-1.5 rounded text-xs font-medium hover:bg-red-100 transition-colors flex items-center justify-center"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </motion.button>
                    ) : (
                      <div className="bg-gray-50 text-gray-400 px-2 py-1.5 rounded text-xs font-medium flex items-center justify-center">
                        <Trash2 className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            variants={sectionVariants}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#044e2b] text-[#d4c5a9]">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">
                      <button
                        onClick={() => setSelectedClaims(selectedClaims.length === currentClaims.length ? [] : currentClaims.map(c => c.id))}
                        className="text-[#d4c5a9] hover:text-white"
                      >
                        {selectedClaims.length === currentClaims.length && currentClaims.length > 0 ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">Claim ID</th>
                    <th className="px-4 py-3 text-left font-semibold">Claimant</th>
                    <th className="px-4 py-3 text-left font-semibold">Village</th>
                    <th className="px-4 py-3 text-left font-semibold">Area</th>
                    <th className="px-4 py-3 text-left font-semibold">Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Submitted</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentClaims.map((claim, index) => (
                    <motion.tr
                      key={claim.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            if (selectedClaims.includes(claim.id)) {
                              setSelectedClaims(prev => prev.filter(id => id !== claim.id));
                            } else {
                              setSelectedClaims(prev => [...prev, claim.id]);
                            }
                          }}
                          className="text-gray-400 hover:text-[#044e2b]"
                        >
                          {selectedClaims.includes(claim.id) ? (
                            <CheckSquare className="h-4 w-4" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3 font-medium text-[#044e2b] text-sm">{claim.id}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{claim.claimantName}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {claim.phone || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{claim.village}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{claim.landArea} acres</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{claim.claimType}</td>
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                          claim.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {getStatusIcon(claim.status)}
                          {claim.status.replace('_', ' ')}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{claim.submittedDate}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleViewDetails(claim)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </motion.button>
                          
                          {/* Map Actions */}
                          {hasMapData(claim) ? (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleViewMap(claim)}
                              className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                              title="View Map"
                            >
                              <Map className="h-4 w-4" />
                            </motion.button>
                          ) : canEditClaim(claim) ? (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleAddMap(claim)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Add Map"
                          >
                            <Map className="h-4 w-4" />
                          </motion.button>
                          ) : null}
                          
                          {claim.status === 'mapped_by_gram_sabha' && canEditClaim(claim) && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleForwardClaim(claim)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Forward to Subdivision"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </motion.button>
                          )}
                          
                          {/* Edit Actions - Only for editable claims */}
                          {canEditClaim(claim) && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(claim)}
                            className="p-1 text-[#044e2b] hover:bg-[#044e2b]/10 rounded"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </motion.button>
                          )}
                          
                          {canEditClaim(claim) && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(claim)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredClaims.length === 0 && (
        <motion.div
          variants={sectionVariants}
          className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200"
        >
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No claims found matching your criteria.</p>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div variants={sectionVariants} className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="text-sm text-gray-700">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredClaims.length)} of {filteredClaims.length} claims
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </motion.button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, Math.min(totalPages - 6, currentPage - 3)) + i;
                return (
                  <motion.button
                    key={pageNumber}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-2 border rounded-lg text-sm font-medium ${
                      currentPage === pageNumber
                        ? 'bg-[#044e2b] text-[#d4c5a9] border-[#044e2b]'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </motion.button>
                );
              })}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Create Claim Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-[#044e2b] text-[#d4c5a9] p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Plus className="h-6 w-6" />
                  Create New Claim
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCreateModal(false)}
                  className="text-[#d4c5a9] hover:text-white"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Claimant Name *</label>
                    <input
                      type="text"
                      value={claimForm.claimantName}
                      onChange={(e) => setClaimForm(prev => ({ ...prev, claimantName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                      placeholder="Enter claimant name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Village *</label>
                    <input
                      type="text"
                      value={claimForm.village}
                      onChange={(e) => setClaimForm(prev => ({ ...prev, village: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                      placeholder="Enter village name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Land Area (acres) *</label>
                    <input
                      type="number"
                      step="0.1"
                      value={claimForm.landArea}
                      onChange={(e) => setClaimForm(prev => ({ ...prev, landArea: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                      placeholder="Enter land area"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Claim Type</label>
                    <select
                      value={claimForm.claimType}
                      onChange={(e) => setClaimForm(prev => ({ ...prev, claimType: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                    >
                      <option value="Individual Forest Rights">Individual Forest Rights</option>
                      <option value="Community Forest Rights">Community Forest Rights</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={claimForm.phone}
                      onChange={(e) => setClaimForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={claimForm.email}
                      onChange={(e) => setClaimForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={claimForm.description}
                    onChange={(e) => setClaimForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                    placeholder="Enter claim description"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreate}
                    disabled={!validateForm()}
                    className="flex-1 bg-[#044e2b] text-[#d4c5a9] py-3 rounded-lg font-semibold hover:bg-[#0a5a35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Claim
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && selectedClaim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-[#044e2b] text-[#d4c5a9] p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Edit className="h-6 w-6" />
                  Edit Claim - {selectedClaim.id}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowEditModal(false)}
                  className="text-[#d4c5a9] hover:text-white"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Claimant Name *</label>
                    <input
                      type="text"
                      value={claimForm.claimantName}
                      onChange={(e) => setClaimForm(prev => ({ ...prev, claimantName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                      placeholder="Enter claimant name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Village *</label>
                    <input
                      type="text"
                      value={claimForm.village}
                      onChange={(e) => setClaimForm(prev => ({ ...prev, village: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                      placeholder="Enter village name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Land Area (acres) *</label>
                    <input
                      type="number"
                      step="0.1"
                      value={claimForm.landArea}
                      onChange={(e) => setClaimForm(prev => ({ ...prev, landArea: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                      placeholder="Enter land area"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={claimForm.status}
                      onChange={(e) => setClaimForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="under_review">Under Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={claimForm.phone}
                      onChange={(e) => setClaimForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={claimForm.email}
                      onChange={(e) => setClaimForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={claimForm.description}
                    onChange={(e) => setClaimForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                    placeholder="Enter claim description"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUpdate}
                    disabled={!validateForm()}
                    className="flex-1 bg-[#044e2b] text-[#d4c5a9] py-3 rounded-lg font-semibold hover:bg-[#0a5a35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Update Claim
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedClaim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-[#044e2b] text-[#d4c5a9] p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Eye className="h-6 w-6" />
                  Claim Details - {selectedClaim.id}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowDetailModal(false)}
                  className="text-[#d4c5a9] hover:text-white"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              <div className="p-6 space-y-8">
                {/* Section A: Applicant Details */}
                    <div>
                  <h3 className="text-lg font-semibold text-[#044e2b] mb-4 border-b border-gray-200 pb-2">Section A: Applicant Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Claim ID:</span>
                          <span className="font-medium">{selectedClaim.id}</span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-gray-600">Claimant Name:</span>
                        <span className="font-medium">{selectedClaim.applicantDetails?.claimantName || selectedClaim.claimantName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Spouse Name:</span>
                        <span className="font-medium">{selectedClaim.applicantDetails?.spouseName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Father/Mother Name:</span>
                        <span className="font-medium">{selectedClaim.applicantDetails?.fatherOrMotherName || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Village:</span>
                        <span className="font-medium">{selectedClaim.applicantDetails?.village || selectedClaim.village}</span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-gray-600">Tehsil:</span>
                        <span className="font-medium">{selectedClaim.tehsil || 'N/A'}</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                        <span className="text-gray-600">Gram Panchayat:</span>
                        <span className="font-medium">{selectedClaim.gramPanchayat || 'N/A'}</span>
                        </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">District:</span>
                        <span className="font-medium">{selectedClaim.district || 'Bhopal'}</span>
                          </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Aadhaar Number:</span>
                        <span className="font-medium">{selectedClaim.claimant?.aadhaarNumber || selectedClaim.aadhaarNumber || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedClaim.claimant?.phone || selectedClaim.phone || 'N/A'}</span>
                        </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedClaim.claimant?.email || selectedClaim.email || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address:</span>
                        <span className="font-medium text-sm">{selectedClaim.applicantDetails?.address || selectedClaim.address || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Family Members */}
                  {selectedClaim.applicantDetails?.familyMembers && selectedClaim.applicantDetails.familyMembers.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-md font-medium text-[#044e2b] mb-3">Family Members</h4>
                      <div className="space-y-2">
                        {selectedClaim.applicantDetails.familyMembers.map((member, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="font-medium">{member.name || 'N/A'}</span>
                            <span className="text-sm text-gray-600">{member.age || 'N/A'} years, {member.relation || 'N/A'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Section B: Eligibility Status */}
                    <div>
                  <h3 className="text-lg font-semibold text-[#044e2b] mb-4 border-b border-gray-200 pb-2">Section B: Eligibility Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                        <span className="text-gray-600">Scheduled Tribe (ST):</span>
                        <span className={`font-medium ${selectedClaim.eligibilityStatus?.isST ? 'text-green-600' : 'text-gray-500'}`}>
                          {selectedClaim.eligibilityStatus?.isST ? 'Yes' : 'No'}
                        </span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-gray-600">Other Traditional Forest Dweller (OTFD):</span>
                        <span className={`font-medium ${selectedClaim.eligibilityStatus?.isOTFD ? 'text-green-600' : 'text-gray-500'}`}>
                          {selectedClaim.eligibilityStatus?.isOTFD ? 'Yes' : 'No'}
                        </span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                        <span className="text-gray-600">Spouse is ST:</span>
                        <span className={`font-medium ${selectedClaim.eligibilityStatus?.isSpouseST ? 'text-green-600' : 'text-gray-500'}`}>
                          {selectedClaim.eligibilityStatus?.isSpouseST ? 'Yes' : 'No'}
                        </span>
                        </div>
                      {selectedClaim.eligibilityStatus?.otfdJustification && (
                        <div className="md:col-span-2">
                          <span className="text-gray-600 block mb-2">OTFD Justification:</span>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedClaim.eligibilityStatus.otfdJustification}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section C: Details of Forest Land Being Claimed */}
                <div>
                  <h3 className="text-lg font-semibold text-[#044e2b] mb-4 border-b border-gray-200 pb-2">Section C: Details of Forest Land Being Claimed</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                        <span className="text-gray-600">Extent for Habitation:</span>
                        <span className="font-medium">{selectedClaim.landDetails?.extentHabitation || '0'} hectares</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Extent for Self-cultivation:</span>
                        <span className="font-medium">{selectedClaim.landDetails?.extentSelfCultivation || '0'} hectares</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Area Claimed:</span>
                        <span className="font-medium text-[#044e2b]">{selectedClaim.landDetails?.totalAreaClaimed || selectedClaim.landArea} acres</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Compartment Number:</span>
                        <span className="font-medium">{selectedClaim.landDetails?.compartmentNumber || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Coordinates:</span>
                          <span className="font-medium text-xs">{selectedClaim.coordinates || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  
                  {/* Land Description */}
                  <div className="mt-4">
                    <h4 className="text-md font-medium text-[#044e2b] mb-3">Description of Land Boundaries</h4>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedClaim.landDetails?.landDescription || selectedClaim.description || 'No description provided'}</p>
                  </div>
                </div>

                {/* Section D: Nature and Basis of Claim */}
                <div>
                  <h3 className="text-lg font-semibold text-[#044e2b] mb-4 border-b border-gray-200 pb-2">Section D: Nature and Basis of Claim</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Land under dispute:</span>
                        <span className={`font-medium ${selectedClaim.claimBasis?.hasDisputes ? 'text-red-600' : 'text-green-600'}`}>
                          {selectedClaim.claimBasis?.hasDisputes ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Has old titles:</span>
                        <span className={`font-medium ${selectedClaim.claimBasis?.hasOldTitles ? 'text-green-600' : 'text-gray-500'}`}>
                          {selectedClaim.claimBasis?.hasOldTitles ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Was displaced:</span>
                        <span className={`font-medium ${selectedClaim.claimBasis?.wasDisplaced ? 'text-red-600' : 'text-green-600'}`}>
                          {selectedClaim.claimBasis?.wasDisplaced ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Forest village:</span>
                        <span className={`font-medium ${selectedClaim.claimBasis?.isForestVillage ? 'text-green-600' : 'text-gray-500'}`}>
                          {selectedClaim.claimBasis?.isForestVillage ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                </div>

                  {/* Additional descriptions */}
                  {(selectedClaim.claimBasis?.disputeDescription || selectedClaim.claimBasis?.oldTitlesDescription || selectedClaim.claimBasis?.displacementDescription || selectedClaim.claimBasis?.forestVillageDescription) && (
                    <div className="mt-4 space-y-3">
                      {selectedClaim.claimBasis?.disputeDescription && (
                <div>
                          <span className="text-gray-600 block mb-1">Dispute Description:</span>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedClaim.claimBasis.disputeDescription}</p>
                        </div>
                      )}
                      {selectedClaim.claimBasis?.oldTitlesDescription && (
                        <div>
                          <span className="text-gray-600 block mb-1">Old Titles Description:</span>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedClaim.claimBasis.oldTitlesDescription}</p>
                        </div>
                      )}
                      {selectedClaim.claimBasis?.displacementDescription && (
                        <div>
                          <span className="text-gray-600 block mb-1">Displacement Description:</span>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedClaim.claimBasis.displacementDescription}</p>
                        </div>
                      )}
                      {selectedClaim.claimBasis?.forestVillageDescription && (
                        <div>
                          <span className="text-gray-600 block mb-1">Forest Village Description:</span>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedClaim.claimBasis.forestVillageDescription}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Section E: Evidence in Support of Claim */}
                <div>
                  <h3 className="text-lg font-semibold text-[#044e2b] mb-4 border-b border-gray-200 pb-2">Section E: Evidence in Support of Claim</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Government Documents */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Government Documents</h4>
                      <p className="text-sm text-gray-600 mb-3">Voter ID, Ration Card, Aadhaar Card, etc.</p>
                      {selectedClaim.evidence?.governmentDocuments && selectedClaim.evidence.governmentDocuments.length > 0 ? (
                        <div className="space-y-2">
                          {selectedClaim.evidence.governmentDocuments.map((doc, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <FileText className="h-4 w-4 text-[#044e2b]" />
                              <div className="flex-1">
                                <span className="text-sm font-medium">{doc.docType || 'Government Document'}</span>
                                {doc.details && (
                                  <p className="text-xs text-gray-600 mt-1">{doc.details}</p>
                                )}
                              </div>
                              {doc.fileUrl && (
                                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-[#044e2b] hover:underline">
                            <Download className="h-4 w-4" />
                                </a>
                              )}
                        </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No government documents uploaded</p>
                      )}
                    </div>

                    {/* Elder Testimonies */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Testimonies from Elders</h4>
                      <p className="text-sm text-gray-600 mb-3">Statements from elderly community members</p>
                      {selectedClaim.evidence?.elderTestimonies && selectedClaim.evidence.elderTestimonies.length > 0 ? (
                        <div className="space-y-2">
                          {selectedClaim.evidence.elderTestimonies.map((testimony, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <FileText className="h-4 w-4 text-[#044e2b]" />
                              <div className="flex-1">
                                <span className="text-sm font-medium">{testimony.elderName || 'Elder Testimony'}</span>
                                {testimony.testimonyDetails && (
                                  <p className="text-xs text-gray-600 mt-1">{testimony.testimonyDetails}</p>
                                )}
                              </div>
                              {testimony.fileUrl && (
                                <a href={testimony.fileUrl} target="_blank" rel="noopener noreferrer" className="text-[#044e2b] hover:underline">
                                  <Download className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No elder testimonies uploaded</p>
                      )}
                    </div>

                    {/* Physical Proof */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Physical Proof on the Land</h4>
                      <p className="text-sm text-gray-600 mb-3">Photos of old houses, wells, bunds, fruit trees, graves, sacred sites</p>
                      {selectedClaim.evidence?.physicalProof && selectedClaim.evidence.physicalProof.length > 0 ? (
                        <div className="space-y-2">
                          {selectedClaim.evidence.physicalProof.map((proof, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <FileText className="h-4 w-4 text-[#044e2b]" />
                              <div className="flex-1">
                                <span className="text-sm font-medium">{proof.description || 'Physical Proof'}</span>
                                {proof.fileUrls && proof.fileUrls.length > 0 && (
                                  <p className="text-xs text-gray-600 mt-1">{proof.fileUrls.length} file(s) uploaded</p>
                                )}
                              </div>
                              {proof.fileUrls && proof.fileUrls.length > 0 && (
                                <a href={proof.fileUrls[0]} target="_blank" rel="noopener noreferrer" className="text-[#044e2b] hover:underline">
                                  <Download className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No physical proof uploaded</p>
                      )}
                    </div>

                    {/* Old Government Records */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Old Government Records</h4>
                      <p className="text-sm text-gray-600 mb-3">Old maps, census records, forest settlement reports</p>
                      {selectedClaim.evidence?.oldGovernmentRecords && selectedClaim.evidence.oldGovernmentRecords.length > 0 ? (
                        <div className="space-y-2">
                          {selectedClaim.evidence.oldGovernmentRecords.map((record, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <FileText className="h-4 w-4 text-[#044e2b]" />
                              <div className="flex-1">
                                <span className="text-sm font-medium">{record.recordDescription || 'Government Record'}</span>
                              </div>
                              {record.fileUrl && (
                                <a href={record.fileUrl} target="_blank" rel="noopener noreferrer" className="text-[#044e2b] hover:underline">
                                  <Download className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No old government records uploaded</p>
                      )}
                    </div>
                  </div>

                  {/* Thumb Impression/Signature */}
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Upload Thumb Impression or Signature</h4>
                    <p className="text-sm text-gray-600 mb-3">Digital signature or thumb impression for verification</p>
                    {selectedClaim.evidence?.thumbImpression || selectedClaim.thumbImpression ? (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <FileText className="h-4 w-4 text-[#044e2b]" />
                        <span className="text-sm">Thumb Impression/Signature uploaded</span>
                        <a href={selectedClaim.evidence?.thumbImpression || selectedClaim.thumbImpression} target="_blank" rel="noopener noreferrer" className="text-[#044e2b] hover:underline">
                          <Download className="h-4 w-4" />
                        </a>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No thumb impression or signature uploaded</p>
                    )}
                  </div>
                </div>

                {/* Claim Status and Actions */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-[#044e2b] mb-4">Claim Status & Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          selectedClaim.status === 'approved' ? 'bg-green-100 text-green-800' :
                          selectedClaim.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          selectedClaim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {getStatusIcon(selectedClaim.status)}
                          {selectedClaim.status.replace('_', ' ')}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Submitted:</span>
                        <span className="font-medium">{selectedClaim.submittedDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Claim Type:</span>
                        <span className="font-medium">{selectedClaim.claimType}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {selectedClaim.remarks && (
                        <div>
                          <span className="text-gray-600 block mb-1">Remarks:</span>
                          <p className="text-sm text-gray-700 bg-white p-2 rounded border">{selectedClaim.remarks}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  {/* Map Actions */}
                  {hasMapData(selectedClaim) ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setShowDetailModal(false);
                        handleViewMap(selectedClaim);
                      }}
                      className="px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                    >
                      View Map
                    </motion.button>
                  ) : canEditClaim(selectedClaim) ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setShowDetailModal(false);
                        handleAddMap(selectedClaim);
                      }}
                      className="px-4 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                    >
                      Add Map
                    </motion.button>
                  ) : null}

                  {/* Edit Actions - Only for editable claims */}
                  {canEditClaim(selectedClaim) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowDetailModal(false);
                      handleEdit(selectedClaim);
                    }}
                    className="flex-1 bg-[#044e2b] text-[#d4c5a9] py-3 rounded-lg font-semibold hover:bg-[#0a5a35] transition-colors"
                  >
                    Edit Claim
                  </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDetailModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedClaim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
            >
              <div className="bg-red-600 text-white p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Trash2 className="h-6 w-6" />
                  Delete Claim
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowDeleteModal(false)}
                  className="text-white hover:text-red-200"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              <div className="p-6">
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete claim <strong>{selectedClaim?.id || 'Unknown'}</strong> for <strong>{selectedClaim?.claimantName || 'Unknown Claimant'}</strong>?
                  This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={confirmDelete}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Delete Claim
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Drawer Modal */}
      <ClaimMapDrawer
        isOpen={showMapDrawer}
        onClose={() => setShowMapDrawer(false)}
        claimData={selectedClaim}
        onSaveMap={handleSaveMap}
        existingMapData={selectedClaim?.mapData}
        isViewMode={selectedClaim ? hasMapData(selectedClaim) : false}
      />

      {/* Remarks Modal */}
      <RemarksModal
        isOpen={showRemarksModal}
        onClose={() => {
          setShowRemarksModal(false);
          setSelectedClaim(null);
          setPendingAction(null);
        }}
        onSubmit={handleRemarksSubmit}
        title="Forward to Subdivision Officer"
        placeholder="Enter remarks for forwarding this claim to the Subdivision Officer..."
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
    </motion.div>
  );
};

export default ClaimManagement;

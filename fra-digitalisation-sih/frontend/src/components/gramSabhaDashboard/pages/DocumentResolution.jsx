import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    CheckCircle,
    CheckSquare,
    ChevronLeft, ChevronRight,
    Clock,
    Download, Eye,
    File,
    FileCheck,
    FileText,
    Filter,
    History,
    Image,
    Search,
    Square,
    Upload,
    X,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';

const DocumentResolution = () => {
  // State management
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Form states
  const [verificationForm, setVerificationForm] = useState({
    comments: '',
    verifiedBy: 'Officer Sharma',
    verificationDate: new Date().toISOString().split('T')[0]
  });

  const [rejectionForm, setRejectionForm] = useState({
    reason: '',
    comments: '',
    rejectedBy: 'Officer Sharma',
    rejectionDate: new Date().toISOString().split('T')[0]
  });

  const [uploadForm, setUploadForm] = useState({
    title: '',
    claimantName: '',
    type: 'Land Deed',
    file: null,
    description: ''
  });

  // Initialize with mock data
  useEffect(() => {
    const mockDocuments = [
      {
        id: 'DOC001',
        title: 'Land Deed - Rajesh Kumar',
        claimantName: 'Rajesh Kumar',
        type: 'Land Deed',
        status: 'verified',
        submittedDate: '2024-01-15',
        verifiedBy: 'Officer Sharma',
        verifiedDate: '2024-01-16',
        issues: [],
        fileSize: '2.3 MB',
        fileType: 'pdf',
        description: 'Original land deed document for forest rights claim',
        comments: 'Document verified successfully. All signatures and dates are valid.',
        history: [
          { action: 'submitted', date: '2024-01-15', by: 'Rajesh Kumar' },
          { action: 'verified', date: '2024-01-16', by: 'Officer Sharma' }
        ]
      },
      {
        id: 'DOC002',
        title: 'ID Proof - Priya Sharma',
        claimantName: 'Priya Sharma',
        type: 'Identity Document',
        status: 'pending_review',
        submittedDate: '2024-01-14',
        verifiedBy: null,
        issues: ['Document quality unclear', 'Signature verification needed'],
        fileSize: '1.8 MB',
        fileType: 'jpg',
        description: 'Aadhaar card copy for identity verification',
        comments: '',
        history: [
          { action: 'submitted', date: '2024-01-14', by: 'Priya Sharma' }
        ]
      },
      {
        id: 'DOC003',
        title: 'Community Certificate - Amit Singh',
        claimantName: 'Amit Singh',
        type: 'Community Certificate',
        status: 'rejected',
        submittedDate: '2024-01-13',
        rejectedBy: 'Officer Patel',
        rejectedDate: '2024-01-14',
        issues: ['Signature mismatch', 'Date inconsistency'],
        fileSize: '3.1 MB',
        fileType: 'pdf',
        description: 'Community forest rights certificate',
        comments: 'Rejected due to signature mismatch and date inconsistencies.',
        history: [
          { action: 'submitted', date: '2024-01-13', by: 'Amit Singh' },
          { action: 'rejected', date: '2024-01-14', by: 'Officer Patel' }
        ]
      },
      {
        id: 'DOC004',
        title: 'Survey Report - Village Council',
        claimantName: 'Village Council',
        type: 'Survey Report',
        status: 'under_review',
        submittedDate: '2024-01-12',
        verifiedBy: 'Officer Gupta',
        issues: [],
        fileSize: '5.2 MB',
        fileType: 'pdf',
        description: 'Detailed land survey report for forest area demarcation',
        comments: 'Under review for technical accuracy.',
        history: [
          { action: 'submitted', date: '2024-01-12', by: 'Village Council' },
          { action: 'under_review', date: '2024-01-13', by: 'Officer Gupta' }
        ]
      }
    ];

    setDocuments(mockDocuments);
    setFilteredDocuments(mockDocuments);
  }, []);

  // Filter documents
  useEffect(() => {
    let filtered = documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.claimantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
      const matchesType = typeFilter === 'all' || doc.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });

    setFilteredDocuments(filtered);
    setCurrentPage(1);
  }, [documents, searchTerm, statusFilter, typeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocuments = filteredDocuments.slice(startIndex, startIndex + itemsPerPage);

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-100';
      case 'pending_review': return 'text-yellow-600 bg-yellow-100';
      case 'under_review': return 'text-blue-600 bg-blue-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4" />;
      case 'pending_review': return <Clock className="h-4 w-4" />;
      case 'under_review': return <AlertTriangle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf': return <FileText className="h-5 w-5" />;
      case 'jpg':
      case 'png': return <Image className="h-5 w-5" />;
      default: return <File className="h-5 w-5" />;
    }
  };

  // Action handlers
  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setShowViewModal(true);
  };

  const handleVerifyDocument = (document) => {
    setSelectedDocument(document);
    setVerificationForm({
      comments: '',
      verifiedBy: 'Officer Sharma',
      verificationDate: new Date().toISOString().split('T')[0]
    });
    setShowVerifyModal(true);
  };

  const handleRejectDocument = (document) => {
    setSelectedDocument(document);
    setRejectionForm({
      reason: '',
      comments: '',
      rejectedBy: 'Officer Sharma',
      rejectionDate: new Date().toISOString().split('T')[0]
    });
    setShowRejectModal(true);
  };

  const handleBulkAction = (action) => {
    if (selectedDocuments.length === 0) return;

    switch (action) {
      case 'verify':
        setShowBulkModal(true);
        break;
      case 'reject':
        // Handle bulk reject
        break;
      case 'export':
        // Handle bulk export
        break;
    }
  };

  const submitVerification = () => {
    const updatedDocuments = documents.map(doc =>
      doc.id === selectedDocument.id
        ? {
            ...doc,
            status: 'verified',
            verifiedBy: verificationForm.verifiedBy,
            verifiedDate: verificationForm.verificationDate,
            comments: verificationForm.comments,
            issues: [],
            history: [
              ...doc.history,
              {
                action: 'verified',
                date: verificationForm.verificationDate,
                by: verificationForm.verifiedBy,
                comments: verificationForm.comments
              }
            ]
          }
        : doc
    );
    setDocuments(updatedDocuments);
    setShowVerifyModal(false);
  };

  const submitRejection = () => {
    const updatedDocuments = documents.map(doc =>
      doc.id === selectedDocument.id
        ? {
            ...doc,
            status: 'rejected',
            rejectedBy: rejectionForm.rejectedBy,
            rejectedDate: rejectionForm.rejectionDate,
            comments: rejectionForm.comments,
            issues: [rejectionForm.reason],
            history: [
              ...doc.history,
              {
                action: 'rejected',
                date: rejectionForm.rejectionDate,
                by: rejectionForm.rejectedBy,
                comments: rejectionForm.comments,
                reason: rejectionForm.reason
              }
            ]
          }
        : doc
    );
    setDocuments(updatedDocuments);
    setShowRejectModal(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  const submitUpload = () => {
    if (!uploadForm.file || !uploadForm.title || !uploadForm.claimantName) return;

    const newDocument = {
      id: `DOC${String(documents.length + 1).padStart(3, '0')}`,
      title: uploadForm.title,
      claimantName: uploadForm.claimantName,
      type: uploadForm.type,
      status: 'pending_review',
      submittedDate: new Date().toISOString().split('T')[0],
      verifiedBy: null,
      issues: [],
      fileSize: `${(uploadForm.file.size / (1024 * 1024)).toFixed(1)} MB`,
      fileType: uploadForm.file.name.split('.').pop().toLowerCase(),
      description: uploadForm.description,
      comments: '',
      history: [
        {
          action: 'submitted',
          date: new Date().toISOString().split('T')[0],
          by: uploadForm.claimantName
        }
      ]
    };

    setDocuments(prev => [...prev, newDocument]);
    setShowUploadModal(false);
    setUploadForm({
      title: '',
      claimantName: '',
      type: 'Land Deed',
      file: null,
      description: ''
    });
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Claimant', 'Type', 'Status', 'Submitted Date', 'File Size'];
    const csvContent = [
      headers.join(','),
      ...filteredDocuments.map(doc => [
        doc.id,
        `"${doc.title}"`,
        `"${doc.claimantName}"`,
        doc.type,
        doc.status,
        doc.submittedDate,
        doc.fileSize
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document_resolution_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
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
          <h1 className="text-3xl font-bold text-[#044e2b]">Document Resolution</h1>
          <p className="text-[#044e2b] opacity-80 mt-1">Verify and resolve document-related issues</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUploadModal(true)}
            className="bg-[#044e2b] text-[#d4c5a9] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#0a5a35] transition-colors"
          >
            <Upload className="h-5 w-5" />
            Upload Document
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportToCSV}
            className="bg-[#d4c5a9] text-[#044e2b] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#c4b599] transition-colors"
          >
            <Download className="h-5 w-5" />
            Export Report
          </motion.button>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div variants={sectionVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#044e2b]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#044e2b] opacity-80 text-sm font-medium">Total Documents</p>
              <p className="text-2xl font-bold text-[#044e2b]">{documents.length}</p>
            </div>
            <FileCheck className="h-8 w-8 text-[#044e2b]" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 opacity-80 text-sm font-medium">Verified</p>
              <p className="text-2xl font-bold text-green-600">
                {documents.filter(doc => doc.status === 'verified').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 opacity-80 text-sm font-medium">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">
                {documents.filter(doc => doc.status === 'pending_review').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 opacity-80 text-sm font-medium">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                {documents.filter(doc => doc.status === 'rejected').length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </motion.div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div variants={sectionVariants} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#044e2b]">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search documents by title, claimant, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#044e2b]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending_review">Pending Review</option>
              <option value="under_review">Under Review</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#044e2b]" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="Land Deed">Land Deed</option>
              <option value="Identity Document">Identity Document</option>
              <option value="Community Certificate">Community Certificate</option>
              <option value="Survey Report">Survey Report</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedDocuments.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{selectedDocuments.length} selected</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBulkAction('verify')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                Verify Selected
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBulkAction('reject')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-red-700 transition-colors"
              >
                <XCircle className="h-4 w-4" />
                Reject Selected
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Documents Table */}
      <motion.div variants={sectionVariants} className="bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-[#044e2b]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#044e2b] text-[#d4c5a9]">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">
                  <button
                    onClick={() => {
                      if (selectedDocuments.length === paginatedDocuments.length) {
                        setSelectedDocuments([]);
                      } else {
                        setSelectedDocuments(paginatedDocuments.map(doc => doc.id));
                      }
                    }}
                    className="text-[#d4c5a9] hover:text-white"
                  >
                    {selectedDocuments.length === paginatedDocuments.length && paginatedDocuments.length > 0 ? (
                      <CheckSquare className="h-5 w-5" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left font-semibold">Document ID</th>
                <th className="px-6 py-4 text-left font-semibold">Title</th>
                <th className="px-6 py-4 text-left font-semibold">Claimant</th>
                <th className="px-6 py-4 text-left font-semibold">Type</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Issues</th>
                <th className="px-6 py-4 text-left font-semibold">File Size</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedDocuments.map((doc, index) => (
                <motion.tr
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        if (selectedDocuments.includes(doc.id)) {
                          setSelectedDocuments(prev => prev.filter(id => id !== doc.id));
                        } else {
                          setSelectedDocuments(prev => [...prev, doc.id]);
                        }
                      }}
                      className="text-gray-400 hover:text-[#044e2b]"
                    >
                      {selectedDocuments.includes(doc.id) ? (
                        <CheckSquare className="h-5 w-5" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 font-medium text-[#044e2b]">{doc.id}</td>
                  <td className="px-6 py-4 text-gray-900 max-w-xs truncate" title={doc.title}>
                    <div className="flex items-center gap-2">
                      {getFileIcon(doc.fileType)}
                      {doc.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{doc.claimantName}</td>
                  <td className="px-6 py-4 text-gray-700">{doc.type}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(doc.status)}`}>
                      {getStatusIcon(doc.status)}
                      {doc.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {doc.issues.length > 0 ? (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-red-600 text-sm">{doc.issues.length} issue(s)</span>
                      </div>
                    ) : (
                      <span className="text-green-600 text-sm">No issues</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{doc.fileSize}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleViewDocument(doc)}
                        className="text-[#044e2b] hover:text-[#0a5a35] p-1"
                        title="View Document"
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleVerifyDocument(doc)}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Verify Document"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRejectDocument(doc)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Reject Document"
                      >
                        <XCircle className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No documents found matching your criteria.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDocuments.length)} of {filteredDocuments.length} documents
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.button>
              <span className="px-3 py-1 text-sm font-medium text-[#044e2b]">
                Page {currentPage} of {totalPages}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>

      {/* View Document Modal */}
      <AnimatePresence>
        {showViewModal && selectedDocument && (
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
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-[#044e2b]">Document Details</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Document ID</label>
                      <p className="text-[#044e2b] font-semibold">{selectedDocument.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <p className="text-gray-900">{selectedDocument.title}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Claimant</label>
                      <p className="text-gray-900">{selectedDocument.claimantName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <p className="text-gray-900">{selectedDocument.type}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedDocument.status)}`}>
                        {getStatusIcon(selectedDocument.status)}
                        {selectedDocument.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">File Size</label>
                      <p className="text-gray-900">{selectedDocument.fileSize}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Submitted Date</label>
                      <p className="text-gray-900">{selectedDocument.submittedDate}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <p className="text-gray-900">{selectedDocument.description}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                      <p className="text-gray-900">{selectedDocument.comments || 'No comments'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Issues</label>
                      {selectedDocument.issues.length > 0 ? (
                        <ul className="list-disc list-inside text-red-600">
                          {selectedDocument.issues.map((issue, index) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-green-600">No issues</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Document History</label>
                      <div className="space-y-2">
                        {selectedDocument.history.map((entry, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <History className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{entry.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                            <span className="text-gray-500">by {entry.by}</span>
                            <span className="text-gray-500">on {entry.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Preview */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Preview</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center">
                      {getFileIcon(selectedDocument.fileType)}
                      <p className="mt-2 text-gray-600">Preview not available for {selectedDocument.fileType.toUpperCase()} files</p>
                      <p className="text-sm text-gray-500">File size: {selectedDocument.fileSize}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verify Document Modal */}
      <AnimatePresence>
        {showVerifyModal && selectedDocument && (
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
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-[#044e2b]">Verify Document</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowVerifyModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document</label>
                  <p className="text-gray-900 font-medium">{selectedDocument.title}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Verified By</label>
                  <input
                    type="text"
                    value={verificationForm.verifiedBy}
                    onChange={(e) => setVerificationForm(prev => ({ ...prev, verifiedBy: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Verification Date</label>
                  <input
                    type="date"
                    value={verificationForm.verificationDate}
                    onChange={(e) => setVerificationForm(prev => ({ ...prev, verificationDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                  <textarea
                    value={verificationForm.comments}
                    onChange={(e) => setVerificationForm(prev => ({ ...prev, comments: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                    placeholder="Add verification comments..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowVerifyModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={submitVerification}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Verify Document
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Document Modal */}
      <AnimatePresence>
        {showRejectModal && selectedDocument && (
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
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-[#044e2b]">Reject Document</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowRejectModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document</label>
                  <p className="text-gray-900 font-medium">{selectedDocument.title}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason *</label>
                  <select
                    value={rejectionForm.reason}
                    onChange={(e) => setRejectionForm(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                  >
                    <option value="">Select a reason</option>
                    <option value="Document quality unclear">Document quality unclear</option>
                    <option value="Signature mismatch">Signature mismatch</option>
                    <option value="Date inconsistency">Date inconsistency</option>
                    <option value="Missing required information">Missing required information</option>
                    <option value="Invalid document type">Invalid document type</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rejected By</label>
                  <input
                    type="text"
                    value={rejectionForm.rejectedBy}
                    onChange={(e) => setRejectionForm(prev => ({ ...prev, rejectedBy: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Date</label>
                  <input
                    type="date"
                    value={rejectionForm.rejectionDate}
                    onChange={(e) => setRejectionForm(prev => ({ ...prev, rejectionDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                  <textarea
                    value={rejectionForm.comments}
                    onChange={(e) => setRejectionForm(prev => ({ ...prev, comments: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                    placeholder="Add rejection comments..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowRejectModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={submitRejection}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Reject Document
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Document Modal */}
      <AnimatePresence>
        {showUploadModal && (
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
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-[#044e2b]">Upload Document</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document Title *</label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                    placeholder="Enter document title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Claimant Name *</label>
                  <input
                    type="text"
                    value={uploadForm.claimantName}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, claimantName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                    placeholder="Enter claimant name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                  <select
                    value={uploadForm.type}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                  >
                    <option value="Land Deed">Land Deed</option>
                    <option value="Identity Document">Identity Document</option>
                    <option value="Community Certificate">Community Certificate</option>
                    <option value="Survey Report">Survey Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                    placeholder="Enter document description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select File *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">PDF, JPG, PNG, DOC, DOCX up to 10MB</p>
                    </label>
                    {uploadForm.file && (
                      <p className="text-sm text-green-600 mt-2">
                        Selected: {uploadForm.file.name} ({(uploadForm.file.size / (1024 * 1024)).toFixed(1)} MB)
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={submitUpload}
                    disabled={!uploadForm.file || !uploadForm.title || !uploadForm.claimantName}
                    className="flex-1 bg-[#044e2b] text-[#d4c5a9] py-2 px-4 rounded-lg font-semibold hover:bg-[#0a5a35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Upload Document
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DocumentResolution;
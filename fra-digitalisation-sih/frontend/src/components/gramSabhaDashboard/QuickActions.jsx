import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    Bell,
    ClipboardList,
    Download,
    FileText,
    Map,
    MessageSquare,
    Plus,
    Upload,
    Users
} from 'lucide-react';
import { useState } from 'react';

const QuickActions = ({ onPageChange }) => {
  const [showNewClaimModal, setShowNewClaimModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [newClaimData, setNewClaimData] = useState({
    claimantName: '',
    village: '',
    landArea: '',
    claimType: 'Individual Forest Rights',
    description: ''
  });

  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    recipients: 'all',
    priority: 'normal'
  });

  const actions = [
    {
      id: 'review-claims',
      title: 'Review Pending Claims',
      description: 'Review and process pending claims',
      icon: FileText,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => onPageChange('claims'),
      primary: true
    },
    {
      id: 'new-claim',
      title: 'New Forest Rights Claim',
      description: 'Submit a new claim application',
      icon: Plus,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => setShowNewClaimModal(true),
      primary: true
    },
    {
      id: 'village-map',
      title: 'Open Village Land Map',
      description: 'View detailed village land mapping',
      icon: Map,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => onPageChange('gis'),
      primary: true
    },
    {
      id: 'upload-gramsabha',
      title: 'Upload Gram Sabha Docs',
      description: 'Upload meeting documents',
      icon: Upload,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => setShowUploadModal(true),
      primary: false
    },
    {
      id: 'monthly-report',
      title: 'Generate Monthly Report',
      description: 'Create comprehensive monthly report',
      icon: ClipboardList,
      color: 'bg-teal-500 hover:bg-teal-600',
      action: () => setShowReportModal(true),
      primary: false
    },
    {
      id: 'send-notification',
      title: 'Send Notification',
      description: 'Broadcast to community members',
      icon: Bell,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      action: () => setShowNotificationModal(true),
      primary: false
    },
    {
      id: 'user-management',
      title: 'User Management',
      description: 'Manage community members',
      icon: Users,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      action: () => onPageChange('settings'),
      primary: false
    },
    {
      id: 'support',
      title: 'Help & Support',
      description: 'Get assistance and support',
      icon: MessageSquare,
      color: 'bg-gray-500 hover:bg-gray-600',
      action: () => window.open('mailto:support@gov.in?subject=Gram Sabha Support Request', '_blank'),
      primary: false
    }
  ];

  const handleNewClaimSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('New claim submitted:', newClaimData);
    setShowNewClaimModal(false);
    setNewClaimData({
      claimantName: '',
      village: '',
      landArea: '',
      claimType: 'Individual Forest Rights',
      description: ''
    });
    setIsProcessing(false);
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Notification sent:', notificationData);
    setShowNotificationModal(false);
    setNotificationData({
      title: '',
      message: '',
      recipients: 'all',
      priority: 'normal'
    });
    setIsProcessing(false);
  };

  const handleReportGeneration = async () => {
    setIsProcessing(true);

    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('Monthly report generated');
    setShowReportModal(false);
    setIsProcessing(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Frequently used operations
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <motion.button
                key={action.id}
                variants={itemVariants}
                onClick={action.action}
                className={`p-4 rounded-lg text-white transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${action.color} ${
                  action.primary ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col items-center space-y-3">
                  <Icon className="h-8 w-8" />
                  <div className="text-center">
                    <h3 className="font-semibold text-sm">{action.title}</h3>
                    <p className="text-xs opacity-90 mt-1 leading-tight">
                      {action.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* New Claim Modal */}
      <AnimatePresence>
        {showNewClaimModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  New Forest Rights Claim
                </h3>
                <button
                  onClick={() => setShowNewClaimModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleNewClaimSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Claimant Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClaimData.claimantName}
                    onChange={(e) => setNewClaimData({...newClaimData, claimantName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter claimant name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Village *
                  </label>
                  <select
                    required
                    value={newClaimData.village}
                    onChange={(e) => setNewClaimData({...newClaimData, village: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select village</option>
                    <option value="Bamboo Village">Bamboo Village</option>
                    <option value="Teak Forest">Teak Forest</option>
                    <option value="Sal Forest">Sal Forest</option>
                    <option value="Oak Grove">Oak Grove</option>
                    <option value="Pine Valley">Pine Valley</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Land Area (acres) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newClaimData.landArea}
                    onChange={(e) => setNewClaimData({...newClaimData, landArea: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter land area"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Claim Type *
                  </label>
                  <select
                    required
                    value={newClaimData.claimType}
                    onChange={(e) => setNewClaimData({...newClaimData, claimType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="Individual Forest Rights">Individual Forest Rights</option>
                    <option value="Community Forest Rights">Community Forest Rights</option>
                    <option value="Community Forest Resource Rights">Community Forest Resource Rights</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newClaimData.description}
                    onChange={(e) => setNewClaimData({...newClaimData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows="3"
                    placeholder="Describe the claim details..."
                  />
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowNewClaimModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Processing...
                      </>
                    ) : (
                      'Create Claim'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Upload Gram Sabha Documents
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Drag and drop files here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Supports PDF, DOC, DOCX (Max 10MB)
                  </p>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Browse Files
                  </button>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Upload Documents
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Modal */}
      <AnimatePresence>
        {showNotificationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Send Notification
                </h3>
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleNotificationSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notification Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={notificationData.title}
                    onChange={(e) => setNotificationData({...notificationData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter notification title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message *
                  </label>
                  <textarea
                    required
                    value={notificationData.message}
                    onChange={(e) => setNotificationData({...notificationData, message: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    rows="3"
                    placeholder="Enter notification message"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Recipients
                  </label>
                  <select
                    value={notificationData.recipients}
                    onChange={(e) => setNotificationData({...notificationData, recipients: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="all">All Community Members</option>
                    <option value="claimants">Active Claimants</option>
                    <option value="officers">Gram Sabha Officers</option>
                    <option value="villages">Specific Villages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={notificationData.priority}
                    onChange={(e) => setNotificationData({...notificationData, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowNotificationModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Sending...
                      </>
                    ) : (
                      'Send Notification'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Generate Monthly Report
                </h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Report Generation
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        This will generate a comprehensive monthly report including claims statistics, village performance, and compliance metrics.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReportGeneration}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Generate Report
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuickActions;
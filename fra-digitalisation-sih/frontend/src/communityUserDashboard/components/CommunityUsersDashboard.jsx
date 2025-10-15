import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AssetCharts from './AssetCharts';
import ClaimStatusCard from './ClaimStatusCard';
import ClaimSubmissionForm from './ClaimSubmissionForm';
import FeedbackForm from './FeedbackForm';
import MapViewer from './MapViewer';
import SchemeCard from './SchemeCard';

const CommunityUsersDashboard = () => {
  const [showClaimForm, setShowClaimForm] = useState(false);

  const handleClaimSuccess = (result) => {
    console.log('Claim submitted successfully:', result);
    // You can add additional success handling here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-6 sm:py-8 rounded-b-lg shadow-md mb-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Welcome to FRA Community Portal
          </h1>
          <p className="text-white/90 mb-4">
            Forest Rights Act, 2006 - Digital Platform for Communities
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Individual Forest Rights
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Community Forest Rights
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              Forest Conservation
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Column */}
        <div className="space-y-6 lg:space-y-8">
          <ClaimStatusCard currentStep={2} />
          <MapViewer />
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:space-y-8">
          <AssetCharts />
        </div>
      </div>

      {/* Schemes Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Eligible Schemes & Programs
        </h2>
        <SchemeCard />
      </motion.div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Feedback Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Share Your Feedback
          </h3>
          <FeedbackForm />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button 
              onClick={() => setShowClaimForm(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors font-medium"
            >
              File New Claim
            </button>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors font-medium">
              View My Claims
            </button>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors font-medium">
              Check Eligibility
            </button>
            <button className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors font-medium">
              Download Documents
            </button>
          </div>
        </motion.div>
      </div>

      {/* Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6"
      >
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Forest Rights Act, 2006
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            The Forest Rights Act recognizes and protects the rights of forest-dwelling communities
            over forest resources and their traditional rights to access and use forest produce.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-white dark:bg-gray-600 px-3 py-1 rounded-full">
              Individual Rights
            </span>
            <span className="bg-white dark:bg-gray-600 px-3 py-1 rounded-full">
              Community Rights
            </span>
            <span className="bg-white dark:bg-gray-600 px-3 py-1 rounded-full">
              Conservation Rights
            </span>
            <span className="bg-white dark:bg-gray-600 px-3 py-1 rounded-full">
              Development Rights
            </span>
          </div>
        </div>
      </motion.div>

      {/* Claim Submission Form Modal */}
      <ClaimSubmissionForm
        isOpen={showClaimForm}
        onClose={() => setShowClaimForm(false)}
        onSuccess={handleClaimSuccess}
      />
    </motion.div>
  );
};

export default CommunityUsersDashboard;
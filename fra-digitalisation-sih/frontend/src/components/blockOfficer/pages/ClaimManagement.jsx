import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import BlockOfficerClaimsTable from '../components/BlockOfficerClaimsTable';

const ClaimManagement = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/block-officer/statistics', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setStats(data.stats);
          }
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={sectionVariants} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Claim Management</h1>
            <p className="text-gray-600 mt-1">Review, approve, and manage forest rights claims at block level</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#044e2b]">
                {isLoading ? '...' : (stats?.reviewedAtBlock || 0)}
              </p>
              <p className="text-sm text-gray-600">Pending Reviews</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {isLoading ? '...' : (stats?.finalApproval || 0)}
              </p>
              <p className="text-sm text-gray-600">Approved This Year</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter Controls */}
      <motion.div variants={sectionVariants} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Filter Claims</h3>
            <p className="text-sm text-gray-600">Use filters to find specific claims</p>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Submitted">Submitted</option>
              <option value="MappedByGramSabha">Mapped by Gram Sabha</option>
              <option value="ForwardedToSubdivision">Forwarded to Subdivision</option>
              <option value="UnderSubdivisionReview">Under Subdivision Review</option>
              <option value="ApprovedBySubdivision">Approved by Subdivision</option>
              <option value="RejectedBySubdivision">Rejected by Subdivision</option>
              <option value="ForwardedToDistrict">Forwarded to District</option>
              <option value="UnderDistrictReview">Under District Review</option>
              <option value="FinalApproved">Final Approved</option>
              <option value="FinalRejected">Final Rejected</option>
            </select>

            <input
              type="text"
              placeholder="Search by applicant or claim ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
            />
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { key: 'all', label: 'All Claims', count: isLoading ? 0 : (stats?.submitted || 0) },
            { key: 'UnderSubdivisionReview', label: 'Under Review', count: isLoading ? 0 : (stats?.reviewedAtBlock || 0) },
            { key: 'FinalApproved', label: 'Approved', count: isLoading ? 0 : (stats?.finalApproval || 0) },
            { key: 'FinalRejected', label: 'Rejected', count: isLoading ? 0 : (stats?.rejected || 0) }
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => handleStatusFilter(filter.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === filter.key
                  ? 'bg-[#044e2b] text-[#d4c5a9]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </motion.div>

      {/* Claims Table */}
      <motion.div variants={sectionVariants}>
        <BlockOfficerClaimsTable statusFilter={statusFilter} searchTerm={searchTerm} />
      </motion.div>

      {/* Bulk Actions */}
      <motion.div variants={sectionVariants} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Bulk Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Reject Selected
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Forward to District
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Request More Info
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            Export Selected
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ClaimManagement;
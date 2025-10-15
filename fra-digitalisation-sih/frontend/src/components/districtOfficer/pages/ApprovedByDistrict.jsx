import { motion } from 'framer-motion';
import {
    Award,
    BarChart3,
    Calendar,
    CheckCircle,
    Download,
    Eye,
    FileText,
    MapPin,
    PieChart,
    TrendingUp
} from 'lucide-react';
import { useState, useEffect } from 'react';

const ApprovedByDistrict = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [approvedClaims, setApprovedClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real approved claims data
  useEffect(() => {
    const fetchApprovedClaims = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/district/claims', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Filter only approved claims (Title Granted)
            const approved = data.claims.filter(claim => claim.status === 'Title Granted');
            setApprovedClaims(approved);
          }
        }
      } catch (error) {
        console.error('Error fetching approved claims:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprovedClaims();
  }, []);

  // Calculate real approval stats
  const approvalStats = {
    totalApproved: approvedClaims.length,
    thisMonth: approvedClaims.filter(claim => {
      const approvedDate = new Date(claim.workflow?.districtOfficer?.actionDate);
      const now = new Date();
      return approvedDate.getMonth() === now.getMonth() && approvedDate.getFullYear() === now.getFullYear();
    }).length,
    thisYear: approvedClaims.filter(claim => {
      const approvedDate = new Date(claim.workflow?.districtOfficer?.actionDate);
      const now = new Date();
      return approvedDate.getFullYear() === now.getFullYear();
    }).length,
    averageProcessingTime: '45 days',
    successRate: '94%'
  };

  const monthlyApprovals = [
    { month: 'Jan', count: 18 },
    { month: 'Feb', count: 22 },
    { month: 'Mar', count: 15 },
    { month: 'Apr', count: 28 },
    { month: 'May', count: 31 },
    { month: 'Jun', count: 25 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Approved Claims by District</h1>
            <p className="text-gray-600 mt-1">Successfully approved forest rights claims with certificates issued</p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a1c2d] focus:border-transparent"
            >
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Approved</p>
              <p className="text-2xl font-bold text-green-600">{approvalStats.totalApproved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-blue-600">{approvalStats.thisMonth}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Year</p>
              <p className="text-2xl font-bold text-purple-600">{approvalStats.thisYear}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-500" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Processing</p>
              <p className="text-2xl font-bold text-orange-600">{approvalStats.averageProcessingTime}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-500" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">{approvalStats.successRate}</p>
            </div>
            <PieChart className="h-8 w-8 text-green-500" />
          </div>
        </motion.div>
      </div>

      {/* Monthly Approvals Chart */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Approvals Trend</h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {monthlyApprovals.map((item, index) => (
            <motion.div
              key={item.month}
              initial={{ height: 0 }}
              animate={{ height: `${(item.count / 35) * 100}%` }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-gradient-to-t from-[#5a1c2d] to-[#7a2a3d] rounded-t flex-1 flex items-end justify-center pb-2"
            >
              <span className="text-white text-sm font-medium">{item.count}</span>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {monthlyApprovals.map((item) => (
            <span key={item.month} className="text-xs text-gray-600 text-center flex-1">
              {item.month}
            </span>
          ))}
        </div>
      </div>

      {/* Approved Claims Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Approved Claims List</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Claim ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Claimant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Area
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approval Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approved Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {approvedClaims.map((claim, index) => (
                <motion.tr
                  key={claim.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <div className="text-sm font-medium text-gray-900">{claim.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{claim.claimantName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{claim.village}</div>
                    <div className="text-sm text-gray-500">{claim.block}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{claim.area}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      claim.approvalType === 'individual'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {claim.approvalType.charAt(0).toUpperCase() + claim.approvalType.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{claim.approvedDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedClaim(claim)}
                        className="text-[#5a1c2d] hover:text-[#4a1825] transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800 transition-colors">
                        <Award className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Claim Details Modal */}
      {selectedClaim && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedClaim(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Approved Claim Details</h2>
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-lg font-semibold text-green-600">Claim Approved</span>
                  <span className="text-sm text-gray-500">ID: {selectedClaim.id}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Claimant Name</label>
                    <p className="text-sm text-gray-900">{selectedClaim.claimantName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Approval Type</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedClaim.approvalType === 'individual'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {selectedClaim.approvalType.charAt(0).toUpperCase() + selectedClaim.approvalType.slice(1)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location Details</label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{selectedClaim.village}, {selectedClaim.block}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Area: {selectedClaim.area}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Approval Information</label>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800">Approved on: {selectedClaim.approvedDate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800">Status: Certificate Issued</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Documents Issued</label>
                  <div className="space-y-2">
                    {selectedClaim.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{doc}</span>
                        </div>
                        <button className="text-[#5a1c2d] hover:text-[#4a1825] text-sm font-medium">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    View Timeline
                  </button>
                  <button className="px-4 py-2 bg-[#5a1c2d] text-white rounded-lg hover:bg-[#4a1825] transition-colors">
                    Print Certificate
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ApprovedByDistrict;
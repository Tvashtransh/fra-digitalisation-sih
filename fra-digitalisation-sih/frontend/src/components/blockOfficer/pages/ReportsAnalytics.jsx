import { motion } from 'framer-motion';
import {
    AlertTriangle,
    BarChart3,
    Building,
    Download,
    FileCheck,
    FileText,
    MapPin,
    PieChart,
    TrendingUp,
    Users
} from 'lucide-react';
import { useState, useEffect } from 'react';

const ReportsAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [stats, setStats] = useState(null);
  const [villageStats, setVillageStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingVillages, setIsLoadingVillages] = useState(false);

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

  // Fetch village statistics
  const fetchVillageStats = async () => {
    try {
      setIsLoadingVillages(true);
      const response = await fetch('/api/block-officer/village-stats', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setVillageStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching village statistics:', error);
    } finally {
      setIsLoadingVillages(false);
    }
  };

  // Fetch village stats when village report is selected
  useEffect(() => {
    if (selectedReport === 'village') {
      fetchVillageStats();
    }
  }, [selectedReport]);

  // Real analytics data for Block Officer
  const analyticsData = {
    claims: {
      total: isLoading ? 0 : (stats?.submitted || 0),
      approved: isLoading ? 0 : (stats?.finalApproval || 0),
      pending: isLoading ? 0 : (stats?.reviewedAtBlock || 0),
      rejected: isLoading ? 0 : (stats?.rejected || 0),
      monthlyGrowth: isLoading ? 0 : 8.3
    },
    documents: {
      total: isLoading ? 0 : (stats?.submitted || 0),
      approved: isLoading ? 0 : (stats?.finalApproval || 0),
      pending: isLoading ? 0 : (stats?.reviewedAtBlock || 0),
      rejected: isLoading ? 0 : (stats?.rejected || 0)
    },
    villages: {
      total: 45, // This should come from backend
      active: 42, // This should come from backend
      inactive: 3 // This should come from backend
    },
    land: {
      totalArea: '2,340 sq km',
      forestArea: '1,856 sq km',
      disputedArea: '124 sq km'
    }
  };

  const reportTypes = [
    { id: 'overview', label: 'Block Overview', icon: BarChart3 },
    { id: 'claims', label: 'Claims Analytics', icon: FileText },
    { id: 'documents', label: 'Document Reports', icon: FileCheck },
    { id: 'village', label: 'Village Reports', icon: Building },
    { id: 'land', label: 'Land Management', icon: MapPin },
    { id: 'performance', label: 'Performance Metrics', icon: TrendingUp }
  ];

  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' }
  ];

  const renderOverviewReport = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#044e2b]"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Claims</p>
            <p className="text-2xl font-bold text-[#044e2b]">
              {isLoading ? '...' : analyticsData.claims.total.toLocaleString()}
            </p>
          </div>
          <FileText className="h-8 w-8 text-[#044e2b]" />
        </div>
        <div className="mt-4 flex items-center">
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          <span className="text-sm text-green-600">
            {isLoading ? '...' : `+${analyticsData.claims.monthlyGrowth}%`}
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Approved Claims</p>
            <p className="text-2xl font-bold text-green-600">
              {isLoading ? '...' : analyticsData.claims.approved.toLocaleString()}
            </p>
          </div>
          <FileCheck className="h-8 w-8 text-green-600" />
        </div>
        <div className="mt-4">
          <span className="text-sm text-gray-600">
            {isLoading ? '...' : 
              `${((analyticsData.claims.approved / Math.max(analyticsData.claims.total, 1)) * 100).toFixed(1)}% of total`
            }
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending Review</p>
            <p className="text-2xl font-bold text-yellow-600">
              {isLoading ? '...' : analyticsData.claims.pending}
            </p>
          </div>
          <AlertTriangle className="h-8 w-8 text-yellow-600" />
        </div>
        <div className="mt-4">
          <span className="text-sm text-gray-600">Requires attention</span>
        </div>
      </motion.div>
    </div>
  );

  const renderClaimsAnalytics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-semibold text-[#044e2b] mb-4">Claims by Status</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Approved</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(analyticsData.claims.approved / analyticsData.claims.total) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-green-600">
                {((analyticsData.claims.approved / analyticsData.claims.total) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Pending</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${(analyticsData.claims.pending / analyticsData.claims.total) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-yellow-600">
                {((analyticsData.claims.pending / analyticsData.claims.total) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Rejected</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${(analyticsData.claims.rejected / analyticsData.claims.total) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-red-600">
                {((analyticsData.claims.rejected / analyticsData.claims.total) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-semibold text-[#044e2b] mb-4">Monthly Trends</h3>
        <div className="space-y-3">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
            <div key={month} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{month}</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#044e2b] h-2 rounded-full"
                    style={{ width: `${Math.random() * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-[#044e2b]">
                  {Math.floor(Math.random() * 50) + 10}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderVillageReport = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Village Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#044e2b]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Villages</p>
              <p className="text-2xl font-bold text-[#044e2b]">
                {isLoadingVillages ? '...' : (villageStats?.totalVillages || 0)}
              </p>
            </div>
            <Building className="h-8 w-8 text-[#044e2b]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Villages</p>
              <p className="text-2xl font-bold text-green-600">
                {isLoadingVillages ? '...' : (villageStats?.activeVillages || 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive Villages</p>
              <p className="text-2xl font-bold text-red-600">
                {isLoadingVillages ? '...' : (villageStats?.inactiveVillages || 0)}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </motion.div>
      </div>

      {/* Village List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#044e2b]">Village-wise Statistics</h3>
          <button
            onClick={fetchVillageStats}
            disabled={isLoadingVillages}
            className="px-4 py-2 bg-[#044e2b] text-white rounded-lg hover:bg-[#0a5a35] transition-colors disabled:opacity-50"
          >
            {isLoadingVillages ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {isLoadingVillages ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#044e2b] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading village statistics...</p>
          </div>
        ) : villageStats?.villages && villageStats.villages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Village Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Total Claims</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Approved</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Pending</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Rejected</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {villageStats.villages.map((village, index) => (
                  <motion.tr
                    key={village._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900">{village._id}</td>
                    <td className="py-3 px-4 text-gray-700">{village.totalClaims}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {village.approved}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {village.pending}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {village.rejected}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          // TODO: Implement village details view
                          console.log('View village details:', village._id);
                        }}
                        className="text-[#044e2b] hover:text-[#0a5a35] font-medium text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No village data available</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'overview':
        return renderOverviewReport();
      case 'claims':
        return renderClaimsAnalytics();
      case 'documents':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-[#044e2b] mb-4">Document Processing Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#044e2b]">{analyticsData.documents.total}</p>
                <p className="text-sm text-gray-600">Total Documents</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{analyticsData.documents.approved}</p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{analyticsData.documents.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </motion.div>
        );
      case 'village':
        return renderVillageReport();
      case 'land':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-[#044e2b] mb-4">Land Management Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Total Block Area</h4>
                <p className="text-2xl font-bold text-[#044e2b]">{analyticsData.land.totalArea}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Forest Area</h4>
                <p className="text-2xl font-bold text-green-600">{analyticsData.land.forestArea}</p>
                <p className="text-sm text-gray-600">Protected forest land</p>
              </div>
            </div>
          </motion.div>
        );
      case 'performance':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-[#044e2b] mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-lg font-bold text-green-600">94.2%</p>
                <p className="text-sm text-gray-600">Approval Rate</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-lg font-bold text-blue-600">2.3 days</p>
                <p className="text-sm text-gray-600">Avg Processing Time</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-lg font-bold text-yellow-600">87%</p>
                <p className="text-sm text-gray-600">Satisfaction Rate</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-lg font-bold text-purple-600">12</p>
                <p className="text-sm text-gray-600">Reports Generated</p>
              </div>
            </div>
          </motion.div>
        );
      default:
        return renderOverviewReport();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#044e2b]">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">Generate comprehensive reports and view detailed analytics for block-level operations</p>
          </div>
          <div className="flex space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
            >
              {periods.map(period => (
                <option key={period.id} value={period.id}>{period.label}</option>
              ))}
            </select>
            <button className="bg-[#044e2b] text-[#d4c5a9] px-4 py-2 rounded-lg hover:bg-[#0a5a35] flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Report Type Selection */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedReport === report.id
                    ? 'border-[#044e2b] bg-[#044e2b] text-[#d4c5a9]'
                    : 'border-gray-200 hover:border-[#044e2b] text-gray-700'
                }`}
              >
                <Icon className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">{report.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Report Content */}
      {renderReportContent()}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#044e2b] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:border-[#044e2b] hover:bg-[#f8f9fa] transition-colors">
            <FileText className="h-6 w-6 text-[#044e2b] mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Monthly Report</span>
            <p className="text-xs text-gray-600 mt-1">Generate monthly performance report</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:border-[#044e2b] hover:bg-[#f8f9fa] transition-colors">
            <PieChart className="h-6 w-6 text-[#044e2b] mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Claims Analysis</span>
            <p className="text-xs text-gray-600 mt-1">Detailed claims breakdown</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:border-[#044e2b] hover:bg-[#f8f9fa] transition-colors">
            <Users className="h-6 w-6 text-[#044e2b] mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Village Report</span>
            <p className="text-xs text-gray-600 mt-1">Village-wise statistics</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:border-[#044e2b] hover:bg-[#f8f9fa] transition-colors">
            <MapPin className="h-6 w-6 text-[#044e2b] mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Land Report</span>
            <p className="text-xs text-gray-600 mt-1">Land usage analytics</p>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportsAnalytics;
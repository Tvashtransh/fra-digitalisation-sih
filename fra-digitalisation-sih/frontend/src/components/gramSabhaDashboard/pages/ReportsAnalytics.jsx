import { motion } from 'framer-motion';
import { BarChart3, Calendar, Download, FileText, Filter, MapPin, PieChart, TreePine, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

const ReportsAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  // Mock analytics data
  const analyticsData = {
    claims: {
      total: 245,
      approved: 189,
      pending: 45,
      rejected: 11,
      monthlyGrowth: 12.5
    },
    land: {
      totalArea: '1,247 acres',
      forestArea: '892 acres',
      agriculturalArea: '355 acres',
      disputedArea: '45 acres'
    },
    villages: {
      total: 12,
      active: 10,
      inactive: 2
    }
  };

  const reportTypes = [
    { id: 'overview', label: 'Overview Report', icon: BarChart3 },
    { id: 'claims', label: 'Claims Analysis', icon: FileText },
    { id: 'land', label: 'Land Usage Report', icon: MapPin },
    { id: 'village', label: 'Village Statistics', icon: Users },
    { id: 'forest', label: 'Forest Management', icon: TreePine }
  ];

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
          <h1 className="text-3xl font-bold text-[#044e2b]">Reports & Analytics</h1>
          <p className="text-[#044e2b] opacity-80 mt-1">Comprehensive data analysis and reporting dashboard</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#044e2b] text-[#d4c5a9] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#0a5a35] transition-colors"
          >
            <Download className="h-4 w-4" />
            Export Report
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#d4c5a9] text-[#044e2b] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#c4b599] transition-colors"
          >
            <Calendar className="h-4 w-4" />
            Schedule Report
          </motion.button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={sectionVariants} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#044e2b]">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Report Type */}
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#044e2b]" />
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
            >
              {reportTypes.map(report => (
                <option key={report.id} value={report.id}>{report.label}</option>
              ))}
            </select>
          </div>

          {/* Time Period */}
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#044e2b]" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>

          {/* Custom Filters */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <Filter className="h-4 w-4" />
            Advanced Filters
          </motion.button>
        </div>
      </motion.div>

      {/* Key Metrics Cards */}
      <motion.div variants={sectionVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Claims',
            value: analyticsData.claims.total,
            change: `+${analyticsData.claims.monthlyGrowth}%`,
            icon: FileText,
            color: 'text-blue-600'
          },
          {
            title: 'Approved Claims',
            value: analyticsData.claims.approved,
            change: `${Math.round((analyticsData.claims.approved / analyticsData.claims.total) * 100)}%`,
            icon: TrendingUp,
            color: 'text-green-600'
          },
          {
            title: 'Total Land Area',
            value: analyticsData.land.totalArea,
            change: '+5.2%',
            icon: MapPin,
            color: 'text-purple-600'
          },
          {
            title: 'Active Villages',
            value: analyticsData.villages.active,
            change: `${Math.round((analyticsData.villages.active / analyticsData.villages.total) * 100)}%`,
            icon: Users,
            color: 'text-orange-600'
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#044e2b]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{metric.title}</p>
                <p className="text-2xl font-bold text-[#044e2b] mt-1">{metric.value}</p>
                <p className={`text-sm mt-2 ${metric.color}`}>{metric.change} from last month</p>
              </div>
              <metric.icon className={`h-8 w-8 ${metric.color}`} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Claims Status Chart */}
        <motion.div variants={sectionVariants} className="bg-white rounded-lg shadow-lg border-l-4 border-[#044e2b]">
          <div className="bg-[#044e2b] text-[#d4c5a9] p-4">
            <h3 className="font-semibold flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Claims Status Distribution
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { status: 'Approved', count: analyticsData.claims.approved, percentage: Math.round((analyticsData.claims.approved / analyticsData.claims.total) * 100), color: 'bg-green-500' },
                { status: 'Pending', count: analyticsData.claims.pending, percentage: Math.round((analyticsData.claims.pending / analyticsData.claims.total) * 100), color: 'bg-yellow-500' },
                { status: 'Rejected', count: analyticsData.claims.rejected, percentage: Math.round((analyticsData.claims.rejected / analyticsData.claims.total) * 100), color: 'bg-red-500' }
              ].map((item, index) => (
                <motion.div
                  key={item.status}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${item.color}`}></div>
                    <span className="text-gray-700">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#044e2b]">{item.count}</span>
                    <span className="text-sm text-gray-500">({item.percentage}%)</span>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Mock Pie Chart */}
            <div className="mt-6 flex justify-center">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full border-8 border-green-500" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}></div>
                <div className="absolute inset-0 rounded-full border-8 border-yellow-500" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 50%, 50% 50%)' }}></div>
                <div className="absolute inset-0 rounded-full border-8 border-red-500" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)' }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Land Usage Chart */}
        <motion.div variants={sectionVariants} className="bg-white rounded-lg shadow-lg border-l-4 border-[#044e2b]">
          <div className="bg-[#044e2b] text-[#d4c5a9] p-4">
            <h3 className="font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Land Usage Breakdown
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { type: 'Forest Land', area: analyticsData.land.forestArea, percentage: Math.round((892 / 1247) * 100), color: 'bg-green-600' },
                { type: 'Agricultural Land', area: analyticsData.land.agriculturalArea, percentage: Math.round((355 / 1247) * 100), color: 'bg-yellow-600' },
                { type: 'Disputed Land', area: analyticsData.land.disputedArea, percentage: Math.round((45 / 1247) * 100), color: 'bg-red-600' }
              ].map((item, index) => (
                <motion.div
                  key={item.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">{item.type}</span>
                    <span className="text-sm text-gray-500">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ delay: index * 0.2, duration: 1 }}
                      className={`h-3 rounded-full ${item.color}`}
                    ></motion.div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-[#044e2b]">{item.area}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Reports Table */}
      <motion.div variants={sectionVariants} className="bg-white rounded-lg shadow-lg border-l-4 border-[#044e2b]">
        <div className="bg-[#044e2b] text-[#d4c5a9] p-4">
          <h3 className="font-semibold">Recent Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { name: 'Monthly Claims Summary', type: 'Claims Analysis', date: '2024-01-15', status: 'completed' },
                { name: 'Land Usage Report Q4', type: 'Land Usage', date: '2024-01-10', status: 'completed' },
                { name: 'Village Activity Report', type: 'Village Statistics', date: '2024-01-08', status: 'processing' },
                { name: 'Forest Management Review', type: 'Forest Management', date: '2024-01-05', status: 'completed' }
              ].map((report, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#044e2b]">{report.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      report.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-[#044e2b] hover:text-[#0a5a35] mr-3"
                    >
                      <Download className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FileText className="h-4 w-4" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReportsAnalytics;
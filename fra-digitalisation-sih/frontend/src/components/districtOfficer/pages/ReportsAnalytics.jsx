import { motion } from 'framer-motion';
import {
    BarChart3,
    Calendar,
    CheckCircle,
    Clock,
    Download,
    FileText,
    TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    PieChart as RechartsPieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

const ReportsAnalytics = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  // Sample data for charts
  const monthlyData = [
    { month: 'Jan', approved: 45, pending: 23, rejected: 8 },
    { month: 'Feb', approved: 52, pending: 18, rejected: 5 },
    { month: 'Mar', approved: 48, pending: 25, rejected: 12 },
    { month: 'Apr', approved: 61, pending: 20, rejected: 7 },
    { month: 'May', approved: 55, pending: 22, rejected: 9 },
    { month: 'Jun', approved: 67, pending: 19, rejected: 6 }
  ];

  const statusData = [
    { name: 'Approved', value: 328, color: '#10b981' },
    { name: 'Pending', value: 127, color: '#f59e0b' },
    { name: 'Rejected', value: 47, color: '#ef4444' }
  ];

  const villageData = [
    { village: 'Banjara Tola', claims: 45, approved: 38 },
    { village: 'Gondpura', claims: 52, approved: 41 },
    { village: 'Baiga Colony', claims: 38, approved: 32 },
    { village: 'Korku Tola', claims: 29, approved: 25 },
    { village: 'Sahariya', claims: 41, approved: 35 }
  ];

  const processingTimeData = [
    { range: '0-30 days', count: 156 },
    { range: '31-60 days', count: 89 },
    { range: '61-90 days', count: 45 },
    { range: '91-120 days', count: 23 },
    { range: '120+ days', count: 12 }
  ];

  const keyMetrics = [
    {
      title: 'Total Claims',
      value: '502',
      change: '+12%',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Approved This Month',
      value: '67',
      change: '+8%',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Average Processing Time',
      value: '42 days',
      change: '-5%',
      icon: Clock,
      color: 'orange'
    },
    {
      title: 'Success Rate',
      value: '89%',
      change: '+3%',
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  const reports = [
    { id: 'overview', name: 'Overview Report', description: 'Comprehensive district overview' },
    { id: 'monthly', name: 'Monthly Report', description: 'Monthly performance metrics' },
    { id: 'village', name: 'Village-wise Report', description: 'Performance by village' },
    { id: 'processing', name: 'Processing Time Report', description: 'Claim processing analytics' },
    { id: 'rejection', name: 'Rejection Analysis', description: 'Reasons for claim rejections' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">Comprehensive analytics and reporting for forest rights claims</p>
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
            <button className="flex items-center space-x-2 px-4 py-2 bg-[#5a1c2d] text-white rounded-lg hover:bg-[#4a1825] transition-colors">
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {keyMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
                <p className={`text-sm ${
                  metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change} from last period
                </p>
              </div>
              <div className={`p-3 rounded-full ${
                metric.color === 'blue' ? 'bg-blue-100' :
                metric.color === 'green' ? 'bg-green-100' :
                metric.color === 'orange' ? 'bg-orange-100' : 'bg-purple-100'
              }`}>
                <metric.icon className={`h-6 w-6 ${
                  metric.color === 'blue' ? 'text-blue-600' :
                  metric.color === 'green' ? 'text-green-600' :
                  metric.color === 'orange' ? 'text-orange-600' : 'text-purple-600'
                }`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Report Selection */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {reports.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                selectedReport === report.id
                  ? 'border-[#5a1c2d] bg-[#5a1c2d] text-white'
                  : 'border-gray-200 hover:border-[#5a1c2d] hover:bg-[#5a1c2d] hover:text-white'
              }`}
            >
              <h4 className="font-medium text-sm">{report.name}</h4>
              <p className={`text-xs mt-1 ${
                selectedReport === report.id ? 'text-white/80' : 'text-gray-600'
              }`}>
                {report.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="approved"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="pending"
                stackId="1"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="rejected"
                stackId="1"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Claim Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Village Performance */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Village-wise Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={villageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="village" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="claims" fill="#3b82f6" name="Total Claims" />
              <Bar dataKey="approved" fill="#10b981" name="Approved Claims" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Processing Time Analysis */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Processing Time Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processingTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Villages */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Villages</h3>
          <div className="space-y-3">
            {villageData.map((village, index) => (
              <div key={village.village} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-600 w-6">{index + 1}.</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{village.village}</p>
                    <p className="text-xs text-gray-500">{village.approved}/{village.claims} approved</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">
                    {Math.round((village.approved / village.claims) * 100)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'Claim Approved', id: 'FRA-2024-156', time: '2 hours ago', type: 'approved' },
              { action: 'New Claim Submitted', id: 'FRA-2024-157', time: '4 hours ago', type: 'new' },
              { action: 'Claim Rejected', id: 'FRA-2024-155', time: '6 hours ago', type: 'rejected' },
              { action: 'Document Requested', id: 'FRA-2024-154', time: '1 day ago', type: 'pending' },
              { action: 'Claim Approved', id: 'FRA-2024-153', time: '1 day ago', type: 'approved' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'approved' ? 'bg-green-500' :
                  activity.type === 'rejected' ? 'bg-red-500' :
                  activity.type === 'new' ? 'bg-blue-500' : 'bg-yellow-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.id} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Export Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <FileText className="h-4 w-4" />
            <span className="text-sm">PDF Report</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            <span className="text-sm">Excel Data</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm">Chart Images</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Schedule Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
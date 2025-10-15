import { motion } from 'framer-motion';
import { BarChart3, Map, PieChart, TrendingUp } from 'lucide-react';
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
    Pie,
    PieChart as RechartsPieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

const BlockOfficerAnalyticsCharts = () => {
  const chartData = {
    monthlyApprovals: [
      { month: 'Jan', approved: 45, rejected: 8, pending: 12 },
      { month: 'Feb', approved: 52, rejected: 6, pending: 15 },
      { month: 'Mar', approved: 48, rejected: 10, pending: 18 },
      { month: 'Apr', approved: 61, rejected: 7, pending: 22 },
      { month: 'May', approved: 55, rejected: 9, pending: 19 },
      { month: 'Jun', approved: 67, rejected: 5, pending: 25 }
    ],
    claimTypes: [
      { type: 'IFR', count: 456, percentage: 36.5, color: 'bg-blue-500' },
      { type: 'CR', count: 387, percentage: 31.0, color: 'bg-green-500' },
      { type: 'CFR', count: 404, percentage: 32.5, color: 'bg-purple-500' }
    ],
    villageStats: [
      { village: 'Village A', claims: 89, approved: 78, rejected: 11 },
      { village: 'Village B', claims: 76, approved: 65, rejected: 11 },
      { village: 'Village C', claims: 92, approved: 81, rejected: 11 },
      { village: 'Village D', claims: 67, approved: 59, rejected: 8 },
      { village: 'Village E', claims: 83, approved: 72, rejected: 11 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Monthly Trends Chart */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-[#044e2b]" />
            <h3 className="text-lg font-semibold text-gray-800">Monthly Approval Trends</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">Claim processing trends over the last 6 months</p>
        </div>

        <div className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.monthlyApprovals}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                stroke="#666"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="#666"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar
                dataKey="approved"
                name="Approved"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="rejected"
                name="Rejected"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="pending"
                name="Pending"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Chart Legend */}
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Approved</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">Rejected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-sm text-gray-600">Pending</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Claim Types Distribution */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-[#044e2b]" />
              <h3 className="text-lg font-semibold text-gray-800">Claim Types Distribution</h3>
            </div>
            <p className="text-sm text-gray-600 mt-1">Breakdown by claim category</p>
          </div>

          <div className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={chartData.claimTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {chartData.claimTypes.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.type === 'IFR' ? '#3b82f6' :
                        entry.type === 'CR' ? '#10b981' : '#8b5cf6'
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} claims`, name]}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="space-y-2">
              {chartData.claimTypes.map((type, index) => (
                <motion.div
                  key={type.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 ${type.color} rounded`}></div>
                    <span className="text-sm font-medium text-gray-800">{type.type}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900">{type.count}</span>
                    <span className="text-xs text-gray-600 ml-1">({type.percentage}%)</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Village Performance Heat Map */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Map className="h-5 w-5 text-[#044e2b]" />
              <h3 className="text-lg font-semibold text-gray-800">Village Performance</h3>
            </div>
            <p className="text-sm text-gray-600 mt-1">Claim processing by village</p>
          </div>

          <div className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={chartData.villageStats}
                layout="horizontal"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  type="number"
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  dataKey="village"
                  type="category"
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar
                  dataKey="approved"
                  name="Approved"
                  fill="#10b981"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="rejected"
                  name="Rejected"
                  fill="#ef4444"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Village Stats Table */}
            <div className="space-y-2">
              {chartData.villageStats.map((village, index) => (
                <motion.div
                  key={village.village}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm font-medium text-gray-800">{village.village}</span>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-green-600">✓{village.approved}</span>
                    <span className="text-red-600">✗{village.rejected}</span>
                    <span className="text-gray-600">Total: {village.claims}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Processing Trend Line Chart */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-[#044e2b]" />
            <h3 className="text-lg font-semibold text-gray-800">Processing Trend</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">Monthly claim processing volume and approval rates</p>
        </div>

        <div className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.monthlyApprovals}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                stroke="#666"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="#666"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="approved"
                stroke="#10b981"
                strokeWidth={3}
                name="Approved"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="pending"
                stroke="#f59e0b"
                strokeWidth={3}
                name="Pending"
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Approval Rate Area Chart */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-[#044e2b]" />
            <h3 className="text-lg font-semibold text-gray-800">Approval Rate Trends</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">Monthly approval rates and processing efficiency</p>
        </div>

        <div className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.monthlyApprovals.map(item => ({
              ...item,
              approvalRate: Math.round((item.approved / (item.approved + item.rejected + item.pending)) * 100)
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                stroke="#666"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#666"
                fontSize={12}
                tickLine={false}
                label={{ value: 'Approval Rate (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Approval Rate']}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="approvalRate"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
                strokeWidth={3}
                name="Approval Rate"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Highest Approval Rate</p>
              <p className="text-2xl font-bold">Village D</p>
              <p className="text-green-100 text-sm">88.1% approval rate</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Needs Attention</p>
              <p className="text-2xl font-bold">Village C</p>
              <p className="text-red-100 text-sm">11.9% rejection rate</p>
            </div>
            <BarChart3 className="h-8 w-8 text-red-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Processing Trend</p>
              <p className="text-2xl font-bold">+23%</p>
              <p className="text-blue-100 text-sm">vs last month</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-200" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlockOfficerAnalyticsCharts;
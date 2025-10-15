import { motion } from 'framer-motion';
import {
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

const DistrictOfficerAnalyticsCharts = () => {
  const monthlyData = [
    { month: 'Jan', claims: 120, approved: 95 },
    { month: 'Feb', claims: 135, approved: 110 },
    { month: 'Mar', claims: 148, approved: 125 },
    { month: 'Apr', claims: 162, approved: 140 },
    { month: 'May', claims: 175, approved: 155 },
    { month: 'Jun', claims: 190, approved: 170 }
  ];

  const claimTypeData = [
    { name: 'Individual Rights', value: 45, color: '#3b82f6' },
    { name: 'Community Rights', value: 30, color: '#10b981' },
    { name: 'Forest Rights', value: 25, color: '#f59e0b' }
  ];

  const performanceData = [
    { metric: 'Processing Time', value: '2.3 days', status: 'Good' },
    { metric: 'Approval Rate', value: '87%', status: 'Excellent' },
    { metric: 'Rejection Rate', value: '5.5%', status: 'Good' },
    { metric: 'Backlog', value: '23 claims', status: 'Low' }
  ];

  return (
    <div className="space-y-6">
      {/* Monthly Trends Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Claims Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Line
              type="monotone"
              dataKey="claims"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Total Claims"
            />
            <Line
              type="monotone"
              dataKey="approved"
              stroke="#10b981"
              strokeWidth={2}
              name="Approved Claims"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Claim Types Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Claim Types Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={claimTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {claimTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            {claimTypeData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            {performanceData.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{metric.metric}</p>
                  <p className="text-sm text-gray-600">{metric.value}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  metric.status === 'Excellent' ? 'bg-green-100 text-green-800' :
                  metric.status === 'Good' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {metric.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DistrictOfficerAnalyticsCharts;
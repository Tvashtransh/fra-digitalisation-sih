import { AnimatePresence, motion } from 'framer-motion';
import { Download, Filter, Minus, RefreshCw, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ComposedChart,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

const AnalyticsCharts = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months');
  const [selectedClaimType, setSelectedClaimType] = useState('all');
  const [chartType, setChartType] = useState('pie');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Enhanced claim types data with more details
  const [claimTypesData, setClaimTypesData] = useState([
    {
      name: 'Individual Forest Rights',
      value: 45,
      color: '#10B981',
      approved: 38,
      pending: 5,
      rejected: 2,
      monthlyTrend: [40, 42, 38, 45, 43, 45],
      avgProcessingTime: 4.2,
      successRate: 84.4
    },
    {
      name: 'Community Forest Rights',
      value: 30,
      color: '#3B82F6',
      approved: 25,
      pending: 3,
      rejected: 2,
      monthlyTrend: [28, 26, 32, 29, 31, 30],
      avgProcessingTime: 5.8,
      successRate: 83.3
    },
    {
      name: 'Community Forest Resource Rights',
      value: 25,
      color: '#F59E0B',
      approved: 20,
      pending: 4,
      rejected: 1,
      monthlyTrend: [22, 24, 23, 26, 24, 25],
      avgProcessingTime: 6.1,
      successRate: 80.0
    }
  ]);

  // Monthly claims data with enhanced details
  const [monthlyData, setMonthlyData] = useState([
    {
      month: 'Jan',
      approved: 45,
      pending: 23,
      rejected: 12,
      total: 80,
      individual: 28,
      community: 32,
      resource: 20
    },
    {
      month: 'Feb',
      approved: 52,
      pending: 31,
      rejected: 8,
      total: 91,
      individual: 35,
      community: 38,
      resource: 18
    },
    {
      month: 'Mar',
      approved: 48,
      pending: 28,
      rejected: 15,
      total: 91,
      individual: 32,
      community: 35,
      resource: 24
    },
    {
      month: 'Apr',
      approved: 61,
      pending: 35,
      rejected: 11,
      total: 107,
      individual: 42,
      community: 40,
      resource: 25
    },
    {
      month: 'May',
      approved: 55,
      pending: 29,
      rejected: 9,
      total: 93,
      individual: 38,
      community: 33,
      resource: 22
    },
    {
      month: 'Jun',
      approved: 67,
      pending: 41,
      rejected: 13,
      total: 121,
      individual: 48,
      community: 45,
      resource: 28
    }
  ]);

  // Processing time trend with more data points
  const [processingTimeData, setProcessingTimeData] = useState([
    { month: 'Jan', avgDays: 5.2, targetDays: 4.5, individual: 4.8, community: 5.6, resource: 5.2 },
    { month: 'Feb', avgDays: 4.8, targetDays: 4.5, individual: 4.4, community: 5.2, resource: 4.9 },
    { month: 'Mar', avgDays: 5.1, targetDays: 4.5, individual: 4.6, community: 5.8, resource: 5.0 },
    { month: 'Apr', avgDays: 4.3, targetDays: 4.5, individual: 4.0, community: 4.8, resource: 4.2 },
    { month: 'May', avgDays: 4.7, targetDays: 4.5, individual: 4.2, community: 5.4, resource: 4.6 },
    { month: 'Jun', avgDays: 4.2, targetDays: 4.5, individual: 3.8, community: 4.9, resource: 4.1 }
  ]);

  // Village-wise claims with enhanced data
  const [villageData, setVillageData] = useState([
    { village: 'Village A', claims: 45, approved: 38, individual: 28, community: 12, resource: 5, successRate: 84.4 },
    { village: 'Village B', claims: 32, approved: 28, individual: 20, community: 8, resource: 4, successRate: 87.5 },
    { village: 'Village C', claims: 28, approved: 24, individual: 18, community: 6, resource: 4, successRate: 85.7 },
    { village: 'Village D', claims: 41, approved: 35, individual: 25, community: 11, resource: 5, successRate: 85.4 },
    { village: 'Village E', claims: 19, approved: 16, individual: 12, community: 5, resource: 2, successRate: 84.2 }
  ]);

  const filteredClaimTypesData = selectedClaimType === 'all'
    ? claimTypesData
    : claimTypesData.filter(type => type.name.toLowerCase().includes(selectedClaimType.toLowerCase()));

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Update data with slight variations
    setClaimTypesData(prev => prev.map(type => ({
      ...type,
      value: Math.max(0, type.value + Math.floor(Math.random() * 6 - 3))
    })));

    setIsRefreshing(false);
  };

  const exportData = () => {
    const dataStr = JSON.stringify({
      claimTypes: claimTypesData,
      monthly: monthlyData,
      processingTime: processingTimeData,
      villages: villageData
    }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `analytics-data-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderTrendIcon = (current, previous) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  return (
    <motion.div
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedClaimType}
              onChange={(e) => setSelectedClaimType(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
            >
              <option value="all">All Claim Types</option>
              <option value="individual">Individual Rights</option>
              <option value="community">Community Rights</option>
              <option value="resource">Resource Rights</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
            >
              <option value="pie">Pie Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportData}
            className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Monthly Claims Trend */}
      <motion.div
        variants={chartVariants}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Monthly Claims Trend
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            {renderTrendIcon(monthlyData[monthlyData.length - 1]?.total, monthlyData[monthlyData.length - 2]?.total)}
            <span>{selectedTimeRange}</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="month"
              className="text-gray-600 dark:text-gray-400"
              fontSize={12}
            />
            <YAxis
              className="text-gray-600 dark:text-gray-400"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="approved"
              stackId="a"
              fill="#10B981"
              name="Approved"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="pending"
              stackId="a"
              fill="#F59E0B"
              name="Pending"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="rejected"
              stackId="a"
              fill="#EF4444"
              name="Rejected"
              radius={[2, 2, 0, 0]}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              name="Total Claims"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Claim Types Distribution */}
        <motion.div
          variants={chartVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Claim Types Distribution
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Interactive {chartType} chart
            </div>
          </div>

          <AnimatePresence mode="wait">
            {chartType === 'pie' && (
              <motion.div
                key="pie"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={filteredClaimTypesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      onClick={(data) => setSelectedClaimType(data.name)}
                      className="cursor-pointer"
                    >
                      {filteredClaimTypesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {chartType === 'bar' && (
              <motion.div
                key="bar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={filteredClaimTypesData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                      dataKey="name"
                      className="text-gray-600 dark:text-gray-400"
                      fontSize={10}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      className="text-gray-600 dark:text-gray-400"
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="value"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                      onClick={(data) => setSelectedClaimType(data.name)}
                      className="cursor-pointer"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {chartType === 'line' && (
              <motion.div
                key="line"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={filteredClaimTypesData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                      dataKey="name"
                      className="text-gray-600 dark:text-gray-400"
                      fontSize={10}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      className="text-gray-600 dark:text-gray-400"
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Claim Types Details */}
          <div className="mt-4 space-y-2">
            {filteredClaimTypesData.map((type) => (
              <div
                key={type.name}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                onClick={() => setSelectedClaimType(type.name)}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: type.color }}
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {type.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {type.value}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {type.successRate}% success
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Processing Time Trend */}
        <motion.div
          variants={chartVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Average Processing Time
            </h3>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600 dark:text-gray-400">Target:</span>
              <span className="font-medium text-green-600 dark:text-green-400">4.5 days</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={processingTimeData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="month"
                className="text-gray-600 dark:text-gray-400"
                fontSize={12}
              />
              <YAxis
                className="text-gray-600 dark:text-gray-400"
                fontSize={12}
                label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="avgDays"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                name="Average Days"
              />
              <Line
                type="monotone"
                dataKey="targetDays"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Target (4.5 days)"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Village-wise Performance */}
      <motion.div
        variants={chartVariants}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Village-wise Performance
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Success rates and claim distribution
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={villageData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="village"
              className="text-gray-600 dark:text-gray-400"
              fontSize={12}
            />
            <YAxis
              yAxisId="left"
              className="text-gray-600 dark:text-gray-400"
              fontSize={12}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              className="text-gray-600 dark:text-gray-400"
              fontSize={12}
              label={{ value: 'Success Rate (%)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="claims"
              fill="#6B7280"
              name="Total Claims"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="left"
              dataKey="approved"
              fill="#10B981"
              name="Approved Claims"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="successRate"
              stroke="#F59E0B"
              strokeWidth={3}
              dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
              name="Success Rate (%)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Key Metrics Summary */}
      <motion.div
        variants={chartVariants}
        className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Key Performance Indicators
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {claimTypesData.reduce((sum, type) => sum + type.successRate * type.value / 100, 0).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Overall Success Rate
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {processingTimeData[processingTimeData.length - 1]?.avgDays.toFixed(1)} days
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Current Avg Processing Time
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {monthlyData[monthlyData.length - 1]?.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Claims This Month
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {villageData.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Active Villages
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsCharts;
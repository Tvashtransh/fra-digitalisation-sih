import { ArrowTrendingUpIcon, CalendarDaysIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
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

const agricultureData = [
  { name: 'Rice', area: 2.5, yield: 4.2, trend: '+5%' },
  { name: 'Wheat', area: 1.8, yield: 3.1, trend: '+8%' },
  { name: 'Pulses', area: 1.2, yield: 2.8, trend: '+12%' },
  { name: 'Vegetables', area: 0.8, yield: 5.5, trend: '+15%' },
  { name: 'Cotton', area: 1.5, yield: 2.9, trend: '+3%' },
];

const forestCoverData = [
  { name: 'Dense Forest', value: 45, area: 562.5 },
  { name: 'Open Forest', value: 30, area: 375 },
  { name: 'Scrub', value: 15, area: 187.5 },
  { name: 'Non-Forest', value: 10, area: 125 },
];

const timeSeriesData = [
  { month: 'Jan', claims: 12, forest: 45.2, water: 85 },
  { month: 'Feb', claims: 15, forest: 45.1, water: 84 },
  { month: 'Mar', claims: 18, forest: 44.8, water: 86 },
  { month: 'Apr', claims: 22, forest: 44.5, water: 87 },
  { month: 'May', claims: 28, forest: 44.2, water: 88 },
  { month: 'Jun', claims: 35, forest: 43.9, water: 89 },
];

const COLORS = ['#046353', '#c7d993', '#f58369', '#9f7aea', '#4299e1'];

const chartTypes = [
  { id: 'agriculture', name: 'Agriculture', icon: ChartBarIcon },
  { id: 'forest', name: 'Forest Cover', icon: ArrowTrendingUpIcon },
  { id: 'trends', name: 'Time Trends', icon: CalendarDaysIcon },
];

export default function AssetCharts() {
  const [activeChart, setActiveChart] = useState('agriculture');
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');
  const [isLoading, setIsLoading] = useState(false);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate occasional data updates
      if (Math.random() < 0.2) {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const renderChart = () => {
    switch (activeChart) {
      case 'agriculture':
        return (
          <div className="space-y-6">
            <div className="card">
              <div className="section-heading mb-4 -mx-6 -mt-6">
                <h2 className="text-lg font-semibold">Agricultural Land Use</h2>
                <p className="text-sm text-gray-600 mt-1">Crop distribution analysis</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={agricultureData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="area" name="Area (hectares)" fill="#046353" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'forest':
        return (
          <div className="space-y-6">
            <div className="card">
              <div className="section-heading mb-4 -mx-6 -mt-6">
                <h2 className="text-lg font-semibold">Forest Cover Distribution</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={forestCoverData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {forestCoverData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'trends':
        return (
          <div className="space-y-6">
            <div className="card">
              <div className="section-heading mb-4 -mx-6 -mt-6">
                <h2 className="text-lg font-semibold">Community Assets Trends</h2>
                <p className="text-sm text-gray-600 mt-1">6-month progression analysis</p>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={timeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="claims" stroke="#f58369" strokeWidth={3} name="New Claims" />
                  <Line yAxisId="right" type="monotone" dataKey="forest" stroke="#046353" strokeWidth={2} name="Forest Cover %" />
                  <Line yAxisId="right" type="monotone" dataKey="water" stroke="#4299e1" strokeWidth={2} name="Water Bodies (acres)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Chart Type Selector */}
      <div className="flex flex-wrap gap-3">
        {chartTypes.map((chart) => {
          const Icon = chart.icon;
          return (
            <button
              key={chart.id}
              onClick={() => setActiveChart(chart.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeChart === chart.id
                  ? 'bg-bg-1 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              {chart.name}
            </button>
          );
        })}
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Time Range:</span>
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-bg-1 focus:border-bg-1"
        >
          <option value="1month">Last Month</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
        </select>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-bg-1"></div>
            Updating data...
          </div>
        )}
      </div>

      {/* Chart Content */}
      {renderChart()}
    </div>
  );
}
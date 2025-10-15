import { motion } from 'framer-motion';
import {
    BarChart3,
    Clock,
    FileText,
    Map,
    Send,
    Users
} from 'lucide-react';

const DistrictOfficerQuickActions = ({ onPageChange }) => {
  const quickActions = [
    {
      id: 'claim-management',
      title: 'Review Pending Claims',
      description: 'Review and process pending claims',
      icon: Clock,
      color: 'bg-blue-500 hover:bg-blue-600',
      page: 'claim-management'
    },
    {
      id: 'gis-mapping',
      title: 'District GIS Map',
      description: 'View all blocks & claims',
      icon: Map,
      color: 'bg-green-500 hover:bg-green-600',
      page: 'gis-mapping'
    },
    {
      id: 'reports-analytics',
      title: 'Forward to State',
      description: 'Send approved claims',
      icon: Send,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      page: 'reports-analytics'
    },
    {
      id: 'search-claim',
      title: 'Generate Report',
      description: 'District consolidated report',
      icon: FileText,
      color: 'bg-purple-500 hover:bg-purple-600',
      page: 'search-claim'
    },
    {
      id: 'pending-district',
      title: 'View Analytics',
      description: 'Block performance metrics',
      icon: BarChart3,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      page: 'pending-district'
    },
    {
      id: 'approved-district',
      title: 'Team Management',
      description: 'Block officer oversight',
      icon: Users,
      color: 'bg-red-500 hover:bg-red-600',
      page: 'approved-district'
    }
  ];

  const quickStats = [
    { label: 'Urgent Reviews', value: '24', status: 'Due Today', color: 'text-red-600' },
    { label: 'Ready to Forward', value: '156', status: 'Approved', color: 'text-green-600' },
    { label: 'In Queue', value: '89', status: 'Processing', color: 'text-yellow-600' },
    { label: 'Block Officers', value: '12', status: 'Active', color: 'text-blue-600' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <span className="text-sm text-gray-500">District officer functions</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon;

          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onPageChange(action.page)}
              className={`${action.color} text-white p-4 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
            >
              <div className="flex flex-col items-center space-y-2">
                <Icon className="h-6 w-6" />
                <div className="text-center">
                  <h3 className="font-semibold text-sm">{action.title}</h3>
                  <p className="text-xs opacity-90 leading-tight">
                    {action.description}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Quick Stats Summary */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-md font-semibold text-gray-900 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
              <div className={`text-xs mt-1 ${stat.color}`}>{stat.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DistrictOfficerQuickActions;
import { motion } from 'framer-motion';
import { Eye, FileText, Map, Send } from 'lucide-react';

const BlockOfficerQuickActions = ({ onPageChange }) => {
  const quickActions = [
    {
      id: 'review_claims',
      title: 'Review Pending Claims',
      description: 'Review and process claims pending at block level',
      icon: Eye,
      color: 'bg-blue-500',
      action: () => onPageChange('claims'),
      count: 89
    },
    {
      id: 'gis_map',
      title: 'Open Block GIS Map',
      description: 'View interactive map with claim locations',
      icon: Map,
      color: 'bg-green-500',
      action: () => onPageChange('gis'),
      count: null
    },
    {
      id: 'forward_claims',
      title: 'Forward Approved Claims',
      description: 'Send approved claims to district for final review',
      icon: Send,
      color: 'bg-purple-500',
      action: () => {},
      count: 45
    },
    {
      id: 'generate_report',
      title: 'Generate Block Report',
      description: 'Create comprehensive block-level performance report',
      icon: FileText,
      color: 'bg-orange-500',
      action: () => onPageChange('reports'),
      count: null
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
        <p className="text-sm text-gray-600 mt-1">Common tasks and shortcuts</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;

            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={action.action}
                className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 group"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-800 group-hover:text-[#044e2b] transition-colors">
                        {action.title}
                      </h4>
                      {action.count && (
                        <span className="bg-[#044e2b] text-[#d4c5a9] text-xs px-2 py-1 rounded-full font-medium">
                          {action.count}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default BlockOfficerQuickActions;
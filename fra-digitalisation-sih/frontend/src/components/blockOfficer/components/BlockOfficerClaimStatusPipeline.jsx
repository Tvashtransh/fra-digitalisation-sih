import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Clock, FileText, Send } from 'lucide-react';
import { useState, useEffect } from 'react';

const BlockOfficerClaimStatusPipeline = ({ onStatusFilter }) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const pipelineStages = [
    {
      id: 'submitted',
      title: 'Submitted',
      count: isLoading ? 0 : (stats?.submitted || 0),
      icon: FileText,
      color: 'bg-gray-500',
      active: false,
      description: 'Claims submitted by applicants'
    },
    {
      id: 'verified',
      title: 'Verified by Gram Sabha',
      count: isLoading ? 0 : (stats?.verifiedByGramSabha || 0),
      icon: CheckCircle,
      color: 'bg-blue-500',
      active: false,
      description: 'Verified at Gram Sabha level'
    },
    {
      id: 'block_review',
      title: 'Reviewed at Block',
      count: isLoading ? 0 : (stats?.reviewedAtBlock || 0),
      icon: Clock,
      color: 'bg-yellow-500',
      active: true,
      description: 'Currently under block review'
    },
    {
      id: 'district_review',
      title: 'District Review',
      count: isLoading ? 0 : (stats?.districtReview || 0),
      icon: Send,
      color: 'bg-purple-500',
      active: false,
      description: 'Pending district level review'
    },
    {
      id: 'final_approval',
      title: 'Final Approval',
      count: isLoading ? 0 : (stats?.finalApproval || 0),
      icon: CheckCircle,
      color: 'bg-green-500',
      active: false,
      description: 'Final approval granted'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Block Claim Pipeline</h3>
        <p className="text-sm text-gray-600 mt-1">Track claim progression through different stages</p>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between space-x-4">
          {pipelineStages.map((stage, index) => {
            const Icon = stage.icon;

            return (
              <div key={stage.id} className="flex items-center flex-1">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex-1 text-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    stage.active
                      ? 'border-[#044e2b] bg-[#044e2b]/5 shadow-lg'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                  onClick={() => onStatusFilter && onStatusFilter(stage.id)}
                >
                  <div className={`w-12 h-12 ${stage.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className={`font-semibold text-sm mb-1 ${
                    stage.active ? 'text-[#044e2b]' : 'text-gray-800'
                  }`}>
                    {stage.title}
                  </h4>
                  <p className={`text-2xl font-bold mb-2 ${
                    stage.active ? 'text-[#044e2b]' : 'text-gray-900'
                  }`}>
                    {stage.count.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 leading-tight">
                    {stage.description}
                  </p>
                </motion.div>

                {index < pipelineStages.length - 1 && (
                  <ArrowRight className={`h-6 w-6 mx-2 flex-shrink-0 ${
                    stage.active ? 'text-[#044e2b]' : 'text-gray-400'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Summary */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-lg font-bold text-[#044e2b]">
                {isLoading ? '...' : stats ? 
                  `${((stats.finalApproval / Math.max(stats.submitted, 1)) * 100).toFixed(1)}%` : 
                  '0%'
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Processing Time</p>
              <p className="text-lg font-bold text-gray-800">
                {isLoading ? '...' : '12 days'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Reviews</p>
              <p className="text-lg font-bold text-yellow-600">
                {isLoading ? '...' : (stats?.reviewedAtBlock || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-lg font-bold text-blue-600">
                {isLoading ? '...' : `+${stats?.submitted || 0}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockOfficerClaimStatusPipeline;
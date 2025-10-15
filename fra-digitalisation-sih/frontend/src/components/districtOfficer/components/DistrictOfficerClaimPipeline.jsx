import { motion } from 'framer-motion';
import {
    ArrowRight,
    CheckCircle,
    Clock,
    FileText,
    MapPin,
    Send,
    Users
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

const DistrictOfficerClaimPipeline = ({ onStageClick, selectedStage }) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/district/statistics', {
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
      subtitle: 'Gram Sabha Level',
      count: isLoading ? 0 : (stats?.submitted || 0),
      icon: FileText,
      color: 'bg-blue-500',
      status: 'completed'
    },
    {
      id: 'verified',
      title: 'Verified',
      subtitle: 'Gram Sabha',
      count: isLoading ? 0 : (stats?.verifiedByGramSabha || 0),
      icon: CheckCircle,
      color: 'bg-green-500',
      status: 'completed'
    },
    {
      id: 'block-review',
      title: 'Block Review',
      subtitle: 'Block Officer',
      count: isLoading ? 0 : (stats?.reviewedAtBlock || 0),
      icon: Users,
      color: 'bg-purple-500',
      status: 'completed'
    },
    {
      id: 'district-review',
      title: 'District Review',
      subtitle: 'District Officer',
      count: isLoading ? 0 : (stats?.districtReview || 0),
      icon: Clock,
      color: 'bg-yellow-500',
      status: 'current'
    },
    {
      id: 'state-approval',
      title: 'State Final',
      subtitle: 'State Authority',
      count: 1089,
      icon: Send,
      color: 'bg-indigo-500',
      status: 'pending'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-[#5a1c2d]" />
          <h2 className="text-xl font-bold text-gray-800">
            Claim Verification Pipeline
          </h2>
        </div>
        <p className="text-gray-600 mt-1">
          Track claims through the verification process
        </p>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between">
          {pipelineStages.map((stage, index) => {
            const Icon = stage.icon;
            const isSelected = selectedStage === stage.id;

            return (
              <React.Fragment key={stage.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex-1 cursor-pointer ${
                    index < pipelineStages.length - 1 ? 'relative' : ''
                  }`}
                  onClick={() => onStageClick(stage.id)}
                >
                  <div className={`text-center p-4 rounded-lg transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#5a1c2d] text-white shadow-lg transform scale-105'
                      : stage.status === 'current'
                        ? 'bg-yellow-50 border-2 border-yellow-300 hover:bg-yellow-100'
                        : stage.status === 'completed'
                          ? 'bg-green-50 hover:bg-green-100'
                          : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                      isSelected ? 'bg-white/20' : stage.color
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        isSelected ? 'text-white' : 'text-white'
                      }`} />
                    </div>

                    <h3 className={`font-semibold text-sm mb-1 ${
                      isSelected ? 'text-white' : 'text-gray-800'
                    }`}>
                      {stage.title}
                    </h3>

                    <p className={`text-xs mb-2 ${
                      isSelected ? 'text-white/80' : 'text-gray-600'
                    }`}>
                      {stage.subtitle}
                    </p>

                    <div className={`text-2xl font-bold ${
                      isSelected ? 'text-white' : 'text-gray-900'
                    }`}>
                      {stage.count}
                    </div>

                    <div className={`text-xs mt-1 ${
                      isSelected ? 'text-white/80' :
                      stage.status === 'current' ? 'text-yellow-600' :
                      stage.status === 'completed' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {stage.status === 'current' ? 'In Progress' :
                       stage.status === 'completed' ? 'Completed' : 'Pending'}
                    </div>
                  </div>
                </motion.div>

                {index < pipelineStages.length - 1 && (
                  <div className="flex items-center px-2">
                    <ArrowRight className={`h-5 w-5 ${
                      selectedStage ? 'text-[#d4c5a9]' : 'text-[#044e2b]'
                    }`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-[#044e2b] mb-2">
            <span>Overall Progress</span>
            <span>87.3% Complete</span>
          </div>
          <div className="w-full bg-[#d4c5a9]/30 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '87.3%' }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-gradient-to-r from-[#044e2b] to-[#0a5a35] h-3 rounded-full"
            ></motion.div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#044e2b]">1,089</div>
            <div className="text-xs text-[#044e2b]/70">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#d4c5a9]">89</div>
            <div className="text-xs text-[#d4c5a9]/70">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#8b4513]">69</div>
            <div className="text-xs text-[#8b4513]/70">Rejected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#0a5a35]">12.5%</div>
            <div className="text-xs text-[#0a5a35]/70">This Month</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistrictOfficerClaimPipeline;
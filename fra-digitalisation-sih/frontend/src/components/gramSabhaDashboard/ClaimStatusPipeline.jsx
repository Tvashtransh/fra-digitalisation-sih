import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRightIcon, CheckCircleIcon, ClockIcon, EyeIcon, RefreshCwIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

const ClaimStatusPipeline = ({ onStatusFilter }) => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [draggedClaim, setDraggedClaim] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/gs/statistics', {
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

  const [statuses, setStatuses] = useState([
    {
      id: 'submitted',
      label: 'Submitted',
      count: 0,
      color: 'bg-blue-500',
      icon: EyeIcon,
      description: 'Claims submitted',
      claims: []
    },
    {
      id: 'verified',
      label: 'Verified',
      count: 0,
      color: 'bg-yellow-500',
      icon: ClockIcon,
      description: 'Under verification',
      claims: []
    },
    {
      id: 'forwarded',
      label: 'Forwarded',
      count: 0,
      color: 'bg-purple-500',
      icon: CheckCircleIcon,
      description: 'Forwarded for review',
      claims: []
    },
    {
      id: 'district_review',
      label: 'District Review',
      count: 0,
      color: 'bg-green-500',
      icon: CheckCircleIcon,
      description: 'Under district review',
      claims: []
    }
  ]);

  // Update statuses with real data
  useEffect(() => {
    if (stats) {
      setStatuses(prevStatuses => prevStatuses.map(status => {
        switch(status.id) {
          case 'submitted':
            return { ...status, count: stats.submitted || 0 };
          case 'verified':
            return { ...status, count: stats.verifiedByGramSabha || 0 };
          case 'forwarded':
            return { ...status, count: stats.reviewedAtBlock || 0 };
          case 'district_review':
            return { ...status, count: stats.districtReview || 0 };
          default:
            return status;
        }
      }));
    }
  }, [stats]);

  const handleStatusClick = (statusId) => {
    setSelectedStatus(statusId);
    onStatusFilter(statusId);
  };

  const handleDragStart = (e, claim, fromStatus) => {
    setDraggedClaim({ claim, fromStatus });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, toStatusId) => {
    e.preventDefault();

    if (!draggedClaim || draggedClaim.fromStatus === toStatusId) return;

    setIsUpdating(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    setStatuses(prevStatuses => {
      const newStatuses = [...prevStatuses];
      const fromIndex = newStatuses.findIndex(s => s.id === draggedClaim.fromStatus);
      const toIndex = newStatuses.findIndex(s => s.id === toStatusId);

      if (fromIndex !== -1 && toIndex !== -1) {
        // Remove from source
        const claimIndex = newStatuses[fromIndex].claims.findIndex(c => c.id === draggedClaim.claim.id);
        if (claimIndex !== -1) {
          const [movedClaim] = newStatuses[fromIndex].claims.splice(claimIndex, 1);
          // Add to destination
          newStatuses[toIndex].claims.push(movedClaim);

          // Update counts
          newStatuses[fromIndex].count = newStatuses[fromIndex].claims.length;
          newStatuses[toIndex].count = newStatuses[toIndex].claims.length;
        }
      }

      return newStatuses;
    });

    setDraggedClaim(null);
    setIsUpdating(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const pipelineVariants = {
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

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <motion.div
      variants={pipelineVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Claim Status Pipeline
        </h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Drag claims between stages
          </div>
          {isUpdating && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCwIcon className="h-4 w-4 text-blue-500" />
            </motion.div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {statuses.map((status, index) => {
          const Icon = status.icon;
          const isSelected = selectedStatus === status.id;

          return (
            <motion.div
              key={status.id}
              variants={itemVariants}
              className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              } ${isUpdating ? 'opacity-50' : ''}`}
              onClick={() => handleStatusClick(status.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status.id)}
            >
              {/* Status Header */}
              <div className="flex items-center justify-between mb-3">
                <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-blue-500 rounded-full"
                  />
                )}
              </div>

              {/* Icon */}
              <div className={`inline-flex p-2 rounded-lg mb-3 ${
                isSelected ? 'bg-blue-100 dark:bg-blue-800' : 'bg-white dark:bg-gray-700'
              }`}>
                <Icon className={`h-6 w-6 ${
                  isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                }`} />
              </div>

              {/* Content */}
              <div className="text-left mb-4">
                <h3 className={`font-semibold text-lg ${
                  isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                }`}>
                  {status.count}
                </h3>
                <p className={`text-sm font-medium ${
                  isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {status.label}
                </p>
                <p className={`text-xs mt-1 ${
                  isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {status.description}
                </p>
              </div>

              {/* Claims List */}
              <div className="space-y-2 max-h-32 overflow-y-auto">
                <AnimatePresence>
                  {status.claims.map((claim) => (
                    <motion.div
                      key={claim.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, claim, status.id)}
                      className={`p-2 bg-white dark:bg-gray-700 rounded border-l-4 cursor-move hover:shadow-sm transition-shadow ${getPriorityColor(claim.priority)}`}
                    >
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                        {claim.title}
                      </p>
                      <div className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                        claim.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                        claim.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      }`}>
                        {claim.priority}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(status.count / 1247) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-1 rounded-full ${status.color}`}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pipeline Flow Indicator */}
      <div className="mt-6 flex items-center justify-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Submitted</span>
        </div>
        <ArrowRightIcon className="h-4 w-4 text-gray-400" />
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Verified</span>
        </div>
        <ArrowRightIcon className="h-4 w-4 text-gray-400" />
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Forwarded</span>
        </div>
        <ArrowRightIcon className="h-4 w-4 text-gray-400" />
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">District Review</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ClaimStatusPipeline;
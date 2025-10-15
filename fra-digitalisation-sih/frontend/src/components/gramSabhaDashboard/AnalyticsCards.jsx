import { motion } from 'framer-motion';
import {
    Activity,
    Award,
    Calendar,
    CheckCircle,
    FileText,
    MapPin,
    RefreshCw,
    Target,
    TrendingUp,
    Users,
    XCircle,
    Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

const AnalyticsCards = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
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

  // Real-time data updates
  const [cards, setCards] = useState([
    {
      title: 'Submitted',
      value: '0',
      change: '+12%',
      changeType: 'positive',
      icon: FileText,
      color: 'bg-blue-500',
      description: 'Claims submitted by applicants',
      trend: [0, 0, 0, 0, 0, 0],
      target: 100,
      unit: 'claims'
    },
    {
      title: 'Verified by Gram Sabha',
      value: '0',
      change: '+8%',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'bg-green-500',
      description: 'Verified at Gram Sabha level',
      trend: [0, 0, 0, 0, 0, 0],
      target: 80,
      unit: 'claims'
    },
    {
      title: 'Reviewed at Block',
      value: '0',
      change: '+15%',
      changeType: 'positive',
      icon: Award,
      color: 'bg-purple-500',
      description: 'Currently under block review',
      trend: [0, 0, 0, 0, 0, 0],
      target: 60,
      unit: 'claims'
    },
    {
      title: 'District Review',
      value: '0',
      change: '+2%',
      changeType: 'neutral',
      icon: XCircle,
      color: 'bg-orange-500',
      description: 'Pending district level review',
      trend: [0, 0, 0, 0, 0, 0],
      target: 40,
      unit: 'claims'
    },
    {
      title: 'Final Approval',
      value: '0',
      change: '+5%',
      changeType: 'positive',
      icon: Award,
      color: 'bg-emerald-500',
      description: 'Final approval granted',
      trend: [0, 0, 0, 0, 0, 0],
      target: 30,
      unit: 'claims'
    },
    {
      title: 'Villages Covered',
      value: '47',
      change: '+3',
      changeType: 'positive',
      icon: MapPin,
      color: 'bg-indigo-500',
      description: 'Active villages in jurisdiction',
      trend: [44, 43, 45, 46, 46, 47],
      target: 50,
      unit: 'villages'
    },
    {
      title: 'Active Users',
      value: '3,421',
      change: '+15%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-cyan-500',
      description: 'Registered community members',
      trend: [3200, 3100, 3300, 3250, 3350, 3421],
      target: 4000,
      unit: 'users'
    },
    {
      title: 'Processing Time',
      value: '4.2 days',
      change: '-0.8',
      changeType: 'positive',
      icon: Activity,
      color: 'bg-teal-500',
      description: 'Average claim processing time',
      trend: [4.8, 4.6, 4.4, 4.3, 4.1, 4.2],
      target: 3.5,
      unit: 'days'
    },
    {
      title: 'Next Meeting',
      value: 'Tomorrow',
      change: '2:00 PM',
      changeType: 'neutral',
      icon: Calendar,
      color: 'bg-orange-500',
      description: 'Scheduled Gram Sabha meeting',
      trend: null,
      target: null,
      unit: 'scheduled'
    },
    {
      title: 'Success Rate',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'positive',
      icon: Target,
      color: 'bg-emerald-500',
      description: 'Overall claim approval rate',
      trend: [92.1, 91.8, 93.2, 93.8, 94.0, 94.2],
      target: 95,
      unit: 'percentage'
    },
    {
      title: 'Digital Adoption',
      value: '78.5%',
      change: '+5.2%',
      changeType: 'positive',
      icon: Zap,
      color: 'bg-violet-500',
      description: 'Online claim submission rate',
      trend: [73.3, 74.1, 75.2, 76.8, 77.9, 78.5],
      target: 85,
      unit: 'percentage'
    },
    {
      title: 'Monthly Growth',
      value: '+23.4%',
      change: '+3.1%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-rose-500',
      description: 'Month-over-month growth',
      trend: [20.3, 21.1, 22.2, 22.8, 23.1, 23.4],
      target: 25,
      unit: 'growth'
    },
    {
      title: 'System Uptime',
      value: '99.9%',
      change: '0.0%',
      changeType: 'neutral',
      icon: Activity,
      color: 'bg-slate-500',
      description: 'Platform availability',
      trend: [99.9, 99.9, 99.9, 99.9, 99.9, 99.9],
      target: 99.9,
      unit: 'uptime'
    }
  ]);

  // Update cards with real statistics
  useEffect(() => {
    if (stats) {
      setCards(prevCards => prevCards.map(card => {
        switch(card.title) {
          case 'Submitted':
            return { ...card, value: stats.submitted.toString() };
          case 'Verified by Gram Sabha':
            return { ...card, value: stats.verifiedByGramSabha.toString() };
          case 'Reviewed at Block':
            return { ...card, value: stats.reviewedAtBlock.toString() };
          case 'District Review':
            return { ...card, value: stats.districtReview.toString() };
          case 'Final Approval':
            return { ...card, value: stats.finalApproval.toString() };
          default:
            return card;
        }
      }));
    }
  }, [stats]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCards(prevCards => prevCards.map(card => {
        if (card.title === 'Active Users') {
          const newValue = Math.floor(parseInt(card.value.replace(',', '')) + Math.random() * 10 - 5);
          return {
            ...card,
            value: newValue.toLocaleString(),
            lastUpdated: new Date()
          };
        }
        return card;
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
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
      console.error('Error refreshing statistics:', error);
    }

    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  const getChangeColor = (type) => {
    switch (type) {
      case 'positive':
        return 'text-green-600 dark:text-green-400';
      case 'negative':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getProgressPercentage = (current, target) => {
    if (!target) return 0;
    const currentNum = parseFloat(current.replace(/[,%]/g, ''));
    return Math.min((currentNum / target) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Key Performance Indicators
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const progressPercent = getProgressPercentage(card.value, card.target);

          return (
            <motion.div
              key={card.title}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.color} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                {card.target && (
                  <div className="text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Target: {card.target}
                    </div>
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {progressPercent.toFixed(0)}%
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {card.value}
                </p>

                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${getChangeColor(card.changeType)}`}>
                    {card.change}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    vs last period
                  </span>
                </div>

                {/* Progress Bar for targets */}
                {card.target && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-2 rounded-full ${card.color}`}
                      />
                    </div>
                  </div>
                )}

                {/* Mini trend chart */}
                {/* {card.trend && (
                  <div className="mt-3 flex items-end space-x-1 h-8">
                    {card.trend.slice(-6).map((value, i) => {
                      const height = (value / Math.max(...card.trend)) * 100;
                      return (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                          className={`flex-1 ${card.color} opacity-60 rounded-sm`}
                          style={{ minHeight: '2px' }}
                        />
                      );
                    })}
                  </div>
                )} */}

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {card.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {cards.filter(c => c.changeType === 'positive').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Improving Metrics
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {cards.filter(c => c.target && getProgressPercentage(c.value, c.target) >= 80).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              On Track to Target
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {((cards.filter(c => c.changeType === 'positive').length / cards.length) * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Positive Trend
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {lastUpdated.toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Last Updated
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsCards;
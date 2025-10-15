import { motion } from 'framer-motion';
import { CheckCircle, Clock, FileText, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const BlockOfficerAnalyticsCards = () => {
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

  const analyticsData = [
    {
      title: 'Submitted',
      value: isLoading ? '...' : (stats?.submitted || 0).toString(),
      icon: FileText,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Verified by Gram Sabha',
      value: isLoading ? '...' : (stats?.verifiedByGramSabha || 0).toString(),
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Reviewed at Block',
      value: isLoading ? '...' : (stats?.reviewedAtBlock || 0).toString(),
      icon: Clock,
      color: 'bg-yellow-500',
      change: '+5%',
      changeType: 'neutral'
    },
    {
      title: 'District Review',
      value: isLoading ? '...' : (stats?.districtReview || 0).toString(),
      icon: XCircle,
      color: 'bg-orange-500',
      change: '+3%',
      changeType: 'positive'
    },
    {
      title: 'Final Approval',
      value: isLoading ? '...' : (stats?.finalApproval || 0).toString(),
      icon: CheckCircle,
      color: 'bg-emerald-500',
      change: '+18%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {analyticsData.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      card.changeType === 'positive' ? 'text-green-600' :
                      card.changeType === 'negative' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {card.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default BlockOfficerAnalyticsCards;
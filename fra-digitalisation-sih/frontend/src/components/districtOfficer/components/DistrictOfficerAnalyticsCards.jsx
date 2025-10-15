import { motion } from 'framer-motion';
import {
    CheckCircle,
    Clock,
    FileText,
    XCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';

const DistrictOfficerAnalyticsCards = () => {
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real claims data
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/district/claims', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setClaims(data.claims || []);
          }
        }
      } catch (error) {
        console.error('Error fetching claims:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClaims();
  }, []);

  // Calculate real analytics from claims data
  const totalClaims = claims.length;
  const pendingReview = claims.filter(claim => 
    claim.status === 'forwarded_to_district' || claim.status === 'UnderDistrictReview'
  ).length;
  const approved = claims.filter(claim => claim.status === 'Title Granted').length;
  const rejected = claims.filter(claim => claim.status === 'FinalRejected').length;

  const analyticsData = [
    {
      id: 'total-claims',
      title: 'Total Claims',
      value: isLoading ? '...' : totalClaims.toString(),
      change: '+12.5%',
      trend: 'up',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      id: 'pending-review',
      title: 'Pending Review',
      value: isLoading ? '...' : pendingReview.toString(),
      change: '-8.2%',
      trend: 'down',
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      id: 'approved-forwarded',
      title: 'Title Granted',
      value: isLoading ? '...' : approved.toString(),
      change: '+15.3%',
      trend: 'up',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      id: 'rejected-sent-back',
      title: 'Rejected Claims',
      value: isLoading ? '...' : rejected.toString(),
      change: '+3.1%',
      trend: 'up',
      icon: XCircle,
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {analyticsData.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.id}
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
                      card.trend === 'up' ? 'text-green-600' : 'text-red-600'
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

export default DistrictOfficerAnalyticsCards;
import { motion } from 'framer-motion';
import {
    FileText,
    Filter,
    Upload
} from 'lucide-react';
import { useState, useEffect } from 'react';
import DistrictOfficerClaimsTable from '../components/DistrictOfficerClaimsTable';

const ClaimManagement = () => {
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

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

  // Calculate real statistics
  const totalClaims = claims.length;
  const pendingReview = claims.filter(claim => 
    claim.status === 'forwarded_to_district' || claim.status === 'UnderDistrictReview'
  ).length;
  const approved = claims.filter(claim => claim.status === 'Title Granted').length;
  const rejected = claims.filter(claim => claim.status === 'FinalRejected').length;

  const claimStats = [
    { label: 'Total Claims', value: isLoading ? '...' : totalClaims.toString(), color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending Review', value: isLoading ? '...' : pendingReview.toString(), color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Title Granted', value: isLoading ? '...' : approved.toString(), color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Rejected', value: isLoading ? '...' : rejected.toString(), color: 'text-red-600', bg: 'bg-red-100' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Claim Management</h1>
            <p className="text-gray-600 mt-1">Manage and review all claims at district level</p>
          </div>

          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-[#5a1c2d] text-white rounded-lg hover:bg-[#4a1825] transition-colors">
              <Upload className="h-4 w-4" />
              <span>Export Data</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-[#5a1c2d] text-[#5a1c2d] rounded-lg hover:bg-[#5a1c2d] hover:text-white transition-colors">
              <Filter className="h-4 w-4" />
              <span>Advanced Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {claimStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <FileText className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Claims Table */}
      <DistrictOfficerClaimsTable 
        statusFilter={statusFilter}
        onStatusFilter={setStatusFilter}
      />
    </div>
  );
};

export default ClaimManagement;
import { useState } from 'react';
import DistrictOfficerAnalyticsCards from '../components/DistrictOfficerAnalyticsCards';
import DistrictOfficerAnalyticsCharts from '../components/DistrictOfficerAnalyticsCharts';
import DistrictOfficerClaimPipeline from '../components/DistrictOfficerClaimPipeline';
import DistrictOfficerClaimsTable from '../components/DistrictOfficerClaimsTable';
import DistrictOfficerGISMap from '../components/DistrictOfficerGISMap';
import DistrictOfficerQuickActions from '../components/DistrictOfficerQuickActions';

const Dashboard = ({ onPageChange }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPipelineStage, setSelectedPipelineStage] = useState(null);

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handlePipelineStageClick = (stage) => {
    setSelectedPipelineStage(stage);
    // Filter claims based on the selected stage
    setStatusFilter(stage);
  };

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <DistrictOfficerAnalyticsCards />

      {/* Claim Verification Pipeline */}
      <DistrictOfficerClaimPipeline
        onStageClick={handlePipelineStageClick}
        selectedStage={selectedPipelineStage}
      />

      {/* Quick Action Tiles */}
      <DistrictOfficerQuickActions onPageChange={onPageChange} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Claims Table */}
        <div className="xl:col-span-2">
          <DistrictOfficerClaimsTable
            statusFilter={statusFilter}
            onStatusFilter={handleStatusFilter}
          />
        </div>

        {/* GIS Mini Map */}
        <div className="xl:col-span-1">
          <DistrictOfficerGISMap />
        </div>
      </div>

      {/* Analytics & Insights */}
      <DistrictOfficerAnalyticsCharts />
    </div>
  );
};

export default Dashboard;
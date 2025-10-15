import React, { useState } from 'react';
import GramSabhaMapView from './gramSabhaDashboard/components/GramSabhaMapView';
import ReviewMapView from './ReviewMapView';

/**
 * Example component showing how to integrate the role-based mapping components
 * This demonstrates how to use the components in different user dashboards
 */
const MapIntegrationExample = () => {
  const [userRole, setUserRole] = useState('gram_sabha'); // 'gram_sabha', 'block_officer', 'district_officer'

  const handleClaimSubmit = (claim) => {
    console.log('New claim submitted:', claim);
    // Handle claim submission logic here
    // e.g., refresh claims list, show success message, etc.
  };

  const handleClaimClick = (claimData) => {
    console.log('Claim clicked:', claimData);
    // Handle claim click logic here
    // e.g., open claim details modal, navigate to claim page, etc.
  };

  const renderMapComponent = () => {
    switch (userRole) {
      case 'gram_sabha':
        return (
          <GramSabhaMapView 
            onClaimSubmit={handleClaimSubmit}
          />
        );
      
      case 'block_officer':
        return (
          <ReviewMapView 
            level="block"
            onClaimClick={handleClaimClick}
          />
        );
      
      case 'district_officer':
        return (
          <ReviewMapView 
            level="district"
            onClaimClick={handleClaimClick}
          />
        );
      
      default:
        return <div>Invalid user role</div>;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          FRA Claims Management - Role-Based Mapping
        </h1>
        
        {/* Role Selector for Demo */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Demo Role Selector:</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => setUserRole('gram_sabha')}
              className={`px-3 py-1 rounded text-sm ${
                userRole === 'gram_sabha' 
                  ? 'bg-[#044e2b] text-white' 
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Gram Sabha Officer
            </button>
            <button
              onClick={() => setUserRole('block_officer')}
              className={`px-3 py-1 rounded text-sm ${
                userRole === 'block_officer' 
                  ? 'bg-[#044e2b] text-white' 
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Block Officer
            </button>
            <button
              onClick={() => setUserRole('district_officer')}
              className={`px-3 py-1 rounded text-sm ${
                userRole === 'district_officer' 
                  ? 'bg-[#044e2b] text-white' 
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              District Officer
            </button>
          </div>
        </div>
      </div>

      {/* Render the appropriate map component based on user role */}
      {renderMapComponent()}
    </div>
  );
};

export default MapIntegrationExample;

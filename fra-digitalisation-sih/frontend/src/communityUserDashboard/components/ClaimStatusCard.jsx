import { ClockIcon, ExclamationTriangleIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';

const steps = [
  {
    id: 1,
    name: 'Application',
    description: 'Initial application submitted',
    status: 'Submitted',
    estimatedDays: 1
  },
  {
    id: 2,
    name: 'Gram Sabha',
    description: 'Verification by Gram Sabha officer',
    status: 'MappedByGramSabha',
    estimatedDays: 15
  },
  {
    id: 3,
    name: 'Subdivision Review',
    description: 'Forwarded to subdivision officer',
    status: 'ForwardedToDistrict',
    estimatedDays: 30
  },
  {
    id: 4,
    name: 'District Review',
    description: 'Under district officer review',
    status: 'UnderDistrictReview',
    estimatedDays: 45
  },
  {
    id: 5,
    name: 'Title Granted',
    description: 'Forest rights title approved and granted',
    status: 'FinalApproved',
    estimatedDays: 60
  },
];

export default function ClaimStatusCard({ claimId, claim, onRefresh }) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Debug logging
  console.log('🎯 ClaimStatusCard rendered with:', {
    claimId,
    claim: claim ? {
      id: claim._id,
      frapattaid: claim.frapattaid,
      status: claim.status,
      createdAt: claim.createdAt
    } : null
  });

  const refreshStatus = async () => {
    setIsLoading(true);
    if (onRefresh) {
      await onRefresh();
    }
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const getStepStatus = (step) => {
    if (!claim) return 'pending';
    
    const currentStatus = claim.status;
    const stepStatus = step.status;
    
    // Handle final rejected status
    if (currentStatus === 'FinalRejected') {
      // Show error for the final step if rejected
      if (step.id === 5) {
        return 'error';
      }
      // Show completed for all previous steps
      if (step.id < 5) {
        return 'completed';
      }
      return 'pending';
    }
    
    // Handle Final Approved status - show all steps as completed
    if (currentStatus === 'FinalApproved') {
      return 'completed';
    }
    
    // Check if this step is completed (exact match)
    if (currentStatus === stepStatus) {
      return 'completed';
    }
    
    // Check if this step is in progress (next step after current status)
    const currentStepIndex = steps.findIndex(s => s.status === currentStatus);
    const stepIndex = steps.findIndex(s => s.status === stepStatus);
    
    // If we found the current status, check for next step
    if (currentStepIndex >= 0) {
      if (stepIndex === currentStepIndex + 1) {
        return 'in-progress';
      }
      
      // Check if this step is completed (before current status)
      if (stepIndex < currentStepIndex) {
        return 'completed';
      }
    }
    
    return 'pending';
  };

  const getCurrentStepIndex = () => {
    if (!claim) return 0;
    return steps.findIndex(step => step.status === claim.status);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleSolidIcon className="h-6 w-6 text-green-500" />;
      case 'in-progress':
        return <LightBulbIcon className="h-6 w-6 text-numbering animate-pulse" />;
      case 'pending':
        return <div className="h-6 w-6 rounded-full border-2 border-gray-300" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-6 w-6 text-red-500 dark:text-red-400" />;
      default:
        return <div className="h-6 w-6 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'in-progress':
        return 'text-numbering';
      case 'pending':
        return 'text-gray-400 dark:text-gray-500';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-400 dark:text-gray-500';
    }
  };

  const getProgressPercentage = () => {
    if (!claim) return 0;
    const currentStepIndex = getCurrentStepIndex();
    return ((currentStepIndex + 1) / steps.length) * 100;
  };

  if (!claim) {
    return (
      <div className="card">
        <div className="section-heading mb-4 -mx-6 -mt-6">
          <h2 className="text-lg font-semibold">Claim Status Tracker</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">No claim selected</p>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Select a claim to view its status</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="section-heading mb-4 -mx-6 -mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Claim Status Tracker</h2>
          <button
            onClick={refreshStatus}
            disabled={isLoading}
            className="text-sm text-[#046353] hover:text-[#046353] disabled:opacity-50 flex items-center gap-1"
          >
            <ClockIcon className="h-4 w-4" />
            {isLoading ? 'Updating...' : 'Refresh'}
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Claim ID: {claim.frapattaid}</p>
      </div>

      <div className="space-y-4">
        {steps.map((step) => {
          const status = getStepStatus(step);
          return (
            <div key={step.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className={`step-number mr-2 ${getStatusColor(status)}`}>{step.id}.</p>
                    <p className={`text-sm font-medium ${status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                      {step.name}
                    </p>
                  </div>
                  {status === 'in-progress' && (
                    <span className="text-xs bg-numbering/10 text-numbering px-2 py-1 rounded-full">
                      In Progress
                    </span>
                  )}
                  {status === 'error' && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      Rejected
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Est. {step.estimatedDays} days • {status === 'completed' ? 'Completed' : status === 'in-progress' ? 'Processing' : status === 'error' ? 'Rejected' : 'Pending'}
                </p>
              </div>
            </div>
          );
        })}

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm text-gray-500">{Math.round(getProgressPercentage())}% Complete</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {/* Status Summary */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Last Updated:</span>
            <span className="font-medium">{new Date(claim.updatedAt || claim.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-600">Current Stage:</span>
            <span className="font-medium text-numbering">
              {steps.find(s => s.status === claim.status)?.name || claim.status.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-600">Status:</span>
            <span className={`font-medium ${
              claim.status === 'Submitted' ? 'text-yellow-600' :
              claim.status === 'MappedByGramSabha' ? 'text-blue-600' :
              claim.status === 'forwarded_to_district' ? 'text-purple-600' :
              claim.status === 'UnderDistrictReview' ? 'text-orange-600' :
              claim.status === 'Title Granted' ? 'text-green-600' :
              claim.status === 'FinalRejected' ? 'text-red-600' :
              claim.status === 'RecommendedByGramSabha' ? 'text-blue-600' :
              claim.status === 'ApprovedBySDLC' ? 'text-green-600' :
              claim.status === 'ApprovedByDLC' ? 'text-green-600' :
              claim.status === 'Rejected' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {claim.status === 'Title Granted' ? 'Title Granted' :
               claim.status === 'FinalRejected' ? 'Rejected' :
               claim.status === 'forwarded_to_district' ? 'Under Review' :
               claim.status === 'UnderDistrictReview' ? 'District Review' :
               claim.status === 'MappedByGramSabha' ? 'GS Verified' :
               claim.status.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </div>
          {claim.remarks && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <span className="text-gray-600 text-sm">Remarks:</span>
              <p className="text-sm text-gray-700 mt-1">{claim.remarks}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
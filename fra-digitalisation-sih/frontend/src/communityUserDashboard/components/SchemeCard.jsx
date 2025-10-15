import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  PaperClipIcon,
  UserGroupIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, ExclamationTriangleIcon as ExclamationIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

const schemes = [
  {
    id: 1,
    name: 'PM-KISAN',
    description: 'Income support for farmers through direct benefit transfers',
    category: 'Agriculture',
    eligibility: true,
    benefits: [
      'Rs. 6000 per year direct benefit transfer in 3 installments',
      'Agricultural support services and advisory',
      'Crop insurance coverage up to Rs. 2 lakh',
      'Access to modern farming techniques and equipment'
    ],
    requirements: [
      'Land ownership document or lease agreement',
      'Aadhaar card linked with bank account',
      'Bank account in farmer\'s name',
      'Recent passport size photograph'
    ],
    applicationForm: {
      fields: ['landSize', 'cropType', 'bankDetails', 'documents']
    },
    applicationSteps: [
      'Verify Aadhaar and bank account linkage',
      'Submit land ownership documents',
      'Complete online application form',
      'Upload required documents',
      'Wait for verification and approval'
    ],
    processingTime: '15-30 days',
    contactInfo: 'PM-KISAN Helpline: 155261'
  },
  {
    id: 2,
    name: 'MGNREGA',
    description: 'Guaranteed wage employment for rural households',
    category: 'Livelihood',
    eligibility: true,
    benefits: [
      'Guaranteed 100 days of employment per household',
      'Minimum wage of Rs. 207 per day',
      'Skill development and training programs',
      'Works related to water conservation, drought relief'
    ],
    requirements: [
      'Job card issued by local Gram Panchayat',
      'Bank/Post office account in applicant\'s name',
      'Residence proof of rural area',
      'Age proof and family details'
    ],
    applicationForm: {
      fields: ['jobCardNumber', 'bankDetails', 'skills', 'documents']
    },
    applicationSteps: [
      'Obtain job card from Gram Panchayat',
      'Register demand for work',
      'Complete work allocation process',
      'Attend work as per schedule',
      'Receive wage payments'
    ],
    processingTime: '7-15 days',
    contactInfo: 'MGNREGA Helpline: 1800110707'
  },
  {
    id: 3,
    name: 'Jal Jeevan Mission',
    description: 'Providing clean drinking water to every rural household',
    category: 'Infrastructure',
    eligibility: false,
    benefits: [
      'Functional household tap water connection',
      'Clean drinking water supply',
      'Water quality monitoring and testing',
      'Community participation in water management'
    ],
    requirements: [
      'Village residence proof',
      'Community approval for water connection',
      'Land details and house ownership',
      'Water usage agreement'
    ],
    applicationForm: {
      fields: ['householdSize', 'currentWaterSource', 'landDetails', 'documents']
    },
    applicationSteps: [
      'Check village water coverage status',
      'Register with local water committee',
      'Submit household details and documents',
      'Participate in community meetings',
      'Wait for pipeline connection'
    ],
    processingTime: '30-90 days',
    contactInfo: 'Jal Jeevan Mission: Local Panchayat'
  },
  {
    id: 4,
    name: 'Pradhan Mantri Awas Yojana',
    description: 'Rural housing scheme for homeless and inadequately housed',
    category: 'Infrastructure',
    eligibility: true,
    benefits: [
      'Financial assistance up to Rs. 1.20 lakh',
      'Technical support and architectural guidance',
      'Material assistance and quality monitoring',
      'Subsidy for construction of pucca house'
    ],
    requirements: [
      'BPL certificate or income certificate',
      'Land ownership or patta document',
      'Construction plan approved by engineer',
      'Aadhaar card and bank account details'
    ],
    applicationForm: {
      fields: ['bplNumber', 'landDetails', 'housePlan', 'documents']
    },
    applicationSteps: [
      'Verify BPL/SECC status',
      'Submit land ownership documents',
      'Prepare house construction plan',
      'Apply through online portal or Gram Panchayat',
      'Wait for subsidy disbursement'
    ],
    processingTime: '45-60 days',
    contactInfo: 'PMAY Helpline: 1800116446'
  },
  {
    id: 5,
    name: 'National Rural Livelihood Mission',
    description: 'Promoting self-employment and skill development',
    category: 'Livelihood',
    eligibility: true,
    benefits: [
      'Skill training programs free of cost',
      'Financial assistance for self-employment',
      'Marketing support and linkages',
      'Capacity building and entrepreneurship development'
    ],
    requirements: [
      'SHG membership or willingness to join',
      'Skill interest form submission',
      'Project proposal for self-employment',
      'Basic education and age criteria'
    ],
    applicationForm: {
      fields: ['shgDetails', 'skillInterest', 'projectProposal', 'documents']
    },
    applicationSteps: [
      'Join or form Self Help Group (SHG)',
      'Identify skill training needs',
      'Prepare project proposal',
      'Apply for training and financial assistance',
      'Receive training and start business'
    ],
    processingTime: '20-40 days',
    contactInfo: 'NRLM Helpline: Local Block Office'
  }
];

export default function SchemeCard({ onApply, appliedSchemes = [] }) {
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [showDetails, setShowDetails] = useState({});
  const [showApplicationGuide, setShowApplicationGuide] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleApply = (scheme) => {
    if (scheme.eligibility) {
      setSelectedScheme(scheme);
      setShowApplicationGuide(true);
      setCurrentStep(0);
    }
  };

  const handleProceedToApplication = () => {
    setShowApplicationGuide(false);
    if (onApply) {
      onApply(selectedScheme);
    }
  };

  const toggleDetails = (schemeId) => {
    setShowDetails(prev => ({
      ...prev,
      [schemeId]: !prev[schemeId]
    }));
  };

  const isApplied = (schemeId) => {
    return appliedSchemes.some(app => app.schemeId === schemeId);
  };

  const getEligibilityStatus = (scheme) => {
    if (isApplied(scheme.id)) return 'applied';
    if (scheme.eligibility) return 'eligible';
    return 'not-eligible';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied': return 'bg-green-100 text-green-800 border-green-200';
      case 'eligible': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'not-eligible': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'applied': return 'Already Applied';
      case 'eligible': return 'Apply Now';
      case 'not-eligible': return 'Not Eligible';
      default: return 'Check Eligibility';
    }
  };

  return (
    <>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {schemes.map((scheme) => {
          const status = getEligibilityStatus(scheme);
          return (
            <div key={scheme.id} className="card relative overflow-hidden">
              {/* Status Ribbon */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${status === 'applied' ? 'bg-green-500' : status === 'eligible' ? 'bg-blue-500' : 'bg-gray-400'}`}></div>

              {/* Eligibility Badge */}
              <div className="absolute top-4 right-4 flex items-center">
                {status === 'applied' ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                ) : status === 'eligible' ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                ) : (
                  <ExclamationIcon className="h-6 w-6 text-red-500" />
                )}
              </div>

              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-bg-1 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {scheme.category}
                </span>
              </div>

              {/* Scheme Title */}
              <h3 className="text-xl font-semibold text-bg-heading mb-2 mt-12">
                {scheme.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {scheme.description}
              </p>

              {/* Key Benefits Preview */}
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2 flex items-center">
                  <CurrencyRupeeIcon className="h-4 w-4 mr-1 text-green-600" />
                  Key Benefits:
                </h4>
                <ul className="text-sm space-y-1">
                  {scheme.benefits.slice(0, showDetails[scheme.id] ? undefined : 2).map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                  {scheme.benefits.length > 2 && !showDetails[scheme.id] && (
                    <li className="text-sm text-blue-600 font-medium">
                      +{scheme.benefits.length - 2} more benefits
                    </li>
                  )}
                </ul>
              </div>

              {/* Requirements */}
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2 flex items-center">
                  <DocumentTextIcon className="h-4 w-4 mr-1 text-blue-600" />
                  Requirements:
                </h4>
                <ul className="text-sm space-y-1">
                  {scheme.requirements.slice(0, showDetails[scheme.id] ? undefined : 2).map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                  {scheme.requirements.length > 2 && !showDetails[scheme.id] && (
                    <li className="text-sm text-blue-600 font-medium">
                      +{scheme.requirements.length - 2} more requirements
                    </li>
                  )}
                </ul>
              </div>

              {/* Processing Info */}
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-gray-600">Processing: {scheme.processingTime}</span>
                  </div>
                  <div className="flex items-center">
                    <InformationCircleIcon className="h-4 w-4 mr-1 text-blue-500" />
                    <span className="text-blue-600 text-xs">Help Available</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => toggleDetails(scheme.id)}
                  className="text-sm text-bg-heading hover:text-bg-1 transition-colors w-full text-left flex items-center"
                >
                  <InformationCircleIcon className="h-4 w-4 mr-1" />
                  {showDetails[scheme.id] ? 'Show Less' : 'Show More Details'}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApply(scheme)}
                    disabled={status === 'applied' || status === 'not-eligible'}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      status === 'applied'
                        ? 'bg-green-100 text-green-800 cursor-not-allowed border border-green-200'
                        : status === 'eligible'
                          ? 'btn-primary hover:opacity-90 shadow-md hover:shadow-lg'
                          : 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200'
                    }`}
                  >
                    {status === 'applied' ? (
                      <>
                        <CheckIcon className="h-4 w-4" />
                        Applied
                      </>
                    ) : status === 'eligible' ? (
                      <>
                        Apply Now
                        <ArrowRightIcon className="h-4 w-4" />
                      </>
                    ) : (
                      'Not Eligible'
                    )}
                  </button>

                  {status === 'eligible' && (
                    <button
                      onClick={() => {
                        setSelectedScheme(scheme);
                        setShowApplicationGuide(true);
                        setCurrentStep(0);
                      }}
                      className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      title="How to Apply"
                    >
                      <InformationCircleIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Application Guide Modal */}
      {showApplicationGuide && selectedScheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-fra-font">How to Apply for {selectedScheme.name}</h2>
                  <p className="text-gray-600 mt-1">Step-by-step application guide</p>
                </div>
                <button
                  onClick={() => setShowApplicationGuide(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Scheme Overview */}
              <div className="bg-gradient-to-r from-bg-1 to-bg-heading p-4 rounded-lg text-white mb-6">
                <h3 className="font-semibold mb-2">{selectedScheme.name}</h3>
                <p className="text-sm opacity-90">{selectedScheme.description}</p>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <span className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    Processing: {selectedScheme.processingTime}
                  </span>
                  <span className="flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-1" />
                    {selectedScheme.contactInfo}
                  </span>
                </div>
              </div>

              {/* Application Steps */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-fra-font mb-4">Application Process</h3>
                <div className="space-y-3">
                  {selectedScheme.applicationSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index <= currentStep ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {index < currentStep ? (
                          <CheckIcon className="h-4 w-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${index <= currentStep ? 'text-gray-900' : 'text-gray-600'}`}>
                          {step}
                        </p>
                      </div>
                      {index === currentStep && (
                        <ArrowRightIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Documents */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-fra-font mb-4 flex items-center">
                  <PaperClipIcon className="h-5 w-5 mr-2" />
                  Required Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedScheme.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <DocumentTextIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                  <InformationCircleIcon className="h-5 w-5 mr-2" />
                  Important Notes
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• All documents must be clear and legible</li>
                  <li>• Keep copies of all submitted documents</li>
                  <li>• Application status can be tracked online</li>
                  <li>• Processing time may vary based on verification</li>
                  <li>• Contact helpline for any assistance</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleProceedToApplication}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <DocumentTextIcon className="h-5 w-5" />
                  Proceed to Application
                </button>
                <button
                  onClick={() => setShowApplicationGuide(false)}
                  className="btn-secondary flex-1"
                >
                  Close Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
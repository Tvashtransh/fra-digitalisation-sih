import {
    CheckCircleIcon,
    ClockIcon,
    DocumentTextIcon,
    InformationCircleIcon,
    PaperClipIcon,
    UserGroupIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import SchemeCard from '../components/SchemeCard';

export default function Schemes() {
  const [filters, setFilters] = useState({
    category: 'All Categories',
    eligibility: 'All Eligibility'
  });
  const [appliedSchemes, setAppliedSchemes] = useState([
    { id: 1, schemeId: 1, schemeName: 'PM-KISAN', status: 'Under Review', appliedDate: '2024-01-15' }
  ]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationForm, setApplicationForm] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleApply = (scheme) => {
    setSelectedScheme(scheme);
    setApplicationForm({});
    setShowApplicationModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newApplication = {
        id: appliedSchemes.length + 1,
        schemeId: selectedScheme.id,
        schemeName: selectedScheme.name,
        status: 'Submitted',
        appliedDate: new Date().toISOString().split('T')[0]
      };

      setAppliedSchemes(prev => [...prev, newApplication]);
      setShowApplicationModal(false);
      setMessage({ type: 'success', text: `Successfully applied for ${selectedScheme.name}!` });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to submit application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      case 'Under Review': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900';
      case 'Submitted': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900';
      case 'Rejected': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Success/Error Messages */}
      {message.text && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Page Header */}
      <div className="bg-bg-1 px-4 sm:px-6 py-6 sm:py-8 rounded-b-lg shadow-md mb-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Government Schemes
          </h1>
          <p className="text-white/90">
            Explore schemes and benefits available to you
          </p>
        </div>
      </div>

      {/* Application Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-bg-heading">{appliedSchemes.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Applications</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">
            {appliedSchemes.filter(app => app.status === 'Approved').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Approved</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {appliedSchemes.filter(app => app.status === 'Under Review').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Under Review</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">
            {appliedSchemes.filter(app => app.status === 'Submitted').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Submitted</div>
        </div>
      </div>

      {/* Schemes Filter */}
      <div className="card">
        <div className="section-heading mb-4 -mx-6 -mt-6">
          <h2 className="text-lg font-semibold">Filter Schemes</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-bg-1 focus:ring-bg-1"
          >
            <option>All Categories</option>
            <option>Agriculture</option>
            <option>Livelihood</option>
            <option>Infrastructure</option>
          </select>
          <select
            value={filters.eligibility}
            onChange={(e) => handleFilterChange('eligibility', e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-bg-1 focus:ring-bg-1"
          >
            <option>All Eligibility</option>
            <option>Eligible</option>
            <option>Not Eligible</option>
          </select>
          <button className="btn-primary w-full">
            Apply Filters
          </button>
        </div>
      </div>

      {/* Schemes Grid */}
      <div>
        <SchemeCard onApply={handleApply} appliedSchemes={appliedSchemes} />
      </div>

      {/* Recent Applications */}
      {appliedSchemes.length > 0 && (
        <div className="card">
          <div className="section-heading mb-4 -mx-6 -mt-6">
            <h2 className="text-lg font-semibold">Recent Applications</h2>
          </div>
          <div className="space-y-4">
            {appliedSchemes.slice(-3).reverse().map((application) => (
              <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-bg-1 rounded-full flex items-center justify-center">
                    <DocumentTextIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-fra-font">{application.schemeName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Applied on {application.appliedDate}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                  {application.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Application Modal */}
            {/* Application Modal */}
      {showApplicationModal && selectedScheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-fra-font">Apply for {selectedScheme.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Complete the application form below</p>
                </div>
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Application Progress</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Step 1 of 1</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-bg-1 h-2 rounded-full w-full"></div>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Scheme Overview */}
                <div className="bg-gradient-to-r from-bg-1 to-bg-heading p-4 rounded-lg text-white">
                  <h3 className="font-semibold mb-2">{selectedScheme.name}</h3>
                  <p className="text-sm opacity-90 mb-3">{selectedScheme.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      <span>Processing: {selectedScheme.processingTime}</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      <span>Eligible ✓</span>
                    </div>
                    <div className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 mr-2" />
                      <span>Support Available</span>
                    </div>
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                    <InformationCircleIcon className="h-5 w-5 mr-2" />
                    Quick Tips for Application
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Ensure all documents are clear and legible</li>
                    <li>• Double-check your bank account details</li>
                    <li>• Keep copies of all submitted documents</li>
                    <li>• Application status will be updated within 24 hours</li>
                  </ul>
                </div>

                {/* Application Form Fields */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-fra-font border-b pb-2">Application Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedScheme.applicationForm.fields.map((field) => (
                      <div key={field} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          {field !== 'documents' && <span className="text-red-500 ml-1">*</span>}
                        </label>

                        {field === 'documents' ? (
                          <div className="space-y-3">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                              <PaperClipIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Upload Required Documents</p>
                              <input
                                type="file"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-bg-1 file:text-white hover:file:bg-bg-1/90"
                                onChange={(e) => {
                                  // Handle file upload
                                  const files = Array.from(e.target.files);
                                  console.log('Uploaded files:', files);
                                }}
                              />
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                              <p>• Supported formats: PDF, JPG, PNG</p>
                              <p>• Maximum file size: 5MB per document</p>
                              <p>• Upload clear, readable documents</p>
                            </div>
                          </div>
                        ) : field.includes('date') ? (
                          <input
                            type="date"
                            value={applicationForm[field] || ''}
                            onChange={(e) => setApplicationForm(prev => ({ ...prev, [field]: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bg-heading focus:border-transparent"
                            required
                          />
                        ) : (
                          <input
                            type="text"
                            value={applicationForm[field] || ''}
                            onChange={(e) => setApplicationForm(prev => ({ ...prev, [field]: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bg-heading focus:border-transparent"
                            placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                            required
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Declaration */}
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 mr-3 flex-shrink-0"
                    />
                    <div className="text-sm">
                      <p className="text-gray-700 font-medium mb-2">Declaration</p>
                      <p className="text-gray-600 leading-relaxed">
                        I hereby declare that all information provided is true and correct to the best of my knowledge.
                        I understand that providing false information may result in rejection of my application and
                        legal consequences. I have read and understood all the terms and conditions of this scheme.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Need Help?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Contact {selectedScheme.contactInfo} for assistance with your application.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>📧 Email support available</span>
                    <span>📞 Helpline: {selectedScheme.contactInfo.split(':')[1]}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4 border-t">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 text-lg font-medium"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <CheckCircleIcon className="h-5 w-5" />
                    )}
                    {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApplicationModal(false)}
                    className="btn-secondary flex-1 py-3"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Resources Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Help Guide */}
        <div className="card">
          <div className="section-heading mb-4 -mx-6 -mt-6">
            <h2 className="text-lg font-semibold">Application Guide</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="step-number mr-3">1.</div>
              <p>Review scheme eligibility criteria and requirements carefully</p>
            </div>
            <div className="flex items-start">
              <div className="step-number mr-3">2.</div>
              <p>Gather all necessary documents and information</p>
            </div>
            <div className="flex items-start">
              <div className="step-number mr-3">3.</div>
              <p>Submit application through the portal or visit nearest center</p>
            </div>
            <div className="flex items-start">
              <div className="step-number mr-3">4.</div>
              <p>Track application status and respond to any queries</p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="card">
          <div className="section-heading mb-4 -mx-6 -mt-6">
            <h2 className="text-lg font-semibold">Need Help?</h2>
          </div>
          <div className="space-y-4">
            <p className="text-sm">
              Our support team is available to help you with any queries related to
              scheme applications and eligibility.
            </p>
            <div className="grid grid-cols-1 gap-4">
              <button className="btn-primary flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Contact Support
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                FAQ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
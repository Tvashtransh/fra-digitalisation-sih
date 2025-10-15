import { CheckCircleIcon, ClockIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import FeedbackForm from '../components/FeedbackForm';

const feedbackTypes = [
  {
    id: 'technical',
    title: 'Technical Issues',
    description: 'Report problems with the portal, errors, or bugs',
    icon: (
      <svg className="w-12 h-12 text-bg-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'process',
    title: 'Process Related',
    description: 'Questions about application process or documentation',
    icon: (
      <svg className="w-12 h-12 text-bg-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    id: 'suggestions',
    title: 'Suggestions',
    description: 'Share ideas for improvement or new features',
    icon: (
      <svg className="w-12 h-12 text-bg-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
];

export default function Feedback() {
  const [userFeedback, setUserFeedback] = useState([]);
  const [activeTab, setActiveTab] = useState('submit');
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    // Load feedback from localStorage
    const storedFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
    setUserFeedback(storedFeedback);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'in-progress':
        return <ExclamationTriangleIcon className="w-5 h-5 text-blue-500" />;
      case 'resolved':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'closed':
        return <XCircleIcon className="w-5 h-5 text-gray-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getCategoryName = (categoryId) => {
    const categories = {
      technical: 'Technical Issues',
      process: 'Process Related',
      suggestions: 'Suggestions',
      document: 'Document Related',
      other: 'Other'
    };
    return categories[categoryId] || categoryId;
  };

  const getTimelineData = (feedback) => {
    const timeline = [
      {
        id: 1,
        status: 'pending',
        title: 'Feedback Submitted',
        description: 'Your feedback has been received and is being reviewed.',
        timestamp: feedback.submittedAt,
        icon: ClockIcon
      }
    ];

    // Add status updates based on current status
    if (feedback.status === 'in-progress') {
      timeline.push({
        id: 2,
        status: 'in-progress',
        title: 'Under Review',
        description: 'Our team is actively working on your feedback.',
        timestamp: new Date(Date.parse(feedback.submittedAt) + 24 * 60 * 60 * 1000).toISOString(), // 1 day later
        icon: ExclamationTriangleIcon
      });
    } else if (feedback.status === 'resolved') {
      timeline.push({
        id: 2,
        status: 'in-progress',
        title: 'Under Review',
        description: 'Our team is actively working on your feedback.',
        timestamp: new Date(Date.parse(feedback.submittedAt) + 24 * 60 * 60 * 1000).toISOString(),
        icon: ExclamationTriangleIcon
      });
      timeline.push({
        id: 3,
        status: 'resolved',
        title: 'Issue Resolved',
        description: 'Your feedback has been addressed successfully.',
        timestamp: new Date(Date.parse(feedback.submittedAt) + 48 * 60 * 60 * 1000).toISOString(), // 2 days later
        icon: CheckCircleIcon
      });
    }

    return timeline;
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-bg-1 px-4 sm:px-6 py-6 sm:py-8 rounded-b-lg shadow-md mb-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Feedback & Support
          </h1>
          <p className="text-white/90">
            Help us improve your experience
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-6xl mx-auto">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('submit')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'submit'
                  ? 'border-bg-1 text-bg-1'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Submit Feedback
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-bg-1 text-bg-1'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              My Feedback History ({userFeedback.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'submit' ? (
        <>
          {/* Feedback Types */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {feedbackTypes.map((type) => (
              <div key={type.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center">
                  {type.icon}
                  <h3 className="mt-4 text-lg font-medium text-bg-heading">
                    {type.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {type.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            {/* Feedback Form */}
            <FeedbackForm onFeedbackSubmitted={() => {
              const storedFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
              setUserFeedback(storedFeedback);
            }} />

            {/* Help Resources */}
            <div className="space-y-6">
              {/* FAQ Section */}
              <div className="card">
                <div className="section-heading mb-4 -mx-6 -mt-6">
                  <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      q: 'How long does the feedback review process take?',
                      a: 'We aim to review and respond to all feedback within 48-72 hours.'
                    },
                    {
                      q: 'Can I track my submitted feedback?',
                      a: 'Yes, you can track your feedback status in the "My Submissions" section.'
                    },
                    {
                      q: 'What types of files can I attach?',
                      a: 'You can attach images (PNG, JPG) and documents (PDF) up to 10MB each.'
                    },
                  ].map((faq, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-bg-heading">{faq.q}</h3>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="card">
                <div className="section-heading mb-4 -mx-6 -mt-6">
                  <h2 className="text-lg font-semibold">Contact Information</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-bg-1 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <h3 className="font-medium">Phone Support</h3>
                      <p className="text-sm text-gray-600">1800-123-4567 (Toll Free)</p>
                      <p className="text-sm text-gray-600">Mon-Fri, 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-bg-1 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <h3 className="font-medium">Email Support</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">support@fra-atlas.gov.in</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Response within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Feedback History */
        <div className="space-y-6">
          {userFeedback.length === 0 ? (
            <div className="card text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No feedback submitted yet</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your submitted feedback will appear here.</p>
              <div className="mt-6">
                <button
                  onClick={() => setActiveTab('submit')}
                  className="btn-primary"
                >
                  Submit Your First Feedback
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {userFeedback.map((feedback) => (
                <div key={feedback.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(feedback.status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
                          {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">#{feedback.ticketNumber}</span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {getCategoryName(feedback.category)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {feedback.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>Submitted: {new Date(feedback.submittedAt).toLocaleDateString()}</span>
                          {feedback.files && feedback.files.length > 0 && (
                            <span>{feedback.files.length} attachment(s)</span>
                          )}
                        </div>
                        <button
                          onClick={() => setSelectedFeedback(selectedFeedback?.id === feedback.id ? null : feedback)}
                          className="text-bg-1 hover:text-bg-heading text-sm font-medium"
                        >
                          {selectedFeedback?.id === feedback.id ? 'Hide Details' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Detailed View */}
                  {selectedFeedback?.id === feedback.id && (
                    <div className="mt-6 border-t border-gray-200 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Timeline */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-4">Status Timeline</h4>
                          <div className="space-y-4">
                            {getTimelineData(feedback).map((event, index) => (
                              <div key={event.id} className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    event.status === 'pending' ? 'bg-yellow-100' :
                                    event.status === 'in-progress' ? 'bg-blue-100' :
                                    event.status === 'resolved' ? 'bg-green-100' : 'bg-gray-100'
                                  }`}>
                                    <event.icon className={`w-4 h-4 ${
                                      event.status === 'pending' ? 'text-yellow-600' :
                                      event.status === 'in-progress' ? 'text-blue-600' :
                                      event.status === 'resolved' ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'
                                    }`} />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2">
                                    <h5 className="text-sm font-medium text-gray-900">{event.title}</h5>
                                    {index === getTimelineData(feedback).length - 1 && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                        Latest
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.description}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {new Date(event.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Additional Details */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-4">Feedback Details</h4>
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Priority:</span>
                              <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                feedback.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                feedback.priority === 'high' ? 'bg-red-100 text-red-800' :
                                feedback.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {feedback.priority?.charAt(0).toUpperCase() + feedback.priority?.slice(1) || 'Medium'}
                              </span>
                            </div>
                            {feedback.email && (
                              <div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</span>
                                <span className="ml-2 text-sm text-gray-900">{feedback.email}</span>
                              </div>
                            )}
                            {feedback.files && feedback.files.length > 0 && (
                              <div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Attachments:</span>
                                <div className="mt-2 space-y-1">
                                  {feedback.files.map((file, index) => (
                                    <div key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                      </svg>
                                      <span>{file.name}</span>
                                      <span className="text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
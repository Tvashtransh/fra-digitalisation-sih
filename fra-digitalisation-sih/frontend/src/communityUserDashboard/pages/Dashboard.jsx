import AssetCharts from '../components/AssetCharts';
import ClaimStatusCard from '../components/ClaimStatusCard';
import FeedbackForm from '../components/FeedbackForm';
import MapViewer from '../components/MapViewer';
import SchemeCard from '../components/SchemeCard';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-bg-1 px-6 py-6 sm:py-8 rounded-b-lg shadow-md mb-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Welcome, Ramesh Kumar
          </h1>
          <p className="text-white/90 mb-4">
            FRA Patta ID: FRA-2025-001
          </p>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Claim Status: Under Review
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Column */}
        <div className="space-y-6 lg:space-y-8">
          <ClaimStatusCard currentStep={2} />
          <MapViewer />
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:space-y-8">
          <AssetCharts />
        </div>
      </div>

      {/* Schemes Section */}
      <div>
        <h2 className="text-2xl font-bold text-heading mb-6">
          Eligible Schemes
        </h2>
        <SchemeCard />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Feedback Form */}
        <div>
          <FeedbackForm />
        </div>

        {/* Community Announcements */}
        <div className="card">
          <div className="section-heading mb-4 -mx-6 -mt-6">
            <h2 className="text-lg font-semibold">Community Announcements</h2>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg border border-gray-100"
              >
                <h3 className="font-medium mb-1">
                  Gram Sabha Meeting - {index}th October
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Join us for the monthly Gram Sabha meeting to discuss community
                  forest rights and new initiatives.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
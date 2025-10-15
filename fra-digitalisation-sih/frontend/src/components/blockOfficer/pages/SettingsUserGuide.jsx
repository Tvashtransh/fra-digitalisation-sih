import { motion } from 'framer-motion';
import {
    Bell,
    Book,
    Download,
    FileText,
    HelpCircle,
    Key,
    Mail,
    Moon,
    Phone,
    Save,
    Settings,
    Shield,
    Sun,
    User,
    Video
} from 'lucide-react';
import { useState, useEffect } from 'react';

const SettingsUserGuide = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState('light');
  const [subdivisionOfficer, setSubdivisionOfficer] = useState(null);
  const [gramPanchayats, setGramPanchayats] = useState([]);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    claims: true,
    reports: true,
    system: false
  });

  // Fetch subdivision officer profile
  useEffect(() => {
    const fetchOfficerProfile = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/block-officer/profile', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSubdivisionOfficer(data.officer);
            
            // Set Gram Panchayats based on subdivision
            if (data.officer.districtId === 'PHN001') {
              // Phanda subdivision - 77 villages
              setGramPanchayats([
                'ACHARPURA', 'ADAMPUR CHAWANI', 'AGARIYA', 'AMJHARA', 'AMLA', 'AMONI', 
                'AMRAVAT KALAN', 'ARWALIYA', 'BADGAON', 'BAGDUNA', 'BAGSI', 'BAHRAWAL',
                'BAIRAGARH', 'BAJRANGGARH', 'BAKANER', 'BAMHANI', 'BAMHORI KALAN',
                'BAMHORI KHURD', 'BARKHEDA YAKUB', 'BARKHEDI ABDULLA', 'BARKHEDI KALAN',
                'BARKHEDI KHURD', 'BARODIYA', 'BHAINSODA', 'BHAISONDA', 'BHANPUR',
                'BHARATPUR', 'BHOJPUR', 'BIJASAN', 'BILKISGANJ', 'CHIKLOD', 'DHAMARRA',
                'DHANAURA', 'DHANORA', 'DHOBI KHEDA', 'DUDHIYA', 'FATEHGARH', 'GINNOR',
                'GOPALPUR', 'GUNGA', 'HATHAIKHEDA', 'ITARSI', 'JAMUNIA', 'KACHNARIYA',
                'KALIASOT', 'KALYANPUR', 'KANADIA', 'KANHA', 'KAROND', 'KHAIRI',
                'KHAJURI KALAN', 'KHAJURI KHURD', 'KOLAR', 'KOTRA', 'LALGHATI',
                'MACHHLISHAHR', 'MANDIDEEP', 'MENDORI', 'MISROD', 'MUBARAKPUR',
                'NARELA', 'NEELBAD', 'OBEDULLAGANJ', 'PACHAMA', 'PANCHSHEEL NAGAR',
                'PHANDA', 'RATIBAD', 'RICHHAI', 'SALAMATPUR', 'SEHORE', 'SEMRA KALAN',
                'SEMRA KHURD', 'SHAHPURA', 'SUKHI SEWANIYA', 'SULTANPUR', 'SUNDER NAGAR',
                'TEELA', 'UMARIA', 'VIDISHA'
              ]);
            } else if (data.officer.districtId === 'BRS001') {
              // Berasia subdivision - 110 villages
              setGramPanchayats([
                'AMARPUR', 'ANKIA', 'ARJUNKHEDI', 'ARRAWATI', 'BABACHIYA', 'BADBELI KALAN',
                'BAGSI', 'BAHRAWAL', 'BAIRAGARH', 'BAJRANGGARH', 'BAKANER', 'BAMHANI',
                'BAMHORI KALAN', 'BAMHORI KHURD', 'BARKHEDA YAKUB', 'BARKHEDI ABDULLA',
                'BARKHEDI KALAN', 'BARKHEDI KHURD', 'BARODIYA', 'BERASIA', 'BHAINSODA',
                'BHAISONDA', 'BHANPUR', 'BHARATPUR', 'BHOJPUR', 'BIJASAN', 'BILKISGANJ',
                'CHIKLOD', 'DHAMARRA', 'DHANAURA', 'DHANORA', 'DHOBI KHEDA', 'DUDHIYA',
                'FATEHGARH', 'GINNOR', 'GOPALPUR', 'GUNGA', 'HATHAIKHEDA', 'ITARSI',
                'JAMUNIA', 'KACHNARIYA', 'KALIASOT', 'KALYANPUR', 'KANADIA', 'KANHA',
                'KAROND', 'KHAIRI', 'KHAJURI KALAN', 'KHAJURI KHURD', 'KOLAR', 'KOTRA',
                'LALGHATI', 'MACHHLISHAHR', 'MANDIDEEP', 'MENDORI', 'MISROD', 'MUBARAKPUR',
                'NARELA', 'NEELBAD', 'OBEDULLAGANJ', 'PACHAMA', 'PANCHSHEEL NAGAR',
                'RATIBAD', 'RICHHAI', 'SALAMATPUR', 'SEHORE', 'SEMRA KALAN', 'SEMRA KHURD',
                'SHAHPURA', 'SUKHI SEWANIYA', 'SULTANPUR', 'SUNDER NAGAR', 'TEELA', 'UMARIA',
                'VIDISHA', 'AGARIYA', 'AMJHARA', 'AMLA', 'AMONI', 'AMRAVAT KALAN', 'ARWALIYA',
                'BADGAON', 'BAGDUNA', 'CHIRAYU', 'DELAWADI', 'GAIRATGANJ', 'HABIBGANJ',
                'HOSHANGABAD', 'ICHHAWAR', 'INDORE', 'JABALPUR', 'KATNI', 'KHANDWA',
                'KHARGONE', 'MANDSAUR', 'MORENA', 'NARSINGHPUR', 'NEEMUCH', 'RAISEN',
                'RAJGARH', 'RATLAM', 'REWA', 'SAGAR', 'SATNA', 'SEHORE', 'SEONI',
                'SHAHDOL', 'SHAJAPUR', 'SHEOPUR', 'SHIVPURI', 'SIDHI', 'SINGRAULI',
                'TIKAMGARH', 'UJJAIN', 'UMARIA', 'VIDISHA', 'WEST NIMAR', 'EAST NIMAR'
              ]);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching officer profile:', error);
      }
    };

    fetchOfficerProfile();
  }, []);

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'userguide', label: 'User Guide', icon: Book },
    { id: 'support', label: 'Support', icon: HelpCircle }
  ];

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const renderProfileSettings = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#044e2b] mb-6">Profile Information</h3>

        {subdivisionOfficer ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={subdivisionOfficer.name || 'N/A'}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Officer ID</label>
              <input
                type="text"
                value={subdivisionOfficer.districtId || 'N/A'}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subdivision</label>
              <input
                type="text"
                value={subdivisionOfficer.assignedSubdivision || 'N/A'}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
              <input
                type="text"
                value={subdivisionOfficer.assignedDistrict || 'N/A'}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#044e2b]"></div>
          </div>
        )}

        {/* Gram Panchayats under Subdivision */}
        {gramPanchayats.length > 0 && (
          <div className="mt-8">
            <h4 className="text-md font-semibold text-[#044e2b] mb-4">
              Gram Panchayats under {subdivisionOfficer?.assignedSubdivision} Subdivision ({gramPanchayats.length} villages)
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {gramPanchayats.map((gp, index) => (
                  <div key={index} className="bg-white px-3 py-2 rounded border text-sm text-gray-700">
                    {gp}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              All claims from these villages are handled by this subdivision office.
            </p>
          </div>
        )}

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Bio / Description</label>
          <textarea
            rows={4}
            defaultValue="Experienced Block Officer with 8+ years in forest rights administration and community development."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button className="bg-[#044e2b] text-[#d4c5a9] px-6 py-2 rounded-lg hover:bg-[#0a5a35] flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

    </motion.div>
  );

  const renderNotificationSettings = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#044e2b] mb-6">Notification Preferences</h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <h4 className="font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={() => handleNotificationChange('email')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#044e2b]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#044e2b]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                <p className="text-sm text-gray-600">Receive notifications via SMS</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={() => handleNotificationChange('sms')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#044e2b]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#044e2b]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-gray-400" />
              <div>
                <h4 className="font-medium text-gray-900">Push Notifications</h4>
                <p className="text-sm text-gray-600">Receive push notifications in browser</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={() => handleNotificationChange('push')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#044e2b]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#044e2b]"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#044e2b] mb-6">Notification Types</h3>

        <div className="space-y-4">
          {[
            { key: 'claims', label: 'Claim Updates', description: 'Notifications about claim status changes' },
            { key: 'reports', label: 'Report Reminders', description: 'Reminders for report submissions' },
            { key: 'system', label: 'System Updates', description: 'System maintenance and updates' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{item.label}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={() => handleNotificationChange(item.key)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#044e2b]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#044e2b]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderSecuritySettings = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#044e2b] mb-6">Password & Security</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
            />
          </div>

          <button className="bg-[#044e2b] text-[#d4c5a9] px-6 py-2 rounded-lg hover:bg-[#0a5a35] flex items-center space-x-2">
            <Key className="h-4 w-4" />
            <span>Update Password</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#044e2b] mb-6">Two-Factor Authentication</h3>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Enable 2FA</h4>
            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
          </div>
          <button className="bg-[#044e2b] text-[#d4c5a9] px-4 py-2 rounded-lg hover:bg-[#0a5a35]">
            Enable
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#044e2b] mb-6">Login Sessions</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Current Session</h4>
              <p className="text-sm text-gray-600">Chrome on Windows • Active now</p>
            </div>
            <span className="text-green-600 text-sm font-medium">Current</span>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Mobile App</h4>
              <p className="text-sm text-gray-600">Android • Last active 2 hours ago</p>
            </div>
            <button className="text-red-600 hover:text-red-800 text-sm">Revoke</button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderUserGuide = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#044e2b] mb-6">User Guide & Documentation</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border border-gray-200 rounded-lg hover:border-[#044e2b] transition-colors cursor-pointer">
            <Book className="h-8 w-8 text-[#044e2b] mb-4" />
            <h4 className="font-semibold text-gray-900 mb-2">FRA Administration Guide</h4>
            <p className="text-sm text-gray-600 mb-4">Complete guide for Forest Rights Act administration</p>
            <button className="text-[#044e2b] hover:text-[#0a5a35] text-sm font-medium flex items-center">
              <Download className="h-4 w-4 mr-1" />
              Download PDF
            </button>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg hover:border-[#044e2b] transition-colors cursor-pointer">
            <Video className="h-8 w-8 text-[#044e2b] mb-4" />
            <h4 className="font-semibold text-gray-900 mb-2">Video Tutorials</h4>
            <p className="text-sm text-gray-600 mb-4">Step-by-step video guides for common tasks</p>
            <button className="text-[#044e2b] hover:text-[#0a5a35] text-sm font-medium">
              Watch Videos
            </button>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg hover:border-[#044e2b] transition-colors cursor-pointer">
            <FileText className="h-8 w-8 text-[#044e2b] mb-4" />
            <h4 className="font-semibold text-gray-900 mb-2">Quick Reference</h4>
            <p className="text-sm text-gray-600 mb-4">Quick reference guide for frequently used features</p>
            <button className="text-[#044e2b] hover:text-[#0a5a35] text-sm font-medium flex items-center">
              <Download className="h-4 w-4 mr-1" />
              Download Guide
            </button>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg hover:border-[#044e2b] transition-colors cursor-pointer">
            <HelpCircle className="h-8 w-8 text-[#044e2b] mb-4" />
            <h4 className="font-semibold text-gray-900 mb-2">FAQ</h4>
            <p className="text-sm text-gray-600 mb-4">Frequently asked questions and answers</p>
            <button className="text-[#044e2b] hover:text-[#0a5a35] text-sm font-medium">
              View FAQ
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#044e2b] mb-6">Recent Updates</h3>

        <div className="space-y-4">
          <div className="border-l-4 border-[#044e2b] pl-4">
            <h4 className="font-medium text-gray-900">Version 2.1.0 - January 2025</h4>
            <p className="text-sm text-gray-600 mt-1">Enhanced GIS mapping features and improved claim processing workflow.</p>
            <span className="text-xs text-gray-500 mt-2 block">Released: Jan 10, 2025</span>
          </div>

          <div className="border-l-4 border-gray-300 pl-4">
            <h4 className="font-medium text-gray-900">Version 2.0.5 - December 2024</h4>
            <p className="text-sm text-gray-600 mt-1">Bug fixes and performance improvements for document upload.</p>
            <span className="text-xs text-gray-500 mt-2 block">Released: Dec 15, 2024</span>
          </div>

          <div className="border-l-4 border-gray-300 pl-4">
            <h4 className="font-medium text-gray-900">Version 2.0.0 - November 2024</h4>
            <p className="text-sm text-gray-600 mt-1">Major update with new dashboard interface and enhanced reporting.</p>
            <span className="text-xs text-gray-500 mt-2 block">Released: Nov 20, 2024</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderSupport = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#044e2b] mb-6">Contact Support</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border border-gray-200 rounded-lg">
            <Mail className="h-8 w-8 text-[#044e2b] mb-4" />
            <h4 className="font-semibold text-gray-900 mb-2">Email Support</h4>
            <p className="text-sm text-gray-600 mb-4">Get help via email</p>
            <p className="text-sm text-[#044e2b] font-medium">support@fra.gov.in</p>
            <p className="text-xs text-gray-500 mt-2">Response time: 24-48 hours</p>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg">
            <Phone className="h-8 w-8 text-[#044e2b] mb-4" />
            <h4 className="font-semibold text-gray-900 mb-2">Phone Support</h4>
            <p className="text-sm text-gray-600 mb-4">Call our helpline</p>
            <p className="text-sm text-[#044e2b] font-medium">1800-XXX-XXXX</p>
            <p className="text-xs text-gray-500 mt-2">Mon-Fri: 9 AM - 6 PM</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#044e2b] mb-6">Submit a Support Ticket</h3>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              placeholder="Brief description of your issue"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent">
              <option value="">Select category</option>
              <option value="technical">Technical Issue</option>
              <option value="account">Account Problem</option>
              <option value="feature">Feature Request</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={4}
              placeholder="Please provide detailed description of your issue or request"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-[#044e2b] text-[#d4c5a9] px-6 py-2 rounded-lg hover:bg-[#0a5a35] flex items-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>Submit Ticket</span>
          </button>
        </form>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'userguide':
        return renderUserGuide();
      case 'support':
        return renderSupport();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Settings className="h-8 w-8 text-[#044e2b]" />
            <div>
              <h1 className="text-2xl font-bold text-[#044e2b]">Settings & User Guide</h1>
              <p className="text-gray-600 mt-1">Configure your preferences and access help resources</p>
            </div>
          </div>
        </div>

        {/* Settings Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#044e2b] text-[#d4c5a9]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </motion.div>
  );
};

export default SettingsUserGuide;
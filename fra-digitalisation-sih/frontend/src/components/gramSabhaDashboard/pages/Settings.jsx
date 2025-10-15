import { motion } from 'framer-motion';
import { Bell, Key, Palette, Save, Settings, Shield, User } from 'lucide-react';
import { useState, useEffect } from 'react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    gramPanchayatName: 'Loading...',
    gpCode: 'Loading...',
    subdivision: 'Loading...',
    district: 'Loading...',
    village: '',
    villages: [],
    gramSabhaId: 'Loading...'
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Fetch Gram Panchayat profile data
  useEffect(() => {
    const fetchGramPanchayatProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const response = await fetch('/api/gs/profile', {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (response.ok && data.success) {
          setProfileData({
            name: data.officer.name || '',
            email: data.officer.email || '',
            contactNumber: data.officer.contactNumber || '',
            gramPanchayatName: data.officer.gpName,
            gpCode: data.officer.gpCode,
            subdivision: data.officer.subdivision,
            district: data.officer.district,
            village: data.officer.village || '',
            villages: data.officer.villages || [],
            gramSabhaId: data.officer.gramSabhaId
          });
        } else {
          console.error('Failed to fetch Gram Panchayat profile:', data.message);
        }
      } catch (error) {
        console.error('Error fetching Gram Panchayat profile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchGramPanchayatProfile();
  }, []);

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    claimUpdates: true,
    documentAlerts: true,
    systemAlerts: false
  });

  const [systemSettings, setSystemSettings] = useState({
    language: 'en',
    timezone: 'IST',
    dateFormat: 'DD/MM/YYYY',
    theme: 'light',
    autoSave: true,
    twoFactorAuth: false
  });

  // Profile update handlers
  const handleProfileEdit = () => {
    setIsEditingProfile(true);
    setProfileError('');
    setProfileSuccess('');
  };

  const handleProfileCancel = () => {
    setIsEditingProfile(false);
    setProfileError('');
    setProfileSuccess('');
    // Reload profile data to reset any changes
    fetchGramPanchayatProfile();
  };

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfileSave = async () => {
    try {
      setIsSavingProfile(true);
      setProfileError('');
      setProfileSuccess('');

      const response = await fetch('/api/gs/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          contactNumber: profileData.contactNumber,
          assignedVillage: profileData.village
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setProfileSuccess('Profile updated successfully!');
        setIsEditingProfile(false);
        // Update profile data with response
        setProfileData(prev => ({
          ...prev,
          name: data.officer.name,
          email: data.officer.email,
          contactNumber: data.officer.contactNumber,
          village: data.officer.village
        }));
      } else {
        setProfileError(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileError('Error updating profile. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'system', label: 'System', icon: Settings }
  ];

  const handleProfileUpdate = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationToggle = (setting) => {
    setNotificationSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleSystemUpdate = (field, value) => {
    setSystemSettings(prev => ({ ...prev, [field]: value }));
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={sectionVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#044e2b]">Settings</h1>
          <p className="text-[#044e2b] opacity-80 mt-1">Manage Gram Panchayat information and system preferences</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#044e2b] text-[#d4c5a9] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#0a5a35] transition-colors"
        >
          <Save className="h-5 w-5" />
          Save Changes
        </motion.button>
      </motion.div>

      {/* Settings Navigation */}
      <motion.div variants={sectionVariants} className="bg-white rounded-lg shadow-lg border-l-4 border-[#044e2b]">
        <div className="flex flex-wrap">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-[#044e2b] border-b-2 border-[#044e2b] bg-[#d4c5a9] bg-opacity-20'
                  : 'text-gray-600 hover:text-[#044e2b] hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Settings Content */}
      <motion.div variants={sectionVariants} className="bg-white rounded-lg shadow-lg border-l-4 border-[#044e2b]">
        <div className="p-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#044e2b]">Profile Information</h2>
                {!isEditingProfile && !isLoadingProfile && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleProfileEdit}
                    className="bg-[#044e2b] text-[#d4c5a9] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#0a5a35] transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Edit Profile
                  </motion.button>
                )}
              </div>

              {/* Success/Error Messages */}
              {profileSuccess && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">{profileSuccess}</p>
                </div>
              )}
              {profileError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{profileError}</p>
                </div>
              )}

              {isLoadingProfile ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#044e2b]"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading profile information...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Personal Information Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#044e2b] mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => handleProfileChange('name', e.target.value)}
                          disabled={!isEditingProfile}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                            isEditingProfile 
                              ? 'bg-white text-gray-900 focus:ring-2 focus:ring-[#044e2b] focus:border-transparent' 
                              : 'bg-gray-50 text-gray-700'
                          }`}
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleProfileChange('email', e.target.value)}
                          disabled={!isEditingProfile}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                            isEditingProfile 
                              ? 'bg-white text-gray-900 focus:ring-2 focus:ring-[#044e2b] focus:border-transparent' 
                              : 'bg-gray-50 text-gray-700'
                          }`}
                          placeholder="Enter your email address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                        <input
                          type="tel"
                          value={profileData.contactNumber}
                          onChange={(e) => handleProfileChange('contactNumber', e.target.value)}
                          disabled={!isEditingProfile}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                            isEditingProfile 
                              ? 'bg-white text-gray-900 focus:ring-2 focus:ring-[#044e2b] focus:border-transparent' 
                              : 'bg-gray-50 text-gray-700'
                          }`}
                          placeholder="Enter your contact number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Village</label>
                        <input
                          type="text"
                          value={profileData.village}
                          onChange={(e) => handleProfileChange('village', e.target.value)}
                          disabled={!isEditingProfile}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                            isEditingProfile 
                              ? 'bg-white text-gray-900 focus:ring-2 focus:ring-[#044e2b] focus:border-transparent' 
                              : 'bg-gray-50 text-gray-700'
                          }`}
                          placeholder="Enter assigned village"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Jurisdiction Information Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#044e2b] mb-4">Jurisdiction Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gram Panchayat Name</label>
                        <input
                          type="text"
                          value={profileData.gramPanchayatName}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GP Code</label>
                        <input
                          type="text"
                          value={profileData.gpCode}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subdivision</label>
                        <input
                          type="text"
                          value={profileData.subdivision}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                        <input
                          type="text"
                          value={profileData.district}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditingProfile && (
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleProfileSave}
                        disabled={isSavingProfile || !profileData.name || !profileData.email}
                        className="bg-[#044e2b] text-[#d4c5a9] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#0a5a35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="h-4 w-4" />
                        {isSavingProfile ? 'Saving...' : 'Save Changes'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleProfileCancel}
                        disabled={isSavingProfile}
                        className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-[#044e2b] mb-6">Notification Preferences</h2>

              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                  { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via SMS' },
                  { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications in browser' },
                  { key: 'claimUpdates', label: 'Claim Updates', desc: 'Get notified about claim status changes' },
                  { key: 'documentAlerts', label: 'Document Alerts', desc: 'Alerts for document verification issues' },
                  { key: 'systemAlerts', label: 'System Alerts', desc: 'Maintenance and system notifications' }
                ].map((setting, index) => (
                  <motion.div
                    key={setting.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium text-[#044e2b]">{setting.label}</h3>
                      <p className="text-sm text-gray-600">{setting.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings[setting.key]}
                        onChange={() => handleNotificationToggle(setting.key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#044e2b] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#044e2b]"></div>
                    </label>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-[#044e2b] mb-6">Security Settings</h2>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-[#044e2b] mb-4 flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Password Management
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-[#044e2b] text-[#d4c5a9] px-6 py-2 rounded-lg font-semibold hover:bg-[#0a5a35] transition-colors"
                    >
                      Update Password
                    </motion.button>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-[#044e2b] mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Two-Factor Authentication
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#044e2b]">Enable 2FA</p>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemSettings.twoFactorAuth}
                        onChange={() => handleSystemUpdate('twoFactorAuth', !systemSettings.twoFactorAuth)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#044e2b] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#044e2b]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-[#044e2b] mb-6">Appearance Settings</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <select
                    value={systemSettings.theme}
                    onChange={(e) => handleSystemUpdate('theme', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color Scheme</label>
                  <div className="flex gap-2">
                    {['#044e2b', '#2563eb', '#dc2626', '#7c3aed'].map((color) => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: color }}
                        onClick={() => handleSystemUpdate('primaryColor', color)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-[#044e2b] mb-6">System Preferences</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={systemSettings.language}
                    onChange={(e) => handleSystemUpdate('language', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="mr">Marathi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={systemSettings.timezone}
                    onChange={(e) => handleSystemUpdate('timezone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                  >
                    <option value="IST">IST (UTC+5:30)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                  <select
                    value={systemSettings.dateFormat}
                    onChange={(e) => handleSystemUpdate('dateFormat', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-[#044e2b]">Auto-save</p>
                    <p className="text-sm text-gray-600">Automatically save changes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={systemSettings.autoSave}
                      onChange={() => handleSystemUpdate('autoSave', !systemSettings.autoSave)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#044e2b] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#044e2b]"></div>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;
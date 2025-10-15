import {
    CalendarIcon,
    CheckIcon,
    DocumentArrowDownIcon,
    EnvelopeIcon,
    KeyIcon,
    MapPinIcon,
    PencilIcon,
    PhoneIcon,
    UserIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

const initialUserProfile = {
  name: "",
  email: "",
  phone: "",
  fraId: "",
  village: "",
  district: "",
  state: "",
  dateOfBirth: "",
  gender: "",
  occupation: "",
  joinDate: "",
  profileImage: null,
};

export default function Profile() {
  const [userProfile, setUserProfile] = useState(initialUserProfile);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(initialUserProfile);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const response = await fetch('/api/claimant/profile', {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (response.ok && data.success) {
          setUserProfile({
            name: data.claimant.name || '',
            email: data.claimant.email || '',
            phone: data.claimant.contactNumber || '',
            aadhaarNumber: data.claimant.aadhaarNumber || '',
            fraId: data.claimant.fraId || '',
            village: data.claimant.village || '',
            gramPanchayat: data.claimant.gramPanchayat || '',
            tehsil: data.claimant.tehsil || '',
            district: data.claimant.district || '',
            state: data.claimant.state || '',
            dateOfBirth: data.claimant.dateOfBirth || '',
            gender: data.claimant.gender || '',
            occupation: data.claimant.occupation || '',
            tribeCategory: data.claimant.tribeCategory || '',
            spouseName: data.claimant.spouseName || '',
            fatherOrMotherName: data.claimant.fatherOrMotherName || '',
            joinDate: data.claimant.joinDate || '',
            profileImage: null
          });
        } else {
          setMessage({ type: "error", text: "Failed to load profile data" });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage({ type: "error", text: "Error loading profile data" });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle profile edit
  const handleEditProfile = () => {
    setEditForm(userProfile);
    setIsEditModalOpen(true);
    setMessage({ type: "", text: "" });
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/claimant/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: editForm.name,
          email: editForm.email,
          contactNumber: editForm.phone,
          village: editForm.village,
          district: editForm.district,
          state: editForm.state,
          dateOfBirth: editForm.dateOfBirth,
          gender: editForm.gender,
          occupation: editForm.occupation,
          address: editForm.address || '',
          gramPanchayat: editForm.gramPanchayat || '',
          tehsil: editForm.tehsil || '',
          tribeCategory: editForm.tribeCategory || '',
          spouseName: editForm.spouseName || '',
          fatherOrMotherName: editForm.fatherOrMotherName || ''
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUserProfile({
          name: data.claimant.name || '',
          email: data.claimant.email || '',
          phone: data.claimant.contactNumber || '',
          fraId: data.claimant.fraId || '',
          village: data.claimant.village || '',
          district: data.claimant.district || '',
          state: data.claimant.state || '',
          dateOfBirth: data.claimant.dateOfBirth || '',
          gender: data.claimant.gender || '',
          occupation: data.claimant.occupation || '',
          joinDate: data.claimant.joinDate || '',
          profileImage: null
        });
        setIsEditModalOpen(false);
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update profile" });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: "error", text: "Error updating profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password change
  const handleChangePassword = () => {
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setIsPasswordModalOpen(true);
    setMessage({ type: "", text: "" });
  };

  const handleSavePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters long." });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsPasswordModalOpen(false);
      setMessage({ type: "success", text: "Password changed successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to change password. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile download
  const handleDownloadProfile = () => {
    const profileData = {
      ...userProfile,
      downloadedAt: new Date().toISOString(),
      downloadFormat: "JSON"
    };

    const dataStr = JSON.stringify(profileData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `FRA_Profile_${userProfile.fraId}_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    setMessage({ type: "success", text: "Profile downloaded successfully!" });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
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
            My Profile
          </h1>
          <p className="text-white/90">
            View and manage your personal information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="text-center">
              {/* Profile Avatar */}
              <div className="w-24 h-24 bg-bg-heading rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="h-12 w-12 text-white" />
              </div>

              {/* Basic Info */}
              <h2 className="text-xl font-bold text-fra-font mb-1">
                {isLoadingProfile ? 'Loading...' : userProfile.name || 'User Name'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Aadhaar: {isLoadingProfile ? 'Loading...' : userProfile.aadhaarNumber || 'Not provided'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                FRA ID: {isLoadingProfile ? 'Loading...' : userProfile.fraId || 'Not assigned yet'}
              </p>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Active Member
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-bg-heading">12</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Claims Filed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-bg-heading">8</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Schemes Applied</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="card">
            <div className="section-heading mb-6 -mx-6 -mt-6">
              <h2 className="text-lg font-semibold">Personal Information</h2>
            </div>

            {isLoadingProfile ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-bg-heading"></div>
                <p className="text-sm text-gray-500 mt-2">Loading profile information...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <UserIcon className="h-5 w-5 text-bg-heading" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                      <p className="font-medium text-fra-font">{userProfile.name || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="h-5 w-5 text-bg-heading" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email Address</p>
                      <p className="font-medium text-fra-font">{userProfile.email || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-5 w-5 text-bg-heading" />
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="font-medium text-fra-font">{userProfile.phone || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="h-5 w-5 text-bg-heading" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Date of Birth</p>
                      <p className="font-medium text-fra-font">
                        {userProfile.dateOfBirth ? new Date(userProfile.dateOfBirth).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="h-5 w-5 text-bg-heading" />
                    <div>
                      <p className="text-sm text-gray-600">Village</p>
                      <p className="font-medium text-fra-font">{userProfile.village || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="h-5 w-5 text-bg-heading" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Gram Panchayat</p>
                      <p className="font-medium text-fra-font">{userProfile.gramPanchayat || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="h-5 w-5 text-bg-heading" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Tehsil</p>
                      <p className="font-medium text-fra-font">{userProfile.tehsil || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="h-5 w-5 text-bg-heading" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">District</p>
                      <p className="font-medium text-fra-font">{userProfile.district || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="h-5 w-5 text-bg-heading" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">State</p>
                      <p className="font-medium text-fra-font">{userProfile.state || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <UserIcon className="h-5 w-5 text-bg-heading" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Occupation</p>
                      <p className="font-medium text-fra-font">{userProfile.occupation || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Account Information */}
          <div className="card">
            <div className="section-heading mb-6 -mx-6 -mt-6">
              <h2 className="text-lg font-semibold">Account Information</h2>
            </div>

            {isLoadingProfile ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-bg-heading"></div>
                <p className="text-sm text-gray-500 mt-2">Loading account information...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">FRA ID</p>
                  <p className="font-medium text-fra-font font-mono">{userProfile.fraId || 'Not assigned yet'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                  <p className="font-medium text-fra-font">
                    {userProfile.joinDate ? new Date(userProfile.joinDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Not available'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Account Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last Login</p>
                  <p className="font-medium text-fra-font">
                    {new Date().toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="btn-primary flex-1 flex items-center justify-center gap-2"
              onClick={handleEditProfile}
            >
              <PencilIcon className="h-4 w-4" />
              Edit Profile
            </button>
            <button
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
              onClick={handleChangePassword}
            >
              <KeyIcon className="h-4 w-4" />
              Change Password
            </button>
            <button
              className="btn-outline flex-1 flex items-center justify-center gap-2"
              onClick={handleDownloadProfile}
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              Download Profile
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-fra-font">Edit Profile</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bg-heading focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bg-heading focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bg-heading focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={editForm.dateOfBirth}
                    onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bg-heading focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
                  <input
                    type="text"
                    value={editForm.village}
                    onChange={(e) => setEditForm({...editForm, village: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bg-heading focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <input
                    type="text"
                    value={editForm.district}
                    onChange={(e) => setEditForm({...editForm, district: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bg-heading focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={editForm.state}
                    onChange={(e) => setEditForm({...editForm, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bg-heading focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                  <input
                    type="text"
                    value={editForm.occupation}
                    onChange={(e) => setEditForm({...editForm, occupation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bg-heading focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <CheckIcon className="h-4 w-4" />
                  )}
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-fra-font">Change Password</h2>
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bg-heading focus:border-transparent"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bg-heading focus:border-transparent"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bg-heading focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleSavePassword}
                  disabled={isLoading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <KeyIcon className="h-4 w-4" />
                  )}
                  {isLoading ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
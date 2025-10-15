import { motion } from 'framer-motion';
import { AlertTriangle, Bell, CheckCircle, Clock, Filter, Search, Send, Settings, X } from 'lucide-react';
import { useState } from 'react';

const Notifications = () => {
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock notifications data
  const notifications = [
    {
      id: 'NOT001',
      title: 'New Claim Submitted',
      message: 'Rajesh Kumar has submitted a new forest rights claim for Bamboo Village',
      type: 'claim',
      priority: 'high',
      status: 'unread',
      timestamp: '2024-01-15 10:30 AM',
      recipient: 'Officer Sharma'
    },
    {
      id: 'NOT002',
      title: 'Document Verification Required',
      message: 'ID proof document for Priya Sharma requires manual verification',
      type: 'document',
      priority: 'medium',
      status: 'unread',
      timestamp: '2024-01-15 09:15 AM',
      recipient: 'Officer Patel'
    },
    {
      id: 'NOT003',
      title: 'Claim Approved',
      message: 'Forest rights claim CLM001 has been approved and notification sent to claimant',
      type: 'approval',
      priority: 'low',
      status: 'read',
      timestamp: '2024-01-14 04:45 PM',
      recipient: 'Officer Gupta'
    },
    {
      id: 'NOT004',
      title: 'System Maintenance Alert',
      message: 'Scheduled system maintenance will occur tonight from 11 PM to 1 AM',
      type: 'system',
      priority: 'medium',
      status: 'read',
      timestamp: '2024-01-14 02:00 PM',
      recipient: 'All Officers'
    },
    {
      id: 'NOT005',
      title: 'Disputed Land Claim',
      message: 'Multiple claimants have filed claims for the same land parcel in Sal Forest',
      type: 'dispute',
      priority: 'high',
      status: 'unread',
      timestamp: '2024-01-13 11:20 AM',
      recipient: 'Officer Sharma'
    }
  ];

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || notification.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'claim': return <Bell className="h-5 w-5" />;
      case 'document': return <CheckCircle className="h-5 w-5" />;
      case 'approval': return <CheckCircle className="h-5 w-5" />;
      case 'system': return <Settings className="h-5 w-5" />;
      case 'dispute': return <AlertTriangle className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const markAsRead = (id) => {
    // In a real app, this would update the notification status
    console.log(`Marking notification ${id} as read`);
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
          <h1 className="text-3xl font-bold text-[#044e2b]">Notifications</h1>
          <p className="text-[#044e2b] opacity-80 mt-1">Manage alerts and system notifications</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#044e2b] text-[#d4c5a9] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#0a5a35] transition-colors"
          >
            <Send className="h-4 w-4" />
            Send Notification
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#d4c5a9] text-[#044e2b] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#c4b599] transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </motion.button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div variants={sectionVariants} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#044e2b]">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#044e2b]" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="claim">Claims</option>
              <option value="document">Documents</option>
              <option value="approval">Approvals</option>
              <option value="system">System</option>
              <option value="dispute">Disputes</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Notification Statistics */}
      <motion.div variants={sectionVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Notifications', value: notifications.length, color: 'text-blue-600' },
          { label: 'Unread', value: notifications.filter(n => n.status === 'unread').length, color: 'text-red-600' },
          { label: 'High Priority', value: notifications.filter(n => n.priority === 'high').length, color: 'text-orange-600' },
          { label: 'Today', value: notifications.filter(n => n.timestamp.includes('2024-01-15')).length, color: 'text-green-600' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#044e2b] text-center"
          >
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-gray-600 mt-2">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Notifications List */}
      <motion.div variants={sectionVariants} className="bg-white rounded-lg shadow-lg border-l-4 border-[#044e2b]">
        <div className="bg-[#044e2b] text-[#d4c5a9] p-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Recent Notifications
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 hover:bg-gray-50 transition-colors ${
                notification.status === 'unread' ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Icon */}
                  <div className={`p-2 rounded-lg ${getPriorityColor(notification.priority)}`}>
                    {getTypeIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-[#044e2b]">{notification.title}</h4>
                      {notification.status === 'unread' && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-3">{notification.message}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {notification.timestamp}
                      </span>
                      <span>To: {notification.recipient}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                        {notification.priority} priority
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {notification.status === 'unread' && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => markAsRead(notification.id)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Mark as Read"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-400 hover:text-gray-600 p-1"
                    title="Dismiss"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No notifications found matching your criteria.</p>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={sectionVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#044e2b] text-center cursor-pointer"
        >
          <CheckCircle className="h-8 w-8 text-[#044e2b] mx-auto mb-3" />
          <h3 className="font-semibold text-[#044e2b] mb-2">Mark All Read</h3>
          <p className="text-gray-600 text-sm">Clear all unread notifications</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#044e2b] text-center cursor-pointer"
        >
          <Settings className="h-8 w-8 text-[#044e2b] mx-auto mb-3" />
          <h3 className="font-semibold text-[#044e2b] mb-2">Notification Settings</h3>
          <p className="text-gray-600 text-sm">Configure alert preferences</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#044e2b] text-center cursor-pointer"
        >
          <Send className="h-8 w-8 text-[#044e2b] mx-auto mb-3" />
          <h3 className="font-semibold text-[#044e2b] mb-2">Broadcast Message</h3>
          <p className="text-gray-600 text-sm">Send notifications to all users</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Notifications;
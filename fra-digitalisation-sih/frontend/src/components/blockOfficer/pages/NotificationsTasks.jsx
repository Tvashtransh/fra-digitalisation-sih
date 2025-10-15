import { motion } from 'framer-motion';
import {
    AlertTriangle,
    Bell,
    Calendar,
    CheckCircle,
    CheckSquare,
    FileText,
    MapPin,
    Search,
    Settings,
    Square,
    Users,
    X
} from 'lucide-react';
import { useState } from 'react';

const NotificationsTasks = () => {
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // Mock notifications and tasks data for Block Officer
  const notifications = [
    {
      id: 'NOT001',
      title: 'Urgent: Pending Claims Review',
      message: '89 claims are pending review for more than 7 days. Please prioritize these cases.',
      type: 'urgent',
      priority: 'high',
      status: 'unread',
      timestamp: '2025-01-15 09:00 AM',
      category: 'claims',
      actionRequired: true
    },
    {
      id: 'NOT002',
      title: 'Document Verification Required',
      message: '12 documents from Gram Sabha A require manual verification before approval.',
      type: 'document',
      priority: 'medium',
      status: 'unread',
      timestamp: '2025-01-15 08:30 AM',
      category: 'documents',
      actionRequired: true
    },
    {
      id: 'NOT003',
      title: 'Monthly Report Due',
      message: 'Block-level monthly performance report is due by end of this week.',
      type: 'task',
      priority: 'medium',
      status: 'unread',
      timestamp: '2025-01-14 05:00 PM',
      category: 'reports',
      actionRequired: true
    },
    {
      id: 'NOT004',
      title: 'GIS Mapping Update',
      message: 'New satellite imagery available for village boundary updates.',
      type: 'system',
      priority: 'low',
      status: 'read',
      timestamp: '2025-01-14 02:30 PM',
      category: 'gis',
      actionRequired: false
    },
    {
      id: 'NOT005',
      title: 'Training Session Reminder',
      message: 'FRA compliance training session scheduled for tomorrow at 10:00 AM.',
      type: 'reminder',
      priority: 'low',
      status: 'read',
      timestamp: '2025-01-13 03:00 PM',
      category: 'training',
      actionRequired: false
    },
    {
      id: 'NOT006',
      title: 'Claim Approved Successfully',
      message: 'Claim CLM-2025-001 has been approved and forwarded to District Office.',
      type: 'success',
      priority: 'low',
      status: 'read',
      timestamp: '2025-01-13 11:15 AM',
      category: 'claims',
      actionRequired: false
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
      case 'urgent': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'document': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'task': return <CheckSquare className="h-5 w-5 text-purple-500" />;
      case 'system': return <Settings className="h-5 w-5 text-gray-500" />;
      case 'reminder': return <Calendar className="h-5 w-5 text-orange-500" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'claims': return <FileText className="h-4 w-4" />;
      case 'documents': return <FileText className="h-4 w-4" />;
      case 'reports': return <FileText className="h-4 w-4" />;
      case 'gis': return <MapPin className="h-4 w-4" />;
      case 'training': return <Users className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const handleSelectNotification = (id) => {
    setSelectedNotifications(prev =>
      prev.includes(id)
        ? prev.filter(notificationId => notificationId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedNotifications(
      selectedNotifications.length === filteredNotifications.length
        ? []
        : filteredNotifications.map(notification => notification.id)
    );
  };

  const handleMarkAsRead = (id) => {
    // In a real app, this would update the backend
    console.log('Mark as read:', id);
  };

  const handleMarkAllAsRead = () => {
    // In a real app, this would update the backend
    console.log('Mark all as read');
  };

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

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
            <div className="relative">
              <Bell className="h-8 w-8 text-[#044e2b]" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#044e2b]">Notifications & Tasks</h1>
              <p className="text-gray-600 mt-1">Manage notifications and track pending tasks at the block level</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleMarkAllAsRead}
              className="bg-[#044e2b] text-[#d4c5a9] px-4 py-2 rounded-lg hover:bg-[#0a5a35] flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Mark All Read</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="urgent">Urgent</option>
            <option value="document">Documents</option>
            <option value="task">Tasks</option>
            <option value="system">System</option>
            <option value="reminder">Reminders</option>
            <option value="success">Success</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedNotifications.length > 0 && (
          <div className="bg-[#f8f9fa] border border-[#d4c5a9] rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-[#044e2b] font-medium">
                {selectedNotifications.length} notification{selectedNotifications.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Mark as Read</span>
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2">
                  <X className="h-4 w-4" />
                  <span>Delete Selected</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#044e2b] text-[#d4c5a9]">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={handleSelectAll}
                    className="text-[#d4c5a9] hover:text-white"
                  >
                    {selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0 ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Notification</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <tr
                  key={notification.id}
                  className={`hover:bg-gray-50 ${notification.status === 'unread' ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleSelectNotification(notification.id)}
                      className="text-gray-400 hover:text-[#044e2b]"
                    >
                      {selectedNotifications.includes(notification.id) ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-start space-x-3">
                      {getTypeIcon(notification.type)}
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                        <div className="text-sm text-gray-500 mt-1">{notification.message}</div>
                        {notification.actionRequired && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 mt-1">
                            Action Required
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">{notification.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                      {notification.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(notification.category)}
                      <span className="text-sm text-gray-900 capitalize">{notification.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {notification.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {notification.status === 'unread' && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Mark as Read"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button className="text-gray-400 hover:text-gray-600" title="More Options">
                        <Settings className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6 text-center"
        >
          <div className="text-2xl font-bold text-red-600">{notifications.filter(n => n.priority === 'high').length}</div>
          <div className="text-sm text-gray-600">High Priority</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 text-center"
        >
          <div className="text-2xl font-bold text-yellow-600">{notifications.filter(n => n.priority === 'medium').length}</div>
          <div className="text-sm text-gray-600">Medium Priority</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6 text-center"
        >
          <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
          <div className="text-sm text-gray-600">Unread</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6 text-center"
        >
          <div className="text-2xl font-bold text-green-600">{notifications.filter(n => n.actionRequired).length}</div>
          <div className="text-sm text-gray-600">Action Required</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotificationsTasks;
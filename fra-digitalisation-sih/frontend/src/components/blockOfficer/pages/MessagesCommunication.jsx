import { motion } from 'framer-motion';
import {
    Archive,
    Forward,
    MessageSquare,
    MoreVertical,
    Paperclip,
    Reply,
    Search,
    Send
} from 'lucide-react';
import { useState } from 'react';

const MessagesCommunication = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Mock messages data
  const messages = {
    inbox: [
      {
        id: 1,
        sender: 'Gram Sabha A',
        subject: 'Query regarding claim CLM-2025-001',
        message: 'Dear Block Officer, We have a query regarding the documentation requirements for claim CLM-2025-001. Could you please clarify the additional documents needed?',
        timestamp: '2025-01-15 10:30 AM',
        priority: 'high',
        status: 'unread',
        category: 'claims',
        attachments: 1
      },
      {
        id: 2,
        sender: 'Gram Sabha B',
        subject: 'Meeting request for land survey',
        message: 'We would like to schedule a meeting to discuss the upcoming land survey in our village. Please let us know your availability next week.',
        timestamp: '2025-01-14 03:45 PM',
        priority: 'medium',
        status: 'read',
        category: 'meetings',
        attachments: 0
      },
      {
        id: 3,
        sender: 'District Office',
        subject: 'Monthly progress report submission',
        message: 'Please submit the monthly progress report for December 2024 by January 20th, 2025.',
        timestamp: '2025-01-13 09:15 AM',
        priority: 'high',
        status: 'read',
        category: 'reports',
        attachments: 2
      }
    ],
    sent: [
      {
        id: 4,
        recipient: 'All Gram Sabhas',
        subject: 'Important: FRA Compliance Training',
        message: 'Dear Gram Sabha Members, We are organizing a training session on FRA compliance on January 20th, 2025. Your participation is mandatory.',
        timestamp: '2025-01-12 02:30 PM',
        priority: 'high',
        status: 'sent',
        category: 'training',
        attachments: 1
      },
      {
        id: 5,
        recipient: 'Gram Sabha C',
        subject: 'Approval notification for claim CLM-2025-002',
        message: 'Your claim CLM-2025-002 has been approved. Please collect the approval letter from the block office.',
        timestamp: '2025-01-11 11:20 AM',
        priority: 'medium',
        status: 'sent',
        category: 'approvals',
        attachments: 1
      }
    ],
    drafts: [
      {
        id: 6,
        recipient: 'Gram Sabha D',
        subject: 'Response to boundary dispute query',
        message: 'Draft response regarding the boundary dispute between villages...',
        timestamp: '2025-01-15 08:00 AM',
        priority: 'medium',
        status: 'draft',
        category: 'disputes',
        attachments: 0
      }
    ]
  };

  const currentMessages = messages[activeTab] || [];
  const filteredMessages = currentMessages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.sender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.recipient?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'claims': return '📄';
      case 'meetings': return '📅';
      case 'reports': return '📊';
      case 'training': return '🎓';
      case 'approvals': return '✅';
      case 'disputes': return '⚠️';
      default: return '💬';
    }
  };

  const handleSelectMessage = (id) => {
    setSelectedMessages(prev =>
      prev.includes(id)
        ? prev.filter(messageId => messageId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedMessages(
      selectedMessages.length === filteredMessages.length
        ? []
        : filteredMessages.map(message => message.id)
    );
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
  };

  const unreadCount = messages.inbox.filter(m => m.status === 'unread').length;

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
            <MessageSquare className="h-8 w-8 text-[#044e2b]" />
            <div>
              <h1 className="text-2xl font-bold text-[#044e2b]">Messages & Communication</h1>
              <p className="text-gray-600 mt-1">Communicate with Gram Sabhas and manage official correspondence</p>
            </div>
          </div>
          <button
            onClick={() => setShowComposeModal(true)}
            className="bg-[#044e2b] text-[#d4c5a9] px-4 py-2 rounded-lg hover:bg-[#0a5a35] flex items-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>Compose</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'inbox', label: 'Inbox', count: unreadCount },
            { id: 'sent', label: 'Sent', count: messages.sent.length },
            { id: 'drafts', label: 'Drafts', count: messages.drafts.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#044e2b] text-[#d4c5a9]'
                  : 'text-gray-600 hover:text-[#044e2b]'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-[#d4c5a9] text-[#044e2b]' : 'bg-[#044e2b] text-[#d4c5a9]'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent"
            />
          </div>

          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#044e2b] focus:border-transparent">
            <option value="all">All Categories</option>
            <option value="claims">Claims</option>
            <option value="meetings">Meetings</option>
            <option value="reports">Reports</option>
            <option value="training">Training</option>
            <option value="approvals">Approvals</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedMessages.length > 0 && (
          <div className="bg-[#f8f9fa] border border-[#d4c5a9] rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-[#044e2b] font-medium">
                {selectedMessages.length} message{selectedMessages.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <Archive className="h-4 w-4" />
                  <span>Archive</span>
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2">
                  <Archive className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages List and Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#044e2b] text-[#d4c5a9]">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedMessages.length === filteredMessages.length && filteredMessages.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-[#044e2b] focus:ring-[#044e2b]"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Sender/Recipient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMessages.map((message) => (
                    <tr
                      key={message.id}
                      className={`hover:bg-gray-50 cursor-pointer ${message.status === 'unread' ? 'bg-blue-50' : ''}`}
                      onClick={() => handleViewMessage(message)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedMessages.includes(message.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectMessage(message.id);
                          }}
                          className="rounded border-gray-300 text-[#044e2b] focus:ring-[#044e2b]"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{getCategoryIcon(message.category)}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {message.sender || message.recipient}
                            </div>
                            {message.attachments > 0 && (
                              <div className="text-xs text-gray-500 flex items-center">
                                <Paperclip className="h-3 w-3 mr-1" />
                                {message.attachments} attachment{message.attachments > 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{message.subject}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{message.message}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                          {message.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {message.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Reply className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredMessages.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No messages found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Message Detail View */}
        <div className="lg:col-span-1">
          {selectedMessage ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#044e2b]">Message Details</h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">From/To</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedMessage.sender || selectedMessage.recipient}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedMessage.subject}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getPriorityColor(selectedMessage.priority)}`}>
                    {selectedMessage.priority}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedMessage.timestamp}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {selectedMessage.message}
                  </div>
                </div>

                {selectedMessage.attachments > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Attachments</label>
                    <div className="mt-1 space-y-2">
                      {Array.from({ length: selectedMessage.attachments }, (_, i) => (
                        <div key={i} className="flex items-center space-x-2 text-sm text-blue-600">
                          <Paperclip className="h-4 w-4" />
                          <span>Attachment {i + 1}.pdf</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 mt-6">
                <button className="flex-1 bg-[#044e2b] text-[#d4c5a9] px-4 py-2 rounded-lg hover:bg-[#0a5a35] flex items-center justify-center space-x-2">
                  <Reply className="h-4 w-4" />
                  <span>Reply</span>
                </button>
                <button className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center justify-center space-x-2">
                  <Forward className="h-4 w-4" />
                  <span>Forward</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a message</h3>
              <p className="text-gray-500">Choose a message from the list to view its details</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6 text-center"
        >
          <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
          <div className="text-sm text-gray-600">Unread Messages</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 text-center"
        >
          <div className="text-2xl font-bold text-green-600">{messages.sent.length}</div>
          <div className="text-sm text-gray-600">Sent Messages</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6 text-center"
        >
          <div className="text-2xl font-bold text-yellow-600">{messages.drafts.length}</div>
          <div className="text-sm text-gray-600">Draft Messages</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6 text-center"
        >
          <div className="text-2xl font-bold text-purple-600">
            {messages.inbox.length + messages.sent.length + messages.drafts.length}
          </div>
          <div className="text-sm text-gray-600">Total Messages</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MessagesCommunication;
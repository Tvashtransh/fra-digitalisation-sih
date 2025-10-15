const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  recipientRole: {
    type: String,
    required: true,
    enum: ['GramSabha', 'SDLCOfficer', 'DLCOfficer', 'SuperAdmin']
  },
  recipientGpCode: {
    type: String,
    required: function() {
      return this.recipientRole === 'GramSabha';
    }
  },
  type: {
    type: String,
    required: true,
    enum: ['new_claim', 'claim_approved', 'claim_rejected', 'claim_updated']
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  claimId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Claim'
  },
  claimFrapattaid: {
    type: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for efficient queries
NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ recipientGpCode: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);


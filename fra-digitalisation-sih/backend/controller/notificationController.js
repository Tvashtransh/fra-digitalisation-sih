const Notification = require('../model/notification');
const { Admin } = require('../model/admin');

// Create notification for new claim
module.exports.createClaimNotification = async (claim) => {
  try {
    // Find Gram Sabha officer for this claim's GP
    const gsOfficer = await Admin.findOne({ 
      role: 'GramSabha', 
      assignedGpCode: claim.gpCode 
    });

    if (!gsOfficer) {
      console.log(`No GS officer found for GP Code: ${claim.gpCode}`);
      return;
    }

    // Create notification for Gram Sabha officer
    const notification = new Notification({
      recipient: gsOfficer._id,
      recipientRole: 'GramSabha',
      recipientGpCode: claim.gpCode,
      type: 'new_claim',
      title: 'New IFR Claim Filed',
      message: `A new IFR claim (${claim.frapattaid}) has been filed by ${claim.claimant?.name || 'Unknown'} in your Gram Panchayat.`,
      claimId: claim._id,
      claimFrapattaid: claim.frapattaid,
      metadata: {
        claimantName: claim.claimant?.name,
        village: claim.claimant?.village,
        areaClaimed: claim.landDetails?.totalAreaClaimed
      }
    });

    await notification.save();
    console.log(`Notification created for GS officer: ${gsOfficer.name} (${claim.gpCode})`);
    
    return notification;
  } catch (error) {
    console.error('Error creating claim notification:', error);
    throw error;
  }
};

// Get notifications for a user
module.exports.getNotifications = async (req, res) => {
  try {
    let userId, userRole, gpCode;
    
    // Check if this is a GS authentication (req.gs exists)
    if (req.gs) {
      userId = req.gs.id;
      userRole = 'GS';
      gpCode = req.gs.gpCode;
    } else if (req.user) {
      userId = req.user.id;
      userRole = req.user.role;
    } else {
      return res.status(401).json({ message: 'Unauthorized', success: false });
    }
    
    let filter = { recipient: userId };
    
    // For Gram Sabha officers, also include notifications by GP Code
    if (userRole === 'GS' || userRole === 'GramSabha') {
      if (userRole === 'GS' && gpCode) {
        filter = {
          $or: [
            { recipient: userId },
            { recipientGpCode: gpCode }
          ]
        };
      } else if (userRole === 'GramSabha') {
        const gsOfficer = await Admin.findById(userId);
        if (gsOfficer && gsOfficer.assignedGpCode) {
          filter = {
            $or: [
              { recipient: userId },
              { recipientGpCode: gsOfficer.assignedGpCode }
            ]
          };
        }
      }
    }

    const notifications = await Notification.find(filter)
      .populate('claimId', 'frapattaid status applicantDetails.claimantName')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      notifications: notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Mark notification as read
module.exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    let userId;
    
    // Check if this is a GS authentication (req.gs exists)
    if (req.gs) {
      userId = req.gs.id;
    } else if (req.user) {
      userId = req.user.id;
    } else {
      return res.status(401).json({ message: 'Unauthorized', success: false });
    }

    const notification = await Notification.findOneAndUpdate(
      { 
        _id: notificationId, 
        recipient: userId 
      },
      { 
        isRead: true, 
        readAt: new Date() 
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ 
        message: 'Notification not found', 
        success: false 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Mark all notifications as read
module.exports.markAllAsRead = async (req, res) => {
  try {
    let userId, userRole, gpCode;
    
    // Check if this is a GS authentication (req.gs exists)
    if (req.gs) {
      userId = req.gs.id;
      userRole = 'GS';
      gpCode = req.gs.gpCode;
    } else if (req.user) {
      userId = req.user.id;
      userRole = req.user.role;
    } else {
      return res.status(401).json({ message: 'Unauthorized', success: false });
    }
    
    let filter = { recipient: userId, isRead: false };
    
    // For Gram Sabha officers, also include notifications by GP Code
    if (userRole === 'GS' || userRole === 'GramSabha') {
      if (userRole === 'GS' && gpCode) {
        filter = {
          $or: [
            { recipient: userId, isRead: false },
            { recipientGpCode: gpCode, isRead: false }
          ]
        };
      } else if (userRole === 'GramSabha') {
        const gsOfficer = await Admin.findById(userId);
        if (gsOfficer && gsOfficer.assignedGpCode) {
          filter = {
            $or: [
              { recipient: userId, isRead: false },
              { recipientGpCode: gsOfficer.assignedGpCode, isRead: false }
            ]
          };
        }
      }
    }

    await Notification.updateMany(
      filter,
      { 
        isRead: true, 
        readAt: new Date() 
      }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

// Get unread notification count
module.exports.getUnreadCount = async (req, res) => {
  try {
    let userId, userRole, gpCode;
    
    // Check if this is a GS authentication (req.gs exists)
    if (req.gs) {
      userId = req.gs.id;
      userRole = 'GS';
      gpCode = req.gs.gpCode;
    } else if (req.user) {
      userId = req.user.id;
      userRole = req.user.role;
    } else {
      return res.status(401).json({ message: 'Unauthorized', success: false });
    }
    
    let filter = { recipient: userId, isRead: false };
    
    // For Gram Sabha officers, also include notifications by GP Code
    if (userRole === 'GS' || userRole === 'GramSabha') {
      if (userRole === 'GS' && gpCode) {
        filter = {
          $or: [
            { recipient: userId, isRead: false },
            { recipientGpCode: gpCode, isRead: false }
          ]
        };
      } else if (userRole === 'GramSabha') {
        const gsOfficer = await Admin.findById(userId);
        if (gsOfficer && gsOfficer.assignedGpCode) {
          filter = {
            $or: [
              { recipient: userId, isRead: false },
              { recipientGpCode: gsOfficer.assignedGpCode, isRead: false }
            ]
          };
        }
      }
    }

    const count = await Notification.countDocuments(filter);

    res.status(200).json({
      success: true,
      unreadCount: count
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};


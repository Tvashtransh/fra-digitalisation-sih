const express = require('express');
const router = express.Router();
const { 
  getNotifications, 
  markAsRead, 
  markAllAsRead, 
  getUnreadCount 
} = require('../controller/notificationController');
const { requireGS } = require('../middlewares/gsAuth');
const { verifyToken } = require('../middlewares/AdminAuth');

// Gram Sabha notification routes
router.get('/gs/notifications', requireGS, getNotifications);
router.put('/gs/notifications/:notificationId/read', requireGS, markAsRead);
router.put('/gs/notifications/mark-all-read', requireGS, markAllAsRead);
router.get('/gs/notifications/unread-count', requireGS, getUnreadCount);

// Admin notification routes
router.get('/admin/notifications', verifyToken, getNotifications);
router.put('/admin/notifications/:notificationId/read', verifyToken, markAsRead);
router.put('/admin/notifications/mark-all-read', verifyToken, markAllAsRead);
router.get('/admin/notifications/unread-count', verifyToken, getUnreadCount);

module.exports = router;


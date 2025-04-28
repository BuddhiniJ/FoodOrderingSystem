const express = require('express');
const { 
  sendOrderConfirmation,
  sendDeliveryAssignment,
  sendStatusUpdate,
  getNotificationHistory,
  resendNotification
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

// Apply rate limiting to all routes
router.use(rateLimiter);

// Protected routes
router.use(protect);

// Routes accessible by all authenticated users
router.post('/order-confirmation', sendOrderConfirmation);
router.post('/delivery-assignment', sendDeliveryAssignment);
router.post('/status-update', sendStatusUpdate);

// Admin only routes
router.get('/history', authorize('admin'), getNotificationHistory);
router.post('/resend/:id', authorize('admin'), resendNotification);

module.exports = router;

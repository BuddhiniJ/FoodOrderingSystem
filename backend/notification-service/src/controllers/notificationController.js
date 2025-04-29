const emailService = require('../services/emailService');
const smsService = require('../services/smsService');
const Notification = require('../models/Notification');
const logger = require('../utils/logger');

// @desc    Send order confirmation notifications
// @route   POST /api/notifications/order-confirmation
// @access  Private
exports.sendOrderConfirmation = async (req, res) => {
  try {
    const { 
      email, 
      phone, 
      orderData 
    } = req.body;

    // Validate required fields
    if (!orderData || !orderData.orderNumber) {
      return res.status(400).json({
        success: false,
        message: 'Order data is required'
      });
    }

    const results = {
      email: null,
      phone: null
    };

    // Send email notification if email is provided
    if (email) {
      results.email = await emailService.sendOrderConfirmation(email, orderData);
    }

    // Send SMS notification if phone is provided
    if (phone) {
      results.phone = await smsService.sendOrderConfirmation(phone, orderData);
    }

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    logger.error(`Order confirmation error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Send order ayment confirmation notifications
// @route   /api/notifications/order-payconfirmation
// @access  Private
exports.sendOrderPaymentConfirmation = async (req, res) => {
  try {
    const { 
      email, 
      phone, 
      orderData 
    } = req.body;

    // Validate required fields
    if (!orderData || !orderData.orderNumber) {
      return res.status(400).json({
        success: false,
        message: 'Order data is required'
      });
    }

    const results = {
      email: null,
      phone: null
    };

    // Send email notification if email is provided
    if (email) {
      results.email = await emailService.sendOrderPaymentConfirmation(email, orderData);
    }

    // Send SMS notification if phone is provided
    if (phone) {
      results.phone = await smsService.sendOrderPaymentConfirmation(phone, orderData);
    }

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    logger.error(`Order payment confirmation error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Send delivery assignment notifications
// @route   POST /api/notifications/delivery-assignment
// @access  Private
exports.sendDeliveryAssignment = async (req, res) => {
  try {
    const { 
      email, 
      phone, 
      assignmentData 
    } = req.body;

    // Validate required fields
    if (!assignmentData || !assignmentData.orderNumber) {
      return res.status(400).json({
        success: false,
        message: 'Assignment data is required'
      });
    }

    const results = {
      email: null,
      sms: null
    };

    // Send email notification if email is provided
    if (email) {
      results.email = await emailService.sendDeliveryAssignment(email, assignmentData);
    }

    // Send SMS notification if phone is provided
    if (phone) {
      results.sms = await smsService.sendDeliveryAssignment(phone, assignmentData);
    }

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    logger.error(`Delivery assignment error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Send status update notifications
// @route   POST /api/notifications/status-update
// @access  Private
exports.sendStatusUpdate = async (req, res) => {
  try {
    const { 
      email, 
      phone, 
      statusData 
    } = req.body;

    // Validate required fields
    if (!statusData || !statusData.status) {
      return res.status(400).json({
        success: false,
        message: 'Status data is required'
      });
    }

    const results = {
      email: null,
      sms: null
    };

    // Send email notification if email is provided
    if (email) {
      results.email = await emailService.sendStatusUpdate(email, statusData);
    }

    // Send SMS notification if phone is provided
    if (phone) {
      results.sms = await smsService.sendStatusUpdate(phone, statusData);
    }

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    logger.error(`Status update error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get notification history
// @route   GET /api/notifications/history
// @access  Private/Admin
exports.getNotificationHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status } = req.query;
    
    // Build query
    const query = {};
    
    if (type) query.type = type;
    if (status) query.status = status;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get notifications with pagination
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count
    const total = await Notification.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: notifications.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: notifications
    });
  } catch (error) {
    logger.error(`Get notification history error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Resend failed notification
// @route   POST /api/notifications/resend/:id
// @access  Private/Admin
exports.resendNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    if (notification.status !== 'failed') {
      return res.status(400).json({
        success: false,
        message: 'Only failed notifications can be resent'
      });
    }
    
    let result;
    
    // Resend based on notification type
    if (notification.type === 'email') {
      result = await emailService.sendEmail(
        notification.recipient,
        notification.content.subject,
        notification.content.html,
        notification._id
      );
    } else if (notification.type === 'sms') {
      result = await smsService.sendSMS(
        notification.recipient,
        notification.content.body,
        notification._id
      );
    }
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error(`Resend notification error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

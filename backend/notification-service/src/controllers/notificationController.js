const emailService = require('../services/emailService');
const smsService = require('../services/smsService');
const Notification = require('../models/Notification');
const logger = require('../utils/logger');
const { io, deliverySockets } = require('../server');

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

// @desc    Send a notification to the delivery personnel to assign the orders
// @route   POST /api/notifications/order-assignment
// @access  Private
exports.sendOrderAssignment = async (req, res) => {
  try {
    const {       
      assignmentData 
    } = req.body;

    // Validate required fields
    if (!assignmentData || !assignmentData.orderNumber) {
      return res.status(400).json({
        success: false,
        message: 'Assignment data is required'
      });
    }

    const deliveryPersonnelId = assignmentData.deliveryPersonnelId;
    if (deliveryPersonnelId) {
      const socketId = deliverySockets.get(deliveryPersonnelId);
      if (socketId) {
        io.to(socketId).emit('new-delivery-order', {
          title: "New Delivery Order",
          message: `Order #${assignmentData.orderNumber} is ready for delivery.`,
          orderId: assignmentData.orderId,
          restaurantName: assignmentData.restaurantName,
          pickupTime: assignmentData.pickupTime,
          createdAt: new Date(),
        });
      }
    }
    
    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    logger.error(`Order assignment error: ${error.message}`);
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


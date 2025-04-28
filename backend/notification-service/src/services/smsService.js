const axios = require('axios');
const config = require('../config/config');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');
const Notification = require('../models/Notification');

// Load SMS templates
const loadTemplate = (templateName) => {
  const templatePath = path.join(__dirname, '../templates/sms', `${templateName}.js`);
  return require(templatePath);
};

// Send SMS using Text.lk API
const sendSMS = async (to, message, notificationId = null) => {
  try {
    // Format the phone number (ensure it has country code for Sri Lanka)
    let formattedPhone = to.replace(/\D/g, '');
    // Ensure the number starts with country code
    if (!formattedPhone.startsWith('94')) {
      // If number starts with 0, replace it with 94
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '94' + formattedPhone.substring(1);
      } else {
        formattedPhone = '94' + formattedPhone;
      }
    }
    
    // Text.lk API endpoint
    const response = await axios.post(
      'https://app.text.lk/api/v3/sms/send',
      {
        recipient: formattedPhone,
        sender_id: config.sms.senderId,
        type: 'plain',
        message: message
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${config.sms.apiKey}`
        }
      }
    );

    logger.info(`SMS sent to ${to}`);
    
    // Update notification status if ID is provided
    if (notificationId) {
      await Notification.findByIdAndUpdate(notificationId, {
        status: 'sent',
        sentAt: new Date()
      });
    }
    
    return { success: true, data: response.data };
  } catch (error) {
    logger.error(`SMS sending error: ${error.message}`);
    
    // Update notification status if ID is provided
    if (notificationId) {
      await Notification.findByIdAndUpdate(notificationId, {
        status: 'failed',
        error: error.message
      });
    }
    
    return { success: false, error: error.message };
  }
};

// Send order confirmation SMS
exports.sendOrderConfirmation = async (phone, orderData) => {
  try {
    // Create notification record
    const notification = await Notification.create({
      type: 'sms',
      recipient: phone,
      templateData: orderData,
      metadata: {
        orderId: orderData.orderId,
        userId: orderData.userId
      }
    });

    // Get template function and generate message
    const templateFn = loadTemplate('orderConfirmation');
    const message = templateFn(orderData);
    
    // Set message content in notification
    await Notification.findByIdAndUpdate(notification._id, {
      content: { body: message }
    });
    
    // Send SMS
    return await sendSMS(phone, message, notification._id);
  } catch (error) {
    logger.error(`Order confirmation SMS error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Send delivery assignment SMS
exports.sendDeliveryAssignment = async (phone, assignmentData) => {
  try {
    // Create notification record
    const notification = await Notification.create({
      type: 'sms',
      recipient: phone,
      templateData: assignmentData,
      metadata: {
        orderId: assignmentData.orderId,
        deliveryPersonnelId: assignmentData.deliveryPersonnelId
      }
    });

    // Get template function and generate message
    const templateFn = loadTemplate('deliveryAssignment');
    const message = templateFn(assignmentData);
    
    // Set message content in notification
    await Notification.findByIdAndUpdate(notification._id, {
      content: { body: message }
    });
    
    // Send SMS
    return await sendSMS(phone, message, notification._id);
  } catch (error) {
    logger.error(`Delivery assignment SMS error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Send status update SMS
exports.sendStatusUpdate = async (phone, statusData) => {
  try {
    // Create notification record
    const notification = await Notification.create({
      type: 'sms',
      recipient: phone,
      templateData: statusData,
      metadata: {
        orderId: statusData.orderId,
        userId: statusData.userId
      }
    });

    // Get template function and generate message
    const templateFn = loadTemplate('statusUpdate');
    const message = templateFn(statusData);
    
    // Set message content in notification
    await Notification.findByIdAndUpdate(notification._id, {
      content: { body: message }
    });
    
    // Send SMS
    return await sendSMS(phone, message, notification._id);
  } catch (error) {
    logger.error(`Status update SMS error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

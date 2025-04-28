const axios = require('axios');
const config = require('../config/config');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');
const Notification = require('../models/Notification');

// Load email templates
const loadTemplate = (templateName) => {
  const templatePath = path.join(__dirname, '../templates/email', `${templateName}.html`);
  return fs.readFileSync(templatePath, 'utf8');
};

// Replace template variables with actual data
const compileTemplate = (template, data) => {
  let compiledTemplate = template;
  
  for (const key in data) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    compiledTemplate = compiledTemplate.replace(regex, data[key]);
  }
  
  return compiledTemplate;
};

// Send email using Brevo (formerly SendinBlue)
const sendEmail = async (to, subject, htmlContent, notificationId = null) => {
  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: config.email.senderName,
          email: config.email.sender
        },
        to: [{ email: to }],
        subject,
        htmlContent
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': config.email.apiKey
        }
      }
    );

    logger.info(`Email sent to ${to}`);
    
    // Update notification status if ID is provided
    if (notificationId) {
      await Notification.findByIdAndUpdate(notificationId, {
        status: 'sent',
        sentAt: new Date()
      });
    }
    
    return { success: true, data: response.data };
  } catch (error) {
    logger.error(`Email sending error: ${error.message}`);
    
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

// Send order confirmation email
exports.sendOrderConfirmation = async (email, orderData) => {
  try {
    // Create notification record
    const notification = await Notification.create({
      type: 'email',
      recipient: email,
      content: {
        subject: `Order Confirmation #${orderData.orderNumber}`,
      },
      templateData: orderData,
      metadata: {
        orderId: orderData.orderId,
        userId: orderData.userId
      }
    });

    // Load and compile template
    const template = loadTemplate('orderConfirmation');
    const htmlContent = compileTemplate(template, orderData);
    
    // Send email
    return await sendEmail(
      email,
      `Order Confirmation #${orderData.orderNumber}`,
      htmlContent,
      notification._id
    );
  } catch (error) {
    logger.error(`Order confirmation email error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Send delivery assignment email
exports.sendDeliveryAssignment = async (email, assignmentData) => {
  try {
    // Create notification record
    const notification = await Notification.create({
      type: 'email',
      recipient: email,
      content: {
        subject: `New Delivery Assignment #${assignmentData.orderNumber}`,
      },
      templateData: assignmentData,
      metadata: {
        orderId: assignmentData.orderId,
        deliveryPersonnelId: assignmentData.deliveryPersonnelId
      }
    });

    // Load and compile template
    const template = loadTemplate('deliveryAssignment');
    const htmlContent = compileTemplate(template, assignmentData);
    
    // Send email
    return await sendEmail(
      email,
      `New Delivery Assignment #${assignmentData.orderNumber}`,
      htmlContent,
      notification._id
    );
  } catch (error) {
    logger.error(`Delivery assignment email error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Send status update email
exports.sendStatusUpdate = async (email, statusData) => {
  try {
    // Create notification record
    const notification = await Notification.create({
      type: 'email',
      recipient: email,
      content: {
        subject: `Order Status Update: ${statusData.status}`,
      },
      templateData: statusData,
      metadata: {
        orderId: statusData.orderId,
        userId: statusData.userId
      }
    });

    // Load and compile template
    const template = loadTemplate('statusUpdate');
    const htmlContent = compileTemplate(template, statusData);
    
    // Send email
    return await sendEmail(
      email,
      `Order Status Update: ${statusData.status}`,
      htmlContent,
      notification._id
    );
  } catch (error) {
    logger.error(`Status update email error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

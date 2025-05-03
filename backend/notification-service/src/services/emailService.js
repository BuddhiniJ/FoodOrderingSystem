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

const compileTemplate = (template, data) => {
  let compiledTemplate = template;
  
  for (const key in data) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    compiledTemplate = compiledTemplate.replace(regex, data[key]);
  }
  
  return compiledTemplate;
};

// Send email using Brevo 
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

    const template = loadTemplate('orderConfirmation');
    const htmlContent = compileTemplate(template, orderData);
    
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

// Send order payment confirmation email
exports.sendOrderPaymentConfirmation = async (email, orderData) => {
  try {    
    const notification = await Notification.create({
      type: 'email',
      recipient: email,
      content: {
        subject: `Order Payment Confirmation #${orderData.orderNumber}`,
      },
      templateData: orderData,
      metadata: {
        orderId: orderData.orderId,
        userId: orderData.userId
      }
    });
    
    const template = loadTemplate('orderPaymentConfirmation');
    const htmlContent = compileTemplate(template, orderData);
    
    return await sendEmail(
      email,
      `Order Payment Confirmation #${orderData.orderNumber}`,
      htmlContent,
      notification._id
    );
  } catch (error) {
    logger.error(`Order payment confirmation email error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Send delivery assignment email
exports.sendDeliveryAssignment = async (email, assignmentData) => {
  try {
    const notification = await Notification.create({
      type: 'email',
      recipient: email,
      content: {
        subject: `Order Delivery #${assignmentData.orderNumber}`,
      },
      templateData: assignmentData,
      metadata: {
        orderId: assignmentData.orderId,
        deliveryPersonnelId: assignmentData.deliveryPersonnelId
      }
    });

    const template = loadTemplate('deliveryAssignment');
    const htmlContent = compileTemplate(template, assignmentData);
    
    return await sendEmail(
      email,
      `Order Delivery #${assignmentData.orderNumber}`,
      htmlContent,
      notification._id
    );
  } catch (error) {
    logger.error(`Delivery assignment email error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

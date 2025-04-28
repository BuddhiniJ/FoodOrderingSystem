const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['email', 'sms'],
    required: true
  },
  recipient: {
    type: String,
    required: true
  },
  content: {
    subject: String,
    body: String,
    html: String
  },
  templateData: {
    type: mongoose.Schema.Types.Mixed
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  },
  sentAt: Date,
  error: String,
  metadata: {
    orderId: String,
    userId: String,
    restaurantId: String,
    deliveryPersonnelId: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', NotificationSchema);

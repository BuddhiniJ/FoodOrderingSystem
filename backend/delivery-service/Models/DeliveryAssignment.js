// 📁 /delivery-service/models/DeliveryAssignment.js
const mongoose = require('mongoose');
const DeliveryAssignmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  orderId: { type: String, required: true },
  restaurantLocation: {
    lat: Number,
    lng: Number,
  },
  status: {
    type: String,
    enum: ['assigned', 'picked-up', 'delivered'],
    default: 'assigned',
  },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('DeliveryAssignment', DeliveryAssignmentSchema);
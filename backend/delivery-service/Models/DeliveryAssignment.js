const mongoose = require('mongoose');

const DeliveryAssignmentSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Delivery personnel ID
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  customerId: { type: String, required: true },
  restaurantLocation: {
    lat: Number,
    lng: Number
  },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DeliveryAssignment', DeliveryAssignmentSchema);

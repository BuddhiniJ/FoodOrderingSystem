// 📁 /delivery-service/models/DeliveryLocation.js
const mongoose = require('mongoose');
const DeliveryLocationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  currentLocation: {
    lat: Number,
    lng: Number,
  },
  timestamp: { type: Date, default: Date.now },
});
module.exports = mongoose.model('DeliveryLocation', DeliveryLocationSchema);
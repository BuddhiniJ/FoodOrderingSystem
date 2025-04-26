const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  contact: String,
  isAvailable: { type: Boolean, default: true },
  image: { type: String },
  description: String,
  latitude: Number,
  longitude: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // NEW
});

module.exports = mongoose.model('Restaurant', restaurantSchema);

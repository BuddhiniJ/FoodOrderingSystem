const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: String,
  image: { type: String },
  price: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
  category: { type: String } // e.g., "Pizza", "Drinks", "Dessert"
});

module.exports = mongoose.model('MenuItem', menuItemSchema);

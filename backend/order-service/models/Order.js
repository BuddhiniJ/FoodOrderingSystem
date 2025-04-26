const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: String,
  quantity: Number,
  price: Number,
  note: String
});

const orderSchema = new mongoose.Schema({
  customerId: { type: String, required: true }, // Replace with ObjectId if needed later
  restaurantId: { type: mongoose.Schema.Types.ObjectId, required: true },
  reference: { type: String, required: true },
  items: [orderItemSchema],
  totalAmount: Number,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing','ready-for-delivery', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);

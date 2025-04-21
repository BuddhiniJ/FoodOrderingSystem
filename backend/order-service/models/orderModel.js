const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  reference: { type: String, required: true },
  customerId: { type: String, required: true },
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: String,
      quantity: Number,
      price: Number,
      restaurantId: { type: mongoose.Schema.Types.ObjectId, required: true },
      notes: String,
    }
  ],
  totalAmount: Number,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Order', orderSchema);

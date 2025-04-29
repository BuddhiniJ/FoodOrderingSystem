const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "lkr",
  },
  paymentMethod: {
    type: String,
    enum: ["card", "cash"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["created", "processing", "completed", "failed", "refunded"],
    default: "created",
  },
  stripePaymentId: {
    type: String, // Stripe Payment ID (e.g., pi_3JXXXXXXXXX)
  },
  stripeClientSecret: {
    type: String, // If you are using Payment Intents, useful for the frontend
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Automatically update `updatedAt`
paymentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Payment", paymentSchema);

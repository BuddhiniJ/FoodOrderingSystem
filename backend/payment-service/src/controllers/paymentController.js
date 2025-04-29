const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/Payment");

exports.createPaymentIntent = async (req, res) => {
  const { userId, orderId, restaurantId, amount, paymentMethod } = req.body;

  try {
    if (!paymentMethod || !["card", "cash"].includes(paymentMethod)) {
      return res
        .status(400)
        .json({ error: "Invalid or missing payment method." });
    }

    let paymentData = {
      userId,
      orderId,
      restaurantId,
      amount,
      paymentMethod,
      paymentStatus: "created",
    };

    if (paymentMethod === "card") {
      // Create Stripe PaymentIntent only for card
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects cents
        currency: "lkr",
        metadata: { orderId, userId, restaurantId },
      });

      paymentData.stripePaymentId = paymentIntent.id;
      paymentData.stripeClientSecret = paymentIntent.client_secret;
    }

    const payment = new Payment(paymentData);
    await payment.save();

    res.status(201).json({
      message: "Payment created successfully",
      ...(paymentMethod === "card"
        ? { clientSecret: payment.stripeClientSecret }
        : {}),
      payment,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    res.status(500).json({ error: "Payment creation failed." });
  }
};

// Get all Payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payments." });
  }
};

// Get Payment by ID
exports.getPaymentById = async (req, res) => {
  const { id } = req.params;

  try {
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found." });
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payment." });
  }
};

// Get Payments by User ID
exports.getPaymentsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const payments = await Payment.find({ userId });

    if (payments.length === 0) {
      return res
        .status(404)
        .json({ message: "No payments found for this user." });
    }

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments by userId:", error);
    res.status(500).json({ error: "Failed to fetch payments by user." });
  }
};

// Get Payments by Restaurant ID
exports.getPaymentsByRestaurantId = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const payments = await Payment.find({ restaurantId });

    if (payments.length === 0) {
      return res
        .status(404)
        .json({ message: "No payments found for this restaurant." });
    }

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments by restaurantId:", error);
    res.status(500).json({ error: "Failed to fetch payments by restaurant." });
  }
};

// Update a Payment
exports.updatePayment = async (req, res) => {
  const { id } = req.params;
  const updates = req.body; // e.g., paymentStatus: 'succeeded'

  try {
    const payment = await Payment.findByIdAndUpdate(id, updates, { new: true });
    if (!payment) {
      return res.status(404).json({ error: "Payment not found." });
    }
    res.status(200).json({ message: "Payment updated successfully", payment });
  } catch (error) {
    res.status(500).json({ error: "Failed to update payment." });
  }
};

// Delete a Payment
exports.deletePayment = async (req, res) => {
  const { id } = req.params;

  try {
    const payment = await Payment.findByIdAndDelete(id);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found." });
    }
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete payment." });
  }
};

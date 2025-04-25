const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/Payment");

exports.createPaymentIntent = async (req, res) => {
  const { orderId, amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency: "usd",
      metadata: { orderId },
    });

    const payment = new Payment({
      orderId,
      amount,
      currency: "usd",
      stripePaymentId: paymentIntent.id,
      paymentStatus: "created",
    });

    await payment.save();

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Payment creation failed." });
  }
};

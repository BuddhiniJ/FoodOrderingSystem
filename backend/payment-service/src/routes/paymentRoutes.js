const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/create-payment-intent", paymentController.createPaymentIntent);
router.get("/", paymentController.getAllPayments);
router.get("/:id", paymentController.getPaymentById);
router.put("/:id", paymentController.updatePayment);
router.delete("/:id", paymentController.deletePayment);

router.get("/user/:userId", paymentController.getPaymentsByUserId);
router.get(
  "/restaurant/:restaurantId",
  paymentController.getPaymentsByRestaurantId
);

module.exports = router;

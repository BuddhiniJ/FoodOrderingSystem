const express = require("express");
const {
  sendOrderConfirmation,
  sendDeliveryAssignment,
  sendOrderAssignment,
  sendOrderPaymentConfirmation,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/auth");
const rateLimiter = require("../middleware/rateLimiter");

const router = express.Router();

router.use(rateLimiter);

router.use(protect);

router.post("/order-confirmation", sendOrderConfirmation);
router.post("/order-payconfirmation", sendOrderPaymentConfirmation);
router.post("/order-assignment", sendOrderAssignment);
router.post("/delivery-assignment", sendDeliveryAssignment);

module.exports = router;

const express = require('express');
const router = express.Router();
const { saveLocation, pickupOrder } = require('../Controllers/deliveryController');
const authenticate = require('../middleware/auth'); // Ensure user is authenticated with JWT

// POST delivery person's location and auto-assign nearby order
router.post('/location', authenticate, saveLocation);

// POST to mark the order as picked up
router.post('/pickup/:orderId', authenticate, pickupOrder);

module.exports = router;

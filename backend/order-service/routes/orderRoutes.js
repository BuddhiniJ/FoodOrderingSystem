const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');

// Create new order
router.post('/', controller.createOrder);

// Get order by ID
router.get('/:id', controller.getOrderById);

// update order by ID
router.put('/:id', controller.updateOrder);

// Get all orders for a customer
router.get('/user/:id', controller.getOrdersByUserId);

// Update order status
router.patch('/:id/status', controller.updateOrderStatus);

// Get all orders for a restaurant
router.get('/restaurant/:restaurantId', controller.getOrdersByRestaurant);

module.exports = router;

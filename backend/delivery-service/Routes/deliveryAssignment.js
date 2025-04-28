const express = require('express');
const { getAssignedOrder, assignOrder, markOrderAsPickedUp, getAllAssignments ,getAssignmentByOrderId } = require('../Controllers/deliveryAssignController');

const authenticate = require('../middleware/auth');
const router = express.Router();

// Get assigned order for a delivery personnel
router.get('/', authenticate, getAssignedOrder);

// Get all assignments for a delivery personnel
router.get('/all', authenticate, getAllAssignments);

// Assign an order to a delivery personnel
router.post('/', authenticate, assignOrder);

// Mark an order as picked up
router.patch('/:assignmentId/pickup', authenticate, markOrderAsPickedUp);

router.get('/order/:orderId', getAssignmentByOrderId);

module.exports = router;
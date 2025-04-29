const express = require('express');
const router = express.Router();
const {
  getAssignedOrder,
  createAssignment,
  markOrderAsPickedUp,
  getAllAssignments,
  getAssignmentByOrderId,
  deleteAssignment
} = require('../Controllers/deliveryAssignController');

const authenticate = require('../middleware/auth');


// Get latest assigned order
router.get('/', authenticate, getAssignedOrder);

// Get all assignments
router.get('/all', authenticate, getAllAssignments);

// Assign new order
router.post('/', authenticate, createAssignment);

// Mark order as picked up
router.patch('/:assignmentId/pickup', authenticate, markOrderAsPickedUp);

// Get assignment by order ID
router.get('/order/:orderId', authenticate, getAssignmentByOrderId);

// Delete an assignment
router.delete('/:id', authenticate, deleteAssignment);

module.exports = router;

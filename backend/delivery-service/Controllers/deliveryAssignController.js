const DeliveryAssignment = require('../Models/DeliveryAssignment');
const axios = require('axios');

// ...existing code...

// @desc    Get all assignments for a delivery personnel
// @route   GET /api/assignments/all
// @access  Private
exports.getAllAssignments = async (req, res) => {
  try {
    const userId = req.user.id;
    // REMOVE .populate('orderId')
    const assignments = await DeliveryAssignment.find({ userId })
      .sort({ createdAt: -1 });
    res.status(200).json({ assignments });
  } catch (error) {
    console.error('Error fetching all assignments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAssignedOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    // REMOVE .populate('orderId')
    const assignment = await DeliveryAssignment.findOne({ userId })
      .sort({ createdAt: -1 });
    if (!assignment) {
      return res.status(404).json({ message: 'No assigned order found' });
    }
    res.status(200).json({ assignment });
  } catch (error) {
    console.error('Error fetching assigned order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Assign an order to a delivery personnel
// @route   POST /api/assignments
// @access  Private
exports.assignOrder = async (req, res) => {
  try {
    const userId = req.user.id; // Delivery person id from JWT
    const { orderId, customerId, restaurantLocation , restaurantId } = req.body;

    // Validate input
    if (!orderId || !customerId || !restaurantLocation || !restaurantId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create a new delivery assignment
    const assignment = new DeliveryAssignment({
      userId, // from JWT
      orderId,
      customerId,
      restaurantLocation,
      restaurantId,
    });

    try {
      await assignment.save();
    } catch (error) {
      console.error('Error saving delivery assignment:', error.message);
      return res.status(500).json({ message: 'Failed to save delivery assignment' });
    }

    res.status(201).json({ message: 'Order assigned successfully', assignment });
  } catch (error) {
    console.error('Error assigning order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark an order as picked up
// @route   PATCH /api/assignments/:assignmentId/pickup
// @access  Private
exports.markOrderAsPickedUp = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    // Find the delivery assignment
    const assignment = await DeliveryAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Update the order status in the Order service
    await axios.patch(`http://localhost:5004/api/orders/${assignment.orderId}/status`, { status: 'out-for-delivery' });

    res.status(200).json({ message: 'Order marked as picked up', assignment });
  } catch (error) {
    console.error('Error marking order as picked up:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Get assignment by Order ID
// @route GET /api/assignments/order/:orderId
// @access Private (optional)
exports.getAssignmentByOrderId = async (req, res) => {
  try {
    const assignment = await DeliveryAssignment.findOne({ orderId: req.params.orderId });
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.status(200).json({ assignment });
  } catch (error) {
    console.error('Error fetching assignment by order id:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

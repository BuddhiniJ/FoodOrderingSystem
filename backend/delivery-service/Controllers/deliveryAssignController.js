const DeliveryAssignment = require('../Models/DeliveryAssignment');
const axios = require('axios');

// @desc    Create a new delivery assignment
// @route   POST /api/assignments
// @access  Private
exports.createAssignment = async (req, res) => {
  try {
    const { orderId, customerId, restaurantLocation, restaurantId } = req.body;
    const userId = req.user.id; // ✅ Authenticated user ID from token

    if (!orderId || !customerId || !restaurantLocation || !restaurantId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const assignment = new DeliveryAssignment({
      userId,
      orderId,
      customerId,
      restaurantLocation,
      restaurantId,
    });

    await assignment.save();
    res.status(201).json({ message: 'Assignment created successfully', assignment });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all delivery assignments for a delivery personnel
// @route   GET /api/assignments/all
// @access  Private
exports.getAllAssignments = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ Authenticated user
    const assignments = await DeliveryAssignment.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get the latest assigned order
// @route   GET /api/assignments
// @access  Private
exports.getAssignedOrder = async (req, res) => {
  try {
    const userId = req.user.id; // ✅
    const assignment = await DeliveryAssignment.findOne({ userId }).sort({ createdAt: -1 });

    if (!assignment) {
      return res.status(404).json({ message: 'No assigned order found' });
    }

    res.status(200).json({ assignment });
  } catch (error) {
    console.error('Error fetching assigned order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark order as picked up
// @route   PATCH /api/assignments/:assignmentId/pickup
// @access  Private
exports.markOrderAsPickedUp = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await DeliveryAssignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    await axios.patch(`http://localhost:5004/api/orders/${assignment.orderId}/status`, { status: 'out-for-delivery' });

    res.status(200).json({ message: 'Order marked as picked up', assignment });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an assignment
// @route   DELETE /api/assignments/:id
// @access  Private
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await DeliveryAssignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get assignment by Order ID
// @route   GET /api/assignments/order/:orderId
// @access  Private
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

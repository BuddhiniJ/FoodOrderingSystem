const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) res.json(order);
  else res.status(404).json({ message: "Order not found" });
};

exports.getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const orders = await Order.find({ customerId: userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('[Order Fetch Error]', err);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  // Check if the status is valid based on the schema enum
  const validStatuses = ['pending', 'confirmed', 'preparing', 'ready-for-delivery', 'out-for-delivery', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } // Return the updated document
    );

    // If order not found
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(updatedOrder); // Send back the updated order
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getOrdersByRestaurant = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const query = { restaurantId: req.params.restaurantId };

    // Optional status filter
    if (status) {
      query.status = status;
    }

    // Optional date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        // Include entire day of endDate by setting to 23:59:59
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// backend/controllers/orderController.js
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be updated' });
    }

    order.items = req.body.items;
    order.totalAmount = req.body.items.reduce((sum, i) => sum + i.quantity * i.price, 0);
    await order.save();

    res.json(order);
  } catch (err) {
    console.error('[Update Order Error]', err);
    res.status(500).json({ message: 'Server error' });
  }
};


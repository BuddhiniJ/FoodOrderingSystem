const DeliveryLocation = require('../Models/DeliveryLocation');
const DeliveryAssignment = require('../Models/DeliveryAssignment');
const axios = require('axios');

const saveLocation = async (req, res) => {
  const userId = req.user.id;
  const { lat, lng } = req.body;

  try {
    await DeliveryLocation.findOneAndUpdate(
      { userId },
      { currentLocation: { lat, lng }, timestamp: new Date() },
      { upsert: true, new: true }
    );

    // Fetch orders & restaurant data (from your order and restaurant services)
    const { data: orders } = await axios.get('http://localhost:5002/api/orders'); // Example URL
    const { data: restaurants } = await axios.get('http://localhost:5003/api/restaurants');

    const nearbyOrders = orders.filter(order => {
      const restaurant = restaurants.find(r => r._id === order.restaurantId);
      if (!restaurant) return false;

      const distance = Math.sqrt(
        Math.pow(restaurant.location.lat - lat, 2) +
        Math.pow(restaurant.location.lng - lng, 2)
      );

      return distance < 0.1; // Adjust proximity threshold
    });

    if (nearbyOrders.length > 0) {
      const order = nearbyOrders[0]; // Assign only the first one for now
      await DeliveryAssignment.create({
        userId,
        orderId: order._id,
        restaurantId: order.restaurantId,
        status: 'assigned',
        assignedAt: new Date()
      });
    }

    res.json({ message: 'Location updated and assignment checked.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const pickupOrder = async (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.orderId;

  try {
    await DeliveryAssignment.findOneAndUpdate(
      { userId, orderId },
      { status: 'picked-up' }
    );

    await axios.put(`http://localhost:5002/api/orders/${orderId}/status`, {
      status: 'delivery-mode'
    });

    res.json({ message: 'Order picked up and status updated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update order' });
  }
};

module.exports = { saveLocation, pickupOrder };

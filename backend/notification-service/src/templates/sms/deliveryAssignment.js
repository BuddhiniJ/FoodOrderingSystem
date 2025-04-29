module.exports = (data) => {
  return `Hello ${data.customerName}, your order #${data.orderNumber} from ${data.restaurantName} is on its way! Delivery by ${data.deliveryPersonName} (${data.deliveryPersonPhone}), picked up at ${data.pickupTime}. Address: ${data.deliveryAddress}`;
};

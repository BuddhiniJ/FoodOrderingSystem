module.exports = (data) => {
  return `Your order #${data.orderNumber} from ${data.restaurantName} has been confirmed! Total: ${data.total}. Est. delivery: ${data.estimatedDeliveryTime}. Track: ${data.trackingLink}`;
};

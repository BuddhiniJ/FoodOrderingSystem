module.exports = (data) => {
  return `Your order #${data.orderNumber} has been confirmed! Total: ${data.total}. Est. delivery: ${data.estimatedDeliveryTime}.`;
};

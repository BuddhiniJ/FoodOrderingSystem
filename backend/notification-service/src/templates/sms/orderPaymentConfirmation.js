module.exports = (data) => {
  return `Dear ${data.customerName}, your payment of ${data.total} for order #${data.orderNumber} at ${data.restaurantName} on ${data.orderDate} was received. Your Items: ${data.orderItemssms}. Thank you for choosing us!`;
};

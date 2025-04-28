module.exports = (data) => {
  return `Hello ${data.customerName}, Your order #${data.orderNumber} has been confirmed! Your Items: ${data.orderItemssms}. Total: ${data.total}.`;
};

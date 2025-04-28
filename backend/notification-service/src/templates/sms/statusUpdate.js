module.exports = (data) => {
  return `Order #${data.orderNumber} status: ${data.status}. ${data.statusMessage} Track: ${data.trackingLink}`;
};

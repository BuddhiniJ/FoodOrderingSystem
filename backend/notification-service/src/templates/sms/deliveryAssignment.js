module.exports = (data) => {
    return `New delivery assignment: Order #${data.orderNumber} from ${data.restaurantName}. Pickup at: ${data.pickupTime}. Customer: ${data.customerName}, ${data.customerPhone}. Accept: ${data.acceptLink}`;
  };
  
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import MainLayout from '../layout/MainLayout';

const OrderHistory = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:5004/api/orders/user/${user._id}`);
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchOrders();
  }, [user]);

  // format order items for the notification
  const formatOrderItemsemail = (items) => {
    return items.map(item => 
      `<div class="order-item">${item.quantity}x ${item.name} - Rs. ${item.price * item.quantity}</div>`
    ).join('');
  };

  const formatOrderItemssms = (items) => {
    return items.map(item => 
      `${item.quantity}x ${item.name} - Rs. ${item.price * item.quantity}`
    ).join(', ');
  };

  const sendOrderConfirmation = async (order) => {
    try {      

      const orderData = {
        orderNumber: order.reference,
        orderId: order._id,
        userId: user._id,
        customerName: user.name,
        orderDate: new Date(order.createdAt).toLocaleString(),        
        orderItemsemail: formatOrderItemsemail(order.items),
        orderItemssms: formatOrderItemssms(order.items),        
        subtotal: `Rs. ${(order.totalAmount - (order.deliveryFee || 0)).toFixed(2)}`,
        // deliveryFee: `Rs. ${(order.deliveryFee || 0).toFixed(2)}`,
        total: `Rs. ${order.totalAmount.toFixed(2)}`,            
        currentYear: new Date().getFullYear()
      };

      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:5002/api/notifications/order-confirmation',
        {
          email: user.email,
          phone: user.phone,
         orderData
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log(`Order confirmation sent for order ${order.reference}`);
    } catch (error) {
      console.error('Failed to send order confirmation:', error.message);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5004/api/orders/${orderId}/status`, { status: newStatus });
      
      // Update the orders state
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      );
      
      setOrders(updatedOrders);
      
      // If the new status is 'confirmed', send the confirmation notification
      if (newStatus === 'confirmed') {
        const confirmedOrder = updatedOrders.find(order => order._id === orderId);
        if (confirmedOrder) {
          await sendOrderConfirmation(confirmedOrder);
        }
      }
    } catch (err) {
      console.error('Failed to update order status', err);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading order history...</div>;

  return (
    <MainLayout>
      <div className="order-history-container">
        <h1 className="order-history-title">Your Order History</h1>
        
        {orders.length === 0 ? (
          <div className="no-orders-message">No past orders found.</div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-ref">Ref: {order.reference}</div>
                  <div className={`order-status order-status-${order.status}`}>
                    Status: {order.status}
                  </div>
                </div>
                
                <ul className="order-items">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="order-item">
                      <div className="item-details">
                        {item.name} x {item.quantity} - Rs. {item.price * item.quantity}
                      </div>
                      {item.note && <div className="item-note">Note: {item.note}</div>}
                    </li>
                  ))}
                </ul>
                
                <div className="order-footer">
                  <div className="order-total">Total: Rs. {order.totalAmount}</div>
                  <div className="order-date">Ordered on {new Date(order.createdAt).toLocaleString()}</div>

                  {/* Buttons only for pending orders */}
                  {order.status === 'pending' && (
                    <div className="order-actions">
                      <Link to={`/edit-order/${order._id}`} className="edit-order-btn">
                        Edit Order
                      </Link>
                      <button
                        className="confirm-order-btn"
                        onClick={() => updateOrderStatus(order._id, 'confirmed')}
                      >
                        Confirm Order
                      </button>
                      <button
                        className="cancel-order-btn"
                        onClick={() => updateOrderStatus(order._id, 'cancelled')}
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}

                  {/* Buttons only for pending orders */}
                  {order.status === 'confirmed' && order.paymentStatus === 'pending' &&(
                    <div className="order-actions">
                      
                      <button
                        className="confirm-order-btn"
                        
                      >
                        Make Payment
                      </button>
                      
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default OrderHistory;
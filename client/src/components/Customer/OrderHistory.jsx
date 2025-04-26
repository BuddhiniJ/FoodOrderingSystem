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
        const res = await axios.get(`http://localhost:5004/api/orders/user/${user.id}`);
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchOrders();
  }, [user]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5004/api/orders/${orderId}/status`, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
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
                        {item.name} x {item.quantity} — Rs. {item.price * item.quantity}
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

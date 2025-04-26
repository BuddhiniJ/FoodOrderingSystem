import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MainLayout from '../layout/MainLayout';

const RestaurantOrders = () => {
  const { id } = useParams(); // Restaurant ID from URL
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
  const [activeTab, setActiveTab] = useState('pending'); // Track active tab status

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:5004/api/orders/restaurant/${id}`);
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [id]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5004/api/orders/${orderId}/status`, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return {
          bg: '#fff0f0',
          text: 'var(--primary-color)',
        };
      case 'confirmed':
        return {
          bg: '#f7f7f7',
          text: 'var(--secondary-color)',
        };
      case 'preparing':
        return {
          bg: '#FFF8E1',
          text: '#F57C00',
        };
      case 'ready-for-delivery':
        return {
          bg: '#E3F2FD',
          text: '#1976D2',
        };
      case 'out-for-delivery':
        return {
          bg: 'var(--light-accent)',
          text: 'var(--accent-color)',
        };
      case 'delivered':
        return {
          bg: '#E8F5E9',
          text: 'var(--success-color)',
        };
      case 'cancelled':
        return {
          bg: '#FFEBEE',
          text: 'var(--danger-color)',
        };
      default:
        return {
          bg: 'var(--light-color)',
          text: 'var(--text-color)',
        };
    }
  };

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Filter orders by date
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const startDate = new Date(dateFilter.startDate);
    const endDate = new Date(dateFilter.endDate);
    return (
      (!dateFilter.startDate || orderDate >= startDate) &&
      (!dateFilter.endDate || orderDate <= endDate)
    );
  });

  // Sort orders by placed date (most recent first)
  const sortedOrders = filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading) return <div className="loading-indicator">Loading orders...</div>;

  // Filter orders based on active tab (status)
  const ordersByStatus = sortedOrders.filter((order) => order.status === activeTab);

  return (
    <MainLayout>
      <div className="orders-container">
        <div className="orders-header">
          <h1 className="orders-title">Orders for Your Restaurant</h1>

          {/* Date filter inputs */}
          <div className="date-filter">
            <input
              type="date"
              name="startDate"
              value={dateFilter.startDate}
              onChange={handleDateFilterChange}
              className="date-input"
            />
            <input
              type="date"
              name="endDate"
              value={dateFilter.endDate}
              onChange={handleDateFilterChange}
              className="date-input"
            />
          </div>
        </div>

        {/* Tabs for each order status */}
        <div className="status-tabs">
          {['pending', 'confirmed', 'preparing', 'ready-for-delivery', 'out-for-delivery', 'delivered', 'cancelled'].map(
            (status) => (
              <button
                key={status}
                className={`tab ${activeTab === status ? 'active' : ''}`}
                onClick={() => setActiveTab(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            )
          )}
        </div>

        {/* Orders List */}
        {ordersByStatus.length === 0 ? (
          <div className="no-orders">
            <p>No orders found for this status.</p>
          </div>
        ) : (
          <div className="orders-list">
            {ordersByStatus.map((order) => {
              const statusStyle = getStatusColor(order.status);

              return (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <h2 className="order-reference">Order Ref: {order.reference}</h2>
                    <span
                      className="order-status"
                      style={{
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.text,
                      }}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="order-items">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <div className="item-details">
                          <span className="item-name">{item.name}</span>
                          <span className="item-quantity">x {item.quantity}</span>
                          <span className="item-price">Rs. {item.price * item.quantity}</span>
                        </div>
                        {item.note && <div className="item-note">Note: {item.note}</div>}
                      </div>
                    ))}
                  </div>

                  <div className="order-summary">
                    <p className="order-total">Total: Rs. {order.totalAmount}</p>
                    <p className="order-date">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                  </div>

                  <div className="order-actions">
                    <label className="status-label">Update Status:</label>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="status-select"
                      disabled={order.status === 'pending' || order.status === 'cancelled'}
                    >

                      {/* <option value="pending">Pending</option> */}
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready-for-delivery">Ready for Delivery</option>
                      <option value="out-for-delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      {/* <option value="cancelled">Cancelled</option> */}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default RestaurantOrders;

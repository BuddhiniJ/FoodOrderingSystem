// src/pages/Customer/OrderHistory.jsx
import React, { useEffect, useState, useContext } from 'react';
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

  if (loading) return <div className="p-6 text-center">Loading order history...</div>;

  return (
    <MainLayout>
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Your Order History</h1>
      {orders.length === 0 ? (
        <p>No past orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="border rounded p-4 shadow">
              <h2 className="text-lg font-semibold mb-2">Ref: {order.reference}</h2>
              <p className="text-sm text-gray-600">Status: <span className="font-medium">{order.status}</span></p>
              <ul className="mt-2 list-disc pl-6">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} x {item.quantity} — Rs. {item.price * item.quantity}
                    {item.note && <span className="block text-xs text-gray-500 italic">Note: {item.note}</span>}
                  </li>
                ))}
              </ul>
              <p className="mt-2 font-bold">Total: Rs. {order.totalAmount}</p>
              <p className="text-sm text-gray-400">Ordered on {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
    </MainLayout>
  );
};

export default OrderHistory;

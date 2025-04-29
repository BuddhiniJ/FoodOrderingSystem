// order details

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MainLayout from "../layout/MainLayout";

const OrderDetails = () => {
  const { id } = useParams(); // order id from URL
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`http://localhost:5004/api/orders/${id}`);
      setOrder(res.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  if (!order) return <div className="text-center mt-5">Loading order details...</div>;

  return (
    <MainLayout>
      <div className="container mt-5">
        <h2 className="text-center mb-4">Order Details</h2>
        <div className="card p-4">
          <h5>Order Reference: {order.reference}</h5>
          <p>Status: <strong>{order.status}</strong></p>

          <h6>Items:</h6>
          <ul>
            {order.items.map((item) => (
              <li key={item.itemId}>
                {item.name} x {item.quantity} — Rs. {item.price}
              </li>
            ))}
          </ul>

          <h6 className="mt-4">Total Amount:</h6>
          <p><strong>Rs. {order.totalAmount}</strong></p>

          <p className="mt-4 text-muted">
            Created at: {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderDetails;

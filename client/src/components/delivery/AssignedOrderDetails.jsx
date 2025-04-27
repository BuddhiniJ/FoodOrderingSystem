import React, { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";
import { useLocation, useNavigate } from "react-router-dom";

const AssignedOrderDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const assignment = location.state?.assignment;
  const [customer, setCustomer] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!assignment) return;
      try {
        // Fetch customer details from user service
        const res = await axios.get(
          `http://localhost:5002/api/users/${assignment.customerId}`
        );
        setCustomer(res.data);
      } catch (err) {
        setStatus("Failed to fetch customer details.");
      }
    };
    fetchCustomer();
  }, [assignment]);

  const handleMarkDelivered = async () => {
    try {
      setLoading(true);
      // Update order status to delivered
      await axios.patch(
        `http://localhost:5004/api/orders/${assignment.orderId}/status`,
        { status: "delivered" }
      );
      setStatus("Order marked as delivered!");
    } catch (err) {
      setStatus("Failed to update order status.");
    } finally {
      setLoading(false);
    }
  };

  if (!assignment) return <div>No assignment found.</div>;

  return (
    <MainLayout>
      <div className="container mt-5">
        <h2>Assigned Order Details</h2>
        <p><strong>Order ID:</strong> {assignment.orderId}</p>
        <p><strong>Customer ID:</strong> {assignment.customerId}</p>
        {customer ? (
          <div className="card p-3 my-3">
            <h4>Customer Details</h4>
            <p><strong>Name:</strong> {customer.name}</p>
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Phone:</strong> {customer.phone}</p>
            <p><strong>Address:</strong> {customer.address}</p>
          </div>
        ) : (
          <div>Loading customer details...</div>
        )}
        <button
          className="btn btn-success"
          onClick={handleMarkDelivered}
          disabled={loading}
        >
          {loading ? "Processing..." : "Mark as Delivered"}
        </button>
        {status && <div className="alert alert-info mt-3">{status}</div>}
        <button className="btn btn-secondary mt-2" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </MainLayout>
  );
};

export default AssignedOrderDetails;
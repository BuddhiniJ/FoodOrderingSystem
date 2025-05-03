import React, { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";
import "./ResturantsPayments.css";

const MyRestaurantsPayments = () => {
  const token = localStorage.getItem("token");
  const [restaurants, setRestaurants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

   const RESTAURANT_API = import.meta.env.VITE_RESTAURANT_SERVICE_URL;
    const PAYMENT_API = import.meta.env.VITE_PAYMENT_SERVICE_URL;


  useEffect(() => {
    const fetchPaymentsForMyRestaurants = async () => {
      try {
        const restaurantRes = await axios.get(
          `${RESTAURANT_API}/restaurants/my-restaurants`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const restaurantList = restaurantRes.data || [];
        setRestaurants(restaurantList);
        const restaurantIds = restaurantList.map((r) => r._id);

        const paymentRequests = restaurantIds.map((id) =>
          axios.get(`${PAYMENT_API}/payments/restaurant/${id}`)
        );
        const paymentResponses = await Promise.all(paymentRequests);
        const allPayments = paymentResponses.flatMap((res) => res.data);

        setPayments(allPayments);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Failed to load payments.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPaymentsForMyRestaurants();
    } else {
      setError("Authentication required.");
      setLoading(false);
    }
  }, [token]);

  const handleStatusChange = (paymentId, newStatus) => {
    setPayments((prev) =>
      prev.map((p) =>
        p._id === paymentId ? { ...p, paymentStatus: newStatus } : p
      )
    );
  };

  const handleUpdate = async (paymentId, status) => {
    try {
      await axios.put(`${PAYMENT_API}/payments/${paymentId}`, {
        paymentStatus: status,
      });
      alert("Payment status updated.");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (paymentId) => {
    if (!window.confirm("Delete this payment?")) return;
    try {
      await axios.delete(`${PAYMENT_API}/payments/${paymentId}`);
      setPayments((prev) => prev.filter((p) => p._id !== paymentId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete.");
    }
  };

  const filteredPayments = payments.filter(
    (payment) =>
      payment.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      payment.userId?.toLowerCase().includes(search.toLowerCase())
  );

  const groupedPayments = {};
  filteredPayments.forEach((payment) => {
    if (!groupedPayments[payment.restaurantId]) {
      groupedPayments[payment.restaurantId] = [];
    }
    groupedPayments[payment.restaurantId].push(payment);
  });

  const getRestaurantName = (id) => {
    const rest = restaurants.find((r) => r._id === id);
    return rest ? rest.name : id;
  };

  if (loading) return <div className="loading">Loading payments...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <MainLayout>
      <div className="payments-container">
        <h2 className="title">Payments by Restaurant</h2>

        <input
          type="text"
          placeholder="Search by Order ID or User ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        {Object.keys(groupedPayments).length === 0 ? (
          <p className="empty">No payments found.</p>
        ) : (
          Object.entries(groupedPayments).map(([restaurantId, payments]) => (
            <div key={restaurantId} className="restaurant-block">
              <h3 className="restaurant-name">
                {getRestaurantName(restaurantId)}
              </h3>
              <div className="payments-grid">
                {payments.map((payment) => (
                  <div key={payment._id} className="payment-card">
                    <p>
                      <strong>User:</strong> {payment.userId}
                    </p>
                    <p>
                      <strong>Order:</strong> {payment.orderId}
                    </p>
                    <p>
                      <strong>Amount:</strong> {payment.amount}{" "}
                      {payment.currency.toUpperCase()}
                    </p>
                    <p>
                      <strong>Method:</strong> {payment.paymentMethod}
                    </p>
                    <p>
                      <strong>Created:</strong>{" "}
                      {new Date(payment.createdAt).toLocaleString()}
                    </p>

                    <div className="status-section">
                      <label>Status:</label>
                      <select
                        value={payment.paymentStatus}
                        onChange={(e) =>
                          handleStatusChange(payment._id, e.target.value)
                        }
                      >
                        <option value="created">Created</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>

                    <div className="button-group">
                      <button
                        onClick={() =>
                          handleUpdate(payment._id, payment.paymentStatus)
                        }
                        className="update-btn"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(payment._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </MainLayout>
  );
};

export default MyRestaurantsPayments;

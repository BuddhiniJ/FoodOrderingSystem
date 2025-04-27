import React, { useState, useEffect } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";
import "./CSS/deliveryHome.css";

// Main component for delivery location and assignments
const DeliveryLocationUpdater = () => {
  // State declarations
  const [allAssignments, setAllAssignments] = useState([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [availability, setAvailability] = useState(true);
  const [status, setStatus] = useState("");
  const [assignedAssignment, setAssignedAssignment] = useState(null);
  const [assignedOrder, setAssignedOrder] = useState(null);
  const [customerPhone, setCustomerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [nearbyOrders, setNearbyOrders] = useState([]);
  const [loadingRow, setLoadingRow] = useState(null);

  // Fetch all assignments on mount
  useEffect(() => {
    const fetchAllAssignments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get("http://localhost:5005/api/assignments/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllAssignments(res.data.assignments || []);
      } catch {
        setAllAssignments([]);
      }
    };
    fetchAllAssignments();
  }, []);

  // Fetch and attach customer phone for each assignment
  useEffect(() => {
    const fetchPhones = async () => {
      const token = localStorage.getItem("token");
      const updated = await Promise.all(
        allAssignments.map(async (assignment) => {
          if (assignment.customerPhone) return assignment;
          try {
            const res = await axios.get(
              `http://localhost:5002/api/users/${assignment.customerId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return { ...assignment, customerPhone: res.data.phone || "N/A" };
          } catch {
            return { ...assignment, customerPhone: "N/A" };
          }
        })
      );
      setAllAssignments(updated);
    };
    if (allAssignments.length > 0) fetchPhones();
    // eslint-disable-next-line
  }, [allAssignments.length]);

  // Fetch assigned assignment on mount
  useEffect(() => {
    const fetchAssignedAssignment = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get("http://localhost:5005/api/assignments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data && res.data.assignment) {
          setAssignedAssignment({
            assignmentId: res.data.assignment._id,
            orderId: res.data.assignment.orderId._id,
            customerId: res.data.assignment.customerId,
          });
        }
      } catch {
        // No assigned order, do nothing
      }
    };
    fetchAssignedAssignment();
  }, []);

  // Fetch customer phone when assignedAssignment changes (for single assigned order)
  useEffect(() => {
    const fetchCustomerPhone = async () => {
      if (assignedAssignment && assignedAssignment.customerId) {
        try {
          const res = await axios.get(
            `http://localhost:5001/api/users/${assignedAssignment.customerId}`
          );
          setCustomerPhone(res.data.phone || "N/A");
        } catch {
          setCustomerPhone("N/A");
        }
      } else {
        setCustomerPhone("");
      }
    };
    fetchCustomerPhone();
  }, [assignedAssignment]);

  // Fetch assigned order details (status) when assignedAssignment changes
  useEffect(() => {
    const fetchOrder = async () => {
      if (assignedAssignment && assignedAssignment.orderId) {
        try {
          const res = await axios.get(
            `http://localhost:5004/api/orders/${assignedAssignment.orderId}`
          );
          setAssignedOrder(res.data);
        } catch {
          setAssignedOrder(null);
        }
      } else {
        setAssignedOrder(null);
      }
    };
    fetchOrder();
  }, [assignedAssignment]);

  // Use browser geolocation to set current location
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setStatus("Location fetched successfully!");
      },
      () => {
        setStatus("Unable to retrieve your location.");
      }
    );
  };

  // Fetch nearby restaurants and orders
  const fetchNearbyRestaurantsAndOrders = async () => {
    try {
      setNearbyOrders([]);
      const resRestaurants = await axios.get("http://localhost:5003/api/restaurants");
      const restaurants = resRestaurants.data;
      const filtered = restaurants.filter((restaurant) => {
        const getDistance = (lat1, lon1, lat2, lon2) => {
          const toRad = (value) => (value * Math.PI) / 180;
          const R = 6371;
          const dLat = toRad(lat2 - lat1);
          const dLon = toRad(lon2 - lon1);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };
        return getDistance(
          latitude,
          longitude,
          restaurant.latitude,
          restaurant.longitude
        ) <= 1.0;
      });
      setNearbyRestaurants(filtered);

      const ordersArr = [];
      for (let restaurant of filtered) {
        const resOrders = await axios.get(
          `http://localhost:5004/api/orders/restaurant/${restaurant._id}?status=ready-for-delivery`
        );
        ordersArr.push({
          restaurant,
          orders: resOrders.data,
        });
      }
      setNearbyOrders(ordersArr);
    } catch {
      setNearbyRestaurants([]);
      setNearbyOrders([]);
      setStatus("Failed to fetch nearby restaurants or orders.");
    }
  };

  // Fetch nearby restaurants/orders when location changes
  useEffect(() => {
    if (latitude && longitude) {
      fetchNearbyRestaurantsAndOrders();
    }
    // eslint-disable-next-line
  }, [latitude, longitude]);

  // Accept an order
  const handleAcceptOrder = async (order, restaurant) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus("Token not found. Please log in again.");
        return;
      }
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5005/api/assignments",
        {
          orderId: order._id,
          customerId: order.customerId,
          restaurantLocation: {
            lat: restaurant.latitude,
            lng: restaurant.longitude,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStatus(`Assigned Order ID ${order._id} successfully!`);
      setAssignedAssignment(res.data.assignment);
      fetchNearbyRestaurantsAndOrders();
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error assigning order.";
      setStatus(msg);
      fetchNearbyRestaurantsAndOrders();
    } finally {
      setLoading(false);
    }
  };

  // Mark an order as picked up
  const handleMarkPickedUp = async (assignment) => {
    setLoadingRow(assignment._id);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus("Token not found. Please log in again.");
        setLoadingRow(null);
        return;
      }
      await axios.patch(
        `http://localhost:5005/api/assignments/${assignment._id}/pickup`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(`Order ${assignment.orderId?._id || assignment.orderId} is now out for delivery!`);
      // Update status in UI
      setAllAssignments((prev) =>
        prev.map((a) =>
          a._id === assignment._id
            ? {
                ...a,
                orderId: {
                  ...a.orderId,
                  status: "out-for-delivery",
                },
              }
            : a
        )
      );
    } catch {
      setStatus("Failed to mark order as picked up.");
    } finally {
      setLoadingRow(null);
    }
  };

  // Mark an order as delivered
  const handleMarkDelivered = async (assignment) => {
    setLoadingRow(assignment._id);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus("Token not found. Please log in again.");
        setLoadingRow(null);
        return;
      }
      await axios.patch(
        `http://localhost:5004/api/orders/${assignment.orderId?._id || assignment.orderId}/status`,
        { status: "delivered" }
      );
      setStatus(`Order ${assignment.orderId?._id || assignment.orderId} marked as delivered!`);
      // Update status in UI
      setAllAssignments((prev) =>
        prev.map((a) =>
          a._id === assignment._id
            ? {
                ...a,
                orderId: {
                  ...a.orderId,
                  status: "delivered",
                },
              }
            : a
        )
      );
    } catch {
      setStatus("Failed to update order status.");
    } finally {
      setLoadingRow(null);
    }
  };

  // Submit location and availability
  const handleSubmitLocation = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus("Token not found. Please log in again.");
        return;
      }
      setLoading(true);

      await axios.post(
        "http://localhost:5005/api/location",
        {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          availability,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStatus("Location updated successfully!");

      if (availability) {
        await fetchNearbyRestaurantsAndOrders();
      }
    } catch {
      setStatus("Failed to update location and availability.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mt-5">
        {/* ================= All Assignments Table ================= */}
        <div className="card mt-4 p-4 shadow-sm">
          <h4 className="mb-3">All Assigned Orders</h4>
          {status && (
            <div className="alert alert-info text-center">{status}</div>
          )}
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Customer Phone</th>
                  <th>Status</th>
                  <th>Assigned At</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {allAssignments.length > 0 ? (
                  allAssignments.map((assignment) => (
                    <tr key={assignment._id}>
                      <td>{assignment.orderId?._id || assignment.orderId}</td>
                      <td>{assignment.customerPhone || "Loading..."}</td>
                      <td>
                        <span className={
                          assignment.orderId?.status === "delivered"
                            ? "badge bg-success"
                            : assignment.orderId?.status === "out-for-delivery"
                            ? "badge bg-warning text-dark"
                            : "badge bg-secondary"
                        }>
                          {assignment.orderId?.status?.replace(/-/g, " ") || "N/A"}
                        </span>
                      </td>
                      <td>{new Date(assignment.createdAt).toLocaleString()}</td>
                      <td>
                        {/* Pickup Button */}
                        <button
                          className="btn btn-primary btn-sm mb-2 w-100"
                          onClick={() => handleMarkPickedUp(assignment)}
                          disabled={
                            loadingRow === assignment._id ||
                            assignment.orderId?.status === "out-for-delivery" ||
                            assignment.orderId?.status === "delivered"
                          }
                        >
                          {loadingRow === assignment._id &&
                          assignment.orderId?.status !== "delivered"
                            ? "Processing..."
                            : assignment.orderId?.status === "out-for-delivery"
                            ? "Out for Delivery"
                            : assignment.orderId?.status === "delivered"
                            ? "Picked Up"
                            : "Mark as Picked Up"}
                        </button>
                        {/* Deliver Button */}
                        <button
                          className="btn btn-success btn-sm w-100"
                          onClick={() => handleMarkDelivered(assignment)}
                          disabled={
                            loadingRow === assignment._id ||
                            assignment.orderId?.status === "delivered"
                          }
                        >
                          {loadingRow === assignment._id &&
                          assignment.orderId?.status !== "delivered"
                            ? "Processing..."
                            : assignment.orderId?.status === "delivered"
                            ? "Delivered"
                            : "Mark as Delivered"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No assignments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= Location & Order Assignment Section ================= */}
        <h2 className="text-center mb-4 mt-5">Delivery Location & Order Assignment</h2>

        {/* Use Current Location Button */}
        <div className="text-center mb-3">
          <button className="btn btn-primary" onClick={useCurrentLocation}>
            🧍🏽‍♂️ Use My Current Location
          </button>
        </div>

        {/* Nearby Orders Section */}
        {nearbyOrders.length > 0 && (
          <div className="card p-3 mb-4 shadow-sm">
            <h5>Nearby Restaurants (within 1km) & Ready-for-Delivery Orders:</h5>
            <ul className="list-group">
              {nearbyOrders.map(({ restaurant, orders }) => (
                <li key={restaurant._id} className="list-group-item">
                  <strong>{restaurant.name}</strong> - {restaurant.location}
                  {orders.length > 0 ? (
                    <ul className="mt-2">
                      {orders.map((order) => (
                        <li key={order._id} style={{ marginBottom: "8px" }}>
                          Order ID: {order._id}, Amount: Rs. {order.totalAmount}
                          <button
                            className="btn btn-sm btn-success ms-3"
                            disabled={loading || !!assignedAssignment}
                            onClick={() => handleAcceptOrder(order, restaurant)}
                          >
                            Accept
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted"> (No ready-for-delivery orders)</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Location Submission Card */}
        <div className="card p-4 shadow-sm mb-5">
          <input
            type="hidden"
            id="latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
          <input
            type="hidden"
            id="longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />

          <div className="form-check mb-3">
            <input
              type="checkbox"
              id="availability"
              className="form-check-input"
              checked={availability}
              onChange={(e) => setAvailability(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="availability">
              Available for Delivery
            </label>
          </div>

          <button
            className="btn btn-success w-100"
            onClick={handleSubmitLocation}
            disabled={loading}
          >
            ✅ {loading ? "Processing..." : "Submit Location & Find Order"}
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default DeliveryLocationUpdater;
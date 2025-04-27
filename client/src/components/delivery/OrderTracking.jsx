import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import MainLayout from '../layout/MainLayout';
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5005"; // Your backend URL

const OrderTracking = () => {
  const [trackOrderId, setTrackOrderId] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const socketRef = useRef(null);

  // Cleanup socket on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleTrackOrder = async () => {
    setError("");
    setOrderData(null);
    setDeliveryLocation(null);

    if (!trackOrderId.trim()) {
      setError("Please enter an Order ID.");
      return;
    }

    setLoading(true);

    try {
      // 1. Fetch order details
      const resOrder = await axios.get(`http://localhost:5004/api/orders/${trackOrderId}`);
      setOrderData(resOrder.data);

      // 2. Fetch all assignments and find the one for this order
      const resAssign = await axios.get("http://localhost:5005/api/assignments/all");
      const assignment = resAssign.data.assignments.find(
        a => a.orderId === trackOrderId || (a.orderId && a.orderId._id === trackOrderId)
      );
      if (!assignment) {
        setError("No delivery assignment found for this Order ID.");
        setLoading(false);
        return;
      }

      const deliveryPersonId = assignment.userId;
      if (!deliveryPersonId) {
        setError("No delivery person assigned yet.");
        setLoading(false);
        return;
      }

      // 3. Connect to socket and listen for location updates
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      const socket = io(SOCKET_URL);
      socketRef.current = socket;

      socket.on(`location-update-${deliveryPersonId}`, (location) => {
        setDeliveryLocation({
          latitude: location.latitude,
          longitude: location.longitude,
        });
      });

      // Optionally, fetch initial location via REST API
      const resLoc = await axios.get(`http://localhost:5005/api/location/${deliveryPersonId}`);
      if (
        resLoc.data &&
        resLoc.data.location &&
        typeof resLoc.data.location.latitude === "number" &&
        typeof resLoc.data.location.longitude === "number"
      ) {
        setDeliveryLocation({
          latitude: resLoc.data.location.latitude,
          longitude: resLoc.data.location.longitude,
        });
      }

    } catch (err) {
      setError("Order not found or something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Track Your Order</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="border p-2 flex-1"
            placeholder="Enter Order ID"
            value={trackOrderId}
            onChange={(e) => setTrackOrderId(e.target.value)}
          />
          <button
            onClick={handleTrackOrder}
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Tracking..." : "Track"}
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {orderData && (
          <div className="border p-4 rounded shadow mb-4">
            <h3 className="text-lg font-bold mb-2">Order Details</h3>
            <p><strong>Order ID:</strong> {orderData._id}</p>
            <p><strong>Status:</strong> {orderData.status}</p>
            <p><strong>Shipping Address:</strong> {orderData.shippingAddress || "N/A"}</p>
          </div>
        )}

        {deliveryLocation && (
          <div className="border p-4 rounded shadow">
            <h3 className="text-lg font-bold mb-2">Delivery Person Location</h3>
            <p>
              Your delivery person is currently located at:<br />
              <strong>Latitude:</strong> {deliveryLocation.latitude}<br />
              <strong>Longitude:</strong> {deliveryLocation.longitude}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default OrderTracking;
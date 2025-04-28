import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import MainLayout from "../layout/MainLayout";
import './CSS/deliveryHome.css'

const TrackDelivery = () => {
  const [orderId, setOrderId] = useState("");
  const [deliveryPersonId, setDeliveryPersonId] = useState(null);
  const [location, setLocation] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  const handleSearch = async () => {
    try {
      // 1. Find delivery assignment by orderId
      const assignmentRes = await axios.get(`http://localhost:5005/api/assignments/order/${orderId}`);
      const userId = assignmentRes.data.assignment.userId;
      setDeliveryPersonId(userId);

      // 2. Immediately fetch location once
      fetchLocation(userId);

      // 3. Start updating location every 10 seconds
      if (intervalId) clearInterval(intervalId); // clear old interval if any
      const id = setInterval(() => fetchLocation(userId), 10000); // 10000ms = 10s
      setIntervalId(id);
    } catch (error) {
      console.error("Error searching assignment:", error);
      alert("Could not find delivery assignment for this Order ID.");
    }
  };

  const fetchLocation = async (userId) => {
    try {
      const locationRes = await axios.get(`http://localhost:5005/api/location/${userId}`);
      setLocation(locationRes.data.location);
    } catch (error) {
      console.error("Error fetching delivery location:", error);
    }
  };

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  return (
     <MainLayout>
    <div className="container mt-5">
      <h2 className="text-center mb-4">Track Your Order</h2>

<div className="custom-container1">
      
        <input
          type="text"
          className="custom-container"
          placeholder="Enter Your Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
      
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {location && (
        <MapContainer center={[location.latitude, location.longitude]} zoom={15} style={{ height: "400px", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[location.latitude, location.longitude]}>
            <Popup>
              Your Order is here!
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
</MainLayout>

  );
};
  

export default TrackDelivery;

import React, { useState } from "react";
import axios from "axios";

const DeliveryLocationUpdater = ({ userId }) => {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [status, setStatus] = useState("");

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude.toFixed(6));
        setLng(position.coords.longitude.toFixed(6));
        setStatus("Location fetched successfully!");
      },
      () => {
        setStatus("Unable to retrieve your location");
      }
    );
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/delivery-location/update", {
        userId,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      });

      setStatus("Location updated successfully!");
    } catch (error) {
      console.error(error);
      setStatus("Error updating location");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Update Delivery Location</h2>

      <div>
        <button onClick={useCurrentLocation}>📍 Use My Current Location</button>
      </div>

      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          style={{ marginBottom: "8px", display: "block", width: "100%" }}
        />
        <input
          type="text"
          placeholder="Longitude"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          style={{ marginBottom: "8px", display: "block", width: "100%" }}
        />
        <button onClick={handleSubmit}>✅ Submit Location</button>
      </div>

      {status && <p style={{ marginTop: "15px", color: "#555" }}>{status}</p>}
    </div>
  );
};

export default DeliveryLocationUpdater;

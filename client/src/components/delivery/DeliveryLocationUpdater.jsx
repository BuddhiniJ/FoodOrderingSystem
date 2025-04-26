import React, { useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";
import "./CSS/deliveryHome.css";

const DeliveryLocationUpdater = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [availability, setAvailability] = useState(true);
  const [status, setStatus] = useState("");

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setStatus("Location fetched successfully!");
      },
      () => {
        setStatus("Unable to retrieve your location");
      }
    );
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token"); // Ensure the user is authenticated
      await axios.post(
        "http://localhost:5005/api/location",
        {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          availability,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStatus("Location and availability updated successfully!");
    } catch (error) {
      console.error(error);
      setStatus("Error updating location and availability");
    }
  };

  return (
    <MainLayout>
      <div className="container mt-5">
        <h2 className="text-center mb-4">Update Delivery Location</h2>

        <div className="text-center mb-3">
          <button className="btn btn-primary" onClick={useCurrentLocation}>
          🧍🏽‍♂️ Use My Current Location
          </button>
        </div>

        <div className="card p-4">
          {/* Hidden Latitude and Longitude Fields */}
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

          <button className="btn btn-success w-100" onClick={handleSubmit}>
            ✅ Submit Location
          </button>
        </div>

        {status && (
          <div className="alert alert-info mt-4 text-center">{status}</div>
        )}
      </div>
    </MainLayout>
  );
};

export default DeliveryLocationUpdater;
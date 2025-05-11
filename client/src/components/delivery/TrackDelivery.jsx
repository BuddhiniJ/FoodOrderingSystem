import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import MainLayout from "../layout/MainLayout";
import "./CSS/deliveryHome.css";

const TrackDelivery = () => {
  const [location, setLocation] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const DELEVERY_API = import.meta.env.VITE_DELIVERY_SERVICE_URL;

  const LOCATION_API = `${DELEVERY_API}/location/680921a8d31b511fbb0f0c73`;

  const fetchLocation = async () => {
    try {
      const res = await axios.get(LOCATION_API);
      if (res.data && res.data.location) {
        setLocation({
          latitude: res.data.location.latitude,
          longitude: res.data.location.longitude,
        });
      } else {
        setLocation(null);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setLocation(null);
    }
  };

  useEffect(() => {
    fetchLocation(); // Initial fetch

    const id = setInterval(fetchLocation, 10000); // Auto-refresh every 10s
    setIntervalId(id);

    return () => clearInterval(id); // Cleanup
  }, []);

  return (
    <MainLayout>
      <div className="container mt-5">
        <h2 className="text-center mb-4">Live Delivery Tracking</h2>

        {location ? (
          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={15}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[location.latitude, location.longitude]}>
              <Popup>Delivery is here!</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div className="text-center mt-4">
            <p>Location not available</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TrackDelivery;

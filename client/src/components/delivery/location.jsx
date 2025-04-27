import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext"; // Adjust the path as needed

const DeliveryPersonTracker = ({ deliveryPersonId }) => {
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const { user, token } = useContext(AuthContext); // Example usage

  useEffect(() => {
    if (!deliveryPersonId) return;

    const fetchLocation = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5005/api/location/${deliveryPersonId}`,
          token
            ? { headers: { Authorization: `Bearer ${token}` } }
            : undefined
        );
        if (
          res.data &&
          res.data.location &&
          typeof res.data.location.latitude === "number" &&
          typeof res.data.location.longitude === "number"
        ) {
          setDeliveryLocation(res.data.location);
        } else {
          setDeliveryLocation(null);
        }
      } catch {
        setDeliveryLocation(null);
      }
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 10000);
    return () => clearInterval(interval);
  }, [deliveryPersonId, token]);

  return (
    <div>
      {deliveryLocation ? (
        <div>
          <p>
            <strong>Latitude:</strong> {deliveryLocation.latitude}<br />
            <strong>Longitude:</strong> {deliveryLocation.longitude}
          </p>
        </div>
      ) : (
        <p>Fetching delivery person's location...</p>
      )}
    </div>
  );
};

export default DeliveryPersonTracker;
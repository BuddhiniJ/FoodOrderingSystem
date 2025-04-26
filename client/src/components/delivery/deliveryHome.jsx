import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import "./CSS/deliveryHome.css"; 

const DeliveryHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || user.role !== "delivery-personnel") {
      navigate("/unauthorized"); // Redirect unauthorized users
    }
  }, [navigate]);

  return (
    <MainLayout>
      <div className="container mt-5">
        <h1 className="text-center">Welcome, Delivery Personnel!</h1>
        <p className="text-center">
          Use the button below to update your delivery location and availability.
        </p>
        <div className="text-center mt-4">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/location-updater")}
          >
            Update Delivery Location
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default DeliveryHome;
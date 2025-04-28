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
      navigate("/unauthorized");
    }
  }, [navigate]);

  return (
    <MainLayout>
      <div className="container d-flex flex-column justify-content-center align-items-center mt-5" style={{ minHeight: "80vh",contentAlign:"center" }}>
        <div className="text-center">
          <h1 className="mb-4 fw-bold" style={{textAlign:"center"}}>Welcome, Delivery Personnel! 🚚</h1>
          <p className="lead text-muted mb-5" style={{textAlign:"center"}}>
            Ready to deliver happiness? Click below to view nearby orders!
          </p>
          
          <button
            className="btn btn-primary btn-lg shadow px-5 py-2" 
            onClick={() => navigate("/location-updater")}
          >
            Find Orders Near Me
          </button>
        
        </div>
      </div>
    </MainLayout>
  );
};

export default DeliveryHome;

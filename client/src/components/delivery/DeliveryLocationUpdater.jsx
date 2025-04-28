import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MainLayout from "../layout/MainLayout";
import { AuthContext } from "../../context/AuthContext";

const LocationUpdater = () => {
  const [location, setLocation] = useState(null);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [orders, setOrders] = useState({});  
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          fetchRestaurants(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error(error);
          alert("Unable to get your location. Please enable GPS.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const fetchRestaurants = async (lat, lng) => {
    try {
      const res = await axios.get("http://localhost:5003/api/restaurants");
      const nearby = res.data.filter((restaurant) => {
        return calculateDistance(lat, lng, restaurant.latitude, restaurant.longitude) <= 10;
      });
      setNearbyRestaurants(nearby);

      const ordersPromises = nearby.map((restaurant) =>
        axios
          .get(`http://localhost:5004/api/orders/restaurant/${restaurant._id}?status=ready-for-delivery`)
          .then((res) => ({ restaurantId: restaurant._id, orders: res.data }))
      );

      const ordersArray = await Promise.all(ordersPromises);
      const ordersMap = {};
      ordersArray.forEach(({ restaurantId, orders }) => {
        ordersMap[restaurantId] = orders;
      });

      setOrders(ordersMap);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const acceptOrder = async (order, restaurant) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5005/api/assignments",
        {
          orderId: order._id,
          customerId: order.customerId,
          restaurantLocation: {
            lat: restaurant.latitude,
            lng: restaurant.longitude,
          },
          restaurantId: restaurant._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );     

      await axios.patch(
        `http://localhost:5004/api/orders/${order._id}/status`,
        { status: "out-for-delivery" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );      

      const customerResponse = await axios.get(
        `http://localhost:5001/api/users/${order.customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Customer Data:", customerResponse.data.data.name);

      // --- Notification Service Call ---
      const assignmentData = {
        orderNumber: order.reference, 
        deliveryPersonName: user.name,
        deliveryPersonPhone: user.phone,
        restaurantName: restaurant.name,        
        pickupTime: new Date().toLocaleTimeString(),
        deliveryAddress: `${customerResponse.data.data.address.street} ${customerResponse.data.data.address.city} ${customerResponse.data.data.address.zipCode} ${customerResponse.data.data.address.country}`, 
        customerName: customerResponse.data.data.name || "",                
        acceptLink: `http://localhost:5173/order-details/${order._id}`,
        currentYear: new Date().getFullYear(),
      };

      await axios.post(
        "http://localhost:5002/api/notifications/delivery-assignment",
        {
          email: customerResponse.data.data.email,
          phone: customerResponse.data.data.phone,
          assignmentData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Order accepted and notification sent!");
    } catch (error) {
      console.error("Error accepting order:", error);
      alert("Failed to accept order.");
    }
  };
  
  
  return (
    <MainLayout>
      <div className="container mt-5">
        <h2 className="text-center mb-4">Nearby Restaurants</h2>

        {nearbyRestaurants.length === 0 ? (
          <p className="text-center">No nearby restaurants found.</p>
        ) : (
          <div className="row">
            {nearbyRestaurants.map((restaurant) => (
              <div key={restaurant._id} className="col-md-6 mb-4">
                <div className="card shadow-sm rounded-4">
                  <iframe
                    width="100%"
                    height="200"
                    frameBorder="0"
                    style={{ borderTopLeftRadius: "0.75rem", borderTopRightRadius: "0.75rem" }}
                    src={`https://maps.google.com/maps?q=${restaurant.latitude},${restaurant.longitude}&z=15&output=embed`}
                    allowFullScreen
                  ></iframe>

                  <div className="card-body">
                    <h4 className="card-title mb-2">{restaurant.name}</h4>
                    <p className="card-text text-muted">{restaurant.description}</p>

                    {orders[restaurant._id]?.length > 0 ? (
                      <div>
                        <h6 className="mt-4 mb-2">Available Orders:</h6>
                        {orders[restaurant._id].map((order) => (
                          <div
                            key={order._id}
                            className="d-flex justify-content-between align-items-center bg-light rounded p-2 mb-2"
                          >
                            <div className="flex-grow-1">
                              <strong>Ref:</strong> {order.reference}
                            </div>
                            <div>
                              <button
                                className="btn btn-primary btn-sm me-2"
                                onClick={() => navigate(`/order-details/${order._id}`)}
                              >
                                Details
                              </button>
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => acceptOrder(order, restaurant)}
                              >
                                Accept
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">No ready orders at this restaurant.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default LocationUpdater;

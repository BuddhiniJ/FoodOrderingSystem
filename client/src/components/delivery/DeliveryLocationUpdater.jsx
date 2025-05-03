import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MainLayout from "../layout/MainLayout";
import { AuthContext } from "../../context/AuthContext";
import { DeliveryNotificationContext } from "../../context/DeliveryNotificationContext";

const LocationUpdater = () => {
  const [location, setLocation] = useState(null);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [orders, setOrders] = useState({});
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addNotification } = useContext(DeliveryNotificationContext);

  const DELIVERY_API = import.meta.env.VITE_DELIVERY_SERVICE_URL;
  const RESTAURANT_API = import.meta.env.VITE_RESTAURANT_SERVICE_URL;
  const ORDER_API = import.meta.env.VITE_ORDER_SERVICE_URL;
  const USER_API = import.meta.env.VITE_USER_SERVICE_URL;
  const NOTIFICATION_API = import.meta.env.VITE_NOTIFICATION_SERVICE_URL;

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(loc);
          updateLocationOnServer(loc);
          fetchRestaurants(loc.latitude, loc.longitude);
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

  const updateLocationOnServer = async (loc) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${DELIVERY_API}/location`,
        {
          latitude: loc.latitude,
          longitude: loc.longitude,
          availability: true,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  const fetchRestaurants = async (lat, lng) => {
    try {
      const res = await axios.get(`${RESTAURANT_API}/restaurants`);
      const nearby = res.data.filter((restaurant) => {
        return calculateDistance(lat, lng, restaurant.latitude, restaurant.longitude) <= 100;
      });
      setNearbyRestaurants(nearby);
  
      const ordersPromises = nearby.map((restaurant) =>
        axios
          .get(
            `${ORDER_API}/orders/restaurant/${restaurant._id}?status=ready-for-delivery`
          )
          .then((res) => ({ restaurantId: restaurant._id, orders: res.data }))
      );
  
      const ordersArray = await Promise.all(ordersPromises);
      const ordersMap = {};
      let totalNewOrders = 0;
      
      ordersArray.forEach(({ restaurantId, orders }) => {
        ordersMap[restaurantId] = orders;
        totalNewOrders += orders.length;
      });
  
      // Display notification if there are any new orders
      if (totalNewOrders > 0) {
        // Use the context's addNotification method instead of browser notifications
        addNotification(`${totalNewOrders} new order(s) ready for delivery`, {
          type: 'new-orders',
          count: totalNewOrders
        });
      }
    
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

      // ✅ Step 0: Get delivery person's current GPS location
    const position = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );
    const currentLatitude = position.coords.latitude;
    const currentLongitude = position.coords.longitude;

    // ✅ Step 0.5: Save delivery person's location to location DB
    await axios.post(
      `${DELIVERY_API}/location`, // Make sure LOCATION_API is defined
      {
        latitude: currentLatitude,
        longitude: currentLongitude,
        availability: true,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  
      // Step 1: Assign the delivery (External API)
      await axios.post(
        `${DELIVERY_API}/assignments`,
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
  
      // ✅ Step 1.5: Save assignment to internal DB
      await axios.post(
        `${DELIVERY_API}/assignments`, // Replace with actual backend API base URL
        {
          userId: user._id, // Ensure `user` is defined (e.g., from auth context)
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
  
      // Step 2: Update order status
      await axios.patch(
        `${ORDER_API}/orders/${order._id}/status`,
        { status: "out-for-delivery" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // Step 3: Fetch customer details
      const customerResponse = await axios.get(
        `${USER_API}/users/${order.customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const customer = customerResponse.data.data;
  
      // Step 4: Send notification
      const assignmentData = {
        orderNumber: order.reference,
        deliveryPersonName: user.name,
        deliveryPersonPhone: user.phone,
        restaurantName: restaurant.name,
        pickupTime: new Date().toLocaleTimeString(),
        deliveryAddress: `${customer.address.street} ${customer.address.city} ${customer.address.zipCode} ${customer.address.country}`,
        customerName: customer.name || "",
        acceptLink: `${ORDER_API}/order-details/${order._id}`,
        currentYear: new Date().getFullYear(),
      };
  
      await axios.post(
        `${NOTIFICATION_API}/notifications/delivery-assignment`,
        {
          email: customer.email,
          phone: customer.phone,
          assignmentData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      alert("Order assigned, status updated, and notification sent successfully!");
      navigate(`/order-details/${order._id}`);
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

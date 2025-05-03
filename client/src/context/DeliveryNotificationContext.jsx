import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "./AuthContext";
import { io } from "socket.io-client";
import axios from "axios";

export const DeliveryNotificationContext = createContext();

export const DeliveryNotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [location, setLocation] = useState(null);
  const notificationIds = useRef(new Set());
  const previousOrdersRef = useRef({});

  const DELIVERY_API = import.meta.env.VITE_DELIVERY_SERVICE_URL;
  const NOTIFICATION_API = import.meta.env.VITE_NOTIFICATION_SERVICE_URL;
  const RESTAURANT_API = import.meta.env.VITE_RESTAURANT_SERVICE_URL;
  const ORDER_API = import.meta.env.VITE_ORDER_SERVICE_URL;
  
  useEffect(() => {
    if (user && user.role === "delivery-personnel") {
      getLocation();
      
      const intervalId = setInterval(() => {
        getLocation();
      }, 1000);
      
      return () => clearInterval(intervalId);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role === "delivery-personnel") {
      const socket = io(`${NOTIFICATION_API}`); 

      socket.on("connect", () => {
        socket.emit("register-delivery", user.id);
      });

      socket.on("new-delivery-order", (notif) => {
        if (notif.id && notificationIds.current.has(notif.id)) {
          return;
        }
        
        if (notif.id) {
          notificationIds.current.add(notif.id);
        }
        
        setNotifications((prev) => [notif, ...prev]);
        setUnreadCount((c) => c + 1);
        showBrowserNotification(notif.message || "New delivery order available");
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

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
          fetchRestaurantsAndOrders(loc.latitude, loc.longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  };

  const updateLocationOnServer = async (loc) => {
    if (!user) return;
    
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

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchRestaurantsAndOrders = async (lat, lng) => {
    if (!user) return;
    
    try {
      const res = await axios.get(`${RESTAURANT_API}/restaurants`);
      const nearby = res.data.filter((restaurant) => {
        return calculateDistance(lat, lng, restaurant.latitude, restaurant.longitude) <= 100;
      });
      
      const ordersPromises = nearby.map((restaurant) =>
        axios
          .get(`${ORDER_API}/orders/restaurant/${restaurant._id}?status=ready-for-delivery`)
          .then((res) => ({ restaurantId: restaurant._id, orders: res.data }))
      );
      
      const ordersArray = await Promise.all(ordersPromises);
      const currentOrdersMap = {};
      let newOrdersCount = 0;
      
      ordersArray.forEach(({ restaurantId, orders }) => {
        currentOrdersMap[restaurantId] = orders;
        
        const prevOrders = previousOrdersRef.current[restaurantId] || [];
        const prevOrderIds = new Set(prevOrders.map(order => order._id));
        
        const newOrders = orders.filter(order => !prevOrderIds.has(order._id));
        newOrdersCount += newOrders.length;
        
        newOrders.forEach(order => {
          const notificationKey = `new-order-${order._id}`;
          if (!notificationIds.current.has(notificationKey)) {
            notificationIds.current.add(notificationKey);
            const restaurant = nearby.find(r => r._id === restaurantId);
            const message = `New order ${order.reference} ready at ${restaurant?.name || 'restaurant'}`;
            
            const notificationId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const formattedDate = new Date().toLocaleString();
            
            const newNotification = {
              id: notificationId,
              message,
              data: {
                type: 'new-order',
                order,
                restaurant
              },
              timestamp: formattedDate,
            };
            
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(c => c + 1);
            showBrowserNotification(message);
          }
        });
      });
      
      previousOrdersRef.current = currentOrdersMap;
      
    } catch (error) {
      console.error("Error fetching restaurants/orders:", error);
    }
  };

  const markAllRead = () => setUnreadCount(0);

  const addNotification = (message, data = {}) => {
    const notificationId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const notificationKey = `${message}-${JSON.stringify(data)}`;
    
    if (notificationIds.current.has(notificationKey)) {
      return;
    }
    
    notificationIds.current.add(notificationKey);
    const formattedDate = new Date().toLocaleString();
    
    const newNotification = {
      id: notificationId,
      message,
      data,
      timestamp: formattedDate,
    };
    
    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((c) => c + 1);
    showBrowserNotification(message);
  };
  
  const showBrowserNotification = async (message) => {
    if ("Notification" in window) {
      if (Notification.permission !== "granted") {
        await Notification.requestPermission();
      }
      
      if (Notification.permission === "granted") {
        new Notification("Food Delivery App", {
          body: message,          
        });
      }
    }
  };

  return (
    <DeliveryNotificationContext.Provider
      value={{ 
        notifications, 
        unreadCount, 
        markAllRead, 
        addNotification,
        location,
        refreshOrders: getLocation
      }}
    >
      {children}
    </DeliveryNotificationContext.Provider>
  );
};

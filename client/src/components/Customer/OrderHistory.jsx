import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import MainLayout from "../layout/MainLayout";

const OrderHistory = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cashPaymentMessage, setCashPaymentMessage] = useState("");

  const navigate = useNavigate();

      const ORDER_API = import.meta.env.VITE_ORDER_SERVICE_URL;
      const PAYMENT_API = import.meta.env.VITE_PAYMENT_SERVICE_URL;
      const NOTIFICATION_API = import.meta.env.VITE_NOTIFICATION_SERVICE_URL;


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${ORDER_API}/orders/user/${user._id}`
        );
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchOrders();
  }, [user]);

  // format order items for the notification
  const formatOrderItemsemail = (items) => {
    return items
      .map(
        (item) =>
          `<div class="order-item">${item.quantity}x ${item.name} - Rs. ${
            item.price * item.quantity
          }</div>`
      )
      .join("");
  };

  const formatOrderItemssms = (items) => {
    return items
      .map(
        (item) =>
          `${item.quantity}x ${item.name} - Rs. ${item.price * item.quantity}`
      )
      .join(", ");
  };

  const sendOrderConfirmation = async (order) => {
    try {
      const orderData = {
        orderNumber: order.reference,
        orderId: order._id,
        userId: user._id,
        customerName: user.name,
        orderDate: new Date(order.createdAt).toLocaleString(),
        orderItemsemail: formatOrderItemsemail(order.items),
        orderItemssms: formatOrderItemssms(order.items),
        subtotal: `Rs. ${(order.totalAmount - (order.deliveryFee || 0)).toFixed(
          2
        )}`,
        // deliveryFee: `Rs. ${(order.deliveryFee || 0).toFixed(2)}`,
        total: `Rs. ${order.totalAmount.toFixed(2)}`,
        currentYear: new Date().getFullYear(),
      };

      const token = localStorage.getItem("token");

      await axios.post(
        `${NOTIFICATION_API}/notifications/order-confirmation`,
        {
          email: user.email,
          phone: user.phone,
          orderData,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(`Order confirmation sent for order ${order.reference}`);
    } catch (error) {
      console.error("Failed to send order confirmation:", error.message);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`${ORDER_API}/orders/${orderId}/status`, {
        status: newStatus,
      });

      // Update the orders state
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      );

      setOrders(updatedOrders);

      // If the new status is 'confirmed', send the confirmation notification
      if (newStatus === "confirmed") {
        const confirmedOrder = updatedOrders.find(
          (order) => order._id === orderId
        );
        if (confirmedOrder) {
          await sendOrderConfirmation(confirmedOrder);
        }
      }
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  const handlePayNow = (order) => {
    setSelectedOrder(order);
    setShowPaymentOptions(true);
  };

  const handlePaymentMethod = async (method) => {
    if (!selectedOrder) return;

    const token = localStorage.getItem("token");

    if (method === "card") {
      // Navigate to card payment page
      navigate("/pay", {
        state: {
          userId: selectedOrder.customerId,
          amount: selectedOrder.totalAmount,
          reference: selectedOrder.reference,
          restaurantId: selectedOrder.restaurantId,
          orderId: selectedOrder._id,
          items: selectedOrder.items,
          paymentMethod: "card",
        },
      });
    } else if (method === "cash") {
      try {
        await axios.post(
          `${PAYMENT_API}/payments/create-payment-intent`,
          {
            userId: selectedOrder.customerId,
            orderId: selectedOrder._id,
            restaurantId: selectedOrder.restaurantId,
            amount: selectedOrder.totalAmount,
            paymentMethod: "cash",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await updateOrderStatus(selectedOrder._id, "preparing");

        setCashPaymentMessage("✅ You paid by cash.");

        // Clear message after a few seconds
        setTimeout(() => {
          setCashPaymentMessage("");
        }, 3000);

        setShowPaymentOptions(false);
      } catch (error) {
        console.error("Cash payment failed:", error.message);
      }
    }
  };

  if (loading)
    return <div className="p-6 text-center">Loading order history...</div>;

  return (
    <MainLayout>
      <div className="order-history-container">
        <h1 className="order-history-title">Your Order History</h1>

        {cashPaymentMessage && (
          <div className="cash-payment-message success-message">
            {cashPaymentMessage}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="no-orders-message">No past orders found.</div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-ref">Ref: {order.reference}</div>
                  <div className={`order-status order-status-${order.status}`}>
                    Status: {order.status}
                  </div>
                </div>

                <ul className="order-items">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="order-item">
                      <div className="item-details">
                        {item.name} x {item.quantity} - Rs.{" "}
                        {item.price * item.quantity}
                      </div>
                      {item.note && (
                        <div className="item-note">Note: {item.note}</div>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="order-footer">
                  <div className="order-total">
                    Total: Rs. {order.totalAmount}
                  </div>
                  <div className="order-date">
                    Ordered on {new Date(order.createdAt).toLocaleString()}
                  </div>

                  {/* Buttons for pending orders */}
                  {order.status === "pending" && (
                    <div className="order-actions">
                      <Link
                        to={`/edit-order/${order._id}`}
                        className="edit-order-btn"
                      >
                        Edit Order
                      </Link>
                      <button
                        className="confirm-order-btn"
                        onClick={() =>
                          updateOrderStatus(order._id, "confirmed")
                        }
                      >
                        Confirm Order
                      </button>
                      <button
                        className="cancel-order-btn"
                        onClick={() =>
                          updateOrderStatus(order._id, "cancelled")
                        }
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}

                  {/* Pay Now button for confirmed orders only and not already paid */}
                  {order.status === "confirmed" && (
                    <div className="order-actions">
                      <button
                        className="pay-now-btn"
                        onClick={() => handlePayNow(order)}
                      >
                        Pay Now
                      </button>
                    </div>
                  )}

                  {/* Paid orders */}
                  {order.status === "paid" && (
                    <div className="paid-message">
                      <strong>Payment Completed ✅</strong>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentOptions && selectedOrder && (
          <>
            <div className="custom-payment-modal">
              <div className="custom-payment-modal-content">
                <h3>Select Payment Method</h3>
                <p>Total Amount: Rs. {selectedOrder.totalAmount}</p>

                <div className="custom-payment-options">
                  <button
                    className="custom-payment-option-btn custom-cash-btn"
                    onClick={() => handlePaymentMethod("cash")}
                  >
                    <i className="bi bi-cash-coin me-2"></i> Pay with Cash
                  </button>
                  <button
                    className="custom-payment-option-btn custom-card-btn"
                    onClick={() => handlePaymentMethod("card")}
                  >
                    <i className="bi bi-credit-card me-2"></i> Pay with Card
                  </button>
                </div>

                <button
                  className="custom-close-modal-btn"
                  onClick={() => setShowPaymentOptions(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
            <div
              className="custom-modal-backdrop"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 1040,
              }}
            ></div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default OrderHistory;

import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  const ORDER_API = import.meta.env.VITE_ORDER_SERVICE_URL;


  useEffect(() => {
    const markOrderAsPaid = async () => {
      if (!orderId) return;

      try {
        setIsLoading(true);
        await axios.patch(
          `${ORDER_API}/orders/${orderId}/status`,
          { status: "preparing" }
        );

        const response = await axios.get(`${ORDER_API}/orders/${orderId}`);
        setOrderDetails(response.data);
      } catch (error) {
        console.error("❌ Failed to mark order as preparing", error);
      } finally {
        setIsLoading(false);
      }
    };

    markOrderAsPaid();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/"); // Automatically navigate home when countdown ends
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [orderId, navigate]);

  return (
    <div className="payment-success-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="payment-success-card"
      >
        {/* Checkmark Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="checkmark-container"
        >
          <div className="checkmark-background">
            <svg
              className="checkmark-icon"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </motion.div>

        <h2 className="payment-success-title">Payment Successful!</h2>

        <p className="payment-success-message">
          Thank you for your purchase. Your order #{orderId} has been confirmed!
          <br />
          Redirecting home in {countdown} seconds...
        </p>

        {/* Order Summary */}
        {orderDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="order-summary"
          >
            <h3 className="order-summary-title">Order Summary</h3>
            <div className="order-summary-details">
              <div className="order-detail-row">
                <span>Status:</span>
                <span className="order-status">Preparing</span>
              </div>
              <div className="order-detail-row">
                <span>Total:</span>
                <span className="order-total">
                  Rs. {orderDetails.totalAmount?.toLocaleString()}
                </span>
              </div>
              <div className="order-detail-row">
                <span>Items:</span>
                <span className="order-items-count">
                  {orderDetails.items?.length}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
          </div>
        )}

        <div className="action-buttons">
          <Link to="/myorders" className="secondary-button">
            <svg
              className="button-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            View Orders
          </Link>
          <Link to="/" className="primary-button">
            <svg
              className="button-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Go Home Now
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;

import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./CheckoutForm.css";
import { FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa";

const CheckoutForm = ({
  total,
  orderId,
  restaurantId,
  userId,
  paymentMethod,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !cardComplete) return;

    setLoading(true);

    try {
      const res = await axios.post(
        `http://localhost:5006/api/payments/create-payment-intent`,
        {
          amount: total,
          orderId,
          restaurantId,
          userId,
          paymentMethod,
        }
      );

      const { clientSecret } = res.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: "Customer Name", // You might want to make this dynamic
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message, {
          position: "bottom-center",
          theme: "colored",
          className: "bg-red-500 text-white",
        });
      } else {
        if (result.paymentIntent.status === "succeeded") {
          toast.success("Payment successful! Redirecting...", {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: true,
          });
          setTimeout(() => {
            navigate(`/payment-success?orderId=${orderId}`);
          }, 2000);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Payment failed. Try again.",
        {
          position: "bottom-center",
          theme: "colored",
          className: "bg-red-500 text-white",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="payment-header">
        <h2 className="checkout-title">Secure Payment</h2>
        <div className="payment-methods">
          <div className="payment-method active">
            <FaCcVisa className="payment-icon" />
          </div>
          <div className="payment-method">
            <FaCcMastercard className="payment-icon" />
          </div>
          <div className="payment-method">
            <FaCcAmex className="payment-icon" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card-element-wrapper">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#1a1a1a",
                  "::placeholder": {
                    color: "#a0aec0",
                  },
                },
              },
              hidePostalCode: true,
            }}
            onChange={(e) => setCardComplete(e.complete)}
          />
        </div>

        <div className="payment-details">
          <div className="detail-row">
            <span>Amount</span>
            <span className="amount">Rs. {total.toLocaleString()}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!stripe || loading || !cardComplete}
          className={`pay-button ${loading ? "processing" : ""}`}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Processing Payment
            </>
          ) : (
            `Pay Rs. ${total.toLocaleString()}`
          )}
        </button>

        <div className="security-assurance">
          <div className="lock-icon"></div>
          <span>All transactions are secure and encrypted</span>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;

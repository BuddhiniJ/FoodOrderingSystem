import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5001/api/payments/create-payment-intent",
        {
          amount: total,
          orderId: "order123", // Replace with actual order ID if needed
        }
      );

      const { clientSecret } = res.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          toast.success("Payment successful!");
          navigate("/payment-success");
        }
      }
    } catch (error) {
      toast.error("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Payment Details
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 border rounded-md p-3">
          <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
        </div>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg font-semibold transition"
        >
          {loading ? "Processing..." : `Pay Rs. ${total}`}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;

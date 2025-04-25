// client/pages/Pay.jsx
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/payment/CheckoutForm";
import OrderSummary from "../components/payment/OrderSummary";

// Replace with your real Stripe public key
const stripePromise = loadStripe("pk_test_XXXXXXXXXXXXXXXXXXXXXXXX");

const Pay = () => {
  const items = [
    { name: "Pizza", price: 500 },
    { name: "Burger", price: 400 },
    { name: "Coke", price: 100 },
  ];
  const total = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Complete Your Payment
      </h1>

      <OrderSummary items={items} total={total} />

      <Elements stripe={stripePromise}>
        <CheckoutForm total={total} />
      </Elements>
    </div>
  );
};

export default Pay;

// client/pages/OrderConfirmation.jsx
import { Link } from "react-router-dom";

const OrderConfirmation = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <h2 className="text-2xl font-bold text-blue-600">Order Confirmation</h2>
        <p className="text-gray-700 mt-2">
          Thank you for your purchase! Your order is being processed.
        </p>
        <Link to="/pay" className="text-blue-600 mt-4 inline-block">
          Return to Payment Page
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;

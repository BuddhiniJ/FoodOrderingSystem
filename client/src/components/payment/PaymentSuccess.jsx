// client/components/payment/PaymentSuccess.jsx
const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <h2 className="text-2xl font-bold text-green-600">
          Payment Successful!
        </h2>
        <p className="text-gray-700 mt-2">
          Your order has been placed. Thank you!
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;

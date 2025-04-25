// client/components/payment/OrderSummary.jsx
const OrderSummary = ({ items = [], total = 1000 }) => {
  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Order Summary
      </h3>
      <ul className="text-gray-700">
        {items.map((item, index) => (
          <li key={index} className="flex justify-between border-b py-1">
            <span>{item.name}</span>
            <span>Rs. {item.price}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between font-bold mt-3">
        <span>Total</span>
        <span>Rs. {total}</span>
      </div>
    </div>
  );
};

export default OrderSummary;

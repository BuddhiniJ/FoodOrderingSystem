import { useLocation } from "react-router-dom";
import CheckoutForm from "../components/payment/CheckoutForm";
import OrderSummary from "../components/payment/OrderSummary";
import MainLayout from "../components/layout/MainLayout";
import "./Pay.css";

const Pay = () => {
  const location = useLocation();
  const {
    amount,
    items,
    userId,
    orderId,
    restaurantId,
    reference,
    paymentMethod,
  } = location.state || {};

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryFee = subtotal > 0 ? 200 : 0;
  const total = subtotal + deliveryFee;

  return (
    <MainLayout>
      <div className="payment-page-container">
        <div className="payment-header">
          <h1 className="payment-title">Complete Your Payment</h1>
          <div className="payment-steps">
            <div className="step completed">Cart</div>
            <div className="step completed">Details</div>
            <div className="step active">Payment</div>
          </div>
        </div>

        <div className="payment-sections">
          <div className="order-summary-section">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              total={total}
            />
          </div>

          <div className="checkout-form-section">
            <CheckoutForm
              total={total}
              orderId={orderId}
              restaurantId={restaurantId}
              userId={userId}
              paymentMethod={paymentMethod}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Pay;

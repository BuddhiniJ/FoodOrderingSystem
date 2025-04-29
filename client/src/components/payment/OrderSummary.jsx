// client/components/payment/OrderSummary.jsx

import React from "react";
import "./OrderSummary.css";

const OrderSummary = ({
  items = [],
  subtotal = 0,
  deliveryFee = 0,
  total = 0,
}) => {
  return (
    <div className="order-summary-container">
      <h2 className="order-summary-title">Order Summary</h2>

      {items.length === 0 ? (
        <div className="empty-summary">No items in the order.</div>
      ) : (
        <>
          <ul className="order-items">
            {items.map((item, index) => (
              <li key={index} className="order-item">
                <div>
                  <span className="item-name">{item.name}</span>
                  <div className="item-quantity">
                    {item.quantity} x Rs. {item.price}
                  </div>
                </div>
                <div>Rs. {item.quantity * item.price}</div>
              </li>
            ))}
          </ul>

          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>Rs. {deliveryFee.toFixed(2)}</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>Rs. {total.toFixed(2)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderSummary;

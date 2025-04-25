import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Replace with your actual Stripe public key
const stripePromise = loadStripe("pk_test_51RHdd005HUGWMPTQ...your_key_here");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </React.StrictMode>
);

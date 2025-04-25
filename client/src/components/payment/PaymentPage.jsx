import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { motion } from "framer-motion";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-3xl font-extrabold text-gray-900 sm:text-4xl"
          >
            Secure Payment Gateway
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-lg text-gray-500"
          >
            Complete your purchase with confidence
          </motion.p>
        </div>

        <motion.div
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10 }}
          className="bg-white shadow-xl rounded-2xl overflow-hidden"
        >
          <div className="p-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </motion.div>

        <div className="mt-8 flex flex-col items-center space-y-4">
          <div className="flex space-x-4">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="ml-2 text-sm text-gray-600">
                Secure Payment
              </span>
            </div>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="ml-2 text-sm text-gray-600">
                No Storage of Card Details
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentPage;

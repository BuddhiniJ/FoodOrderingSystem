// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Components
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Profile from "./components/profile/Profile";
import UpdateProfile from "./components/profile/UpdateProfile";
import UserManagement from "./components/admin/UserManagement";

import PaymentPage from "./components/payment/PaymentPage";
import Pay from "./pages/Pay";
import PaymentSuccess from "./components/payment/PaymentSuccess";
import OrderConfirmation from "./pages/OrderConformation";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/pay" element={<Pay />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />

          {/* Protected Routes for all authenticated users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<UpdateProfile />} />
          </Route>

          {/* Admin Routes */}
          <Route
            element={<ProtectedRoute allowedRoles={["restaurant-admin"]} />}
          >
            <Route path="/admin/users" element={<UserManagement />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

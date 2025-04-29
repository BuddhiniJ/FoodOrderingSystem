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
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/profile/Profile';
import UpdateProfile from './components/profile/UpdateProfile';
import UserManagement from './components/admin/UserManagement';

// buddhini

import MyRestaurantsPage from './components/resturant/MyRestaurantsPage';
import RegisterRestaurant from './components/resturant/RegisterRestaurant';
import ResturantView from './components/resturant/ResturantView';
import EditResturant from './components/resturant/EditResturant';
import RestaurantsList from './components/Customer/RestaurantsList';
import MenuPage from './components/Customer/MenuPage';
import CartPage from './components/Customer/CartPage';
import OrderHistory from './components/Customer/OrderHistory';
import EditOrder from './components/Customer/EditOrder';

// Delivery Components
import DeliveryHome from './components/delivery/deliveryHome';
import DeliveryLocationUpdater from './components/delivery/DeliveryLocationUpdater';
import OrderDetails from './components/delivery/OrderDetails';
import TrackDelivery from './components/delivery/TrackDelivery';


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
          <Route element={<ProtectedRoute allowedRoles={['restaurant-admin']} />}>
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/my-restaurants" element={<MyRestaurantsPage />} />
            <Route path="/add-restaurant" element={<RegisterRestaurant />} />
            <Route path="/view-restaurant/:id" element={<ResturantView />} />
            <Route path="/edit-restaurant/:id" element={<EditResturant />} />
          </Route>

          {/* Delivery Personnel Routes */}
          <Route element={<ProtectedRoute allowedRoles={['delivery-personnel']} />}>
            <Route path="/delivery" element={<DeliveryHome />} />
            <Route path="/location-updater" element={<DeliveryLocationUpdater />} />
            <Route path="/order-details/:id" element={<OrderDetails />} />

          </Route>

          {/*Buddhini */}
          {/* User Routes */}
          <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
            <Route path="/restaurantsList" element={<RestaurantsList />} />
            <Route path="/restaurants/:id/menu" element={<MenuPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/myorders" element={<OrderHistory />} />
            <Route path="/edit-order/:id" element={<EditOrder />} />
            <Route path="/track-order" element={<TrackDelivery />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

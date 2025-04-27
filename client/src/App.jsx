// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Components
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/profile/Profile';
import UpdateProfile from './components/profile/UpdateProfile';
import UserManagement from './components/admin/UserManagement';

// buddhini


import RestaurantsList from './components/Customer/RestaurantsList';
import MenuPage from './components/Customer/MenuPage';
import CartPage from './components/Customer/CartPage';
import OrderHistory from './components/Customer/OrderHistory';
import EditOrder from './components/Customer/EditOrder';

// Delivery Components
import DeliveryHome from './components/delivery/deliveryHome';
import DeliveryLocationUpdater from './components/delivery/DeliveryLocationUpdater';
import AssignedOrderDetails from './components/delivery/AssignedOrderDetails';
import OrderTracking from "./components/delivery/OrderTracking";


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
          
          {/* Protected Routes for all authenticated users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<UpdateProfile />} />
          </Route>
          
          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['restaurant-admin']} />}>
            <Route path="/admin/users" element={<UserManagement />} />
          </Route>

          {/* Delivery Personnel Routes */}
          <Route element={<ProtectedRoute allowedRoles={['delivery-personnel']} />}>
            <Route path="/delivery" element={<DeliveryHome />} />
            <Route path="/location-updater" element={<DeliveryLocationUpdater />} />
            <Route path="/assigned-order-details" element={<AssignedOrderDetails />} /> 
            
          </Route>

          {/*Buddhini */} 
          {/* User Routes */}
          <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
            <Route path="/restaurantsList" element={<RestaurantsList />} />
            <Route path="/restaurants/:id/menu" element={<MenuPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/myorders" element={<OrderHistory />} />
            <Route path="/edit-order/:id" element={<EditOrder />} />
            <Route path="/track-order" element={<OrderTracking />} />
</Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

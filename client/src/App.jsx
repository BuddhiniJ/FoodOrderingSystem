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
import MyRestaurantsPage from './components/resturant/MyRestaurantsPage';
import RegisterRestaurant from './components/resturant/RegisterRestaurant';
import ResturantView from './components/resturant/ResturantView';
import EditResturant from './components/resturant/EditResturant';

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
            <Route path="/my-restaurants" element={<MyRestaurantsPage />} />
            <Route path="/add-restaurant" element={<RegisterRestaurant />} />
            <Route path="/view-restaurant/:id" element={<ResturantView />} />
            <Route path="/edit-restaurant/:id" element={<EditResturant />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

import CustomerDashboard from './pages/Customer/Home';
import MenuPage from './pages/Customer/MenuPage';
import CartPage from './pages/Customer/Cart';
import AdminDashboard from './pages/Resturant/AdminDashboard';
import RegisterRestaurant from './pages/Resturant/RegisterResturant';
import EditRestaurant from './pages/Resturant/EditRestaurant';
import ResturantLogin from './pages/Resturant/ResturantLogin';
import Home from './pages/HomePage';


function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/restaurant/:id/menu" element={<MenuPage />} />
          <Route path="/admin" element={<RegisterRestaurant />} />
          <Route path="/resturantLogin" element={<ResturantLogin />} />
          <Route path="/admin/:id/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/:id/edit" element={<EditRestaurant />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import MainLayout from './layout/MainLayout';
import RestaurantsList from './Customer/RestaurantsList';
import MyRestaurantsPage from './resturant/MyRestaurantsPage';

const Home = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');


  return (
    <MainLayout>
      <div className="home-container">
        <div className="hero-section">
          <h1>Welcome to Food Delivery Platform</h1>
          <p>Order food from your favorite restaurants and get it delivered to your doorstep.</p>

          {!isAuthenticated ? (
            <div className="cta-buttons">
              <Link to="/login" className="btn btn-primary">Login</Link>
              <Link to="/register" className="btn btn-secondary">Register</Link>
            </div>
          ) : (
            <div className="welcome-user">
              <h2>Welcome back, {user.name}!</h2>
              <p>What would you like to do today?</p>
              <div className="user-actions">
                {/* {user.role === 'restaurant-admin' && (
                  <div className="admin-actions">
                    <Link to="/profile" className="btn btn-secondary">View Profile</Link>
                    <Link to="/admin/users" className="btn btn-primary">Manage Users</Link> &nbsp; &nbsp;
                    <Link to="/my-restaurants" className="btn btn-secondary">My Restaurants</Link>
                  </div>
                )} */}
                {user.role === 'restaurant-admin' && (
                  <div>
                    <MyRestaurantsPage />
                    </div>
                )}
                {user.role === 'customer' && (
                  <div>
                    {/* <Link to="/restaurantsList" className="btn btn-secondary">View Resturants</Link> &nbsp; &nbsp; */}
                    <RestaurantsList searchQuery={searchQuery} />
                    </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;

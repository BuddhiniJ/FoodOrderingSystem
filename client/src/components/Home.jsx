import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import MainLayout from './layout/MainLayout';

const Home = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

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
                <Link to="/profile" className="btn btn-primary">View Profile</Link>
                {user.role === 'restaurant-admin' && (
                  <Link to="/admin/users" className="btn btn-secondary">Manage Users</Link>
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

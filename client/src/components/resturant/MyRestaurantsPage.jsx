import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ResturantStyles.css'; // Import the custom CSS file
import MainLayout from '../layout/MainLayout';

const MyRestaurantsPage = () => {
  const token = localStorage.getItem('token');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:5003/api/restaurants/my-restaurants', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
          params: {
            _: Date.now(),
          }
        });

        if (response.data && Array.isArray(response.data)) {
          setRestaurants(response.data);
        } else {
          setRestaurants([]);
          console.warn('Unexpected response format:', response.data);
        }
      } catch (err) {
        console.error('Failed to fetch restaurants:', err);
        setError('Failed to load restaurants. Please try again later.');
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMyRestaurants();
    } else {
      setLoading(false);
      setError('Authentication required. Please log in.');
    }
  }, [token]);

  if (loading) {
    return <div className="container loading-container">Loading your restaurants...</div>;
  }

  if (error) {
    return <div className="container error-alert">{error}</div>;
  }

  return (
    <MainLayout>

      <div className="my-restaurants-container">
        <div className="page-header">
          <h1>My Restaurants</h1>
          <Link to="/add-restaurant" className="add-restaurant-btn">
            + Add New Restaurant
          </Link>
        </div>

        {restaurants.length === 0 ? (
          <div className="empty-state">
            <p>You have not registered any restaurants yet.</p>
            <p>Click the button above to add your first restaurant.</p>
          </div>
        ) : (
          <div className="restaurant-grid">
            {restaurants.map(restaurant => (
              <div key={restaurant._id} className="restaurant-card">
                <div className="restaurant-card-header">
                  <h3>{restaurant.name}</h3>
                  <span className={`status-badge ${restaurant.isAvailable ? 'available' : 'unavailable'}`}>
                    {restaurant.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                {restaurant.image && (
                  <div className="restaurant-image-container">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="restaurant-image"
                    />
                  </div>
                )}

                <div className="restaurant-details">
                  <div className="detail-item">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{restaurant.location}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Contact:</span>
                    <span className="detail-value">{restaurant.contact}</span>
                  </div>

                  <div className="detail-item description">
                    <span className="detail-label">Description:</span>
                    <p className="detail-value">{restaurant.description}</p>
                  </div>
                </div>

                <div className="restaurant-actions">
                  <Link to={`/edit-restaurant/${restaurant._id}`} className="edit-btn">
                    Edit
                  </Link>
                  <Link to={`/view-restaurant/${restaurant._id}`} className="view-btn">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>

  );
};

export default MyRestaurantsPage;
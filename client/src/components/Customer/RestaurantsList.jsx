// 📁 src/pages/Customer/RestaurantsList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MainLayout from '../layout/MainLayout';


const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5003/api/restaurants')
      .then(res => setRestaurants(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <MainLayout>

    <div className="restaurants-container">
        <h1 className="restaurants-title">Available Restaurants</h1>
        <div className="restaurants-grid">
          {restaurants.map(rest => (
            <Link key={rest._id} to={`/restaurants/${rest._id}/menu`} className="restaurant-card">
              {rest.image && <img src={rest.image} alt={rest.name} className="restaurant-image" />}
              <h2 className="restaurant-name">{rest.name}</h2>
              <p className="restaurant-location">{rest.location}</p>
              <p className="restaurant-description">{rest.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default RestaurantsList;

import React, { useEffect, useState } from 'react';
import axios from '../api/restaurantAPI';

const CustomerRestaurants = ({ onSelect }) => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    axios.get('/restaurants').then(res => setRestaurants(res.data));
  }, []);

  return (
    <div>
      <h2>Select a Restaurant</h2>
      <ul>
        {restaurants.filter(r => r.isAvailable).map(r => (
          <li key={r._id}>
            <button onClick={() => onSelect(r)}>{r.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerRestaurants;

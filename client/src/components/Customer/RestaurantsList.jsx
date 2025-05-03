import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../stylesheets/ResturantStyles.css";
const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const RESTAURANT_API = import.meta.env.VITE_RESTAURANT_SERVICE_URL;

  useEffect(() => {
    axios
      .get(`${RESTAURANT_API}/restaurants`)
      .then((res) => setRestaurants(res.data))
      .catch((err) => console.error(err));
  }, []);

  // If searchQuery is empty, display all restaurants, otherwise filter based on the searchQuery
  const filteredRestaurants = searchQuery
    ? restaurants.filter((rest) =>
        rest.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : restaurants;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="restaurants-container">
      <h1 className="restaurants-title">Find a Restaurant</h1>

      {/* Search Bar */}
      <div className="restaurant-search-container">
        <input
          type="text"
          placeholder="Search for a restaurant"
          value={searchQuery}
          onChange={handleSearchChange}
          className="restaurant-search-bar"
        />
      </div>

      <div className="restaurants-grid">
        {filteredRestaurants.map((rest) => (
          <Link
            key={rest._id}
            to={`/restaurants/${rest._id}/menu`}
            className="restaurant-card"
          >
            {rest.image && (
              <img
                src={rest.image}
                alt={rest.name}
                className="restaurant-image"
              />
            )}
            <h2 className="restaurant-name">{rest.name}</h2>
            <p className="restaurant-location">{rest.location}</p>
            <p className="restaurant-description">{rest.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RestaurantsList;

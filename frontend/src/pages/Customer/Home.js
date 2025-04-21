import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios.get('http://localhost:5001/api/restaurants')
      .then(res => {
        setRestaurants(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      {/* Hero Section */}
      <div className="relative text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/bg.png')" }}></div>
        <div className="container mx-auto px-4 py-12 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Delicious Food Delivered</h1>
          <p className="text-xl mb-8 max-w-xl">Discover and order from the best local restaurants in your area</p>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search restaurants or locations..."
              className="w-full py-3 px-4 pr-10 rounded-lg text-gray-800 focus:ring-2 focus:ring-orange-400 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i class="fa-solid fa-magnifying-glass absolute right-3 top-3 text-gray-500" size={20}></i>
          </div>
        </div>
      </div>

      {/* Restaurant List */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Popular Restaurants</h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No restaurants found matching your search.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map(restaurant => (
              <li key={restaurant._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                  {restaurant.image ? (
                    <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                  ) : (
                    <h1>  no image </h1>
                  )}
                  <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 rounded-bl-lg text-sm font-medium">
                    4.5 ★
                  </div>
                </div>

                <div className="p-4">
                  <Link to={`/restaurant/${restaurant._id}/menu`} className="text-xl font-semibold text-gray-800 hover:text-orange-600 transition-colors duration-200">
                    {restaurant.name}
                  </Link>

                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <i class="fa-solid fa-map-pin mr-1 text-orange-500" size={16}></i>
                      <span>{restaurant.location}</span>
                    </div>
                    <div className="flex items-center">
                      <i class="fa-solid fa-map-pin mr-1 text-orange-500" size={16}></i>
                      <span>{restaurant.contact}</span>
                    </div>
                    <div className="flex items-center">
                      <i class="fa-solid fa-map-pin mr-1 text-orange-500" size={16}></i>
                      <span>30-45 min delivery</span>
                    </div>
                  </div>

                  <p className="mt-3 text-gray-700 line-clamp-2">{restaurant.description}</p>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-orange-600 font-medium">Free delivery on first order</span>
                    <Link to={`/restaurant/${restaurant._id}/menu`} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium">
                      View Menu
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Choose a Restaurant', desc: 'Browse our selection of top-rated local restaurants' },
            { title: 'Select Your Food', desc: 'View menus and pick your favorite dishes' },
            { title: 'Enjoy Your Meal', desc: 'Pay online and get your food delivered to your door' }
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-orange-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-orange-600">{index + 1}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CartModal from '../../components/CartModel';
import { useCart } from '../../context/CartContext';

const MenuPage = () => {
  const { id } = useParams();
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    axios.get(`http://localhost:5001/api/restaurants/${id}`)
      .then(res => setRestaurant(res.data))
      .catch(err => console.error('Error fetching restaurant:', err));

    setLoading(true);
    const url = `http://localhost:5001/api/restaurants/menu/${id}`;
    const query = selectedCategory ? `?category=${selectedCategory}` : '';

    axios.get(url + query)
      .then(res => {
        setMenu(res.data);
        setLoading(false);
        if (!selectedCategory) {
          const uniqueCategories = [...new Set(res.data.map(item => item.category))];
          setCategories(uniqueCategories);
        }
      })
      .catch(err => {
        console.error('Error fetching menu:', err);
        setLoading(false);
      });
  }, [id, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {restaurant && (
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
          <p className="mt-2 text-lg text-gray-600">Menu Selection</p>
        </header>
      )}

      <div className="flex flex-col md:flex-row mb-8">
        <div className="w-full md:w-64 mb-4 md:mb-0 md:mr-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium text-lg mb-3">Categories</h3>
            <div className="space-y-2">
              <button
                className={`block w-full text-left px-3 py-2 rounded ${selectedCategory === '' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                onClick={() => setSelectedCategory('')}
              >
                All Items
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`block w-full text-left px-3 py-2 rounded ${selectedCategory === cat ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {selectedCategory && (
              <div className="mt-4 pt-4 border-t">
                <button
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  onClick={() => setSelectedCategory('')}
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Clear Filter
                </button>
              </div>
            )}
          </div>
        </div>

        <Link to="/cart" className="text-blue-600 hover:underline">View Cart</Link>


        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : menu.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-500">No menu items found</p>
              {selectedCategory && (
                <p className="text-sm text-gray-500 mt-2">Try selecting a different category</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menu.map(item => (
                <div key={item._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  {item.image ? (
                    <div className="relative h-48 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-tl-md font-medium">
                        Rs.{item.price}
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                      <span className="text-gray-400">No image</span>
                      <div className="absolute bottom-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-tl-md font-medium">
                        Rs.{item.price}
                      </div>
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{item.description}</p>

                    <div className="mt-4 flex justify-between items-center">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedItem && (
        <CartModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onConfirm={(data) => addToCart({ ...data, restaurant })}
        />

      )}
    </div>
  );
};

export default MenuPage;

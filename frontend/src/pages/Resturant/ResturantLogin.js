// 🚀 LoginRestaurant.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginRestaurant = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/restaurants/loginResturant', credentials);
      navigate(`/admin/${res.data.restaurantId}/dashboard`);
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Login to Manage Restaurant</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input className="border p-2 rounded w-full" placeholder="Username" value={credentials.username} onChange={e => setCredentials({ ...credentials, username: e.target.value })} />
        <input className="border p-2 rounded w-full" type="password" placeholder="Password" value={credentials.password} onChange={e => setCredentials({ ...credentials, password: e.target.value })} />
        <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Login</button>
      </form>
    </div>
  );
};

export default LoginRestaurant;
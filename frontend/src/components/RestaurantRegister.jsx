import React, { useState } from 'react';
import axios from '../api/restaurantAPI';

const RestaurantRegister = ({ onRegistered }) => {
  const [form, setForm] = useState({ name: '', address: '', isAvailable: true });

  const handleSubmit = async () => {
    const res = await axios.post('/restaurants', form);
    onRegistered(res.data); // Pass data to parent for menu binding
    setForm({ name: '', address: '', isAvailable: true });
  };

  return (
    <div>
      <h2>Register Restaurant</h2>
      <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
      <label>
        <input type="checkbox" checked={form.isAvailable} onChange={e => setForm({ ...form, isAvailable: e.target.checked })} />
        Available
      </label>
      <button onClick={handleSubmit}>Register</button>
    </div>
  );
};

export default RestaurantRegister;

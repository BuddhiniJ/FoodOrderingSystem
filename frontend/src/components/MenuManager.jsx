import React, { useEffect, useState } from 'react';
import axios from '../api/restaurantAPI';

const MenuManager = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', description: '', category: '', restaurantId: '', isAvailable: true });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    axios.get('/restaurants').then(res => setRestaurants(res.data));
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    const res = await axios.get('/menu');
    setMenuItems(res.data);
  };

  const handleSubmit = async () => {
    if (editId) {
      await axios.put(`/menu/${editId}`, form);
    } else {
      await axios.post('/menu', form);
    }
    setForm({ name: '', price: '', description: '', category: '', restaurantId: '', isAvailable: true });
    setEditId(null);
    fetchMenu();
  };

  const handleEdit = item => {
    setForm(item);
    setEditId(item._id);
  };

  const handleDelete = async id => {
    await axios.delete(`/menu/${id}`);
    fetchMenu();
  };

  return (
    <div>
      <h2>Manage Menu</h2>
      <select value={form.restaurantId} onChange={e => setForm({ ...form, restaurantId: e.target.value })}>
        <option value="">Select Restaurant</option>
        {restaurants.map(r => (
          <option key={r._id} value={r._id}>{r.name}</option>
        ))}
      </select>
      <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
      <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
      <label>
        <input type="checkbox" checked={form.isAvailable} onChange={e => setForm({ ...form, isAvailable: e.target.checked })} />
        Available
      </label>
      <button onClick={handleSubmit}>{editId ? 'Update' : 'Add'}</button>

      <ul>
        {menuItems.map(item => (
          <li key={item._id}>
            {item.name} - Rs.{item.price} | {item.category} | {item.description}
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuManager;

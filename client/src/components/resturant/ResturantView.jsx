import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ResturantStyles.css'; // Import the custom CSS file
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

import MainLayout from '../layout/MainLayout';


const RestaurantView = () => {
  const { id: restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Special'];

  useEffect(() => {
    fetchRestaurantAndMenu();
  }, [restaurantId]);

  const fetchRestaurantAndMenu = async () => {
    setLoading(true);
    try {
      const [restaurantRes, menuRes] = await Promise.all([
        axios.get(`http://localhost:5003/api/restaurants`),
        axios.get(`http://localhost:5003/api/restaurants/menu/${restaurantId}`)
      ]);

      const found = restaurantRes.data.find(r => r._id === restaurantId);
      setRestaurant(found);
      setMenuItems(menuRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    formData.append('restaurantId', restaurantId);
    if (image) formData.append('image', image);

    try {
      if (editingId) {
        await axios.put(`http://localhost:5003/api/restaurants/menu/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5003/api/restaurants/menu/with-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      resetForm();
      fetchRestaurantAndMenu();
    } catch (err) {
      console.error(err);
      alert('Failed to save menu item');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', category: '' });
    setImage(null);
    setPreview(null);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category
    });
    setEditingId(item._id);

    if (item.image) {
      setPreview(item.image);
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await axios.delete(`http://localhost:5003/api/restaurants/menu/${id}`);
        fetchRestaurantAndMenu();
      } catch (err) {
        console.error(err);
        alert('Failed to delete item');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading restaurant details...</p>
      </div>
    );
  }

  const mapContainerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: '12px',
    marginTop: '1rem'
  };

  const center = {
    lat: parseFloat(restaurant?.latitude || 6.9271),  // default to Colombo
    lng: parseFloat(restaurant?.longitude || 79.8612)
  };

  return (
    <MainLayout>

      <div className="restaurant-view-container">
        {restaurant ? (
          <div className="restaurant-header">
            <div className="restaurant-header-content">
              <div className="restaurant-header-info">
                <h1>{restaurant.name}</h1>
                <p className="restaurant-location">{restaurant.location}</p>
              </div>
              <div className="restaurant-header-actions">
                <Link to="/my-restaurants" className="back-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        <div className="restaurant-content">
          {restaurant ? (
            <div className="restaurant-details-card">
              <div className="restaurant-info-container">
                {restaurant.image && (
                  <div className="restaurant-image-wrapper">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="restaurant-image"
                    />
                  </div>
                )}

                <div className={restaurant.image ? "restaurant-info with-image" : "restaurant-info"}>
                  <div className="info-panel">
                    <h3>Restaurant Information</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <p className="info-label">Contact</p>
                        <p className="info-value">{restaurant.contact || 'Not provided'}</p>
                      </div>
                      <div className="info-item">
                        <p className="info-label">Status</p>
                        <span className={`status-pill ${restaurant.isAvailable ? 'available' : 'unavailable'}`}>
                          {restaurant.isAvailable ? 'Available for Orders' : 'Not Available'}
                        </span>
                      </div>
                    </div>
                    {restaurant.description && (
                      <div className="info-description">
                        <p className="info-label">Description</p>
                        <p className="info-value description">{restaurant.description}</p>
                      </div>
                    )}
                    {restaurant?.latitude && restaurant?.longitude && (
                      <div className="restaurant-map-container">
                        <GoogleMap
                          mapContainerStyle={mapContainerStyle}
                          center={center}
                          zoom={15}
                        >
                          <Marker position={center} />
                        </GoogleMap>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="restaurant-error-notice">
              <div className="error-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <p>Restaurant information could not be loaded. Please check if the restaurant ID is correct.</p>
            </div>
          )}

          <div className="menu-form-card">
            <div className="card-header">
              <h2>{editingId ? 'Update Menu Item' : 'Add New Menu Item'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="menu-form">
              <div className="form-grid">
                <div className="form-left-column">
                  <div className="form-group">
                    <label>Item Name</label>
                    <input
                      className="form-input"
                      placeholder="E.g., Chicken Burger"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Short description of the item"
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="price-category-row">
                    <div className="form-group">
                      <label>Price (Rs)</label>
                      <input
                        className="form-input"
                        placeholder="E.g., 350"
                        type="number"
                        min="0"
                        step="any"
                        value={form.price}
                        onChange={e => setForm({ ...form, price: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Category</label>
                      <select
                        className="form-select"
                        value={form.category}
                        onChange={e => setForm({ ...form, category: e.target.value })}
                        required
                      >
                        <option value="" disabled>Select a category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-right-column">
                  <div className="form-group">
                    <label>Item Image</label>
                    <div className="image-upload-area">
                      {preview ? (
                        <div className="image-preview-container">
                          <img src={preview} alt="Preview" className="image-preview" />
                          <button
                            type="button"
                            onClick={() => {
                              setImage(null);
                              setPreview(null);
                            }}
                            className="remove-image-btn"
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : (
                        <div className="upload-placeholder">
                          <svg width="48" height="48" viewBox="0 0 48 48" stroke="currentColor" fill="none">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="upload-text">
                            <label htmlFor="file-upload" className="file-upload-label">
                              <span>Upload an image</span>
                              <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                            </label>
                          </div>
                          <p className="upload-hint">PNG, JPG up to 2MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className={`submit-btn ${submitting ? 'submitting' : ''}`}
                >
                  {submitting ? (
                    <>
                      <svg className="spinner" width="16" height="16" viewBox="0 0 24 24">
                        <circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingId ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    editingId ? 'Update Item' : 'Add Item'
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="menu-items-card">
            <div className="card-header">
              <h2>Menu Items</h2>
            </div>

            {menuItems.length === 0 ? (
              <div className="empty-menu-state">
                <svg width="48" height="48" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>No menu items yet. Add your first item using the form above.</p>
              </div>
            ) : (
              <div className="menu-table-container">
                <table className="menu-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Description</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th className="actions-column">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map(item => (
                      <tr key={item._id}>
                        <td>
                          <div className="menu-item-info">
                            {item.image ? (
                              <img className="menu-item-image" src={item.image} alt={item.name} />
                            ) : (
                              <div className="menu-item-no-image">
                                <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                            <div className="menu-item-name">{item.name}</div>
                          </div>
                        </td>
                        <td>
                          <div className="menu-item-description">{item.description}</div>
                        </td>
                        <td>
                          <div className="menu-item-price">Rs. {item.price}</div>
                        </td>
                        <td>
                          <span className="category-badge">{item.category}</span>
                        </td>
                        <td>
                          <div className="menu-item-actions">
                            <button
                              onClick={() => handleEdit(item)}
                              className="edit-btn"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item._id, item.name)}
                              className="delete-btn"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>

  );
};

export default RestaurantView;
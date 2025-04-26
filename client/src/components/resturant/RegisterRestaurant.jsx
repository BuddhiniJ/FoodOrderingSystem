import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import MainLayout from '../layout/MainLayout';


const RegisterRestaurant = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', location: '', contact: '', description: '', isAvailable: true
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const token = localStorage.getItem('token');

  // Google Maps state
  const [markerPosition, setMarkerPosition] = useState({ lat: 6.9271, lng: 79.8612 }); // default: Colombo

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    if (image) formData.append('image', image);

    // Include lat/lng from map
    formData.append('latitude', markerPosition.lat);
    formData.append('longitude', markerPosition.lng);

    try {
      const res = await axios.post('http://localhost:5003/api/restaurants/restaurants', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      alert('Registered successfully!');
      navigate(`/admin/${res.data._id}/dashboard`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <MainLayout>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow">
              <div className="card-header bg-primary text-white text-center py-3">
                <h2 className="mb-0">Register Your Restaurant</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* Basic Information Section */}
                  <div className="card mb-4">
                    <div className="card-header bg-light">
                      <h3 className="h5 mb-0">Basic Information</h3>
                    </div>
                    <div className="card-body">
                      <div className="row mb-3">
                        <div className="col-md-6 mb-3 mb-md-0">
                          <label htmlFor="name" className="form-label">Restaurant Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Enter restaurant name"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="location" className="form-label">Location</label>
                          <input
                            type="text"
                            className="form-control"
                            id="location"
                            placeholder="City or Area"
                            value={form.location}
                            onChange={e => setForm({ ...form, location: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="contact" className="form-label">Contact Information</label>
                        <input
                          type="text"
                          className="form-control"
                          id="contact"
                          placeholder="Phone number or email"
                          value={form.contact}
                          onChange={e => setForm({ ...form, contact: e.target.value })}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          id="description"
                          placeholder="Tell customers about your restaurant"
                          rows="4"
                          value={form.description}
                          onChange={e => setForm({ ...form, description: e.target.value })}
                          required
                        ></textarea>
                      </div>

                      <div>
                        <label htmlFor="isAvailable" className="form-label">Availability Status</label>
                        <select
                          className="form-select"
                          id="isAvailable"
                          value={form.isAvailable}
                          onChange={e => setForm({ ...form, isAvailable: e.target.value === 'true' })}
                        >
                          <option value={true}>Available for Orders</option>
                          <option value={false}>Not Currently Available</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Restaurant Photo Section */}
                  <div className="card mb-4">
                    <div className="card-header bg-light">
                      <h3 className="h5 mb-0">Restaurant Photo</h3>
                    </div>
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-md-6 mb-3 mb-md-0">
                          <label htmlFor="image" className="form-label">Upload Image</label>
                          <input
                            type="file"
                            className="form-control"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                          <div className="form-text">Recommended: High quality JPEG or PNG, landscape orientation</div>
                        </div>
                        <div className="col-md-6 text-center">
                          {preview ? (
                            <img
                              src={preview}
                              alt="Restaurant preview"
                              className="img-thumbnail"
                              style={{ height: '160px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="bg-light p-5 border rounded text-muted d-flex align-items-center justify-content-center" style={{ height: '160px' }}>
                              <span>Image preview</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Map Location Section */}
                  <div className="card mb-4">
                    <div className="card-header bg-light">
                      <h3 className="h5 mb-0">Pin Location on Map</h3>
                    </div>
                    <div className="card-body">
                      <div className="border rounded mb-3">
                        <LoadScript googleMapsApiKey="AIzaSyDv0hcUFYDTsfEDjTt84D0q0PROe66LKFc">
                          <GoogleMap
                            mapContainerStyle={{ height: '400px', width: '100%' }}
                            center={markerPosition}
                            zoom={14}
                            onClick={(e) => setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
                          >
                            <Marker
                              position={markerPosition}
                              draggable={true}
                              onDragEnd={(e) => setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
                            />
                          </GoogleMap>
                        </LoadScript>
                      </div>
                      <div className="d-flex align-items-center text-muted mb-1">
                        <svg className="me-1" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span>Latitude: {markerPosition.lat.toFixed(5)}, Longitude: {markerPosition.lng.toFixed(5)}</span>
                      </div>
                      <div className="form-text">Drag the marker or click on the map to set your restaurant's exact location</div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary btn-lg px-5">
                      Register Restaurant
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>

  );
};

export default RegisterRestaurant;
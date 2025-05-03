// EditRestaurant.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import MainLayout from '../layout/MainLayout';

const EditRestaurant = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const RESTAURANT_API = import.meta.env.VITE_RESTAURANT_SERVICE_URL;

    const [form, setForm] = useState({
        name: '', location: '', contact: '', description: '', isAvailable: true,
        latitude: null, longitude: null
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyDv0hcUFYDTsfEDjTt84D0q0PROe66LKFc"
    });

    useEffect(() => {
        const fetchRestaurant = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                  `${RESTAURANT_API}/restaurants/${id}`
                );
                setForm({
                    ...res.data,
                    isAvailable: res.data.isAvailable,
                    latitude: res.data.latitude,
                    longitude: res.data.longitude
                });
                if (res.data.image) setPreview(res.data.image);
            } catch (err) {
                console.error(err);
                alert('Failed to fetch restaurant data');
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurant();
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImage(null);
        setPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        Object.entries(form).forEach(([k, v]) => formData.append(k, v));
        if (image) formData.append('image', image);

        try {
            await axios.put(`${RESTAURANT_API}/restaurants/${id}`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            alert('Updated successfully!');
            navigate(`/my-restaurants`);
        } catch (err) {
            console.error(err);
            alert('Update failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleMapClick = (e) => {
        setForm({
            ...form,
            latitude: e.latLng.lat(),
            longitude: e.latLng.lng()
        });
    };

    if (loading) {
        return (
            <div className="edit-restaurant-container">
                <div className="loading-container">
                    <div className="loader"></div>
                </div>
            </div>
        );
    }

    return (
        <MainLayout>

            <div className="edit-restaurant-container">
                <div className="edit-restaurant-card">
                    <div className="card-header">
                        <h2>Edit Restaurant</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="edit-form">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Restaurant Name</label>
                                <input
                                    className="form-input"
                                    placeholder="Enter restaurant name"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    className="form-input"
                                    placeholder="Address or area"
                                    value={form.location}
                                    onChange={e => setForm({ ...form, location: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Contact Number</label>
                                <input
                                    className="form-input"
                                    placeholder="Phone number"
                                    value={form.contact}
                                    onChange={e => setForm({ ...form, contact: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Availability Status</label>
                                <div className="toggle-container">
                                    <span className="toggle-label">Status:</span>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={form.isAvailable}
                                            onChange={() => setForm({ ...form, isAvailable: !form.isAvailable })}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                    <span className={`toggle-status ${form.isAvailable ? 'status-available' : 'status-unavailable'}`}>
                                        {form.isAvailable ? 'Available' : 'Not Available'}
                                    </span>
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Tell customers about your restaurant"
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="image-section">
                                <label className="upload-label">Restaurant Image</label>
                                <div className="image-upload-container">
                                    <input
                                        type="file"
                                        className="file-input"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />

                                    {!preview ? (
                                        <div className="upload-area">
                                            <svg className="upload-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                                            </svg>
                                            <div className="upload-text">Click to upload an image</div>
                                            <p className="upload-hint">PNG, JPG up to 5MB</p>
                                        </div>
                                    ) : (
                                        <div className="image-preview-wrapper">
                                            <img
                                                src={preview}
                                                alt="Restaurant preview"
                                                className="preview-image"
                                            />
                                            <button
                                                type="button"
                                                className="remove-image"
                                                onClick={removeImage}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M18 6L6 18M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="map-section">
                                <label>Restaurant Location on Map</label>
                                {isLoaded ? (
                                    <>
                                        <div className="map-container">
                                            <GoogleMap
                                                mapContainerStyle={{ width: '100%', height: '100%' }}
                                                center={{ lat: form.latitude || 6.9271, lng: form.longitude || 79.8612 }}
                                                zoom={form.latitude && form.longitude ? 15 : 8}
                                                onClick={handleMapClick}
                                            >
                                                {form.latitude && form.longitude && (
                                                    <Marker position={{ lat: form.latitude, lng: form.longitude }} />
                                                )}
                                            </GoogleMap>
                                        </div>
                                        <p className="map-instructions">Click on the map to set your restaurant's location</p>
                                    </>
                                ) : (
                                    <div className="loading-container">
                                        <div className="loader"></div>
                                    </div>
                                )}
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => navigate('/my-restaurants')}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <svg className="spinner" width="16" height="16" viewBox="0 0 24 24">
                                                <circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </>
                                    ) : "Update Restaurant"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
};

export default EditRestaurant;

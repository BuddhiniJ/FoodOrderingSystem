import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditRestaurant = () => {
    const { id: restaurantId } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: '', location: '', contact: '', description: '', isAvailable: true });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:5001/api/restaurants`)
            .then(res => {
                const found = res.data.find(r => r._id === restaurantId);
                if (found) {
                    setForm({
                        name: found.name || '',
                        location: found.location || '',
                        contact: found.contact || '',
                        description: found.description || '',
                        isAvailable: found.isAvailable || false
                    });
                    if (found.image) setPreview(found.image);
                } else {
                    setError("Restaurant not found");
                }
            })
            .catch(err => {
                console.error(err);
                setError("Failed to load restaurant data");
            })
            .finally(() => setLoading(false));
    }, [restaurantId]);

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
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('location', form.location);
            formData.append('contact', form.contact);
            formData.append('description', form.description);
            formData.append('isAvailable', form.isAvailable);
            if (image) formData.append('image', image);

            const response = await axios.put(
                `http://localhost:5001/api/restaurants/${restaurantId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            navigate(`/admin/${restaurantId}/dashboard`);
        } catch (err) {
            console.error('Update error:', err.response?.data || err.message);
            setError(err.response?.data?.error || "Failed to update restaurant");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !form.name) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error && !form.name) {
        return (
            <div className="max-w-2xl mx-auto p-6 text-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
                <button
                    onClick={() => navigate('/admin/restaurants')}
                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Back to Restaurants
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Edit Restaurant</h2>
                <button
                    onClick={() => navigate(`/admin/${restaurantId}/dashboard`)}
                    className="text-gray-600 hover:text-gray-800"
                >
                    Cancel
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
                    <input
                        className="shadow-sm border border-gray-300 p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter restaurant name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                        className="shadow-sm border border-gray-300 p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter location"
                        value={form.location}
                        onChange={e => setForm({ ...form, location: e.target.value })}
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Contact Information</label>
                    <input
                        className="shadow-sm border border-gray-300 p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Phone number, email, etc."
                        value={form.contact}
                        onChange={e => setForm({ ...form, contact: e.target.value })}
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        className="shadow-sm border border-gray-300 p-3 rounded w-full h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe your restaurant"
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Availability Status</label>
                    <select
                        className="shadow-sm border border-gray-300 bg-white p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={form.isAvailable}
                        onChange={e => setForm({ ...form, isAvailable: e.target.value === 'true' })}
                    >
                        <option value={true}>Available for Orders</option>
                        <option value={false}>Temporarily Unavailable</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Restaurant Image</label>
                    <div className="flex items-center space-x-4">
                        <label className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <span>Choose File</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                        <span className="text-sm text-gray-500">{image ? image.name : "No file chosen"}</span>
                    </div>

                    {preview && (
                        <div className="mt-2">
                            <div className="bg-gray-100 p-2 rounded">
                                <img src={preview} alt="Restaurant Preview" className="h-40 w-full object-cover rounded" />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Preview image</p>
                        </div>
                    )}
                </div>

                <div className="pt-5 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => navigate(`/admin/${restaurantId}/dashboard`)}
                        className="bg-white py-2 px-4 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditRestaurant;
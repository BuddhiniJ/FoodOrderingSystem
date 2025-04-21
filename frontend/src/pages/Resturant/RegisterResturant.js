// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';

// const RegisterRestaurant = () => {
//   const [form, setForm] = useState({
//     name: '',
//     location: '',
//     contact: '',
//     description: '',
//     isAvailable: true
//   });
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       const reader = new FileReader();
//       reader.onload = () => {
//         setPreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const formData = new FormData();
//     Object.keys(form).forEach(key => formData.append(key, form[key]));
//     if (image) formData.append('image', image);

//     try {
//       const res = await axios.post('http://localhost:5001/api/restaurants/with-image', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//       Swal.fire({
//         icon: 'success',
//         title: 'Restaurant Registered!',
//         text: 'Your restaurant has been successfully registered.',
//         confirmButtonColor: '#10B981'
//       });
//       navigate(`/admin/${res.data._id}/dashboard`);
//     } catch (err) {
//       console.error(err);
//       Swal.fire({
//         icon: 'error',
//         title: 'Registration Failed',
//         text: err.response?.data?.message || 'Something went wrong. Please try again.',
//         confirmButtonColor: '#EF4444'
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto my-10 bg-white rounded-lg shadow-lg overflow-hidden">
//       <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4">
//         <h1 className="text-3xl font-bold text-white">Register a New Restaurant</h1>
//         <p className="text-green-50">Complete the form below to add your restaurant to our platform</p>
//       </div>

//       <form onSubmit={handleSubmit} className="p-6 space-y-6">

//         <div className="grid md:grid-cols-2 gap-6">
//           {/* Left column */}
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
//               <input
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
//                 placeholder="Enter restaurant name"
//                 value={form.name}
//                 onChange={e => setForm({ ...form, name: e.target.value })}
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
//               <input
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
//                 placeholder="Enter full address"
//                 value={form.location}
//                 onChange={e => setForm({ ...form, location: e.target.value })}
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
//               <input
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
//                 placeholder="Enter contact number"
//                 value={form.contact}
//                 onChange={e => setForm({ ...form, contact: e.target.value })}
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
//               <input
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
//                 placeholder="Enter username"
//                 value={form.username}
//                 onChange={e => setForm({ ...form, username: e.target.value })}
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//               <input
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
//                 placeholder="Enter password"
//                 value={form.password}
//                 onChange={e => setForm({ ...form, password: e.target.value })}
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//               <textarea
//                 className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm h-32"
//                 placeholder="Write a short description about your restaurant"
//                 value={form.description}
//                 onChange={e => setForm({ ...form, description: e.target.value })}
//                 required
//               ></textarea>
//             </div>
//           </div>

//           {/* Right column */}
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Image</label>
//               <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-green-400 transition-colors">
//                 {preview ? (
//                   <div className="space-y-2 text-center">
//                     <img src={preview} alt="Preview" className="mx-auto h-40 object-cover" />
//                     <button
//                       type="button"
//                       className="px-3 py-1 text-sm text-red-600 hover:text-red-700"
//                       onClick={() => {
//                         setImage(null);
//                         setPreview(null);
//                       }}
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="space-y-1 text-center">
//                     <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
//                       <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                     </svg>
//                     <div className="flex text-sm text-gray-600">
//                       <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
//                         <span>Upload a file</span>
//                         <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
//                       </label>
//                       <p className="pl-1">or drag and drop</p>
//                     </div>
//                     <p className="text-xs text-gray-500">
//                       Recommended: 800x400 pixels (JPG, PNG)
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
//               <label className="flex items-center space-x-3 cursor-pointer">
//                 <div className="relative">
//                   <input
//                     type="checkbox"
//                     checked={form.isAvailable}
//                     onChange={e => setForm({ ...form, isAvailable: e.target.checked })}
//                     className="h-6 w-6 text-green-500 border-gray-300 rounded focus:ring-green-500"
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-900">Available for Orders</span>
//                   <span className="text-xs text-gray-500">Your restaurant will appear in search results</span>
//                 </div>
//               </label>
//             </div>
//           </div>
//         </div>

//         <div className="pt-5 border-t border-gray-200">
//           <div className="flex justify-end space-x-3">
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center"
//             >
//               {loading ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Processing...
//                 </>
//               ) : 'Register Restaurant'}
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default RegisterRestaurant;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

const RegisterRestaurant = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', location: '', contact: '', description: '', isAvailable: true,
    username: '', password: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // 🗺️ Google Maps state
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

    // 📍 Include lat/lng from map
    formData.append('latitude', markerPosition.lat);
    formData.append('longitude', markerPosition.lng);

    try {
      const res = await axios.post('http://localhost:5001/api/restaurants/with-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Registered successfully!');
      navigate(`/admin/${res.data._id}/dashboard`);
    } catch (err) {
      console.error(err);
      alert('Registration failed');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Register Restaurant</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="border p-2 rounded w-full" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="border p-2 rounded w-full" placeholder="Location (City or Area)" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
        <input className="border p-2 rounded w-full" placeholder="Contact" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
        <textarea className="border p-2 rounded w-full" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <select className="border p-2 rounded w-full" value={form.isAvailable} onChange={e => setForm({ ...form, isAvailable: e.target.value === 'true' })}>
          <option value={true}>Available</option>
          <option value={false}>Not Available</option>
        </select>

        {/* 🧑 Auth fields */}
        <input className="border p-2 rounded w-full" placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
        <input className="border p-2 rounded w-full" type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />

        {/* 📸 Image Upload */}
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && <img src={preview} alt="Preview" className="h-40 object-cover rounded" />}

        {/* 📍 Google Map */}
        <div className="border p-2 rounded">
          <label className="block mb-1 font-medium text-gray-700">Select Location on Map</label>
          <LoadScript googleMapsApiKey="AIzaSyDv0hcUFYDTsfEDjTt84D0q0PROe66LKFc">
            <GoogleMap
              mapContainerStyle={{ height: '300px', width: '100%' }}
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
          <p className="text-sm text-gray-600 mt-2">Latitude: {markerPosition.lat.toFixed(5)}, Longitude: {markerPosition.lng.toFixed(5)}</p>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Register</button>
      </form>
    </div>
  );
};

export default RegisterRestaurant;

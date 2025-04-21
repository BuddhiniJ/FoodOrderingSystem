const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: String,
    contact: String,
    description: String,
    isAvailable: { type: Boolean, default: true },
    image: { type: String },
    username: { type: String, required: true },
    password: { type: String, required: true },
    latitude: Number,
    longitude: Number,

});

module.exports = mongoose.model('Restaurant', restaurantSchema);

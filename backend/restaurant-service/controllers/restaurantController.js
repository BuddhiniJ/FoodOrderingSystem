const Restaurant = require('../models/restaurantModel');
const MenuItem = require('../models/menuModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Restaurant
exports.createRestaurant = async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRestaurantWithImage = async (req, res) => {
  try {
    const { name, location, isAvailable, description, contact, username, password} = req.body;
    const imageUrl = req.file?.path;

    const existing = await Restaurant.findOne({ username });
    if (existing) return res.status(400).json({ message: "Username already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);

    const restaurant = new Restaurant({
      name,
      location,
      contact, // Add contact
      description, // Add description
      isAvailable: isAvailable === 'true',
      image: imageUrl,
      username, 
      password: hashedPassword
    });

    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getRestaurants = async (req, res) => {
  const restaurants = await Restaurant.find();
  res.json(restaurants);
};

exports.getResturantById = async (req, res) => {
  try {
    const restaurants = await Restaurant.findById(req.params.id);
    if (!restaurants) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateRestaurant = async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      location: req.body.location,
      isAvailable: req.body.isAvailable === 'true' || req.body.isAvailable === true,
      description: req.body.description,
      contact: req.body.contact
    };

    if (req.file && req.file.path) {
      updateData.image = req.file.path;
    }

    const updatedItem = await Restaurant.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    );
    res.json(updatedItem);
  } catch (err) {
    console.error(err); // Add logging
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRestaurant = async (req, res) => {
  await Restaurant.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};

// Menu Item
exports.addMenuItem = async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addMenuItemWithImage = async (req, res) => {
  try {
    const { name, description, price, category, restaurantId } = req.body;
    const imageUrl = req.file?.path;

    const item = new MenuItem({
      name,
      description,
      price,
      category,
      restaurantId,
      image: imageUrl
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMenuByRestaurant = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { restaurantId: req.params.restaurantId };

    if (category) {
      filter.category = category;
    }

    const menu = await MenuItem.find(filter);
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getMenuById = async (req, res) => {
  try {
    const menu = await MenuItem.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const updateData = {
      name,
      description,
      price,
      category
    };

    if (req.file && req.file.path) {
      updateData.image = req.file.path; // Cloudinary image URL
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteMenuItem = async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.json({ message: 'Menu item deleted' });
};

//resturantlogin
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Restaurant.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, username: user.username,restaurantId: user._id, });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

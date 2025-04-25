const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

// ======= Restaurant CRUD =======

// exports.createRestaurantWithImage = async (req, res) => {
//     try {
//         const { name, location, contact, description, isAvailable, latitude, longitude } = req.body;
//         const imageUrl = req.file?.path;

//         const restaurant = new Restaurant({
//             name,
//             location,
//             contact,
//             description,
//             isAvailable: isAvailable === 'true',
//             latitude: parseFloat(latitude),
//             longitude: parseFloat(longitude),
//             image: imageUrl,
//             user: req.user._id
//         });

//         await restaurant.save();
//         res.status(201).json(restaurant);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

exports.createRestaurantWithImage = async (req, res) => {
    console.log('User from token:', req.user);  // Log user info for debugging
  
    try {
      const { name, location, contact, description, isAvailable, latitude, longitude } = req.body;
      const imageUrl = req.file?.path;
  
      const restaurant = new Restaurant({
        name,
        location,
        contact,
        description,
        isAvailable: isAvailable === 'true',
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        image: imageUrl,
        user: req.user._id || req.user.id
      });
  
      await restaurant.save();
      res.status(201).json(restaurant);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  


exports.getMyRestaurants = async (req, res) => {
    try {
        res.set('Cache-Control', 'no-store');
        const restaurants = await Restaurant.find({ user: req.user._id });
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getRestaurants = async (req, res) => {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
};

exports.updateRestaurant = async (req, res) => {
    try {
      const { name, location, contact, description, isAvailable, latitude, longitude } = req.body;
      const imageUrl = req.file?.path;

      const updateData = {
        name,
        location,
        latitude,
        longitude,
        isAvailable,
        description,
        image: imageUrl,
        contact
      };
  
  
      const updated = await Restaurant.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!updated) return res.status(404).json({ message: 'Restaurant not found' });
  
      res.json(updated);
    } catch (err) {
      console.error('[Update Restaurant Error]', err);
      res.status(500).json({ error: err.message });
    }
  };
  

exports.deleteRestaurant = async (req, res) => {
    await Restaurant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
};

exports.getRestaurantById = async (req, res) => {
    try {
      const restaurant = await Restaurant.findById(req.params.id);
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
      res.json(restaurant);
    } catch (err) {
      console.error('Failed to get restaurant:', err);
      res.status(500).json({ error: err.message });
    }
  };
  

// ======= Menu CRUD =======

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

exports.updateMenuItem = async (req, res) => {
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
};

exports.deleteMenuItem = async (req, res) => {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item deleted' });
};

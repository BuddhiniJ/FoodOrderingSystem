const express = require('express');
const router = express.Router();
const controller = require('../controllers/restaurantController');
const upload = require('../middleware/cloudinaryUpload');
const { authenticate } = require('../middleware/auth'); // Adjust path as needed

// Standard routes
router.get('/', controller.getRestaurants);
router.put('/:id', upload.single('image'), controller.updateRestaurant);
router.delete('/:id', controller.deleteRestaurant);
router.post('/restaurants', authenticate, upload.single('image'), controller.createRestaurantWithImage);
router.get('/my-restaurants', authenticate, controller.getMyRestaurants);
router.get('/:id', controller.getRestaurantById);

// Menu routes
router.post('/menu/with-image', upload.single('image'), controller.addMenuItemWithImage);
router.get('/menu/:restaurantId', controller.getMenuByRestaurant);
router.put('/menu/:id', controller.updateMenuItem);
router.delete('/menu/:id', controller.deleteMenuItem);

module.exports = router;

const express = require('express');
const router = express.Router();
const controller = require('../controllers/restaurantController');
const upload = require('../middleware/upload');
const auth = require('../middleware/authMiddleware');


// Restaurant Routes
router.post('/', controller.createRestaurant);
router.get('/', controller.getRestaurants);
router.get('/:id', controller.getResturantById);
router.put('/:id', upload.single('image'), controller.updateRestaurant);
router.delete('/:id', controller.deleteRestaurant);
router.post('/with-image', upload.single('image'), controller.createRestaurantWithImage);
router.post('/loginResturant', controller.login);


// Menu Item Routes
router.post('/menu', controller.addMenuItem);
router.post('/menu/with-image', upload.single('image'), controller.addMenuItemWithImage);
router.get('/menu/:restaurantId', controller.getMenuByRestaurant);
router.get('/menu/item/:id', controller.getMenuById);
router.put('/menu/:id', upload.single('image'), controller.updateMenuItem);
router.delete('/menu/:id', controller.deleteMenuItem);

module.exports = router;

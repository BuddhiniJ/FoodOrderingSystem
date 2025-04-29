const express = require('express');
const router = express.Router();
const { saveLocation, getLocationByUserId } = require('../Controllers/deliveryController');
const authenticate = require('../middleware/auth');



router.post('/', authenticate, saveLocation);
router.get('/:userId', getLocationByUserId); // if you want, you can secure this too

module.exports = router;

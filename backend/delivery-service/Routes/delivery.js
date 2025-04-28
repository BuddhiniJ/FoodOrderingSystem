const express = require('express');
const { saveLocation , getLocationByUserId } = require('../Controllers/deliveryController');
const authenticate = require('../middleware/auth'); // Use the updated middleware

const router = express.Router();

router.post('/', authenticate, saveLocation);
router.get('/:userId', getLocationByUserId); 



module.exports = router;
const express = require('express');
const { saveLocation } = require('../Controllers/deliveryController');
const authenticate = require('../middleware/auth'); // Use the updated middleware

const router = express.Router();

router.post('/', authenticate, saveLocation);

module.exports = router;
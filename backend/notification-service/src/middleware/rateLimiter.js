const rateLimit = require('express-rate-limit');
const config = require('../config/config');

const limiter = rateLimit({
  windowMs: config.rateLimits.windowMs,
  max: config.rateLimits.max,
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
});

module.exports = limiter;

const Location = require('../Models/DeliveryLocation');

// @desc    Save or update delivery personnel location and availability
// @route   POST /api/location
// @access  Private
exports.saveLocation = async (req, res) => {
  try {
    const { latitude, longitude, availability } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    // Check if the location for the user already exists
    let location = await Location.findOne({ userId: req.user.id });

    if (location) {
      // Update existing location and availability
      location.location = { latitude, longitude };
      if (availability !== undefined) {
        location.availability = availability;
      }
      location.timestamp = Date.now();
      await location.save();
    } else {
      // Create a new location entry
      location = await Location.create({
        userId: req.user.id,
        location: { latitude, longitude },
        availability: availability !== undefined ? availability : true,
      });
    }

    res.status(201).json({
      success: true,
      data: location,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
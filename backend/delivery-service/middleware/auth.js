const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../user-service/src/models/User'); // Import the User model from the user-service

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Connect to the UserDB to fetch the user
    const userDBConnection = await mongoose.createConnection(process.env.USER_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const UserModel = userDBConnection.model('User', User.schema);

    // Find the user in the UserDB
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user; // Attach the user to the request object
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

module.exports = authenticate;
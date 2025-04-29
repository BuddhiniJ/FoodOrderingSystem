const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user ID to the request object
    req.user = { id: decoded.id };

    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

module.exports = authenticate;

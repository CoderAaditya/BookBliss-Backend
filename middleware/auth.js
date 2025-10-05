const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes that require authentication
const auth = async (req, res, next) => {
  try {
    // Extract the Authorization header which should contain 'Bearer <token>'
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ msg: 'No token, authorization denied' });

    // Support both raw token and 'Bearer <token>' formats
    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : authHeader;
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    // Verify token signature and extract payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Load full user document and attach to request for downstream handlers
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ msg: 'Token is not valid' });

    req.user = user; // make user available to route handlers
    req.token = token; // also keep raw token if needed
    next();
  } catch (err) {
    // On any error (invalid token, expired, DB error), deny access
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;
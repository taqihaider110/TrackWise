const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure User model is correctly set up

// Authentication middleware to verify token
const authMiddleware = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const token = req.header('Authorization').replace('Bearer ', '');

    // Verify the token and decode the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // JWT_SECRET should be in your environment

    // Fetch the user from the database based on the decoded user ID
    const user = await User.findByPk(decoded.userId);

    // If no user found or user doesn't exist, throw an error
    if (!user) {
      throw new Error('User not found');
    }

    // Attach the user to the request object for access in route handlers
    req.user = user;

    // Continue to the next middleware or route handler
    next();
  } catch (e) {
    res.status(401).json({ error: 'Please authenticate.' }); // Unauthorized access error
  }
};

module.exports = authMiddleware;

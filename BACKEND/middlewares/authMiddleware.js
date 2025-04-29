const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token missing or malformed' });
    }

    const token = authHeader.split(' ')[1]; // Safer token extraction
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (e) {
    console.error('Authentication error:', e.message);
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

module.exports = authMiddleware;

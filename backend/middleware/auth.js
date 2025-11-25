const jwt = require('jsonwebtoken');
const db = require('../config/db');

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    // Fetch user from DB
    db.get(
      'SELECT id, username, role FROM users WHERE id = ?',
      [decoded.id],
      (err, user) => {
        if (err || !user) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        req.user = user; // attach user data
        next();
      }
    );

  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

const admin = (req, res, next) => {
  if (req.user?.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Admin access required' });
  }
};

module.exports = { protect, admin };

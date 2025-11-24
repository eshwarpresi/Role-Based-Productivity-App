const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// ⭐ Add test route so you can check backend is responding
router.get('/test', (req, res) => {
  res.json({ message: 'Auth test working' });
});

module.exports = router;

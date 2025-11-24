require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// ⭐ NUCLEAR CORS - ALLOW EVERYTHING
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json());

// ⭐ SIMPLE HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ 
    message: '✅ Backend is WORKING!',
    timestamp: new Date().toISOString(),
    status: 'active'
  });
});

// ⭐ SIMPLE LOGIN ENDPOINT
app.post('/api/auth/login', (req, res) => {
  console.log('Login attempt:', req.body);
  
  const { username, password } = req.body;
  
  // Demo login
  if (username === 'admin' && password === 'admin123') {
    return res.json({
      token: 'demo-token-12345',
      user: { id: 1, username: 'admin', role: 'admin' },
      message: 'Login successful!'
    });
  }
  
  res.status(401).json({ message: 'Invalid credentials' });
});

// ⭐ TEST ENDPOINT
app.get('/api/test', (req, res) => {
  res.json({ message: '✅ Test endpoint working!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Health: https://role-based-productivity-app.onrender.com/api/health`);
  console.log(`🔑 Demo: admin / admin123`);
});
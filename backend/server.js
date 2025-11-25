require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// CORS - ALLOW EVERYTHING
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'BACKEND IS WORKING!',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// SIMPLE LOGIN ENDPOINT (TEMPORARY)
app.post('/api/auth/login', (req, res) => {
  console.log('Login attempt:', req.body);
  
  const { username, password } = req.body;
  
  // Demo login - works for any user
  if (username && password) {
    return res.json({
      token: 'demo-jwt-token-12345',
      user: { 
        id: 1, 
        username: username, 
        role: username === 'admin' ? 'admin' : 'user' 
      },
      message: 'Login successful!'
    });
  } else {
    return res.status(401).json({ 
      message: 'Username and password required' 
    });
  }
});

// SIMPLE REGISTER ENDPOINT (TEMPORARY)
app.post('/api/auth/register', (req, res) => {
  console.log('Register attempt:', req.body);
  
  const { username, password } = req.body;
  
  if (username && password) {
    return res.status(201).json({
      token: 'demo-jwt-token-12345',
      user: { 
        id: 2, 
        username: username, 
        role: 'user' 
      },
      message: 'Registration successful!'
    });
  } else {
    return res.status(400).json({ 
      message: 'Username and password required' 
    });
  }
});

// Test auth endpoint
app.get('/api/auth/test', (req, res) => {
  res.json({ message: 'Auth test working!' });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SIMPLE BACKEND running on port ${PORT}`);
  console.log(`✅ CORS: All origins allowed`);
  console.log(`🔑 Login: Any username/password will work`);
});
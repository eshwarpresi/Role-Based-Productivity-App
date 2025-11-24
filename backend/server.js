require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// ⭐ ALLOW EVERYTHING - NO CORS RESTRICTIONS
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"]
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

// Add request logging
app.use((req, res, next) => {
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// ⭐ HEALTH CHECK - SIMPLE
app.get('/api/health', (req, res) => {
  console.log('✅ Health check called');
  res.json({ 
    message: 'BACKEND IS WORKING!',
    status: 'active',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin
  });
});

// ⭐ SIMPLE LOGIN - NO DATABASE
app.post('/api/auth/login', (req, res) => {
  console.log('🔑 Login attempt:', req.body);
  
  const { username, password } = req.body;
  
  // Demo credentials
  if (username === 'admin' && password === 'admin123') {
    return res.json({
      token: 'demo-jwt-token-12345',
      user: { 
        id: 1, 
        username: 'admin', 
        role: 'admin' 
      },
      message: 'Login successful!'
    });
  } else {
    return res.status(401).json({ 
      message: 'Invalid credentials. Use admin/admin123' 
    });
  }
});

// ⭐ TEST ENDPOINT
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Test endpoint working!',
    backend: 'Render',
    origin: req.headers.origin
  });
});

// ⭐ AUTH TEST
app.get('/api/auth/test', (req, res) => {
  res.json({ 
    message: 'Auth test working!',
    timestamp: new Date().toISOString()
  });
});

// Handle unknown routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SERVER STARTED on port ${PORT}`);
  console.log(`✅ Health: https://role-based-productivity-app.onrender.com/api/health`);
  console.log(`🔑 Demo: admin / admin123`);
  console.log(`🌍 CORS: All origins allowed`);
});
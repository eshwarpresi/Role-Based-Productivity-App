require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// ⭐ NUCLEAR CORS FIX FOR VERCEL
app.use(cors({
  origin: function (origin, callback) {
    // Allow all origins in production
    const allowedOrigins = [
      "http://localhost:3000",
      "https://role-based-productivity-app.vercel.app",
      "https://role-based-productivity-app-*.vercel.app",
      /\.vercel\.app$/,
      "*" // Allow everything
    ];
    
    // Always allow the request
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"]
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

// Add request logging
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Health check with CORS headers
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running with CORS',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
    cors: 'enabled'
  });
});

// Simple login endpoint
app.post('/api/auth/login', (req, res) => {
  console.log('Login attempt from:', req.headers.origin);
  
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    res.json({
      token: 'demo-jwt-token-12345',
      user: { id: 1, username: 'admin', role: 'admin' },
      message: 'Login successful'
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API test successful!',
    origin: req.headers.origin,
    backend: 'Render'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ CORS: All origins allowed`);
  console.log(`🌍 Health: https://role-based-productivity-app.onrender.com/api/health`);
});
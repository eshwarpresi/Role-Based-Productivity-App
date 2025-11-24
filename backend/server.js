const express = require('express');
const cors = require('cors');

const app = express();

// ⭐ CORS - ALLOW EVERYTHING
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json());

// ⭐ SIMPLE HEALTH CHECK
app.get('/api/health', (req, res) => {
  console.log('✅ Health check called from:', req.headers.origin);
  res.json({ 
    message: 'BACKEND IS WORKING!',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// ⭐ SIMPLE LOGIN
app.post('/api/auth/login', (req, res) => {
  console.log('🔑 Login attempt:', req.body);
  
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    return res.json({
      token: 'demo-jwt-token-12345',
      user: { id: 1, username: 'admin', role: 'admin' },
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
  res.json({ message: 'Test endpoint working!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 FRESH BACKEND running on port ${PORT}`);
  console.log(`✅ CORS: All origins allowed`);
});
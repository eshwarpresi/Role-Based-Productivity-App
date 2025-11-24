require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// ⭐ ENHANCED CORS FOR PRODUCTION
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, postman, etc)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      "http://localhost:3000",
      "https://role-based-productivity-app.vercel.app",
      "https://role-based-productivity-app-git-main-eshwarpresi.vercel.app",
      /\.vercel\.app$/
    ];
    
    if (allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      } else if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    })) {
      return callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
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

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    origin: req.headers.origin,
    cors: "enabled"
  });
});

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "API is working!",
    backend: "Render",
    origin: req.headers.origin
  });
});

// Simple login endpoint for testing
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  
  console.log('Login attempt:', { username, origin: req.headers.origin });
  
  // Demo credentials
  if (username === "admin" && password === "admin123") {
    res.json({
      token: "demo-jwt-token-12345",
      user: {
        id: 1,
        username: "admin",
        role: "admin"
      },
      message: "Login successful"
    });
  } else {
    res.status(401).json({
      message: "Invalid credentials"
    });
  }
});

// Test auth endpoint
app.get("/api/auth/test", (req, res) => {
  res.json({ 
    message: "Auth test working",
    origin: req.headers.origin
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 CORS enabled for production`);
  console.log(`✅ Health: https://role-based-productivity-app.onrender.com/api/health`);
});
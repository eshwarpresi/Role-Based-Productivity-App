require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();

// ⭐ FIXED CORS CONFIGURATION
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://role-based-productivity-app.vercel.app",
    "https://role-based-productivity-app-*.vercel.app",
    /\.vercel\.app$/
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"]
}));

// Handle preflight requests
app.options("*", cors());

app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.originalUrl} - Origin: ${req.headers.origin}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    message: "Server is running with CORS",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Simple test endpoint
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "API is working!",
    origin: req.headers.origin,
    backend: "Render"
  });
});

// Handle unknown API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ 
    message: "API route not found",
    path: req.originalUrl
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "Task Manager Backend API",
    status: "running",
    documentation: "Use /api endpoints"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend server running on port ${PORT}`);
  console.log(`🌍 CORS enabled for Vercel deployment`);
  console.log(`🔄 Environment: ${process.env.NODE_ENV}`);
});
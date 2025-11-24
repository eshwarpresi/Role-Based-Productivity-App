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
    "https://role-based-productivity-app-git-main-eshwarpresi.vercel.app",
    "https://role-based-productivity-app-*.vercel.app",
    /\.vercel\.app$/
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"]
}));

// Handle preflight requests properly
app.options("*", cors());

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Test endpoint with CORS headers
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "Backend is working with CORS!",
    origin: req.headers.origin || "No origin header"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend running on port ${PORT}`);
  console.log(`🌍 CORS enabled for Vercel deployment`);
});
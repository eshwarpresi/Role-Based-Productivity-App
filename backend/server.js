require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();

// Enhanced CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://role-based-productivity-app.vercel.app",
      "https://role-based-productivity-app-git-main-your-username.vercel.app",
      /\.vercel\.app$/,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// Handle preflight requests
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

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "API is working!",
    backend: "Render",
    status: "connected"
  });
});

// Handle unknown API paths
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
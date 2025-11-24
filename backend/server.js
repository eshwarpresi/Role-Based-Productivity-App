require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// ⭐ ALLOW EVERYTHING TEMPORARILY
app.use(cors({ origin: "*" }));

app.use(express.json());

// Simple test endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    message: "Server is running with open CORS",
    status: "OK",
    timestamp: new Date().toISOString()
  });
});

app.post("/api/auth/login", (req, res) => {
  res.json({ 
    message: "Login endpoint",
    token: "test-token",
    user: { id: 1, username: "admin", role: "admin" }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT} with open CORS`);
});
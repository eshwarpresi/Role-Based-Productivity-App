require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();

// ⭐ Correct CORS settings — required for Vercel frontend
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://role-based-productivity-app.vercel.app",
      /\.vercel\.app$/,
    ],
    credentials: true,
  })
);

// ⭐ Required to parse JSON bodies
app.use(express.json());

// ⭐ Register API routes first
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" });
});

// Test endpoint
app.get("/api/auth/test", (req, res) => {
  res.json({ message: "Auth test working" });
});

// Handle unknown API paths
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

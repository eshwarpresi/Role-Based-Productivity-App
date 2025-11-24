require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://role-based-productivity-frontend.vercel.app",
      "https://role-based-productivity-app.onrender.com"
    ],
    credentials: true,
  })
);

app.use(express.json());

// ⭐ API ROUTES MUST COME FIRST ⭐
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

// ⭐ Only 404 for API paths
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ❌ NO frontend serving, NO app.get("*") (This was breaking the API)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

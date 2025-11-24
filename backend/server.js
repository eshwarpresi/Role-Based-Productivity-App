require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();

// ✅ FIXED CORS — Added your real Vercel domain
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://role-based-productivity-app.vercel.app",  // ⭐ Your Real Vercel Frontend
      /\.vercel\.app$/,                                   // ⭐ Allow any Vercel preview deployments
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

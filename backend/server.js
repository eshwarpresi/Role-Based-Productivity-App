require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes (REAL backend)
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// ===== CORS For Deployment =====
app.use(cors({
  origin: "*", // Allow all origins (or use your frontend URL only)
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Body parser
app.use(express.json());

// ===== Health Check =====
app.get('/api/health', (req, res) => {
  res.json({
    message: 'Server is running!',
    status: 'active',
    ts: new Date().toISOString()
  });
});

// ===== Real Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// ===== 404 Handler =====
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);
  res.status(500).json({ message: "Something went wrong on the server!" });
});

// ===== Server Start =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎉 Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔑 Auth: /api/auth/login & /api/auth/register`);
  console.log(`📝 Tasks: /api/tasks`);
});

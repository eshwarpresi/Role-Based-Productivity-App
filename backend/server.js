require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// CORS for local + Render frontend
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://role-based-productivity-app.onrender.com'
    ],
    credentials: true
  })
);

app.use(express.json());

// API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: "ok", message: "Backend is running!" });
});

// -------------------------------
// SERVE FRONTEND (IMPORTANT)
// -------------------------------
const distPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔗 API Health: https://role-based-productivity-app.onrender.com/api/health`);
});

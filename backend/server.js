require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// CORS settings
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

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route working!' });
});

// ❌ REMOVE FRONTEND SERVING CODE — Render error fixed!
// ❌ Removed:
// const frontendPath = path.join(__dirname, '../frontend/dist');
// app.use(express.static(frontendPath));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(frontendPath, 'index.html'));
// });

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV}`);
  console.log(
    `✅ Health check: https://role-based-productivity-app.onrender.com/api/health`
  );
});

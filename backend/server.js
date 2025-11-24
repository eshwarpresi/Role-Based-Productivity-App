require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

// ⭐ CORS configuration
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://role-based-productivity-app.vercel.app",
    "https://role-based-productivity-app-*.vercel.app",
    /\.vercel\.app$/
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json());

// Database setup
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
    // Initialize tables
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending',
      priority TEXT DEFAULT 'medium',
      due_date DATE,
      assigned_to INTEGER,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assigned_to) REFERENCES users (id),
      FOREIGN KEY (created_by) REFERENCES users (id)
    )`);

    // Create demo admin user if not exists
    const adminPassword = bcrypt.hashSync("admin123", 10);
    db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`, 
      ["admin", adminPassword, "admin"]);
  }
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "fallback_secret", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

// Routes

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Task Manager API is running!",
    status: "OK",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth/*",
      tasks: "/api/tasks/*"
    }
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    message: "Server is running",
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "production"
  });
});

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({
    message: "API test successful!",
    origin: req.headers.origin,
    backend: "Render"
  });
});

// Auth test endpoint
app.get("/api/auth/test", (req, res) => {
  res.json({
    message: "Auth route is working",
    timestamp: new Date().toISOString()
  });
});

// LOGIN endpoint
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  // Check user in database
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      },
      message: "Login successful"
    });
  });
});

// REGISTER endpoint
app.post("/api/auth/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    function(err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(400).json({ message: "Username already exists" });
        }
        return res.status(500).json({ message: "Registration failed" });
      }

      const token = jwt.sign(
        { id: this.lastID, username, role: "user" },
        process.env.JWT_SECRET || "fallback_secret",
        { expiresIn: "24h" }
      );

      res.status(201).json({
        token,
        user: {
          id: this.lastID,
          username,
          role: "user"
        },
        message: "Registration successful"
      });
    }
  );
});

// GET USER PROFILE (protected)
app.get("/api/auth/me", authenticateToken, (req, res) => {
  res.json({
    user: req.user
  });
});

// TASKS endpoints (protected)
app.get("/api/tasks", authenticateToken, (req, res) => {
  db.all("SELECT * FROM tasks", (err, tasks) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch tasks" });
    }
    res.json({ tasks });
  });
});

app.post("/api/tasks", authenticateToken, (req, res) => {
  const { title, description, priority, due_date } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  db.run(
    "INSERT INTO tasks (title, description, priority, due_date, created_by) VALUES (?, ?, ?, ?, ?)",
    [title, description, priority || "medium", due_date, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: "Failed to create task" });
      }

      res.status(201).json({
        id: this.lastID,
        title,
        description,
        priority: priority || "medium",
        due_date,
        status: "pending",
        created_by: req.user.id,
        message: "Task created successfully"
      });
    }
  );
});

// Handle 404 for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    message: "API route not found",
    path: req.originalUrl
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Health check: https://role-based-productivity-app.onrender.com/api/health`);
  console.log(`🔑 Demo credentials: admin / admin123`);
});
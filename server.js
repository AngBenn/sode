require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
const db = require("./db");
const scenarioRoutes = require("./routes/scenarios");
const progressRoutes = require("./routes/progress");




const app = express();

// Middleware
app.use(express.json());
app.use("/api/scenarios", scenarioRoutes);
app.use("/api/progress", progressRoutes); // Mount the progress routes
app.use(cors());
app.use(express.urlencoded({ extended: true }));




// REGISTER Endpoint
app.post("/register", async (req, res) => {
  const { first_name, last_name, email, phone, password } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user data into the database
    const sql = "INSERT INTO users (first_name, last_name, email, phone, password) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [first_name, last_name, email, phone, hashedPassword], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Registration failed. Email may already exist." });
      }
      // Registration successful: return a message indicating the user should login
      res.status(201).json({ message: "User registered successfully! Please log in." });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during registration." });
  }
});

// LOGIN Endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error during login." });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Login successful: return token and dashboard route for the frontend to redirect
    res.json({ message: "Login successful!", token, redirect: "/dashboard" });
  });
});

/// Serve static files from the build folder (React production build)
app.use(express.static(path.join(__dirname, 'build')));

// Debugging middleware (optional - logs all requests)
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// ✅ Fixed Catch-all Route (Excludes API calls)
app.get(/^\/(?!api\/).*$/, (req, res) => {
  console.log("Catch-all route triggered for:", req.url);
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start Server
const PORT = process.env.BACKEND_PORT || 5004;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

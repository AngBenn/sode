import express from "express";
import db from "../db.js"; // Import database connection using ES module syntax

const router = express.Router();

// GET /api/progress - Fetch user progress data
router.get("/", (req, res) => {
  const userId = req.query.userId; // Expecting userId as a query parameter

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const query = "SELECT * FROM progress WHERE user_id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching progress:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json({ progress: results });
  });
});

export default router; // Use ES module export

// This file defines a new Express router for handling progress-related API routes. The GET /api/progress route fetches progress data for a specific user based on the userId query parameter. The query is executed using the MySQL connection pool from db.js. If the query is successful, the progress data is returned in the response. If there is an error, an error response is sent with an appropriate message. The router is exported for use in the main server file. The progress data can be used to display user progress in the frontend application.
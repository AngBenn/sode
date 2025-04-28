import express from "express";
import db from "../db.js"; // Import database connection using ES module syntax
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify admin access
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
    if (!token) return res.status(403).json({ error: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.userId !== 1) { // Ensure only admin (user ID 1) can modify scenarios
            return res.status(403).json({ error: "Access denied. Admins only." });
        }
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token." });
    }
};

// **1. Get All Scenarios**
router.get("/", (req, res) => {
    const sql = "SELECT * FROM scenarios";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Error fetching scenarios." });
        res.json(results);
    });
});

// **2. Get a Single Scenario by ID**
router.get("/:id", (req, res) => {
    const sql = "SELECT * FROM scenarios WHERE id = ?";
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: "Error fetching scenario." });
        if (results.length === 0) return res.status(404).json({ error: "Scenario not found." });
        res.json(results[0]);
    });
});

// **3. Create a New Scenario (Admin Only)**
router.post("/", verifyAdmin, (req, res) => {
    const { name, category, description, levels } = req.body;

    if (!name || !levels) {
        return res.status(400).json({ error: "Name and levels are required." });
    }

    const sql = "INSERT INTO scenarios (name, category, description, levels) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, category, description, JSON.stringify(levels)], (err, result) => {
        if (err) return res.status(500).json({ error: "Error creating scenario." });
        res.status(201).json({ message: "Scenario created successfully!", scenarioId: result.insertId });
    });
});

// **4. Delete a Scenario (Admin Only)**
router.delete("/:id", verifyAdmin, (req, res) => {
    const sql = "DELETE FROM scenarios WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: "Error deleting scenario." });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Scenario not found." });
        res.json({ message: "Scenario deleted successfully." });
    });
});

export default router; // Use ES module export

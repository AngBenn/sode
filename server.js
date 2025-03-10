const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());

//  API route for /api/hello
app.get('/api/hello', (req, res) => {
    res.json({ message: "Hello from API" });
});

//  Serve React static files from the build folder
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all handler for React frontend (only for non-API routes)
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
        res.status(404).json({ error: "API endpoint not found" });
    } else {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});

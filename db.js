require("dotenv").config();
const mysql = require("mysql2");

// Create a MySQL connection pool for better performance
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "sode_auth",
  connectionLimit: 10, // Allows multiple simultaneous connections
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database");
    connection.release(); // Release the connection back to the pool
  }
});

module.exports = db;
// This file exports the MySQL connection pool, which is used in the routes to interact with the database. The connection pool allows multiple simultaneous connections to the database, improving performance and scalability. The pool is created using the mysql2 package and the database configuration is read from environment variables using dotenv. The connection is established when the module is imported and released back to the pool after use.
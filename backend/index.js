require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { query } = require("./config/database");

const app = express();
const port = process.env.port || 8080;

app.use(express.json());
// Enable CORS for all routes
app.use(
  cors({
    origin: "http://localhost:3000", // Allow your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/health", async (req, res) => {
  try {
    const result = await query("SELECT 1 as value");
    res.json({ status: "ok", result: result[0].value });
  } catch (error) {
    res.json({
      status: "error",
      message: "Database connection failed",
      error: error.message,
    });
  }
});

app.get("/api/test-integration", (req, res) => {
  try {
    res.json({
      status: "ok",
      message: "Backend API is working correctly",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

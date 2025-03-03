require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { query } = require("./config/database");

const app = express();
const port = process.env.port || 8080;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/health", async (req, res) => {
  try {
    const [result] = await query("SELECT 1 as value");
    res.json({ status: "ok", result: result[0].value });
  } catch (error) {
    res.json({
      status: "error",
      message: "Database connection failed",
      error: error.message,
    });
  }
});

app.get("/api/todo", async (req, res) => {
  try {
    const [rows] = await query(
      "SELECT id, todo, checked, created_timestamp FROM todos ORDER BY created_timestamp DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error getting todo list:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.post("/api/todo", async (req, res) => {
  try {
    const { todo } = req.body;

    if (!todo) {
      return res
        .status(400)
        .json({ status: "error", message: "todo is required" });
    }

    const [result] = await query("INSERT INTO todos (todo) VALUES (?)", [todo]);

    res.status(201).json({
      status: "success",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error saving todo:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

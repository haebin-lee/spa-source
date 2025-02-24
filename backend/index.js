require("dotenv").config();

const express = require("express");
const { query } = require("./config/database");

const app = express();
const port = process.env.port || 8080;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/health", async (req, res) => {
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

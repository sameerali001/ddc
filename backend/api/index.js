// Vercel Serverless Function - Express App Wrapper
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("../db");

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploads statically
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Connect Database
let isConnected = false;
const ensureDB = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

// Register API Routes
app.use("/api/auth", async (req, res, next) => { await ensureDB(); next(); }, require("../routes/auth"));
app.use("/api/admin", async (req, res, next) => { await ensureDB(); next(); }, require("../routes/admin"));
app.use("/api/inquiries", async (req, res, next) => { await ensureDB(); next(); }, require("../routes/inquiries"));
app.use("/api/public", async (req, res, next) => { await ensureDB(); next(); }, require("../routes/public"));

// Default Root Route
app.get("/", (req, res) => {
  res.json({
    message: "Doon Defence College API Server is running on Vercel.",
    status: "ok"
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({ error: "Something went wrong on the server" });
});

module.exports = app;

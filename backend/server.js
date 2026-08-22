require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./db");

const app = express();

// Middleware
app.use(cors({
  origin: "*", // Allow all origins for local development and direct client routing
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploads statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect Database (MongoDB with local file fallback)
connectDB();

// Register API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/inquiries", require("./routes/inquiries"));
app.use("/api/public", require("./routes/public"));

// Default Root Route
app.get("/", (req, res) => {
  res.json({
    message: "Doon Defence College API Server is running.",
    databaseMode: require("./db").db.isFallback() ? "Local JSON Fallback" : "MongoDB"
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`--------------------------------------------------------`);
  console.log(`Express server running on http://localhost:${PORT}`);
  console.log(`Serving static uploads at http://localhost:${PORT}/uploads`);
  console.log(`--------------------------------------------------------`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({ error: "Something went wrong on the server" });
});

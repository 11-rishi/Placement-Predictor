const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Basic route
app.get("/", (req, res) => {
  res.send("Placement Predictor API is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

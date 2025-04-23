const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
const User = require("./models/User");  // Import the User model

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

// POST route to save the ATS score to the user's profile
app.post("/api/save-ats-score", async (req, res) => {
  const { userId, atsScore } = req.body;

  if (!atsScore || !userId) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Store the ATS score in the user's document
    user.atsScore = atsScore; // Assuming you added atsScore field in user model
    await user.save();

    res.status(200).json({ message: "ATS score saved successfully" });
  } catch (error) {
    console.error("Error saving ATS score:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

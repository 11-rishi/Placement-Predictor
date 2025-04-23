const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');  // Assuming you have auth middleware
const User = require('../models/User');  // Import the User model

// POST route to save the ATS score to the user's profile
router.post("/save-ats-score", auth, async (req, res) => {
  const { userId, atsScore } = req.body;

  if (!atsScore || !userId) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Store ATS score in the user document
    user.atsScore = atsScore;  // This will update the atsScore field in the user's document
    await user.save();

    res.status(200).json({ message: "ATS score saved successfully" });
  } catch (error) {
    console.error("Error saving ATS score:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

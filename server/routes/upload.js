// routes/upload.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { spawn } = require('child_process');
const auth = require("../middleware/auth");
const Resume = require("../models/Resume");
const AtsScore = require("../models/AtsScore");
const User = require("../models/User");
const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Create unique filename with user ID + timestamp + original extension
    const userId = req.user.id;
    const timestamp = Date.now();
    const fileExt = path.extname(file.originalname);
    cb(null, `${userId}_${timestamp}${fileExt}`);
  },
});

// Filter for PDF files only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max size
});

// Function to get ATS score using Python model
const getATSScore = (filePath) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['app.py', filePath]);
    
    let score = 0;
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      try {
        const result = JSON.parse(data.toString());
        if (result.success) {
          score = result.score;
        } else {
          error = result.message || 'Failed to process resume';
        }
      } catch (e) {
        error = 'Error parsing Python output';
      }
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${error}`));
      } else if (error) {
        reject(new Error(error));
      } else {
        resolve(score);
      }
    });
  });
};

// Function to determine score category
const getScoreCategory = (score) => {
  if (score >= 80) return 'high';
  if (score >= 60) return 'medium';
  return 'low';
};

// POST route to handle resume uploads
router.post("/", auth, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Get ATS score using Python model
    const score = await getATSScore(req.file.path);
    console.log("Generated ATS score:", score); // Debug log

    // Create new resume entry in database
    const newResume = new Resume({
      user: req.user.id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      score: score,
    });

    await newResume.save();

    // Create new ATS score entry
    const scoreCategory = getScoreCategory(score);
    const newAtsScore = new AtsScore({
      userId: req.user.id,
      score: score,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      scoreCategory: scoreCategory,
      recommendations: [], // You can add recommendations based on the score
      keywords: [], // You can add keywords found in the resume
      missingKeywords: [] // You can add missing keywords
    });

    await newAtsScore.save();
    console.log("Saved ATS score to database:", newAtsScore); // Debug log

    // Update user's ATS score
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { atsScore: score },
      { new: true }
    );
    console.log("Updated user's ATS score:", updatedUser); // Debug log

    // Return response with score
    res.status(201).json({
      message: "Resume uploaded and analyzed successfully",
      score: score,
      scoreCategory: scoreCategory,
      resume: {
        id: newResume._id,
        filename: newResume.filename,
        score: newResume.score,
        uploadDate: newResume.uploadDate,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error during upload" });
  }
});

// GET route to fetch user's resume history
router.get("/history", auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id })
      .sort({ uploadDate: -1 }) // Newest first
      .select("-__v");

    res.json({ resumes });
  } catch (error) {
    console.error("History fetch error:", error);
    res.status(500).json({ message: "Server error fetching resume history" });
  }
});

// GET route to download a specific resume
router.get("/:id", auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.download(resume.path, resume.originalName);
  } catch (error) {
    res.status(500).json({ message: "Server error downloading resume" });
  }
});

module.exports = router;
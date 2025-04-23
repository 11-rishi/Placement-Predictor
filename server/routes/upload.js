// routes/upload.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");
const Resume = require("../models/Resume");
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

// POST route to handle resume uploads
router.post("/", auth, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Get ATS score from form data (sent after Flask API processing)
    const score = parseFloat(req.body.score) || 0;

    // Create new resume entry in database
    const newResume = new Resume({
      user: req.user.id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      score: score,
    });

    await newResume.save();

    res.status(201).json({
      message: "Resume uploaded successfully",
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

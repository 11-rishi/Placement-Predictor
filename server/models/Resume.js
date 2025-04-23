// models/Resume.js
const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  keywords: {
    type: [String],
    default: [],
  },
  feedback: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Resume", ResumeSchema);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
const atsScoreRoutes = require("./routes/atsScore");
const testScoresRoutes = require("./routes/testScores");
const User = require("./models/User");
const fetch = require('node-fetch');

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
app.use("/api/ats-score", atsScoreRoutes);
app.use("/api/test-scores", testScoresRoutes);

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Judge0 Proxy Endpoint (Self-hosted, no API key required)
app.post('/api/execute', async (req, res) => {
  const { sourceCode, language, testCases } = req.body;
  const JUDGE0_API_URL = 'http://localhost:2358'; // Self-hosted Judge0
  const LANGUAGES = { python3: 71, java: 62, cpp: 54 };

  try {
    const results = [];
    let passedTests = 0;
    for (const testCase of testCases) {
      // Create submission
      const submissionResponse = await fetch(`${JUDGE0_API_URL}/submissions/?base64_encoded=false&wait=false`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          source_code: sourceCode,
          language_id: LANGUAGES[language],
          stdin: JSON.stringify(testCase.input),
          cpu_time_limit: 5,
          memory_limit: 128
        })
      });
      if (!submissionResponse.ok) {
        const errorText = await submissionResponse.text();
        results.push({
          input: testCase.input,
          output: null,
          expected: testCase.output,
          success: false,
          error: errorText
        });
        continue;
      }
      const { token } = await submissionResponse.json();
      // Poll for result
      let result;
      let attempts = 0;
      const maxAttempts = 10;
      do {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await fetch(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false`, {
          headers: {
            'content-type': 'application/json'
          }
        });
        result = await response.json();
        attempts++;
      } while (result.status && result.status.id <= 2 && attempts < maxAttempts);
      if (result.status && result.status.id === 3) {
        // Success
        let output = result.stdout ? result.stdout.trim() : '';
        try { output = JSON.parse(output); } catch { /* ignore */ }
        const expectedOutput = testCase.output;
        const success = JSON.stringify(output) === JSON.stringify(expectedOutput);
        if (success) passedTests++;
        results.push({
          input: testCase.input,
          output,
          expected: expectedOutput,
          success,
          error: null
        });
      } else {
        const error = result.stderr || result.compile_output || 'Unknown error';
        results.push({
          input: testCase.input,
          output: null,
          expected: testCase.output,
          success: false,
          error
        });
      }
    }
    res.json({
      success: passedTests === testCases.length,
      results,
      passedTests,
      totalTests: testCases.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to execute code.' });
  }
});

// Basic route
app.get("/", (req, res) => {
  res.send("Placement Predictor API is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
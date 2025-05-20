const express = require('express');
const router = express.Router();
const TestScore = require('../models/TestScore');
const auth = require('../middleware/auth');

// Save test score
router.post('/save', auth, async (req, res) => {
    try {
        console.log('Received test score save request:', req.body); // Debug log

        const {
            companyName,
            aptitudeScore,
            codingScore,
            atsScore,
            prediction,
            questions,
            aptitudeAnswers,
            codingAnswers,
            testResults
        } = req.body;

        // Validate required fields
        if (!companyName) {
            return res.status(400).json({
                message: 'Company name is required'
            });
        }

        if (aptitudeScore === undefined || aptitudeScore < 0 || aptitudeScore > 100) {
            return res.status(400).json({
                message: 'Invalid aptitude score value. Score must be between 0 and 100.'
            });
        }

        if (codingScore === undefined || codingScore < 0 || codingScore > 100) {
            return res.status(400).json({
                message: 'Invalid coding score value. Score must be between 0 and 100.'
            });
        }

        if (atsScore === undefined || atsScore < 0 || atsScore > 100) {
            return res.status(400).json({
                message: 'Invalid ATS score value. Score must be between 0 and 100.'
            });
        }

        if (prediction === undefined || prediction < 0 || prediction > 100) {
            return res.status(400).json({
                message: 'Invalid prediction value. Prediction must be between 0 and 100.'
            });
        }

        // Check if a test score with the same company and user already exists
        const existingScore = await TestScore.findOne({
            userId: req.user._id,
            companyName: companyName,
            aptitudeScore: Number(aptitudeScore),
            codingScore: Number(codingScore)
        });

        if (existingScore) {
            console.log('Test score already exists, returning existing score:', existingScore);
            return res.status(200).json({
                message: 'Test score already exists',
                testScore: existingScore
            });
        }

        // Create new test score document
        const testScore = new TestScore({
            userId: req.user._id,
            companyName,
            aptitudeScore: Number(aptitudeScore),
            codingScore: Number(codingScore),
            atsScore: Number(atsScore),
            prediction: Number(prediction),
            questions: questions || {},
            aptitudeAnswers: aptitudeAnswers || [],
            codingAnswers: codingAnswers || [],
            testResults: testResults || {}
        });

        console.log('Created test score document:', testScore); // Debug log

        // Save to database
        const savedScore = await testScore.save();
        console.log('Saved test score:', savedScore); // Debug log

        res.status(201).json({
            message: 'Test score saved successfully',
            testScore: savedScore
        });
    } catch (error) {
        console.error('Error saving test score:', error); // Debug log
        res.status(500).json({
            message: 'Error saving test score',
            error: error.message
        });
    }
});

// Get user's test scores
router.get('/history', auth, async (req, res) => {
    try {
        console.log('Fetching test scores for user:', req.user._id); // Debug log
        const scores = await TestScore.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .select('-__v');
        console.log('Found test scores:', scores.length); // Debug log
        res.json(scores);
    } catch (error) {
        console.error('Error fetching test scores:', error); // Debug log
        res.status(500).json({
            message: 'Error fetching test scores',
            error: error.message
        });
    }
});

// Get latest test score
router.get('/latest', auth, async (req, res) => {
    try {
        console.log('Fetching latest test score for user:', req.user._id); // Debug log
        const latestScore = await TestScore.findOne({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .select('-__v');

        if (!latestScore) {
            console.log('No test scores found for user'); // Debug log
            return res.status(404).json({ message: 'No test scores found' });
        }

        console.log('Found latest test score:', latestScore); // Debug log
        res.json(latestScore);
    } catch (error) {
        console.error('Error fetching latest test score:', error); // Debug log
        res.status(500).json({
            message: 'Error fetching latest test score',
            error: error.message
        });
    }
});

// Get test scores for a specific company
router.get('/company/:companyName', auth, async (req, res) => {
    try {
        console.log('Fetching test scores for company:', req.params.companyName); // Debug log
        const scores = await TestScore.find({
            userId: req.user._id,
            companyName: req.params.companyName
        })
            .sort({ createdAt: -1 })
            .select('-__v');

        console.log('Found company test scores:', scores.length); // Debug log
        res.json(scores);
    } catch (error) {
        console.error('Error fetching company test scores:', error); // Debug log
        res.status(500).json({
            message: 'Error fetching company test scores',
            error: error.message
        });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const PredictionScore = require('../models/PredictionScore');
const auth = require('../middleware/auth');

// Save a new prediction score
router.post('/save', auth, async (req, res) => {
    try {
        const {
            companyName,
            testType,
            scores,
            prediction
        } = req.body;

        // Validate required fields
        if (!companyName || !testType || !scores || !prediction) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create new prediction score
        const predictionScore = new PredictionScore({
            userId: req.user.id,
            companyName,
            testType,
            scores,
            prediction
        });

        await predictionScore.save();

        res.status(201).json({
            success: true,
            predictionScore
        });
    } catch (error) {
        console.error('Error saving prediction score:', error);
        res.status(500).json({ message: 'Server error while saving prediction score' });
    }
});

// Get prediction scores for a user
router.get('/user', auth, async (req, res) => {
    try {
        const predictionScores = await PredictionScore.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.json(predictionScores);
    } catch (error) {
        console.error('Error fetching prediction scores:', error);
        res.status(500).json({ message: 'Server error while fetching prediction scores' });
    }
});

// Get prediction scores for a specific company
router.get('/company/:companyName', auth, async (req, res) => {
    try {
        const predictionScores = await PredictionScore.find({
            userId: req.user.id,
            companyName: req.params.companyName
        }).sort({ createdAt: -1 });

        res.json(predictionScores);
    } catch (error) {
        console.error('Error fetching company prediction scores:', error);
        res.status(500).json({ message: 'Server error while fetching company prediction scores' });
    }
});

// Get latest prediction score
router.get('/latest', auth, async (req, res) => {
    try {
        const latestScore = await PredictionScore.findOne({ userId: req.user.id })
            .sort({ createdAt: -1 });

        if (!latestScore) {
            return res.status(404).json({ message: 'No prediction scores found' });
        }

        res.json(latestScore);
    } catch (error) {
        console.error('Error fetching latest prediction score:', error);
        res.status(500).json({ message: 'Server error while fetching latest prediction score' });
    }
});

module.exports = router; 
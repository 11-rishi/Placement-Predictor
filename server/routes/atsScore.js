const express = require('express');
const router = express.Router();
const AtsScore = require('../models/AtsScore');
const auth = require('../middleware/auth');

// Save ATS score
router.post('/save', auth, async (req, res) => {
    try {
        console.log('Received ATS score save request:', req.body); // Debug log

        const { 
            score, 
            fileName, 
            fileType, 
            recommendations, 
            scoreCategory, 
            keywords, 
            missingKeywords 
        } = req.body;

        // Validate required fields
        if (!score || score < 0 || score > 100) {
            console.log('Invalid score value:', score); // Debug log
            return res.status(400).json({ 
                message: 'Invalid score value. Score must be between 0 and 100.' 
            });
        }

        if (!fileName || !fileType) {
            console.log('Missing file information:', { fileName, fileType }); // Debug log
            return res.status(400).json({ 
                message: 'File information is required' 
            });
        }

        if (!scoreCategory || !['high', 'medium', 'low'].includes(scoreCategory)) {
            console.log('Invalid score category:', scoreCategory); // Debug log
            return res.status(400).json({ 
                message: 'Invalid score category' 
            });
        }

        // Create new ATS score document
        const atsScore = new AtsScore({
            userId: req.user._id,
            score: Number(score),
            fileName,
            fileType,
            recommendations: recommendations || [],
            scoreCategory,
            keywords: keywords || [],
            missingKeywords: missingKeywords || []
        });

        console.log('Created ATS score document:', atsScore); // Debug log

        // Save to database
        const savedScore = await atsScore.save();
        console.log('Saved ATS score:', savedScore); // Debug log

        res.status(201).json({ 
            message: 'ATS score saved successfully', 
            atsScore: savedScore 
        });
    } catch (error) {
        console.error('Error saving ATS score:', error); // Debug log
        res.status(500).json({ 
            message: 'Error saving ATS score', 
            error: error.message 
        });
    }
});

// Get user's ATS scores
router.get('/history', auth, async (req, res) => {
    try {
        console.log('Fetching ATS scores for user:', req.user._id); // Debug log
        const scores = await AtsScore.find({ userId: req.user._id })
            .sort({ analysisDate: -1 })
            .select('-__v');
        console.log('Found scores:', scores); // Debug log
        res.json(scores);
    } catch (error) {
        console.error('Error fetching ATS scores:', error); // Debug log
        res.status(500).json({ 
            message: 'Error fetching ATS scores', 
            error: error.message 
        });
    }
});

// Get latest ATS score
router.get('/latest', auth, async (req, res) => {
    try {
        console.log('Fetching latest ATS score for user:', req.user._id); // Debug log
        const latestScore = await AtsScore.findOne({ userId: req.user._id })
            .sort({ analysisDate: -1 })
            .select('-__v');
        
        if (!latestScore) {
            console.log('No scores found for user'); // Debug log
            return res.status(404).json({ message: 'No ATS scores found' });
        }
        
        console.log('Found latest score:', latestScore); // Debug log
        res.json(latestScore);
    } catch (error) {
        console.error('Error fetching latest ATS score:', error); // Debug log
        res.status(500).json({ 
            message: 'Error fetching latest ATS score', 
            error: error.message 
        });
    }
});

module.exports = router; 
const mongoose = require('mongoose');

const atsScoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    fileName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    analysisDate: {
        type: Date,
        default: Date.now
    },
    recommendations: [{
        type: String
    }],
    scoreCategory: {
        type: String,
        enum: ['high', 'medium', 'low'],
        required: true
    },
    keywords: [{
        type: String
    }],
    missingKeywords: [{
        type: String
    }]
});

// Add index for faster queries
atsScoreSchema.index({ userId: 1, analysisDate: -1 });

module.exports = mongoose.model('AtsScore', atsScoreSchema); 
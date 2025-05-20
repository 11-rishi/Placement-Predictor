const mongoose = require('mongoose');

const testScoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    aptitudeScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    codingScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    atsScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    prediction: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    questions: {
        type: Object,
        default: {}
    },
    aptitudeAnswers: {
        type: Array,
        default: []
    },
    codingAnswers: {
        type: Array,
        default: []
    },
    testResults: {
        type: Object,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add index for faster queries
testScoreSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('TestScore', testScoreSchema);

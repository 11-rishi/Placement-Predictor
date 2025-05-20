// Weightage for different components in the final prediction
const WEIGHTS = {
  aptitude: 0.4,  // 40% weight for aptitude
  coding: 0.4,    // 40% weight for coding
  ats: 0.2        // 20% weight for ATS score
};

// Thresholds for different prediction categories
const THRESHOLDS = {
  high: 80,    // High chance of placement
  medium: 60,  // Medium chance of placement
  low: 40      // Low chance of placement
};

// Calculate prediction score based on test performance
export const calculatePredictionScore = (aptitudeScore, codingScore, atsScore) => {
  // Normalize all scores to be between 0 and 100
  const normalizedAptitude = Math.min(Math.max(aptitudeScore, 0), 100);
  const normalizedCoding = Math.min(Math.max(codingScore, 0), 100);
  const normalizedAts = Math.min(Math.max(atsScore, 0), 100);

  // Calculate weighted score
  const weightedScore = (
    normalizedAptitude * WEIGHTS.aptitude +
    normalizedCoding * WEIGHTS.coding +
    normalizedAts * WEIGHTS.ats
  );

  // Determine prediction category
  let predictionCategory;
  if (weightedScore >= THRESHOLDS.high) {
    predictionCategory = 'high';
  } else if (weightedScore >= THRESHOLDS.medium) {
    predictionCategory = 'medium';
  } else {
    predictionCategory = 'low';
  }

  return {
    score: Math.round(weightedScore),
    category: predictionCategory,
    breakdown: {
      aptitude: normalizedAptitude,
      coding: normalizedCoding,
      ats: normalizedAts
    }
  };
};

// Get detailed feedback based on scores
export const getDetailedFeedback = (prediction) => {
  const { score, category, breakdown } = prediction;

  let feedback = {
    overall: '',
    aptitude: '',
    coding: '',
    ats: '',
    recommendations: []
  };

  // Overall feedback
  switch (category) {
    case 'high':
      feedback.overall = 'You have a high chance of placement! Your performance is strong across all areas.';
      break;
    case 'medium':
      feedback.overall = 'You have a moderate chance of placement. There are some areas where you can improve.';
      break;
    case 'low':
      feedback.overall = 'You need to improve your performance to increase your chances of placement.';
      break;
  }

  // Component-specific feedback
  if (breakdown.aptitude < 60) {
    feedback.aptitude = 'Your aptitude score needs improvement. Focus on practicing more aptitude questions.';
    feedback.recommendations.push('Practice more aptitude questions daily');
  }
  if (breakdown.coding < 60) {
    feedback.coding = 'Your coding skills need enhancement. Practice more coding problems.';
    feedback.recommendations.push('Solve more coding problems on platforms like LeetCode or HackerRank');
  }
  if (breakdown.ats < 60) {
    feedback.ats = 'Your resume needs optimization to pass ATS screening.';
    feedback.recommendations.push('Optimize your resume with relevant keywords and skills');
  }

  return feedback;
};

// Save test results and prediction
export const saveTestResults = async (companyName, testType, scores, prediction, questions, aptitudeAnswers, codingAnswers, testResults) => {
  // First save to localStorage as a backup
  const testHistory = {
    companyName,
    testType,
    date: new Date().toISOString(),
    scores,
    prediction: typeof prediction === 'object' ? prediction.score : prediction
  };

  try {
    // Get existing history
    const existingHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');

    // Check if this test result already exists in local storage
    const existingEntry = existingHistory.find(entry =>
      entry.companyName === companyName &&
      entry.scores.aptitude === scores.aptitude &&
      entry.scores.coding === scores.coding
    );

    // Only add to history if it doesn't already exist
    if (!existingEntry) {
      existingHistory.push(testHistory);
      // Save updated history to localStorage
      localStorage.setItem('testHistory', JSON.stringify(existingHistory));
    }

    // Save to server
    const response = await fetch('http://localhost:5000/api/test-scores/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        companyName,
        aptitudeScore: scores.aptitude,
        codingScore: scores.coding,
        atsScore: scores.ats,
        prediction: typeof prediction === 'object' ? prediction.score : prediction,
        questions,
        aptitudeAnswers,
        codingAnswers,
        testResults
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save test results to server');
    }

    const data = await response.json();
    console.log('Test results saved to server:', data);

    return data.testScore;
  } catch (error) {
    console.error('Error saving test results:', error);
    // Return the local history even if server save fails
    return testHistory;
  }
};

// Get prediction history for a user
export const getPredictionHistory = async () => {
  try {
    const response = await fetch('/api/prediction/user', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch prediction history');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching prediction history:', error);
    // Fallback to local storage if API fails
    return JSON.parse(localStorage.getItem('testHistory') || '[]');
  }
};

// Get prediction history for a specific company
export const getCompanyPredictionHistory = async (companyName) => {
  try {
    const response = await fetch(`/api/prediction/company/${encodeURIComponent(companyName)}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch company prediction history');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching company prediction history:', error);
    // Fallback to filtered local storage if API fails
    const allHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');
    return allHistory.filter(item => item.companyName === companyName);
  }
};
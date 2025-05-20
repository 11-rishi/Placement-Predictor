import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './TestResultSheet.css';
import { saveTestResults } from '../services/predictionService';

const TestResultSheet = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    companyName,
    atsScore,
    aptitudeScore,
    codingScore,
    questions,
    aptitudeAnswers,
    codingAnswers,
    testResults
  } = location.state || {};
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  // Calculate weighted prediction score
  const prediction = Math.round(
    (atsScore * 0.2) +          // 20% weight for ATS
    (aptitudeScore * 0.4) +     // 40% weight for aptitude
    (codingScore * 0.4)         // 40% weight for coding
  );

  const getPredictionClass = (score) => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  // Save the prediction score to the database when the component mounts
  useEffect(() => {
    const savePredictionScore = async () => {
      if (!scoreSaved && companyName && atsScore !== undefined && aptitudeScore !== undefined && codingScore !== undefined) {
        try {
          console.log('Saving prediction score to database:', prediction);

          // Check if we already have this test result in localStorage
          const existingHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');
          const existingEntry = existingHistory.find(entry =>
            entry.companyName === companyName &&
            entry.scores.aptitude === aptitudeScore &&
            entry.scores.coding === codingScore
          );

          if (existingEntry) {
            console.log('Test result already exists in localStorage, skipping save');
            setScoreSaved(true);
            return;
          }

          // Save test results to the database
          await saveTestResults(
            companyName,
            'tech', // Assuming this is a tech test
            {
              aptitude: aptitudeScore,
              coding: codingScore,
              ats: atsScore
            },
            prediction,
            questions || {},
            aptitudeAnswers || [],
            codingAnswers || [],
            testResults || {}
          );

          setScoreSaved(true);
          console.log('Prediction score saved successfully');
        } catch (error) {
          console.error('Error saving prediction score:', error);
        }
      }
    };

    savePredictionScore();
  }, [companyName, atsScore, aptitudeScore, codingScore, prediction, questions, aptitudeAnswers, codingAnswers, testResults, scoreSaved]);

  const renderAnswerReview = () => (
    <div className="answer-review-section">
      <h3>Detailed Test Results</h3>

      {/* Aptitude Section */}
      <div className="test-section">
        <div className="section-header">
          <h4>Aptitude Test</h4>
          <div className="section-score">
            Score: {aptitudeScore}% ({testResults?.aptitude?.correct || 0}/{testResults?.aptitude?.total || 0} correct)
          </div>
        </div>
        <div className="questions-list">
          {questions?.aptitude?.map((q, idx) => {
            const userAnswer = aptitudeAnswers[idx] || [];
            const isCorrect = userAnswer.length > 0 &&
              (Array.isArray(q.answer)
                ? JSON.stringify(userAnswer.map(i => q.options[i]).sort()) === JSON.stringify(q.answer.sort())
                : q.options[userAnswer[0]] === q.answer);

            return (
              <div key={idx} className={`question-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="question-header">
                  <span className="question-number">Question {idx + 1}</span>
                  <span className={`status-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                <div className="question-content">
                  <p className="question-text">{q.question}</p>
                  <div className="answer-comparison">
                    <div className="user-answer">
                      <strong>Your Answer:</strong>
                      <p>{userAnswer.length > 0
                        ? userAnswer.map(i => q.options[i]).join(', ')
                        : 'Not answered'}</p>
                    </div>
                    <div className="correct-answer">
                      <strong>Correct Answer:</strong>
                      <p>{Array.isArray(q.answer) ? q.answer.join(', ') : q.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coding Section */}
      <div className="test-section">
        <div className="section-header">
          <h4>Coding Test</h4>
          <div className="section-score">
            Score: {codingScore}% ({testResults?.coding?.correct || 0}/{testResults?.coding?.total || 0} correct)
          </div>
        </div>
        <div className="questions-list">
          {questions?.coding?.map((q, idx) => (
            <div key={idx} className="question-item">
              <div className="question-header">
                <span className="question-number">Question {idx + 1}</span>
              </div>
              <div className="question-content">
                <p className="question-text">{q.title}</p>
                <div className="code-section">
                  <div className="code-answer">
                    <strong>Your Code:</strong>
                    <pre>{codingAnswers[idx] || 'Not attempted'}</pre>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="result-sheet-container">
      <Navbar />
      <div className="result-sheet">
        <div className="result-header">
          <h2>Test Results - {companyName}</h2>
        </div>

        <div className="scores-summary">
          <div className="score-card">
            <h3>ATS Score</h3>
            <div className="score-value">{atsScore}<span className="max">/100</span></div>
          </div>
          <div className="score-card">
            <h3>Aptitude Score</h3>
            <div className="score-value">{aptitudeScore}<span className="max">/100</span></div>
          </div>
          <div className="score-card">
            <h3>Coding Score</h3>
            <div className="score-value">{codingScore}<span className="max">/100</span></div>
          </div>
          <div className={`prediction-card ${getPredictionClass(prediction)}`}>
            <h3>Placement Prediction</h3>
            <div className="prediction-value">{prediction}%</div>
            {scoreSaved && <div className="score-saved-indicator">✓ Saved</div>}
          </div>
        </div>

        <div className="actions">
          <button className="back-btn" onClick={() => navigate('/companies')}>
            Back to Companies
          </button>
          {!showAllAnswers && (
            <button className="review-btn" onClick={() => setShowAllAnswers(true)}>
              Review Answers
            </button>
          )}
        </div>

        {showAllAnswers && renderAnswerReview()}
      </div>
    </div>
  );
};

export default TestResultSheet;
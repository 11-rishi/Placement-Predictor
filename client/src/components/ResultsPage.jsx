import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { companiesData } from '../services/companiesData';
import { 
  aptitudeQuestionPool, 
  codingQuestionPool, 
  interviewQuestionPool, 
  hrQuestionPool,
  getAnswerKey 
} from '../services/testQuestions';
import { getCompanyQuestions } from '../services/testHistory';
import evaluationModel from '../services/evaluationModel';
import { saveTestHistory } from '../services/testHistory';
import Navbar from './Navbar';
import './ResultsPage.css';

const ResultsPage = () => {
  const { companyName, type } = useParams();
  const navigate = useNavigate();
  const company = companiesData.find(c => c.name === decodeURIComponent(companyName) && c.type === type);
  const location = useLocation();
  const { aptitudeAnswers, codingAnswers, codingLangs, codingOutputs, nonTechAnswers } = location.state || {};
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeSpent, setTimeSpent] = useState(location.state?.timeSpent || 0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!company) {
      setError('Company not found');
      return;
    }

    try {
      const companyQuestions = getCompanyQuestions(company.name, type);
      if (!companyQuestions) {
        setError('Failed to load questions');
        return;
      }
      setQuestions(companyQuestions);
    } catch (err) {
      console.error('Error loading questions:', err);
      setError('Failed to load questions');
    }
  }, [company, type]);

  useEffect(() => {
    const loadResults = () => {
      try {
        if (!company) {
          setError('Company not found');
          return;
        }

        const totalScore = calculateTotalScore();
        const detailedFeedback = getDetailedFeedback();
        setScore(totalScore);
        setFeedback(detailedFeedback);

        // Save test history with correct answers
        const correctAnswers = {
          aptitude: aptitudeQuestionPool?.map(q => ({
            question: q.question,
            correctAnswer: q.answer,
            options: q.options
          })) || [],
          coding: codingQuestionPool?.map(q => ({
            question: q.question,
            testCases: q.testCases
          })) || [],
          nonTech: [...(interviewQuestionPool || []), ...(hrQuestionPool || [])].map(q => ({
            question: q.question,
            expectedPoints: q.expectedPoints
          }))
        };

        saveTestHistory(company.name, type, {
          aptitudeAnswers,
          codingAnswers,
          nonTechAnswers,
          timeSpent
        }, correctAnswers);
      } catch (err) {
        console.error('Error loading results:', err);
        setError('Failed to load results');
      }
    };

    if (company && questions) {
      loadResults();
    }
  }, [company, questions]);

  const calculateAptitudeScore = () => {
    let score = 0;
    let total = aptitudeQuestionPool.length;

    for (let i = 0; i < aptitudeAnswers.length; i++) {
      const answer = aptitudeAnswers[i];
      const question = aptitudeQuestionPool[i];
      if (answer && answer.length > 0) {
        const isCorrect = evaluationModel.evaluateAnswer(
          'aptitude',
          answer.map(idx => question.options[idx]).join(', '),
          question.answer
        );
        if (isCorrect) score++;
      }
    }

    return { score, total };
  };

  const calculateCodingScore = () => {
    let score = 0;
    let total = codingQuestionPool.length;

    for (let i = 0; i < codingOutputs.length; i++) {
      const output = codingOutputs[i];
      if (output) {
        const isCorrect = evaluationModel.evaluateAnswer(
          'coding',
          codingAnswers[i],
          output
        );
        if (isCorrect) score++;
      }
    }

    return { score, total };
  };

  const calculateNonTechScore = () => {
    if (!questions?.interview || !questions?.hr || !nonTechAnswers) {
      return { score: 0, total: 0 };
    }

    let score = 0;
    let total = (questions.interview?.length || 0) + (questions.hr?.length || 0);

    for (let i = 0; i < nonTechAnswers.length; i++) {
      const answer = nonTechAnswers[i];
      const question = [...(questions.interview || []), ...(questions.hr || [])][i];
      if (answer && answer.length > 0 && question) {
        const evaluation = evaluationModel.evaluateAnswer(
          'non-tech',
          answer,
          null,
          question.expectedPoints
        );
        if (evaluation.score >= 0.7) score++;
      }
    }

    return { score, total };
  };

  const getDetailedFeedback = () => {
    console.log('Starting getDetailedFeedback with:', {
      type,
      questions,
      aptitudeAnswers,
      codingAnswers,
      codingOutputs,
      nonTechAnswers
    });

    if (!questions) {
      console.log('No questions available');
      return [];
    }

    const feedback = [];

    try {
      if (type === 'tech') {
        // Aptitude section
        if (questions.aptitude && Array.isArray(aptitudeAnswers)) {
          console.log('Processing aptitude section with:', {
            aptitudeQuestions: questions.aptitude,
            aptitudeAnswers
          });
          const aptScore = calculateAptitudeScore();
          const aptitudeDetails = aptitudeAnswers.map((answer, index) => {
            console.log(`Processing aptitude answer ${index}:`, { answer, question: questions.aptitude?.[index] });
            const question = questions.aptitude?.[index];
            if (!question) {
              console.log(`No question found for aptitude index ${index}`);
              return null;
            }
            if (!Array.isArray(answer)) {
              console.log(`Invalid answer format for aptitude index ${index}:`, answer);
              return null;
            }
            const isCorrect = evaluationModel.evaluateAnswer(
              'aptitude',
              answer.map(idx => question.options?.[idx] || '').join(', '),
              question.answer
            );
            return {
              question: question.question,
              correct: isCorrect,
              yourAnswer: answer.map(idx => question.options?.[idx] || '').join(', '),
              correctAnswer: question.answer
            };
          }).filter(Boolean);

          feedback.push({
            section: 'Aptitude',
            score: aptScore.score,
            total: aptScore.total,
            percentage: Math.round((aptScore.score / aptScore.total) * 100),
            details: aptitudeDetails
          });
        }

        // Coding section
        if (questions.coding && Array.isArray(codingAnswers) && Array.isArray(codingOutputs)) {
          console.log('Processing coding section with:', {
            codingQuestions: questions.coding,
            codingAnswers,
            codingOutputs
          });
          const codeScore = calculateCodingScore();
          const codingDetails = codingOutputs.map((output, index) => {
            console.log(`Processing coding output ${index}:`, { output, question: questions.coding?.[index] });
            const question = questions.coding?.[index];
            if (!question) {
              console.log(`No question found for coding index ${index}`);
              return null;
            }
            if (!output) {
              console.log(`No output found for coding index ${index}`);
              return null;
            }
            const isCorrect = evaluationModel.evaluateAnswer(
              'coding',
              codingAnswers[index] || '',
              output
            );
            return {
              question: question.question,
              success: isCorrect,
              passedTests: output?.passedTests || 0,
              totalTests: output?.totalTests || 0,
              results: output?.results || []
            };
          }).filter(Boolean);

          feedback.push({
            section: 'Coding',
            score: codeScore.score,
            total: codeScore.total,
            percentage: Math.round((codeScore.score / codeScore.total) * 100),
            details: codingDetails
          });
        }
      } else {
        // Non-tech section
        if (questions.interview && questions.hr && Array.isArray(nonTechAnswers)) {
          console.log('Processing non-tech section with:', {
            interviewQuestions: questions.interview,
            hrQuestions: questions.hr,
            nonTechAnswers
          });
          const nonTechScore = calculateNonTechScore();
          const allQuestions = [...(questions.interview || []), ...(questions.hr || [])];
          const nonTechDetails = nonTechAnswers.map((answer, index) => {
            console.log(`Processing non-tech answer ${index}:`, { answer, question: allQuestions[index] });
            const question = allQuestions[index];
            if (!question) {
              console.log(`No question found for non-tech index ${index}`);
              return null;
            }
            if (!answer) {
              console.log(`No answer found for non-tech index ${index}`);
              return null;
            }
            const evaluation = evaluationModel.evaluateAnswer(
              'non-tech',
              answer || '',
              null,
              question.expectedPoints
            );
            return {
              question: question.question,
              coveredPoints: evaluation.coveredPoints.length,
              totalPoints: question.expectedPoints.length,
              expectedPoints: question.expectedPoints,
              missingPoints: evaluation.missingPoints
            };
          }).filter(Boolean);

          feedback.push({
            section: 'Interview & HR',
            score: nonTechScore.score,
            total: nonTechScore.total,
            percentage: Math.round((nonTechScore.score / nonTechScore.total) * 100),
            details: nonTechDetails
          });
        }
      }
    } catch (error) {
      console.error('Error in getDetailedFeedback:', error);
      console.error('Error details:', {
        type,
        questions,
        aptitudeAnswers,
        codingAnswers,
        codingOutputs,
        nonTechAnswers
      });
      return [];
    }

    console.log('Final feedback:', feedback);
    return feedback;
  };

  const calculateTotalScore = () => {
    if (type === 'tech') {
      const aptScore = calculateAptitudeScore();
      const codeScore = calculateCodingScore();
      const totalScore = aptScore.score + codeScore.score;
      const totalQuestions = aptScore.total + codeScore.total;
      return {
        score: totalScore,
        total: totalQuestions,
        percentage: Math.round((totalScore / totalQuestions) * 100)
      };
    } else {
      const nonTechScore = calculateNonTechScore();
      return {
        score: nonTechScore.score,
        total: nonTechScore.total,
        percentage: Math.round((nonTechScore.score / nonTechScore.total) * 100)
      };
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m ` : ''}${remainingSeconds}s`;
  };

  const getPerformanceColor = () => {
    if (score.percentage >= 80) return "#10B981"; // Green
    if (score.percentage >= 60) return "#3B82F6"; // Blue
    if (score.percentage >= 40) return "#F59E0B"; // Yellow
    return "#EF4444"; // Red
  };

  const getFeedback = () => {
    if (score.percentage >= 80) return "Excellent! You've demonstrated strong understanding.";
    if (score.percentage >= 60) return "Good job! You've shown solid knowledge.";
    if (score.percentage >= 40) return "Fair performance. Keep practicing!";
    return "Needs improvement. Don't give up!";
  };

  const renderOverview = () => (
    <div className="overview-section">
      <div className="score-card">
        <div className="score-circle" style={{ borderColor: getPerformanceColor() }}>
          <span className="score-percentage">{score.percentage}%</span>
          <span className="score-label">Score</span>
        </div>
        <div className="score-details">
          <div className="score-stat">
            <span className="stat-label">Time Taken</span>
            <span className="stat-value">{formatTime(timeSpent)}</span>
          </div>
          <div className="score-stat">
            <span className="stat-label">Questions</span>
            <span className="stat-value">{score.total}</span>
          </div>
          <div className="score-stat">
            <span className="stat-label">Correct</span>
            <span className="stat-value">{score.score}</span>
          </div>
        </div>
      </div>
      <div className="feedback-card">
        <h3>Performance Analysis</h3>
        <p>{getFeedback()}</p>
        <div className="performance-metrics">
          {feedback.map((section, index) => (
            <div key={index} className="metric-item">
              <div className="metric-header">
                <span className="metric-title">{section.section}</span>
                <span className="metric-score">{section.percentage}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${section.percentage}%`,
                    backgroundColor: getPerformanceColor()
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDetailedResults = () => (
    <div className="detailed-results">
      {feedback.map((section, index) => (
        <div key={index} className="section-results">
          <h3>{section.section}</h3>
          <div className="questions-grid">
            {section.details.map((detail, qIndex) => (
              <div key={qIndex} className="question-card">
                <div className="question-header">
                  <span className="question-number">Question {qIndex + 1}</span>
                  <span className={`status-badge ${detail.correct || detail.success ? 'success' : 'error'}`}>
                    {detail.correct || detail.success ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                <p className="question-text">{detail.question}</p>
                <div className="answer-details">
                  <div className="answer-section">
                    <span className="answer-label">Your Answer:</span>
                    <p className="answer-text">{detail.yourAnswer || detail.answer}</p>
                  </div>
                  {showAnswers && (
                    <div className="answer-section">
                      <span className="answer-label">Correct Answer:</span>
                      <p className="answer-text">{detail.correctAnswer}</p>
                    </div>
                  )}
                  {detail.passedTests !== undefined && (
                    <div className="test-results">
                      <span className="test-label">Test Cases:</span>
                      <div className="test-progress">
                        <div 
                          className="test-fill"
                          style={{ width: `${(detail.passedTests / detail.totalTests) * 100}%` }}
                        />
                        <span className="test-count">{detail.passedTests}/{detail.totalTests}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <div className="results-container">
        <Navbar />
        <div className="error-message">
          <h2>{error}</h2>
          <button onClick={() => navigate('/companies')}>Back to Companies</button>
        </div>
      </div>
    );
  }

  if (!company || !questions) {
    return (
      <div className="results-container">
        <Navbar />
        <div className="loading">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <Navbar />
      <div className="results-content">
        <div className="results-header">
          <h1>{company.name} Test Results</h1>
          <p className="test-type">{type.toUpperCase()} Assessment</p>
        </div>

        <div className="results-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'detailed' ? 'active' : ''}`}
            onClick={() => setActiveTab('detailed')}
          >
            Detailed Results
          </button>
        </div>

        <div className="results-body">
          {activeTab === 'overview' ? renderOverview() : renderDetailedResults()}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage; 
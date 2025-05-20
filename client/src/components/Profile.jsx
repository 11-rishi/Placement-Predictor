import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import LineChart from './LineChart';
import './Profile.css';
import { useNavigate } from 'react-router-dom';

// Constants for ATS score thresholds
const SCORE_THRESHOLDS = {
  HIGH: 80,
  MEDIUM: 60
};

const Profile = () => {
  const { user } = useAuth();
  const [atsScores, setAtsScores] = useState([]);
  const [testScores, setTestScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [atsResponse, testResponse] = await Promise.all([
          fetch('http://localhost:5000/api/ats-score/history', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          fetch('http://localhost:5000/api/test-scores/history', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
        ]);

        if (!atsResponse.ok) {
          throw new Error('Failed to fetch ATS scores');
        }
        if (!testResponse.ok) {
          throw new Error('Failed to fetch test scores');
        }

        const [atsData, testData] = await Promise.all([
          atsResponse.json(),
          testResponse.json()
        ]);

        setAtsScores(atsData);
        setTestScores(testData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getScoreCategory = (score) => {
    if (score >= SCORE_THRESHOLDS.HIGH) return 'high';
    if (score >= SCORE_THRESHOLDS.MEDIUM) return 'medium';
    return 'low';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getScoreStats = () => {
    if (!atsScores || !atsScores.length) return null;

    const scores = atsScores.map(s => s.score);
    return {
      average: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1),
      highest: Math.max(...scores),
      lowest: Math.min(...scores),
      total: scores.length
    };
  };

  const getTestStats = () => {
    if (!testScores || !testScores.length) return null;

    const aptitudeScores = testScores.map(s => s.aptitudeScore);
    const codingScores = testScores.map(s => s.codingScore);
    const predictions = testScores.map(s => s.prediction);

    return {
      highestAptitude: Math.max(...aptitudeScores),
      highestCoding: Math.max(...codingScores),
      highestPrediction: Math.max(...predictions),
      lowestPrediction: Math.min(...predictions),
      averagePrediction: (predictions.reduce((a, b) => a + b, 0) / predictions.length).toFixed(1),
      total: testScores.length
    };
  };

  const getTestScoreCategory = (aptitude, coding) => {
    const average = (aptitude + coding) / 2;
    if (average >= 80) return 'high';
    if (average >= 60) return 'medium';
    return 'low';
  };

  if (!user) {
    return (
      <div className="profile-container">
        <Navbar />
        <div className="profile-error">
          <h2>Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  const stats = getScoreStats();
  const testStats = getTestStats();

  // Get the latest ATS score from the history (if available)
  const latestAtsScore = atsScores && Array.isArray(atsScores) && atsScores.length > 0
    ? atsScores[0].score
    : (user?.atsScore || 0);
  console.log("Latest ATS Score:", latestAtsScore);

  return (
    <div className="profile-container">
      <Navbar />

      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{user.username}</h1>
            <p className="profile-email">{user.email}</p>
            <div className="profile-stats-brief">
              <div className="stat-item">
                <span className="stat-value">{stats?.total || 0}</span>
                <span className="stat-label">Resumes Analyzed</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats?.highest || 0}</span>
                <span className="stat-label">Highest ATS Score</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats?.lowest || 0}</span>
                <span className="stat-label">Lowest ATS Score</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{testStats?.total || 0}</span>
                <span className="stat-label">Tests Completed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Score History
          </button>
          <button
            className={`tab-button ${activeTab === 'tests' ? 'active' : ''}`}
            onClick={() => setActiveTab('tests')}
          >
            Test Results
          </button>
        </div>

        {activeTab === 'overview' ? (
          <div className="profile-overview">
            <div className="overview-grid">
              <div className="overview-card current-score">
                <h3>Current ATS Score</h3>
                <div className="score-ring-container">
                  <ScoreDisplay atsScore={latestAtsScore} />
                </div>
                <p className="score-category">
                  {getScoreCategory(latestAtsScore).toUpperCase()} SCORE
                </p>
                <div className="score-description">
                  {latestAtsScore >= SCORE_THRESHOLDS.HIGH ? (
                    <p>Excellent! Your resume is highly optimized for ATS systems.</p>
                  ) : latestAtsScore >= SCORE_THRESHOLDS.MEDIUM ? (
                    <p>Good score. Some improvements could help optimize your resume further.</p>
                  ) : (
                    <p>Consider revising your resume to better match ATS requirements.</p>
                  )}
                </div>

                {latestAtsScore < SCORE_THRESHOLDS.HIGH && (
                  <div className="profile-recommendations">
                    <h4>Improvement Points:</h4>
                    <ul className="recommendations-list">
                      <RecommendationItem text="Use more industry-specific keywords" />
                      <RecommendationItem text="Improve formatting and structure" />
                      {latestAtsScore < SCORE_THRESHOLDS.MEDIUM && (
                        <>
                          <RecommendationItem text="Remove complex graphics or tables" />
                          <RecommendationItem text="Use a simpler, more standard layout" />
                          <RecommendationItem text="Ensure contact information is clearly visible" />
                        </>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <div className="overview-card score-stats">
                <h3>ATS Score History</h3>
                <div className="stats-grid">
                  <div className="stat-box">
                    <span className="stat-label">Highest Score</span>
                    <span className="stat-value">{stats?.highest || 0}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Average Score</span>
                    <span className="stat-value">{stats?.average || 0}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Lowest Score</span>
                    <span className="stat-value">{stats?.lowest || 0}</span>
                  </div>
                </div>

                <h3 style={{ marginTop: '2rem' }}>Test Statistics</h3>
                <div className="stats-grid">
                  <div className="stat-box">
                    <span className="stat-label">Tests Taken</span>
                    <span className="stat-value">{testStats?.total || 0}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Best Prediction</span>
                    <span className="stat-value">{testStats?.highestPrediction || 0}%</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Avg. Prediction</span>
                    <span className="stat-value">{testStats?.averagePrediction || 0}%</span>
                  </div>
                </div>
                <div className="score-trend">
                  <h4>Recent Trend</h4>
                  {atsScores && atsScores.length > 0 ? (
                    <LineChart
                      data={atsScores.slice(0, 5).map(score => ({
                        score: score.score,
                        date: score.analysisDate
                      })).reverse()}
                    />
                  ) : (
                    <div className="no-data-message">No score data available</div>
                  )}
                </div>
              </div>
            </div>
            <button
              className="predict-btn"
              style={{ marginTop: '2rem' }}
              onClick={() => navigate('/companies')}
            >
              Predict Placement
            </button>
          </div>
        ) : activeTab === 'history' ? (
          <div className="profile-section">
            <h2>ATS Score History</h2>
            {loading ? (
              <div className="loading">Loading scores...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : atsScores.length === 0 ? (
              <div className="no-scores">No ATS scores available</div>
            ) : (
              <div className="score-history">
                {atsScores.map((score) => (
                  <div key={score._id} className="score-card">
                    <div className="score-card-header">
                      <span className="score-date">{formatDate(score.analysisDate)}</span>
                      <span className={`score-badge score-${score.scoreCategory}`}>
                        {score.scoreCategory}
                      </span>
                    </div>
                    <div className="score-card-body">
                      <div className={`score-circle score-${score.scoreCategory}`}>
                        <span className="score-value">{score.score}</span>
                        <span className="score-max">/100</span>
                      </div>
                      <div className="score-details">
                        <p>File: {score.fileName}</p>
                        {score.recommendations && score.recommendations.length > 0 && (
                          <div className="recommendations">
                            <h4>Recommendations:</h4>
                            <ul>
                              {score.recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="profile-section">
            <h2>Test Results</h2>
            {loading ? (
              <div className="loading">Loading test results...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : testScores.length === 0 ? (
              <div className="no-scores">
                <p>No test results available</p>
                <button
                  className="take-test-btn"
                  onClick={() => navigate('/companies')}
                >
                  Take a Test
                </button>
              </div>
            ) : (
              <div className="test-results-container">
                {testScores.map((result) => (
                  <div key={result._id} className="test-result-card">
                    <div className="test-result-header">
                      <div className="company-details">
                        <h3>{result.companyName}</h3>
                        <span className="test-date">{formatDate(result.createdAt)}</span>
                      </div>
                      <div className={`prediction-badge prediction-${getScoreCategory(result.prediction)}`}>
                        <span className="prediction-label">Placement Prediction</span>
                        <span className="prediction-percentage">{result.prediction}%</span>
                      </div>
                    </div>

                    <div className="test-result-body">
                      <div className="score-panels">
                        <div className="score-panel">
                          <div className="score-panel-header">
                            <span className="score-icon ats-icon">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                                <path d="M19.5 22.5a3 3 0 003-3v-8.174l-6.879 4.022 3.485 1.876a.75.75 0 01-.712 1.321l-5.683-3.06a1.5 1.5 0 00-1.422 0l-5.683 3.06a.75.75 0 01-.712-1.32l3.485-1.877L1.5 11.326V19.5a3 3 0 003 3h15z" />
                                <path d="M1.5 9.589v-.745a3 3 0 011.578-2.641l7.5-4.039a3 3 0 012.844 0l7.5 4.039A3 3 0 0122.5 8.844v.745l-8.426 4.926-.652-.35a3 3 0 00-2.844 0l-.652.35L1.5 9.59z" />
                              </svg>
                            </span>
                            <h4>ATS Score</h4>
                          </div>
                          <div className="score-panel-value">{result.atsScore}</div>
                        </div>

                        <div className="score-panel">
                          <div className="score-panel-header">
                            <span className="score-icon aptitude-icon">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                                <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                                <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                                <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
                              </svg>
                            </span>
                            <h4>Aptitude</h4>
                          </div>
                          <div className="score-panel-value">{result.aptitudeScore}</div>
                        </div>

                        <div className="score-panel">
                          <div className="score-panel-header">
                            <span className="score-icon coding-icon">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                                <path fillRule="evenodd" d="M14.447 3.027a.75.75 0 01.527.92l-4.5 16.5a.75.75 0 01-1.448-.394l4.5-16.5a.75.75 0 01.921-.526zM16.72 6.22a.75.75 0 011.06 0l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 010-1.06zm-9.44 0a.75.75 0 010 1.06L2.56 12l4.72 4.72a.75.75 0 11-1.06 1.06L.97 12.53a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                            <h4>Coding</h4>
                          </div>
                          <div className="score-panel-value">{result.codingScore}</div>
                        </div>
                      </div>

                      <div className="test-result-actions">
                        <button
                          className="view-details-btn"
                          onClick={() => navigate('/test-results', {
                            state: {
                              companyName: result.companyName,
                              atsScore: result.atsScore,
                              aptitudeScore: result.aptitudeScore,
                              codingScore: result.codingScore,
                              prediction: result.prediction,
                              questions: result.questions,
                              aptitudeAnswers: result.aptitudeAnswers,
                              codingAnswers: result.codingAnswers,
                              testResults: result.testResults
                            }
                          })}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ScoreDisplay component from Dashboard
const ScoreDisplay = ({ atsScore }) => {
  const radius = 90;
  const stroke = 15;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = Math.max(0, Math.min(atsScore, 100));
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="score-container-horizontal">
      <div className="score-progress-horizontal">
        <svg height={radius * 2} width={radius * 2}>
          <defs>
            <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <circle
            stroke="#23293a"
            fill="none"
            strokeWidth={stroke}
            cx={radius}
            cy={radius}
            r={normalizedRadius}
          />
          <circle
            stroke="url(#score-gradient)"
            fill="none"
            strokeWidth={stroke}
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.7s" }}
          />
        </svg>
        <div className="score-value-horizontal">
          <span className="score-number">{Math.round(atsScore)}</span>
        </div>
      </div>
    </div>
  );
};

// Recommendation item component
const RecommendationItem = ({ text }) => (
  <li className="profile-recommendation-item">
    <span className="recommendation-check">✓</span>
    <span className="recommendation-text">{text}</span>
  </li>
);

export default Profile;

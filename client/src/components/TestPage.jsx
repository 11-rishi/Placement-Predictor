import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { companiesData } from "../services/companiesData";
import { getCompanyQuestions } from "../services/testHistory";
import { getAnswerKey } from "../services/testQuestions";
import "./TestPage.css";
import { useAuth } from '../context/AuthContext';
import { calculatePredictionScore, getDetailedFeedback, saveTestResults } from '../services/predictionService';

const TestPage = () => {
  const { companyName, type } = useParams();
  const navigate = useNavigate();
  const company = companiesData.find(c => c.name === decodeURIComponent(companyName) && c.type === type);
  const { atsScore } = useAuth();

  const [questions, setQuestions] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timer, setTimer] = useState(30 * 60); // 30 minutes
  const [aptitudeAnswers, setAptitudeAnswers] = useState([]);
  const [codingAnswers, setCodingAnswers] = useState([]);
  const [nonTechAnswers, setNonTechAnswers] = useState([]);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [visitedQuestions, setVisitedQuestions] = useState(new Set());
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [testResults, setTestResults] = useState({
    aptitude: {
      totalQuestions: 0,
      correctAnswers: 0,
      score: 0
    },
    coding: {
      totalQuestions: 0,
      correctAnswers: 0,
      score: 0
    }
  });
  const [currentPrediction, setCurrentPrediction] = useState(0);

  // Initialize questions and answers
  useEffect(() => {
    if (company) {
      const companyQuestions = getCompanyQuestions(company.name, type);
      setQuestions(companyQuestions);

      if (type === 'tech') {
        setAptitudeAnswers(Array(companyQuestions.aptitude.length).fill().map(() => []));
        setCodingAnswers(Array(companyQuestions.coding.length).fill().map(() => []));
      } else {
        setNonTechAnswers(new Array(companyQuestions.interview.length + companyQuestions.hr.length).fill(''));
      }
    }
  }, [company, type]);

  // Timer effect
  useEffect(() => {
    if (!company || !questions) return;

    if (timer > 0) {
      const t = setTimeout(() => {
        setTimer(timer - 1);
        if (timer === 300) {
          setShowTimeWarning(true);
        }
      }, 1000);
      return () => clearTimeout(t);
    } else {
      handleSubmit();
    }
  }, [timer, company, questions]);

  // Function to check if an answer is correct
  const isAnswerCorrect = (question, userAnswer) => {
    if (!userAnswer || userAnswer.length === 0) return false;

    if (Array.isArray(question.answer)) {
      // For multiple choice questions with multiple answers
      const userSet = new Set(userAnswer.map(idx => question.options[idx]));
      const correctSet = new Set(question.answer);
      return userSet.size === correctSet.size &&
             [...userSet].every(value => correctSet.has(value));
    } else {
      // For single answer questions
      return userAnswer.length === 1 && question.options[userAnswer[0]] === question.answer;
    }
  };

  // Update test results whenever answers change
  useEffect(() => {
    if (!questions) return;

    // Calculate aptitude results
    const aptitudeResults = questions.aptitude && Array.isArray(questions.aptitude)
      ? questions.aptitude.reduce((acc, question, idx) => {
          const isCorrect = isAnswerCorrect(question, aptitudeAnswers[idx]);
          return {
            totalQuestions: acc.totalQuestions + 1,
            correctAnswers: acc.correctAnswers + (isCorrect ? 1 : 0)
          };
        }, { totalQuestions: 0, correctAnswers: 0 })
      : { totalQuestions: 0, correctAnswers: 0 };

    // Calculate coding results (now treated as MCQs)
    const codingResults = questions.coding && Array.isArray(questions.coding)
      ? questions.coding.reduce((acc, question, idx) => {
          const isCorrect = isAnswerCorrect(question, codingAnswers[idx]);
          return {
            totalQuestions: acc.totalQuestions + 1,
            correctAnswers: acc.correctAnswers + (isCorrect ? 1 : 0)
          };
        }, { totalQuestions: 0, correctAnswers: 0 })
      : { totalQuestions: 0, correctAnswers: 0 };

    // Calculate scores
    const aptitudeScore = aptitudeResults.totalQuestions > 0
      ? Math.round((aptitudeResults.correctAnswers / aptitudeResults.totalQuestions) * 100)
      : 0;
    const codingScore = codingResults.totalQuestions > 0
      ? Math.round((codingResults.correctAnswers / codingResults.totalQuestions) * 100)
      : 0;

    setTestResults({
      aptitude: {
        ...aptitudeResults,
        score: aptitudeScore
      },
      coding: {
        ...codingResults,
        score: codingScore
      }
    });
  }, [questions, aptitudeAnswers, codingAnswers]);

  // Function to calculate prediction score
  const calculatePrediction = (aptScore, codScore) => {
    return Math.round(
      (atsScore * 0.2) +          // 20% weight for ATS
      (aptScore * 0.4) +          // 40% weight for aptitude
      (codScore * 0.4)            // 40% weight for coding
    );
  };

  // Update prediction whenever answers change
  useEffect(() => {
    if (!questions) return;

    const aptitudeScore = testResults.aptitude.score;
    const codingScore = testResults.coding.score;

    // Update prediction
    const newPrediction = calculatePrediction(aptitudeScore, codingScore);
    setCurrentPrediction(newPrediction);
  }, [questions, testResults, atsScore]);

  const getPredictionClass = (score) => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  const handleAptitudeChange = (qIdx, optIdx) => {
    const updated = [...aptitudeAnswers];
    const question = questions.aptitude[qIdx];

    if (Array.isArray(question.answer)) {
      // Multiple answer question - handle checkbox behavior
      if (!updated[qIdx]) {
        updated[qIdx] = [];
      }
      if (updated[qIdx].includes(optIdx)) {
        updated[qIdx] = updated[qIdx].filter(i => i !== optIdx);
      } else {
        updated[qIdx] = [...updated[qIdx], optIdx];
      }
    } else {
      // Single answer question - handle radio behavior
      updated[qIdx] = [optIdx];
    }

    setAptitudeAnswers(updated);
    markQuestionVisited(qIdx);
  };

  const handleCodingChange = (qIdx, optIdx) => {
    const updated = [...codingAnswers];
    const question = questions.coding[qIdx];

    if (Array.isArray(question.answer)) {
      // Multiple answer question - handle checkbox behavior
      if (!updated[qIdx]) {
        updated[qIdx] = [];
      }
      if (updated[qIdx].includes(optIdx)) {
        updated[qIdx] = updated[qIdx].filter(i => i !== optIdx);
      } else {
        updated[qIdx] = [...updated[qIdx], optIdx];
      }
    } else {
      // Single answer question - handle radio behavior
      updated[qIdx] = [optIdx];
    }

    setCodingAnswers(updated);
    markQuestionVisited(qIdx + questions.aptitude.length);
  };

  const handleNonTechChange = (qIdx, val) => {
    const updated = [...nonTechAnswers];
    updated[qIdx] = val;
    setNonTechAnswers(updated);
    markQuestionVisited(qIdx);
  };

  const markQuestionVisited = (questionIndex) => {
    setVisitedQuestions(prev => new Set([...prev, questionIndex]));
  };

  const handleSubmit = async () => {
    if (!showSubmitConfirm) {
      setShowSubmitConfirm(true);
      return;
    }

    const allQuestions = type === 'tech'
      ? [...(questions.aptitude || []), ...(questions.coding || [])]
      : [...(questions.interview || []), ...(questions.hr || [])];

    const answerKey = getAnswerKey(allQuestions);

    if (type === 'tech') {
      // Use the final test results
      const { aptitude, coding } = testResults;

      // Calculate prediction score
      const prediction = calculatePredictionScore(
        aptitude.score,
        coding.score,
        atsScore || 0
      );
      const feedback = getDetailedFeedback(prediction);

      // Save test results
      await saveTestResults(
        company.name,
        type,
        {
          aptitude: aptitude.score,
          coding: coding.score,
          ats: atsScore || 0
        },
        prediction,
        questions,
        aptitudeAnswers,
        codingAnswers,
        {
          aptitude: {
            total: aptitude.totalQuestions,
            correct: aptitude.correctAnswers
          },
          coding: {
            total: coding.totalQuestions,
            correct: coding.correctAnswers
          }
        }
      );

      navigate(`/companies/${encodeURIComponent(company.name)}/result-sheet`, {
        state: {
          companyName: company.name,
          atsScore: atsScore || 0,
          aptitudeScore: aptitude.score,
          codingScore: coding.score,
          questions,
          aptitudeAnswers,
          codingAnswers,
          prediction,
          feedback,
          testResults: {
            aptitude: {
              total: aptitude.totalQuestions,
              correct: aptitude.correctAnswers
            },
            coding: {
              total: coding.totalQuestions,
              correct: coding.correctAnswers
            }
          }
        }
      });
    } else {
      navigate(`/companies/${encodeURIComponent(company.name)}/results`, {
        state: {
          type,
          questions: allQuestions,
          answers: nonTechAnswers,
          answerKey
        }
      });
    }
  };

  if (!company || !questions) {
    return <div className="loading">Loading...</div>;
  }

  const totalQuestions = type === 'tech'
    ? (questions.aptitude?.length || 0) + (questions.coding?.length || 0)
    : (questions.interview?.length || 0) + (questions.hr?.length || 0);

  const getQuestionStatus = (index) => {
    if (visitedQuestions.has(index)) {
      if (questions.aptitude && Array.isArray(questions.aptitude) && index < questions.aptitude.length) {
        return aptitudeAnswers[index]?.length > 0 ? 'answered' : 'visited';
      } else if (questions.aptitude && Array.isArray(questions.aptitude)) {
        const codingIndex = index - (questions.aptitude?.length || 0);
        return codingAnswers[codingIndex]?.length > 0 ? 'answered' : 'visited';
      }
    }
    return 'unvisited';
  };

  const renderAptitudeQuestion = (question) => (
    <div className="question-container">
      <div className="question-header">
        <h3>Question {currentQuestion + 1}</h3>
        <span className={`difficulty-badge ${question.difficulty}`}>
          {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
        </span>
      </div>
      <div className="question-content">
        <div className="question-description">
          <p>{question.question}</p>
        </div>
        <div className="options-grid">
          {question.options.map((option, idx) => (
            <label
              key={idx}
              className={`option ${aptitudeAnswers[currentQuestion]?.includes(idx) ? 'selected' : ''}`}
            >
              <input
                type={Array.isArray(question.answer) ? "checkbox" : "radio"}
                name={`aptitude-${currentQuestion}`}
                checked={aptitudeAnswers[currentQuestion]?.includes(idx) || false}
                onChange={() => handleAptitudeChange(currentQuestion, idx)}
              />
              <span className="option-text">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCodingQuestion = (question) => (
    <div className="question-container">
      <div className="question-header">
        <h3>{question.title}</h3>
        <span className="difficulty-badge">{question.difficulty}</span>
      </div>
      <div className="question-content">
        <div className="question-description">
          <p>{question.description}</p>
        </div>
        <div className="options-grid">
          {question.options.map((option, idx) => (
            <label
              key={idx}
              className={`option ${codingAnswers[currentQuestion - questions.aptitude.length]?.includes(idx) ? 'selected' : ''}`}
            >
              <input
                type={Array.isArray(question.answer) ? "checkbox" : "radio"}
                name={`coding-${currentQuestion - questions.aptitude.length}`}
                checked={codingAnswers[currentQuestion - questions.aptitude.length]?.includes(idx) || false}
                onChange={() => handleCodingChange(currentQuestion - questions.aptitude.length, idx)}
              />
              <span className="option-text">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnswerReview = () => (
    <div className="answer-review-section">
      <h3>Test Review</h3>

      <div className="score-summary">
        <div className="score-item">
          <h4>Aptitude Score</h4>
          <div className="score-value">
            {testResults.aptitude.correctAnswers} / {testResults.aptitude.totalQuestions}
            <span className="score-percentage">
              ({Math.round((testResults.aptitude.correctAnswers / testResults.aptitude.totalQuestions) * 100)}%)
            </span>
          </div>
        </div>
        <div className="score-item">
          <h4>Coding Score</h4>
          <div className="score-value">
            {testResults.coding.correctAnswers} / {testResults.coding.totalQuestions}
            <span className="score-percentage">
              ({Math.round((testResults.coding.correctAnswers / testResults.coding.totalQuestions) * 100)}%)
            </span>
          </div>
        </div>
      </div>

      <div className="answer-review-content">
        <div className="answer-section">
          <h4>Aptitude Questions</h4>
          {questions.aptitude && Array.isArray(questions.aptitude) && questions.aptitude.map((q, idx) => (
            <div key={idx} className={`answer-item ${isAnswerCorrect(q, aptitudeAnswers[idx]) ? 'correct' : 'incorrect'}`}>
              <div className="question-header">
                <span className="question-number">Question {idx + 1}</span>
                <span className={`status-badge ${isAnswerCorrect(q, aptitudeAnswers[idx]) ? 'correct' : 'incorrect'}`}>
                  {isAnswerCorrect(q, aptitudeAnswers[idx]) ? 'Correct' : 'Incorrect'}
                </span>
              </div>
              <p className="question-text">{q.question}</p>
              <div className="options-list">
                {q.options.map((option, optIdx) => (
                  <div
                    key={optIdx}
                    className={`option-item ${
                      aptitudeAnswers[idx]?.includes(optIdx) ? 'selected' : ''
                    } ${
                      (Array.isArray(q.answer) ?
                        q.answer.includes(option) :
                        option === q.answer) ? 'correct' : ''
                    }`}
                  >
                    <span className="option-marker">
                      {aptitudeAnswers[idx]?.includes(optIdx) ? '✓' : ''}
                    </span>
                    {option}
                    {(Array.isArray(q.answer) ?
                      q.answer.includes(option) :
                      option === q.answer) &&
                      <span className="correct-marker">★</span>}
                  </div>
                ))}
              </div>
              {q.explanation && (
                <div className="explanation">
                  <strong>Explanation:</strong>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="answer-section">
          <h4>Coding Questions</h4>
          {questions.coding && Array.isArray(questions.coding) && questions.coding.map((q, idx) => (
            <div key={idx} className={`answer-item ${isAnswerCorrect(q, codingAnswers[idx]) ? 'correct' : 'incorrect'}`}>
              <div className="question-header">
                <span className="question-number">Question {idx + 1}</span>
                <span className={`status-badge ${isAnswerCorrect(q, codingAnswers[idx]) ? 'correct' : 'incorrect'}`}>
                  {isAnswerCorrect(q, codingAnswers[idx]) ? 'Correct' : 'Incorrect'}
                </span>
              </div>
              <p className="question-text">{q.title}</p>
              <p className="question-description">{q.description}</p>
              <div className="options-list">
                {q.options.map((option, optIdx) => (
                  <div
                    key={optIdx}
                    className={`option-item ${
                      codingAnswers[idx]?.includes(optIdx) ? 'selected' : ''
                    } ${
                      (Array.isArray(q.answer) ?
                        q.answer.includes(option) :
                        option === q.answer) ? 'correct' : ''
                    }`}
                  >
                    <span className="option-marker">
                      {codingAnswers[idx]?.includes(optIdx) ? '✓' : ''}
                    </span>
                    {option}
                    {(Array.isArray(q.answer) ?
                      q.answer.includes(option) :
                      option === q.answer) &&
                      <span className="correct-marker">★</span>}
                  </div>
                ))}
              </div>
              {q.explanation && (
                <div className="explanation">
                  <strong>Explanation:</strong>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const min = String(Math.floor(timer / 60)).padStart(2, '0');
  const sec = String(timer % 60).padStart(2, '0');

  return (
    <div className="test-page">
      <div className="test-header">
        <div className="test-info">
          <div className="test-header-left">
            <h2>{company.name} - {type === 'tech' ? 'Tech' : 'Non-Tech'} Test</h2>
            <div className="test-info">
              <span>Total Questions: {totalQuestions}</span>
            </div>
          </div>
          <div className="test-header-right">
            <button className="submit-btn" onClick={handleSubmit}>
              Submit Test
            </button>
          </div>
        </div>
      </div>

      <div className="test-content">
        <div className="test-sidebar">
          <div className="question-nav">
            {type === 'tech' ? (
              <>
                <div className="nav-section">
                  <h3>Aptitude</h3>
                  {questions.aptitude.map((_, idx) => (
                    <button
                      key={`apt-${idx}`}
                      className={`nav-btn ${getQuestionStatus(idx)} ${currentQuestion === idx ? 'current' : ''}`}
                      onClick={() => setCurrentQuestion(idx)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <div className="nav-section">
                  <h3>Coding</h3>
                  {questions.coding.map((_, idx) => (
                    <button
                      key={`code-${idx}`}
                      className={`nav-btn ${getQuestionStatus(idx + questions.aptitude.length)} ${currentQuestion === idx + questions.aptitude.length ? 'current' : ''}`}
                      onClick={() => setCurrentQuestion(idx + questions.aptitude.length)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="nav-section">
                <h3>Questions</h3>
                {[...questions.interview, ...questions.hr].map((_, idx) => (
                  <button
                    key={`nontech-${idx}`}
                    className={`nav-btn ${getQuestionStatus(idx)} ${currentQuestion === idx ? 'current' : ''}`}
                    onClick={() => setCurrentQuestion(idx)}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="test-main">
          {type === 'tech' ? (
            currentQuestion < questions.aptitude.length ? (
              renderAptitudeQuestion(questions.aptitude[currentQuestion])
            ) : (
              renderCodingQuestion(questions.coding[currentQuestion - questions.aptitude.length])
            )
          ) : (
            <div className="question-container">
              <div className="question-header">
                <h3>Question {currentQuestion + 1}</h3>
                <span className="question-type">
                  {currentQuestion < questions.interview.length ? 'Technical Interview' : 'HR Interview'}
                </span>
              </div>
              <div className="question-content">
                <p className="question-text">
                  {currentQuestion < questions.interview.length
                    ? questions.interview[currentQuestion].question
                    : questions.hr[currentQuestion - questions.interview.length].question}
                </p>
                <textarea
                  value={nonTechAnswers[currentQuestion]}
                  onChange={(e) => handleNonTechChange(currentQuestion, e.target.value)}
                  className="answer-input"
                  placeholder="Type your answer here..."
                  rows={6}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {showTimeWarning && (
        <div className="time-warning">
          <p>⚠️ Only 5 minutes remaining! Please complete your test.</p>
          <button onClick={() => setShowTimeWarning(false)}>Dismiss</button>
        </div>
      )}

      {showSubmitConfirm && (
        <div className="submit-confirm">
          <h3>Confirm Submission</h3>
          <p>Are you sure you want to submit your test? This action cannot be undone.</p>
          <div className="confirm-actions">
            <button onClick={() => setShowSubmitConfirm(false)}>Cancel</button>
            <button onClick={handleSubmit} className="primary">Submit</button>
          </div>
        </div>
      )}

      {showAllAnswers && renderAnswerReview()}

      {!showAllAnswers && (
        <div style={{textAlign: 'center', marginTop: '2rem'}}>
          <button className="show-answers-btn" onClick={() => setShowAllAnswers(true)}>
            Show All Answers
          </button>
        </div>
      )}
    </div>
  );
};

export default TestPage;
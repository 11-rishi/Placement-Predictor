import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './TestResults.css';

const TestResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { type, questions, answers, answerKey, codingOutputs } = location.state || {};

  const [showAnswers, setShowAnswers] = useState(false);

  if (!location.state) {
    return (
      <div className="results-error">
        <h2>No Results Found</h2>
        <p>Please complete a test to view results.</p>
        <button onClick={() => navigate('/companies')}>Go to Companies</button>
      </div>
    );
  }

  const renderAptitudeResults = () => {
    return questions.aptitude.map((q, idx) => (
      <div key={idx} className="result-card">
        <div className="question-header">
          <h3>Question {idx + 1}</h3>
          <span className={`status ${answers.aptitude[idx]?.includes(q.options.indexOf(q.answer)) ? 'correct' : 'incorrect'}`}>
            {answers.aptitude[idx]?.includes(q.options.indexOf(q.answer)) ? '✓' : '✗'}
          </span>
        </div>
        <p className="question-text">{q.question}</p>
        <div className="options-list">
          {q.options.map((opt, optIdx) => (
            <div
              key={optIdx}
              className={`option ${
                optIdx === q.options.indexOf(q.answer)
                  ? 'correct-answer'
                  : answers.aptitude[idx]?.includes(optIdx)
                  ? 'selected-incorrect'
                  : ''
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
        {showAnswers && (
          <div className="explanation">
            <h4>Explanation:</h4>
            <p>{q.explanation}</p>
          </div>
        )}
      </div>
    ));
  };

  const renderCodingResults = () => {
    return questions.coding.map((q, idx) => (
      <div key={idx} className="result-card">
        <div className="question-header">
          <h3>Question {idx + 1}</h3>
          <span className={`status ${codingOutputs[idx]?.success ? 'correct' : 'incorrect'}`}>
            {codingOutputs[idx]?.success ? '✓' : '✗'}
          </span>
        </div>
        <p className="question-text">{q.question}</p>
        <div className="code-section">
          <h4>Your Solution:</h4>
          <pre className="code-block">{answers.coding[idx]}</pre>
          {codingOutputs[idx] && (
            <div className={`output ${codingOutputs[idx].success ? 'success' : 'error'}`}>
              <h4>Test Results:</h4>
              {codingOutputs[idx].success ? (
                <p>✅ All test cases passed!</p>
              ) : (
                <>
                  <p>❌ Test failed</p>
                  <p>Expected: {codingOutputs[idx].expected}</p>
                  <p>Got: {codingOutputs[idx].output}</p>
                </>
              )}
            </div>
          )}
        </div>
        {showAnswers && (
          <div className="solution-section">
            <h4>Model Solution:</h4>
            <pre className="code-block">{q.solution[answers.codingLangs[idx]]}</pre>
            <div className="explanation">
              <h4>Explanation:</h4>
              <p>{q.explanation}</p>
            </div>
          </div>
        )}
      </div>
    ));
  };

  const renderNonTechResults = () => {
    return questions.map((q, idx) => (
      <div key={idx} className="result-card">
        <div className="question-header">
          <h3>Question {idx + 1}</h3>
        </div>
        <p className="question-text">{q.question}</p>
        <div className="answer-section">
          <h4>Your Answer:</h4>
          <p className="user-answer">{answers[idx]}</p>
        </div>
        {showAnswers && (
          <div className="expected-points">
            <h4>Expected Points to Cover:</h4>
            <ul>
              {q.expectedPoints.map((point, pointIdx) => (
                <li key={pointIdx}>{point}</li>
              ))}
            </ul>
            <div className="sample-answer">
              <h4>Sample Answer:</h4>
              <p>{q.sampleAnswer}</p>
            </div>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Test Results</h2>
        <div className="results-actions">
          <button
            className={`toggle-answers-btn ${showAnswers ? 'active' : ''}`}
            onClick={() => setShowAnswers(!showAnswers)}
          >
            {showAnswers ? 'Hide Answers' : 'Show Answers'}
          </button>
          <button className="back-btn" onClick={() => navigate('/companies')}>
            Back to Companies
          </button>
        </div>
      </div>

      <div className="results-content">
        {type === 'tech' ? (
          <>
            <section className="results-section">
              <h3>Aptitude Questions</h3>
              {renderAptitudeResults()}
            </section>
            <section className="results-section">
              <h3>Coding Questions</h3>
              {renderCodingResults()}
            </section>
          </>
        ) : (
          <section className="results-section">
            <h3>Interview Questions</h3>
            {renderNonTechResults()}
          </section>
        )}
      </div>
    </div>
  );
};

export default TestResults; 
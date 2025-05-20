import React, { useState } from "react";
import { companiesData } from "../services/companiesData";
import "./CompanyModal.css";

const CompanyModal = ({ isOpen, onClose, atsScore }) => {
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [attempting, setAttempting] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [sectionScore, setSectionScore] = useState(0);
  const [finalScore, setFinalScore] = useState(null);
  const [placement, setPlacement] = useState("");

  if (!isOpen) return null;

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setStep(1);
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setStep(2);
  };

  const handleBack = () => {
    if (step === 4) {
      setStep(2);
      setAttempting(false);
      setUserAnswers([]);
      setCurrentQ(0);
      setSectionScore(0);
      setFinalScore(null);
      setPlacement("");
    } else if (step === 3) {
      setStep(2);
      setAttempting(false);
      setUserAnswers([]);
      setCurrentQ(0);
      setSectionScore(0);
    } else if (step === 2) {
      setStep(1);
      setSelectedCompany(null);
    } else if (step === 1) {
      setStep(0);
      setSelectedType(null);
    }
  };

  // Filter companies by type
  const filteredCompanies = companiesData.filter(
    (c) => c.type === selectedType
  );

  // Get all questions for attempt
  let allQuestions = [];
  if (selectedCompany && selectedType === "tech") {
    allQuestions = [
      ...selectedCompany.aptitude.map(q => ({ ...q, section: "Aptitude" })),
      ...selectedCompany.coding.map(q => ({ ...q, section: "Coding" }))
    ];
  } else if (selectedCompany && selectedType === "non-tech") {
    allQuestions = [
      ...selectedCompany.interview.map(q => ({ ...q, section: "Interview" })),
      ...selectedCompany.hr.map(q => ({ ...q, section: "HR" }))
    ];
  }

  // Handle answer input
  const handleAnswerChange = (e) => {
    const updated = [...userAnswers];
    updated[currentQ] = e.target.value;
    setUserAnswers(updated);
  };

  // Scoring logic
  const scoreAnswer = (q, userAns) => {
    if (selectedType === "tech") {
      // Exact or keyword match for aptitude/coding
      if (!userAns) return 0;
      const correct = q.answer.toLowerCase();
      const ans = userAns.toLowerCase();
      if (ans === correct) return 1;
      if (ans.includes(correct) || correct.includes(ans)) return 1;
      // Allow partial match for keywords
      const correctWords = correct.split(/\W+/);
      let matchCount = 0;
      correctWords.forEach(word => {
        if (word.length > 2 && ans.includes(word)) matchCount++;
      });
      return matchCount / correctWords.length > 0.6 ? 1 : 0;
    } else {
      // Keyword scoring for interview/hr
      if (!userAns) return 0;
      const ans = userAns.toLowerCase();
      const keywords = q.keywords || [];
      let found = 0;
      keywords.forEach(kw => {
        if (ans.includes(kw.toLowerCase())) found++;
      });
      return found / keywords.length;
    }
  };

  // Handle next question or finish
  const handleNext = () => {
    if (currentQ < allQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Score all answers
      let score = 0;
      allQuestions.forEach((q, i) => {
        score += scoreAnswer(q, userAnswers[i] || "");
      });
      const percent = Math.round((score / allQuestions.length) * 100);
      setSectionScore(percent);
      // Placement prediction
      let placementScore = atsScore
        ? Math.round(0.5 * atsScore + 0.5 * percent)
        : percent;
      setFinalScore(placementScore);
      let placementLabel = "Low";
      if (placementScore >= 80) placementLabel = "High";
      else if (placementScore >= 60) placementLabel = "Medium";
      setPlacement(placementLabel);
      setStep(4);
    }
  };

  // Start attempt
  const startAttempt = () => {
    setAttempting(true);
    setStep(3);
    setUserAnswers([]);
    setCurrentQ(0);
    setSectionScore(0);
    setFinalScore(null);
    setPlacement("");
  };

  return (
    <div className="company-modal-overlay">
      <div className="company-modal-card">
        <button className="close-btn" onClick={onClose}>&times;</button>
        {step === 0 && (
          <div className="modal-step">
            <h2>Select Job Type</h2>
            <div className="type-btns">
              <button className="type-btn tech" onClick={() => handleTypeSelect("tech")}>Tech</button>
              <button className="type-btn nontech" onClick={() => handleTypeSelect("non-tech")}>Non-Tech</button>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="modal-step">
            <h2>Select a Company</h2>
            <div className="company-list">
              {filteredCompanies.map((company) => (
                <button
                  key={company.name}
                  className="company-btn"
                  onClick={() => handleCompanySelect(company)}
                >
                  {company.name}
                </button>
              ))}
            </div>
            <button className="back-btn" onClick={handleBack}>Back</button>
          </div>
        )}
        {step === 2 && selectedCompany && (
          <div className="modal-step">
            <h2>{selectedCompany.name} - {selectedType === "tech" ? "Tech" : "Non-Tech"} Questions</h2>
            {selectedType === "tech" ? (
              <>
                <h3>Aptitude Questions</h3>
                <ul className="question-list">
                  {selectedCompany.aptitude.map((q, i) => (
                    <li key={i}>{q.question}</li>
                  ))}
                </ul>
                <h3>Coding Questions</h3>
                <ul className="question-list">
                  {selectedCompany.coding.map((q, i) => (
                    <li key={i}>{q.question}</li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <h3>Interview Questions</h3>
                <ul className="question-list">
                  {selectedCompany.interview.map((q, i) => (
                    <li key={i}>{q.question}</li>
                  ))}
                </ul>
                <h3>HR Questions</h3>
                <ul className="question-list">
                  {selectedCompany.hr.map((q, i) => (
                    <li key={i}>{q.question}</li>
                  ))}
                </ul>
              </>
            )}
            <button className="type-btn" style={{marginTop: '1.2rem'}} onClick={startAttempt}>Attempt Questions</button>
            <button className="back-btn" onClick={handleBack}>Back</button>
          </div>
        )}
        {step === 3 && (
          <div className="modal-step">
            <h2>Attempt Questions ({currentQ + 1} / {allQuestions.length})</h2>
            <div className="question-attempt">
              <div className="question-label">{allQuestions[currentQ].section}:</div>
              <div className="question-text" style={{color: '#1e293b'}}>{allQuestions[currentQ].question}</div>
              <textarea
                className="answer-input"
                value={userAnswers[currentQ] || ""}
                onChange={handleAnswerChange}
                rows={selectedType === "tech" ? 2 : 3}
                placeholder="Type your answer here..."
                autoFocus
              />
              <button className="type-btn" style={{marginTop: '1.2rem'}} onClick={handleNext}>
                {currentQ === allQuestions.length - 1 ? "Finish & Predict" : "Next"}
              </button>
              <button className="back-btn" onClick={handleBack}>Cancel</button>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="modal-step">
            <h2>Results & Placement Prediction</h2>
            <div className="score-summary">
              <div>Section Score: <b>{sectionScore}%</b></div>
              {atsScore && <div>ATS Score: <b>{atsScore}</b></div>}
              <div style={{marginTop: '0.7rem'}}>Placement Prediction: <span className={`placement-label placement-${placement.toLowerCase()}`}>{placement}</span></div>
              <div style={{marginTop: '0.7rem'}}>Final Score: <b>{finalScore}</b></div>
            </div>
            <h3 style={{marginTop: '1.2rem'}}>Your Answers:</h3>
            <ul className="question-list">
              {allQuestions.map((q, i) => (
                <li key={i}>
                  <div><b>{q.section}:</b> {q.question}</div>
                  <div style={{color:'#3b82f6'}}>Your answer: {userAnswers[i] || <i>Not answered</i>}</div>
                  <div style={{color:'#10b981'}}>Correct/Keywords: {selectedType === 'tech' ? q.answer : (q.keywords && q.keywords.join(', '))}</div>
                </li>
              ))}
            </ul>
            <button className="back-btn" onClick={handleBack}>Back</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyModal;
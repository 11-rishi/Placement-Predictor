import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "./Dashboard.css";

const API_ENDPOINTS = {
  UPLOAD: "http://localhost:5000/api/upload",
  SAVE_SCORE: "http://localhost:5000/api/ats-score/save"
};

const FILE_TYPES = {
  PDF: "application/pdf"
};

const SCORE_THRESHOLDS = {
  HIGH: 70,
  MEDIUM: 50
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, atsScore, setAtsScore } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputKey] = useState(Date.now());

 

  const getScoreCategory = (score) => {
    if (score >= SCORE_THRESHOLDS.HIGH) return "high";
    if (score >= SCORE_THRESHOLDS.MEDIUM) return "medium";
    return "low";
  };

 

  const handleFileChange = useCallback(async (event) => {
    let uploadedFile;

    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      uploadedFile = event.dataTransfer.files[0];
    }
    else if (event.target && event.target.files && event.target.files.length > 0) {
      uploadedFile = event.target.files[0];
    }

    if (!uploadedFile) {
      setError("Please select a file");
      return;
    }

    if (uploadedFile.type !== FILE_TYPES.PDF) {
      setError("Please upload a valid PDF file");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", uploadedFile);

      const uploadResponse = await fetch(API_ENDPOINTS.UPLOAD, {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!uploadResponse.ok) {
        throw new Error(uploadResponse.statusText || "Error processing file");
      }

      const data = await uploadResponse.json();
      console.log("Upload response:", data); // Debug log

      const score = data.atsScore || data.score;
      if (score === undefined || isNaN(score)) {
        throw new Error("Invalid score received from server");
      }

      setAtsScore(score);

      if (user?.id) {
        const scoreCategory = getScoreCategory(score);
        console.log("Saving score:", { 
          score: score,
          category: scoreCategory,
          fileName: uploadedFile.name
        });

        const saveScoreResponse = await fetch(API_ENDPOINTS.SAVE_SCORE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            score: score,
            fileName: uploadedFile.name,
            fileType: uploadedFile.type,
            scoreCategory: scoreCategory,
            recommendations: data.recommendations || [],
            keywords: data.keywords || [],
            missingKeywords: data.missingKeywords || []
          }),
        });

        const saveScoreData = await saveScoreResponse.json();
        console.log("Save score response:", saveScoreData); 

        if (!saveScoreResponse.ok) {
          throw new Error(saveScoreData.message || "Failed to save ATS score");
        }
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setError(error.message || "Failed to process your resume");
    } finally {
      setIsLoading(false);
    }
  }, [user, setAtsScore]);


  useEffect(() => {
    return () => {
    };
  }, []);

  if (!user) {
    return (
      <div className="auth-required">
        <Navbar />
        <div className="auth-required-card">
          <div className="auth-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h2>Authentication Required</h2>
          <p>Please log in to access your dashboard</p>
          <button className="primary-button" onClick={() => navigate("/login")}>
            Go to Login
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-premium-container">
        <div className="dashboard-premium-header">
          <h1>Welcome back, <span className="highlight">{user.username}</span></h1>
          <p>Optimize your resume for Applicant Tracking Systems</p>
        </div>

        <div className="dashboard-premium-content">
          <div className="main-card">
            <div className="premium-card">
              {atsScore === null ? (
                <UploadSection
                  isLoading={isLoading}
                  error={error}
                  inputKey={inputKey}
                  handleFileChange={handleFileChange}
                />
              ) : (
                <ResultsSection
                  atsScore={atsScore}
                />
              )}
            </div>
          </div>

          <div className="sidebar">
            <TipsCard />
            <PremiumFeaturesCard />
          </div>
        </div>
      </div>
    </div>
  );
};

const UploadSection = ({ isLoading, error, inputKey, handleFileChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef();

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const dropEvent = {
      dataTransfer: e.dataTransfer,
      preventDefault: () => {},
      stopPropagation: () => {}
    };

    handleFileChange(dropEvent);
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="glass-card">
      <h2 className="upload-title">Upload Your Resume</h2>
      <p className="upload-subtitle">Get your resume analyzed by our ATS scoring system</p>

      <div
        className={`upload-drop${isDragging ? ' drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          key={inputKey}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden-file-input"
          ref={fileInputRef}
        />
        <div className="upload-drop-content">
          <span className="upload-drop-icon">
            <i className="fas fa-cloud-upload-alt"></i>
          </span>
          <div className="upload-drop-text">
            <span>Drag & drop your PDF here</span>
            <span>or <span className="upload-browse" onClick={handleBrowseClick}>browse</span></span>
          </div>
        </div>
      </div>

      <button
        className="upload-resume-btn"
        onClick={handleBrowseClick}
        disabled={isLoading}
      >
        Upload Resume
      </button>

      {isLoading && (
        <div className="loading-indicator">
          <div className="loader"></div>
          <p className="loading-text">Analyzing your resume...</p>
          <p className="loading-subtext">This may take a few moments</p>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

const ErrorMessage = ({ error }) => (
  <div className="error-message">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
    <span>{error}</span>
  </div>
);

const ResultsSection = ({ atsScore }) => {
  const navigate = useNavigate();
  const { resetAnalysis } = useAuth();

  return (
    <div className="horizontal-results-card animate-fadein">
      <div className="results-left">
        <div className="score-ring-horizontal">
          <ScoreDisplay atsScore={atsScore} />
        </div>
      </div>
      <div className="results-right">
        <span className={
          atsScore >= SCORE_THRESHOLDS.HIGH ? "interpretation-badge animate-bounce" :
          atsScore >= SCORE_THRESHOLDS.MEDIUM ? "interpretation-badge medium animate-bounce" :
          "interpretation-badge low animate-bounce"
        }>
          {atsScore >= SCORE_THRESHOLDS.HIGH ? "Excellent" : atsScore >= SCORE_THRESHOLDS.MEDIUM ? "Good" : "Needs Improvement"}
        </span>
        <div className="summary-text animate-fadein">
          {atsScore >= SCORE_THRESHOLDS.HIGH ? "Your resume is ready for top jobs!" :
            atsScore >= SCORE_THRESHOLDS.MEDIUM ? "Almost there—just a few tweaks needed." :
            "Let's boost your resume for better results!"}
        </div>
        <RecommendationsSection atsScore={atsScore} />

        <div className="results-buttons">
          <button
            className="analyze-another-btn animate-fadein"
            onClick={() => resetAnalysis()}
          >
            Analyze Another
          </button>

          <button
            className="predict-btn animate-fadein"
            onClick={() => navigate('/companies')}
          >
            Predict Placement
          </button>
        </div>
      </div>
    </div>
  );
};

const ScoreDisplay = ({ atsScore }) => {
  const radius = 70;
  const stroke = 12;
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
        <span className="score-value-horizontal">{atsScore}</span>
      </div>
    </div>
  );
};

const InterpretationSection = ({ atsScore }) => {
  let badgeClass = "interpretation-badge";
  let badgeText = "Excellent ATS Score";
  let interpText = "Your resume is well-optimized for ATS systems.";
  if (atsScore >= SCORE_THRESHOLDS.HIGH) {
    badgeClass += "";
    badgeText = "Excellent ATS Score";
    interpText = "Your resume is well-optimized for ATS systems.";
  } else if (atsScore >= SCORE_THRESHOLDS.MEDIUM) {
    badgeClass += " medium";
    badgeText = "Good ATS Score";
    interpText = "Your resume should pass most ATS systems but could be improved.";
  } else {
    badgeClass += " low";
    badgeText = "Needs Improvement";
    interpText = "Your resume may struggle with ATS systems.";
  }
  return (
    <div className="interpretation-container">
      <span className={badgeClass}>{badgeText}</span>
      <p>{interpText}</p>
      <RecommendationsSection atsScore={atsScore} />
    </div>
  );
};

const RecommendationsSection = ({ atsScore }) => (
  <div className="recommendations">
    <h4>Recommendations:</h4>
    <ul className="recommendations-list">
      {atsScore < SCORE_THRESHOLDS.HIGH && (
        <>
          <RecommendationItem text="Use more industry-specific keywords" />
          <RecommendationItem text="Improve formatting and structure" />
        </>
      )}
      {atsScore < SCORE_THRESHOLDS.MEDIUM && (
        <>
          <RecommendationItem text="Remove complex graphics or tables" />
          <RecommendationItem text="Use a simpler, more standard layout" />
        </>
      )}
      {atsScore >= SCORE_THRESHOLDS.HIGH && (
        <RecommendationItem text="Continue to tailor your resume for specific job applications" />
      )}
    </ul>
  </div>
);

const RecommendationItem = ({ text }) => (
  <li className="modern-recommendation">
    <span className="modern-check">✔</span>
    <span>{text}</span>
  </li>
);

const TipsCard = () => (
  <div className="premium-card tips-card">
    <h3>Resume Tips</h3>
    <ul className="tips-list">
      <TipItem text="Use standard fonts like Arial or Calibri" />
      <TipItem text="Include keywords from the job description" />
      <TipItem text="Avoid using headers/footers" />
      <TipItem text="Save as a simple PDF format" />
    </ul>
  </div>
);

const TipItem = ({ text }) => (
  <li>
    <div className="tip-bullet"></div>
    <span>{text}</span>
  </li>
);

const PremiumFeaturesCard = () => (
  <div className="premium-card upgrade-card">
    <h3>Premium Features</h3>
    <ul className="premium-features-list">
      <PremiumFeatureItem text="Job-specific keyword suggestions" />
      <PremiumFeatureItem text="Interview preparation tools" />
      <PremiumFeatureItem text="Expert resume review" />
    </ul>
    <button className="upgrade-button">
      Upgrade to Premium
    </button>
  </div>
);

const PremiumFeatureItem = ({ text }) => (
  <li>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>{text}</span>
  </li>
);

// ScoreHistorySection removed as it's no longer needed

// Prop type validation
UploadSection.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  inputKey: PropTypes.number.isRequired,
  handleFileChange: PropTypes.func.isRequired
};

ResultsSection.propTypes = {
  file: PropTypes.object,
  atsScore: PropTypes.number.isRequired
};

ErrorMessage.propTypes = {
  error: PropTypes.string.isRequired
};

ScoreDisplay.propTypes = {
  atsScore: PropTypes.number.isRequired
};

InterpretationSection.propTypes = {
  atsScore: PropTypes.number.isRequired
};

RecommendationsSection.propTypes = {
  atsScore: PropTypes.number.isRequired
};

RecommendationItem.propTypes = {
  text: PropTypes.string.isRequired
};

TipItem.propTypes = {
  text: PropTypes.string.isRequired
};

PremiumFeatureItem.propTypes = {
  text: PropTypes.string.isRequired
};

export default Dashboard;
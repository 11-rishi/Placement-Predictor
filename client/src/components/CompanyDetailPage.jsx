import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { companiesData } from "../services/companiesData";
import { getCompanyQuestions, getTestHistory } from "../services/testHistory";
import "./CompanyDetailPage.css";

const CompanyDetailPage = () => {
  const { companyName } = useParams();
  const navigate = useNavigate();
  const company = companiesData.find(c => c.name === decodeURIComponent(companyName));
  const [selectedType, setSelectedType] = useState(company.type);
  const [testHistory, setTestHistory] = useState(null);

  useEffect(() => {
    if (company) {
      const allHistory = getTestHistory();
      const filtered = allHistory
        .filter(h => h.companyName === company.name && h.type === selectedType)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setTestHistory(filtered.length > 0 ? filtered[0] : null);
    }
  }, [company, selectedType]);

  if (!company) return <div className="company-detail-bg"><div className="company-detail-container"><h2>Company not found.</h2></div></div>;

  const hasBothTypes = companiesData.filter(c => c.name === company.name && c.type !== company.type).length > 0;

  const handleStartTest = () => {
    const questions = getCompanyQuestions(company.name, company.type);
    navigate(`/companies/${encodeURIComponent(company.name)}/test/${company.type}`, {
      state: { questions }
    });
  };

  return (
    <div className="company-detail-bg">
      <div className="company-detail-container">
        <h1 className="company-detail-title">{company.name}</h1>
        <div className="company-detail-type">
          <span className={`company-type-badge ${company.type}`}>{company.type === 'tech' ? 'Tech' : 'Non-Tech'}</span>
        </div>
        {hasBothTypes && (
          <div className="type-select-row">
            <button
              className={`type-select-btn ${selectedType === 'tech' ? 'active' : ''}`}
              onClick={() => setSelectedType('tech')}
            >Tech</button>
            <button
              className={`type-select-btn ${selectedType === 'non-tech' ? 'active' : ''}`}
              onClick={() => setSelectedType('non-tech')}
            >Non-Tech</button>
          </div>
        )}
        {testHistory && (
          <div className="test-history">
            <h3>Previous Test Results</h3>
            <p>
              Last Score: <b>{testHistory.score}</b><br />
              Last taken: {new Date(testHistory.date).toLocaleDateString()}
            </p>
            <button 
              className="view-history-btn"
              onClick={() => navigate(`/companies/${encodeURIComponent(company.name)}/history/${selectedType}`)}
            >
              View History
            </button>
          </div>
        )}
        <div className="company-detail-actions">
          {selectedType === 'tech' ? (
            <>
              <button
                className="start-test-btn"
                onClick={() => {
                  const questions = getCompanyQuestions(company.name, 'tech');
                  navigate(`/companies/${encodeURIComponent(company.name)}/test/tech`, { state: { questions } });
                }}
              >
                {testHistory ? 'Take Aptitude Test Again' : 'Start Aptitude Test'}
              </button>
              <button
                className="start-test-btn"
                style={{ marginLeft: '1rem' }}
                onClick={() => {
                  const questions = getCompanyQuestions(company.name, 'tech');
                  navigate(`/companies/${encodeURIComponent(company.name)}/test/tech`, { state: { questions, section: 'coding' } });
                }}
              >
                {testHistory ? 'Take Coding Test Again' : 'Start Coding Test'}
              </button>
            </>
          ) : (
            <button
              className="start-test-btn"
              onClick={handleStartTest}
            >
              {testHistory ? 'Take Test Again' : 'Start Test'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage; 
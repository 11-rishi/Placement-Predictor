import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { companiesData } from "../services/companiesData";
import "./CompaniesPage.css";
import { FaBuilding } from 'react-icons/fa';

const CompaniesPage = () => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("tech");
  const navigate = useNavigate();

  const filtered = companiesData.filter(c =>
    c.type === tab && c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="companies-page-bg">
      <div className="companies-page-container">
        <h1 className="companies-title">Select a Company</h1>
        <div className="company-tabs">
          <button
            className={`company-tab-btn${tab === 'tech' ? ' active' : ''}`}
            onClick={() => setTab('tech')}
          >
            Tech Companies
          </button>
          <button
            className={`company-tab-btn${tab === 'non-tech' ? ' active' : ''}`}
            onClick={() => setTab('non-tech')}
          >
            Non-Tech Companies
          </button>
        </div>
        <input
          className="company-search"
          type="text"
          placeholder={`Search ${tab === 'tech' ? 'tech' : 'non-tech'} companies...`}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="companies-list">
          {filtered.map(company => (
            <div
              className="company-card"
              key={company.name}
            >
              <div className="company-logo">
                <FaBuilding size={38} />
              </div>
              <div className="company-card-name">{company.name}</div>
              <div className={`company-card-type ${company.type}`}>{company.type === 'tech' ? 'Tech' : 'Non-Tech'}</div>
              <button
                className="take-test-btn"
                onClick={() => navigate(`/companies/${encodeURIComponent(company.name)}`)}
              >
                Take Test
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage; 
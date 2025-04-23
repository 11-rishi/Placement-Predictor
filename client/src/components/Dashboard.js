import React, { useState } from 'react';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

// Dummy function to simulate model scoring
const getATSScore = (file) => {
  // Simulate a model API call or logic to extract and calculate ATS score from the uploaded file
  return Math.floor(Math.random() * 100); // Return a random ATS score for now
};

const Dashboard = () => {
  const { user } = useAuth();
  const [atsScore, setAtsScore] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileChange = async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile);
  
      const formData = new FormData();
      formData.append("file", uploadedFile);
  
      try {
        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setAtsScore(data.score);
        } else {
          alert(data.error || "Error processing file.");
        }
      } catch (error) {
        console.error("Upload failed", error);
        alert("Upload failed.");
      }
    } else {
      alert("Please upload a valid PDF file.");
    }
  };
  

  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="not-authorized">
          <h2>Please login to access your dashboard.</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Welcome back, {user.username}!</h2>
          <p>Continue your placement journey</p>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Upload Your Resume for ATS Score</h3>
            <div className="upload-section">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload" className="upload-btn">
                Upload PDF
              </label>
              <p className="upload-hint">Upload your latest resume to get an ATS score</p>

              {atsScore !== null && (
                <div className="ats-score">
                  <h4>Your ATS Score: {atsScore}</h4>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

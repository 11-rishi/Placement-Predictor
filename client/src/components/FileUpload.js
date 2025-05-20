import React, { useState, useRef } from "react";
import "./FileUpload.css";
import { FaCloudUploadAlt } from "react-icons/fa";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [atsScore, setAtsScore] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (file) => {
    const allowedTypes = ["application/pdf"];
    if (file && allowedTypes.includes(file.type)) {
      setFile(file);
      setError("");
      setAtsScore(null);
      setRecommendations([]);
    } else {
      setError("Please upload a PDF document");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    setError("");
    setAtsScore(null);
    setRecommendations([]);
    const formData = new FormData();
    formData.append("resume", file);
    try {
      const response = await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok && data.score !== undefined) {
        setAtsScore(data.score);
        setRecommendations(data.recommendations || []);
      } else {
        setError(data.error || "Failed to analyze resume");
      }
    } catch (error) {
      setError("Server connection error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setAtsScore(null);
    setRecommendations([]);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="file-upload-main-card">
      {!atsScore && (
        <div
          className={`drop-zone-modern ${isDragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-icon-modern">
            <FaCloudUploadAlt size={56} />
          </div>
          <p className="upload-instruction">Drag & drop your resume here, or</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept=".pdf"
            style={{ display: "none" }}
          />
          <button
            className="main-upload-btn"
            onClick={() => fileInputRef.current.click()}
            disabled={isLoading}
          >
            {file ? "Change File" : "Upload Resume"}
          </button>
          {file && (
            <div className="file-info-modern">
              <span>{file.name}</span>
              <button
                className="main-upload-btn analyze"
                onClick={handleUpload}
                disabled={isLoading}
              >
                {isLoading ? "Analyzing..." : "Analyze"}
              </button>
            </div>
          )}
          {error && <div className="upload-status error">{error}</div>}
          {isLoading && <div className="modern-spinner"></div>}
        </div>
      )}
      {atsScore !== null && !isLoading && (
        <div className="ats-result-modern">
          <div className="ats-score-circle">
            <span className="score-value">{atsScore}</span>
            <span className="score-label">ATS Score</span>
          </div>
          <div className="ats-recommendations">
            <h3>Recommendations</h3>
            <ul>
              {recommendations.length > 0 ? (
                recommendations.map((rec, idx) => <li key={idx}>{rec}</li>)
              ) : (
                <li>No recommendations available.</li>
              )}
            </ul>
            <button className="main-upload-btn" onClick={resetUpload}>
              Re-upload Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

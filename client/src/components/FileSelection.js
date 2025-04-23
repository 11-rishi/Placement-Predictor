// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './FileSelection.css';
// import Navbar from './Navbar';
// import { useAuth } from '../context/AuthContext';

// const FileSelection = () => {
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     setSelectedFiles(files);
//     setError('');
//   };

//   const handleUpload = async () => {
//     if (selectedFiles.length === 0) {
//       setError('Please select at least one file');
//       return;
//     }

//     setUploading(true);
//     setError('');

//     try {
//       const formData = new FormData();
//       selectedFiles.forEach((file) => {
//         formData.append('files', file);
//       });

//       const response = await fetch('/api/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error('Upload failed');
//       }

//       const data = await response.json();
//       console.log('Upload successful:', data);
//       // Navigate to results page or show success message
//     } catch (err) {
//       setError('Failed to upload files. Please try again.');
//       console.error('Upload error:', err);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="file-selection">
//       <Navbar />
//       <div className="file-selection-content">
//         <h1>Upload Your Files</h1>
//         <div className="upload-section">
//           <div className="file-input-container">
//             <input
//               type="file"
//               id="file-upload"
//               multiple
//               onChange={handleFileChange}
//               className="file-input"
//             />
//             <label htmlFor="file-upload" className="file-input-label">
//               Choose Files
//             </label>
//           </div>

//           {selectedFiles.length > 0 && (
//             <div className="selected-files">
//               <h3>Selected Files:</h3>
//               <ul>
//                 {selectedFiles.map((file, index) => (
//                   <li key={index}>{file.name}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {error && <div className="error-message">{error}</div>}

//           <button
//             onClick={handleUpload}
//             disabled={uploading || selectedFiles.length === 0}
//             className="upload-button"
//           >
//             {uploading ? 'Uploading...' : 'Upload Files'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FileSelection;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FileSelection.css";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";

const FileSelection = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [atsResult, setAtsResult] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // Validate that files are PDFs
    const validFiles = files.filter((file) => file.type === "application/pdf");

    if (validFiles.length !== files.length) {
      setError("Only PDF files are accepted for ATS scoring");
    } else {
      setError("");
    }

    setSelectedFiles(validFiles);
    setAtsResult(null); // Reset previous results when new files are selected
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one PDF file");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // Send the first file for ATS scoring
      const formData = new FormData();
      formData.append("resume", selectedFiles[0]);

      const response = await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAtsResult(data);
        console.log("ATS analysis successful:", data);
      } else {
        throw new Error(data.message || "ATS analysis failed");
      }
    } catch (err) {
      setError("Failed to analyze resume. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-selection">
      <Navbar />
      <div className="file-selection-content">
        <h1>Resume ATS Score Analyzer</h1>
        <p className="description">
          Upload your resume in PDF format to receive an ATS compatibility score
          and optimization tips.
        </p>

        <div className="upload-section">
          <div className="file-input-container">
            <input
              type="file"
              id="file-upload"
              accept=".pdf"
              onChange={handleFileChange}
              className="file-input"
            />
            <label htmlFor="file-upload" className="file-input-label">
              Choose Resume (PDF)
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <div className="selected-files">
              <h3>Selected Resume:</h3>
              <ul>
                {selectedFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className="upload-button"
          >
            {uploading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>

        {atsResult && (
          <div className="ats-results-container">
            <h2>ATS Analysis Results</h2>

            <div className="ats-score-summary">
              <div className="score-circle">
                <span className="score-value">{atsResult.score}</span>
                <span className="score-label">out of 100</span>
              </div>

              <div className="score-interpretation">
                {atsResult.score >= 80 ? (
                  <p className="score-excellent">
                    Excellent! Your resume is well-optimized for ATS systems.
                  </p>
                ) : atsResult.score >= 60 ? (
                  <p className="score-good">
                    Good. Your resume should pass most ATS systems, but there's
                    room for improvement.
                  </p>
                ) : (
                  <p className="score-needs-work">
                    Needs improvement. Your resume may struggle with ATS
                    systems.
                  </p>
                )}
              </div>
            </div>

            <div className="score-details">
              <h3>Score Breakdown</h3>
              {atsResult.breakdown.map((item, index) => (
                <div key={index} className="breakdown-item">
                  <div className="breakdown-header">
                    <span className="breakdown-name">{item.name}</span>
                    <span className="breakdown-value">
                      {item.value} ({item.weighted.toFixed(1)} pts)
                    </span>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${(
                          (item.weighted / atsResult.score) *
                          100
                        ).toFixed(2)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {atsResult.skills && atsResult.skills.length > 0 && (
              <div className="detected-skills">
                <h3>Detected Skills</h3>
                <div className="skills-tags">
                  {atsResult.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="recommendations">
              <h3>Improvement Recommendations</h3>
              <ul className="recommendations-list">
                {atsResult.features["Skills Count"] < 5 && (
                  <li>Add more relevant technical skills to your resume</li>
                )}
                {atsResult.features["Experience"] < 2 && (
                  <li>
                    Highlight your work experience more clearly, including years
                    of experience
                  </li>
                )}
                {atsResult.features["Education Level"] < 1 && (
                  <li>Ensure your education details are clearly mentioned</li>
                )}
                {atsResult.features["Certifications Count"] < 1 && (
                  <li>Add relevant certifications to boost your score</li>
                )}
                {atsResult.features["Project Count"] < 3 && (
                  <li>
                    Include more projects to showcase your skills and experience
                  </li>
                )}
                <li>
                  Use keywords that match job descriptions in your target field
                </li>
                <li>
                  Ensure your resume has a clean, simple format that is easy for
                  ATS to parse
                </li>
              </ul>
            </div>

            <button
              className="analyze-another-button"
              onClick={() => {
                setSelectedFiles([]);
                setAtsResult(null);
                document.getElementById("file-upload").value = "";
              }}
            >
              Analyze Another Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileSelection;

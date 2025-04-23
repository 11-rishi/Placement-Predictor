// import React, { useState } from "react";
// import Navbar from "./Navbar";
// import { useAuth } from "../context/AuthContext";

// // Dummy function to simulate model scoring
// const getATSScore = (file) => {
//   // Simulate a model API call or logic to extract and calculate ATS score from the uploaded file
//   return Math.floor(Math.random() * 100); // Return a random ATS score for now
// };

// const Dashboard = () => {
//   const { user } = useAuth();
//   const [atsScore, setAtsScore] = useState(null);
//   const [file, setFile] = useState(null);

//   const handleFileChange = async (event) => {
//     const uploadedFile = event.target.files[0];
//     if (uploadedFile && uploadedFile.type === "application/pdf") {
//       setFile(uploadedFile);

//       const formData = new FormData();
//       formData.append("file", uploadedFile);

//       try {
//         const response = await fetch("http://localhost:5000/api/upload", {
//           method: "POST",
//           body: formData,
//         });

//         const data = await response.json();

//         if (response.ok) {
//           setAtsScore(data.score);
//         } else {
//           alert(data.error || "Error processing file.");
//         }
//       } catch (error) {
//         console.error("Upload failed", error);
//         alert("Upload failed.");
//       }
//     } else {
//       alert("Please upload a valid PDF file.");
//     }
//   };

//   if (!user) {
//     return (
//       <div>
//         <Navbar />
//         <div className="not-authorized">
//           <h2>Please login to access your dashboard.</h2>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Navbar />

//       <div className="dashboard-container">
//         <div className="dashboard-header">
//           <h2>Welcome back, {user.username}!</h2>
//           <p>Continue your placement journey</p>
//         </div>

//         <div className="dashboard-cards">
//           <div className="dashboard-card">
//             <h3>Upload Your Resume for ATS Score</h3>
//             <div className="upload-section">
//               <input
//                 type="file"
//                 accept=".pdf"
//                 onChange={handleFileChange}
//                 style={{ display: "none" }}
//                 id="file-upload"
//               />
//               <label htmlFor="file-upload" className="upload-btn">
//                 Upload PDF
//               </label>
//               <p className="upload-hint">
//                 Upload your latest resume to get an ATS score
//               </p>

//               {atsScore !== null && (
//                 <div className="ats-score">
//                   <h4>Your ATS Score: {atsScore}</h4>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const { atsScore, setAtsScore } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(Date.now());


  const handleFileChange = async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
      setError("");
      setIsLoading(true);
  
      const formData = new FormData();
      formData.append("resume", uploadedFile);
  
      try {
        const response = await fetch("http://localhost:8080/upload", {
          method: "POST",
          body: formData,
        });
  
        const data = await response.json();
  
        if (response.ok && data.score !== undefined) {
          // Set ATS score in context
          setAtsScore(data.score);
  
          // Save ATS score to backend for the logged-in user
          const saveScoreResponse = await fetch("http://localhost:8080/save-ats-score", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.id, // Assuming user object has an ID
              atsScore: data.score,
            }),
          });
  
          if (!saveScoreResponse.ok) {
            throw new Error("Failed to save ATS score");
          }
  
        } else {
          setError(data.error || "Error processing file");
        }
      } catch (error) {
        console.error("Upload failed", error);
        setError("Failed to connect to the server");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Please upload a valid PDF file");
    }
  };
  
  const resetAnalysis = () => {
    setFile(null);
    setAtsScore(null);
    setError("");
    setInputKey(Date.now()); // force re-render of the file input
  };
  

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
        {/* Dashboard Header */}
        <div className="dashboard-premium-header">
          <h1>Welcome back, <span className="highlight">{user.username}</span></h1>
          <p>Optimize your resume for Applicant Tracking Systems</p>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-premium-content">
          {/* Main Card */}
          <div className="main-card">
            <div className="premium-card">
              {atsScore === null ? (
                <div className="upload-container">
                  <div className="section-header">
                    <div className="icon-container">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="12" y1="18" x2="12" y2="12"></line>
                        <line x1="9" y1="15" x2="15" y2="15"></line>
                      </svg>
                    </div>
                    <div>
                      <h2>Resume Analysis</h2>
                      <p>Upload your resume to get an ATS compatibility score</p>
                    </div>
                  </div>

                  <div className="upload-area">
                  <input
  key={inputKey} // 👈 This forces React to re-render the input
  type="file"
  accept=".pdf"
  onChange={handleFileChange}
  id="file-upload"
  className="hidden-file-input"
/>

                    
                    {isLoading ? (
                      <div className="loading-state">
                        <div className="loader"></div>
                        <p className="loading-text">Analyzing your resume...</p>
                        <p className="loading-subtext">This may take a few moments</p>
                      </div>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="upload-icon">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <h3>Drop your resume here</h3>
                        <p>or select a file from your computer</p>
                        <label htmlFor="file-upload" className="upload-button">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="button-icon">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                          Upload PDF Resume
                        </label>
                      </>
                    )}
                    
                    {error && (
                      <div className="error-message">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <span>{error}</span>
                      </div>
                    )}
                  </div>

                  <div className="how-it-works">
                    <h3>How it works:</h3>
                    <ul className="steps-list">
                      <li>
                        <div className="step-number">1</div>
                        <span>Upload your resume in PDF format</span>
                      </li>
                      <li>
                        <div className="step-number">2</div>
                        <span>Our system analyzes compatibility with ATS software</span>
                      </li>
                      <li>
                        <div className="step-number">3</div>
                        <span>Get a detailed score and optimization recommendations</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="results-container">
                  <div className="results-header">
                    <div className="section-header">
                      <div className="icon-container">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <div>
                        <h2>Analysis Complete</h2>
                        <p>Resume: {file?.name || "Your resume"}</p>
                      </div>
                    </div>
                    <button
                      onClick={resetAnalysis}
                      className="analyze-again"
                    >
                      Analyze Another
                    </button>
                  </div>

                  <div className="results-content">
                    <div className="score-container">
                      <h3>ATS Compatibility Score</h3>
                      <div className="score-circle-container">
                        <div className={`score-circle score-${atsScore >= 80 ? 'high' : atsScore >= 60 ? 'medium' : 'low'}`} data-score={atsScore}>
                          <svg viewBox="0 0 200 200">
                            <circle cx="100" cy="100" r="80" className="score-circle-bg" />
                            <circle cx="100" cy="100" r="80" className="score-circle-progress" style={{ 
                              strokeDasharray: `${atsScore * 5.02}, 502`, 
                              strokeDashoffset: 0 
                            }} />
                          </svg>
                          <div className="score-text">
                            <span className="score-value">{atsScore}</span>
                            <span className="score-max">out of 100</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="interpretation-container">
                      <h3>Interpretation</h3>

                      {atsScore >= 80 ? (
                        <div className="interpretation high">
                          <h4>Excellent Score</h4>
                          <p>Your resume is well-optimized for ATS systems.</p>
                        </div>
                      ) : atsScore >= 60 ? (
                        <div className="interpretation medium">
                          <h4>Good Score</h4>
                          <p>Your resume should pass most ATS systems but could be improved.</p>
                        </div>
                      ) : (
                        <div className="interpretation low">
                          <h4>Needs Improvement</h4>
                          <p>Your resume may struggle with ATS systems.</p>
                        </div>
                      )}

                      <div className="recommendations">
                        <h4>Recommendations:</h4>
                        <ul className="recommendations-list">
                          {atsScore < 80 && (
                            <>
                              <li>
                                <span className="check-mark">✓</span>
                                <span>Use more industry-specific keywords</span>
                              </li>
                              <li>
                                <span className="check-mark">✓</span>
                                <span>Improve formatting and structure</span>
                              </li>
                            </>
                          )}
                          {atsScore < 60 && (
                            <>
                              <li>
                                <span className="check-mark">✓</span>
                                <span>Remove complex graphics or tables</span>
                              </li>
                              <li>
                                <span className="check-mark">✓</span>
                                <span>Use a simpler, more standard layout</span>
                              </li>
                            </>
                          )}
                          {atsScore >= 80 && (
                            <li>
                              <span className="check-mark">✓</span>
                              <span>Continue to tailor your resume for specific job applications</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            <div className="premium-card tips-card">
              <h3>Resume Tips</h3>
              <ul className="tips-list">
                <li>
                  <div className="tip-bullet"></div>
                  <span>Use standard fonts like Arial or Calibri</span>
                </li>
                <li>
                  <div className="tip-bullet"></div>
                  <span>Include keywords from the job description</span>
                </li>
                <li>
                  <div className="tip-bullet"></div>
                  <span>Avoid using headers/footers</span>
                </li>
                <li>
                  <div className="tip-bullet"></div>
                  <span>Save as a simple PDF format</span>
                </li>
              </ul>
            </div>
            
            <div className="premium-card upgrade-card">
              <h3>Premium Features</h3>
              <ul className="premium-features-list">
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Job-specific keyword suggestions</span>
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Interview preparation tools</span>
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Expert resume review</span>
                </li>
              </ul>
              <button className="upgrade-button">
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

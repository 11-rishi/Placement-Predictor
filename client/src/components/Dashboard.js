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
  const [atsScore, setAtsScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
          setAtsScore(data.score);
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
    document.getElementById("file-upload").value = "";
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
          <p>Check your resume's ATS compatibility score</p>
        </div>

        <div className="dashboard-card">
          {atsScore === null ? (
            <div className="upload-section">
              <h3>Upload Your Resume for ATS Score</h3>
              <p className="upload-hint">
                Upload your resume to see how well it performs with ATS systems
              </p>

              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                id="file-upload"
                style={{ display: "none" }}
              />
              <label htmlFor="file-upload" className="upload-btn">
                {isLoading ? "Analyzing..." : "Upload PDF Resume"}
              </label>

              {error && <div className="error-message">{error}</div>}
            </div>
          ) : (
            <div className="score-result">
              <h3>Your ATS Compatibility Score</h3>

              <div className="score-display">
                <div className="score-circle">
                  <span>{atsScore}</span>
                </div>
                <div className="score-label">out of 100</div>
              </div>

              <div className="score-interpretation">
                {atsScore >= 80 ? (
                  <p className="excellent-score">
                    Excellent! Your resume is well-optimized for ATS systems.
                  </p>
                ) : atsScore >= 60 ? (
                  <p className="good-score">
                    Good. Your resume should pass most ATS systems.
                  </p>
                ) : (
                  <p className="poor-score">
                    Needs improvement. Your resume may struggle with ATS
                    systems.
                  </p>
                )}
              </div>

              <button
                className="analyze-again-btn"
                onClick={() => navigate("/dashboard")}
              >
                Analyze Another Resume
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

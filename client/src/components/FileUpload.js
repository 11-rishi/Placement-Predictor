// import React, { useState, useRef } from "react";
// import "./FileUpload.css";

// const FileUpload = () => {
//   const [file, setFile] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [uploadStatus, setUploadStatus] = useState("");
//   const fileInputRef = useRef(null);

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const droppedFile = e.dataTransfer.files[0];
//     validateAndSetFile(droppedFile);
//   };

//   const handleFileInput = (e) => {
//     const selectedFile = e.target.files[0];
//     validateAndSetFile(selectedFile);
//   };

//   const validateAndSetFile = (file) => {
//     const allowedTypes = [
//       "application/pdf",
//       "application/msword",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     ];
//     if (file && allowedTypes.includes(file.type)) {
//       setFile(file);
//       setUploadStatus("");
//     } else {
//       setUploadStatus("Please upload a PDF or Word document");
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("resume", file);

//     try {
//       const response = await fetch("http://localhost:5000/upload", {
//         method: "POST",
//         body: formData,
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setUploadStatus("File uploaded successfully!");
//         setFile(null);
//         if (fileInputRef.current) {
//           fileInputRef.current.value = "";
//         }
//       } else {
//         setUploadStatus(data.message || "Upload failed");
//       }
//     } catch (error) {
//       setUploadStatus("Error uploading file");
//     }

//     setUploadProgress(0);
//   };

//   return (
//     <div className="file-upload-container">
//       <div
//         className={`drop-zone ${isDragging ? "dragging" : ""}`}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//       >
//         <div className="upload-icon">
//           <i className="fas fa-cloud-upload-alt"></i>
//         </div>
//         <p>Drag and drop your resume here or</p>
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleFileInput}
//           accept=".pdf,.doc,.docx"
//           style={{ display: "none" }}
//         />
//         <button
//           className="select-file-btn"
//           onClick={() => fileInputRef.current.click()}
//         >
//           Select File
//         </button>
//       </div>

//       {file && (
//         <div className="file-info">
//           <p>Selected file: {file.name}</p>
//           <button className="upload-btn" onClick={handleUpload}>
//             Generate ATS Score
//           </button>
//         </div>
//       )}

//       {uploadStatus && (
//         <div
//           className={`upload-status ${
//             uploadStatus.includes("successfully") ? "success" : "error"
//           }`}
//         >
//           {uploadStatus}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileUpload;
import React, { useState, useRef } from "react";
import "./FileUpload.css";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [atsScore, setAtsScore] = useState(null);
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
    } else {
      setError("Please upload a PDF document");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setError("");

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
      } else {
        setError(data.error || "Failed to analyze resume");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Server connection error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setAtsScore(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Resume ATS Score Analyzer</h2>

      {atsScore === null ? (
        <>
          <div
            className={`drop-zone ${isDragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="upload-icon">
              <i className="fas fa-cloud-upload-alt"></i>
            </div>
            <p>Drag and drop your resume here or</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept=".pdf"
              style={{ display: "none" }}
            />
            <button
              className="select-file-btn"
              onClick={() => fileInputRef.current.click()}
            >
              Select PDF File
            </button>
          </div>

          {file && (
            <div className="file-info">
              <p>Selected file: {file.name}</p>
              <button
                className="upload-btn"
                onClick={handleUpload}
                disabled={isLoading}
              >
                {isLoading ? "Analyzing..." : "Generate ATS Score"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="score-display">
          <div className="score-circle">
            <span className="score-value">{atsScore}</span>
            <span className="score-label">/ 100</span>
          </div>

          <div className="score-message">
            {atsScore >= 80 ? (
              <p className="excellent">
                Excellent! Your resume is well-optimized for ATS systems.
              </p>
            ) : atsScore >= 60 ? (
              <p className="good">
                Good. Your resume should pass most ATS systems.
              </p>
            ) : (
              <p className="needs-work">
                Needs improvement. Your resume may struggle with ATS systems.
              </p>
            )}
          </div>

          <button className="reset-btn" onClick={resetUpload}>
            Analyze Another Resume
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default FileUpload;

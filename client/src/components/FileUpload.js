import React, { useState, useRef } from 'react';
import './FileUpload.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
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
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (file && allowedTypes.includes(file.type)) {
      setFile(file);
      setUploadStatus('');
    } else {
      setUploadStatus('Please upload a PDF or Word document');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setUploadStatus('File uploaded successfully!');
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setUploadStatus(data.message || 'Upload failed');
      }
    } catch (error) {
      setUploadStatus('Error uploading file');
    }

    setUploadProgress(0);
  };

  return (
    <div className="file-upload-container">
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
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
          accept=".pdf,.doc,.docx"
          style={{ display: 'none' }}
        />
        <button
          className="select-file-btn"
          onClick={() => fileInputRef.current.click()}
        >
          Select File
        </button>
      </div>

      {file && (
        <div className="file-info">
          <p>Selected file: {file.name}</p>
          <button className="upload-btn" onClick={handleUpload}>
            Generate ATS Score
          </button>
        </div>
      )}

      {uploadStatus && (
        <div className={`upload-status ${uploadStatus.includes('successfully') ? 'success' : 'error'}`}>
          {uploadStatus}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
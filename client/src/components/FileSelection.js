import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FileSelection.css';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

const FileSelection = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setError('');
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      console.log('Upload successful:', data);
      // Navigate to results page or show success message
    } catch (err) {
      setError('Failed to upload files. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-selection">
      <Navbar />
      <div className="file-selection-content">
        <h1>Upload Your Files</h1>
        <div className="upload-section">
          <div className="file-input-container">
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleFileChange}
              className="file-input"
            />
            <label htmlFor="file-upload" className="file-input-label">
              Choose Files
            </label>
          </div>
          
          {selectedFiles.length > 0 && (
            <div className="selected-files">
              <h3>Selected Files:</h3>
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
            {uploading ? 'Uploading...' : 'Upload Files'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileSelection; 
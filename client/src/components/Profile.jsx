import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, atsScore } = useAuth();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (user) {
      setUserProfile(user);
    }
  }, [user]);

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <h1>Profile</h1>
        {userProfile ? (
          <div className="profile-card">
            <p><strong>Username:</strong> {userProfile.username}</p>
            <p><strong>Email:</strong> {userProfile.email}</p>
            <div className="ats-scores">
              <h2>ATS Scores</h2>
              {userProfile.atsScores && userProfile.atsScores.length > 0 ? (
                <ul>
                  {userProfile.atsScores.map((score, index) => (
                    <li key={index}>Score {index + 1}: {score}</li>
                  ))}
                </ul>
              ) : (
                <p>No ATS scores available.</p>
              )}
            </div>
          </div>
        ) : (
          <p>Loading user info...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;

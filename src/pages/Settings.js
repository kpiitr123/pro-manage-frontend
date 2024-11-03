import React, { useState } from 'react';
import '../styles/Settings.css';

const Settings = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      <form className="settings-form">
        <div className="input-group">
          <span className="icon">👤</span>
          <input type="text" placeholder="Name" />
        </div>
        <div className="input-group">
          <span className="icon">✉️</span>
          <input type="email" placeholder="Update Email" />
        </div>
        <div className="input-group">
          <span className="icon">🔒</span>
          <input
            type={showOldPassword ? "text" : "password"}
            placeholder="Old Password"
          />
          <span
            className="toggle-password"
            onClick={() => setShowOldPassword(!showOldPassword)}
          >
            👁️
          </span>
        </div>
        <div className="input-group">
          <span className="icon">🔒</span>
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
          />
          <span
            className="toggle-password"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            👁️
          </span>
        </div>
        <button type="submit" className="update-button">Update</button>
      </form>
    </div>
  );
};

export default Settings;

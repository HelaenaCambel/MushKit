import React, { useState } from "react";
import "../../component styles/User Profile Details/UserDetailsView.css";
import "../../component styles/User Profile Details/UserDetailsViewMedia.css";

const UserDetailsView = ({ user, isEditing, onChange, errors }) => {
  const [passwordTouched, setPasswordTouched] = useState(false); 
  const [pinTouched, setPinTouched] = useState(false); 
  const [tempPassword, setTempPassword] = useState(user.password || ""); 
  const [tempPin, setTempPin] = useState(user.pin || "");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    onChange({ [id]: value });

    if (id === "password") {
      setTempPassword(value); 
    }
    if (id === "pin") {
      setTempPin(value); 
    }
  };

  // Function to mask PIN (show only the last digit)
  const maskPin = (pin) => {
    if (!pin) return "";
    const masked = pin.slice(0, -1).replace(/./g, "*");
    return masked + pin.slice(-1); 
  };

  // Function to mask Password (show only the first and last digit)
  const maskPassword = (password) => {
    if (!password) return "";
    if (password.length <= 2) return password; 
    const firstChar = password[0];
    const lastChar = password[password.length - 1];
    const masked = password.slice(1, -1).replace(/./g, "*");
    return firstChar + masked + lastChar;
  };

  const handleFocus = (field) => {
    if (field === "password") {
      setPasswordTouched(true);
      setTempPassword(""); 
    }
    if (field === "pin") {
      setPinTouched(true);
      setTempPin(""); 
    }
  };

  const handleBlur = (field) => {
    if (field === "password" && !tempPassword) {
      setPasswordTouched(false);
    }
    if (field === "pin" && !tempPin) {
      setPinTouched(false);
    }
  };

  return (
    <div className="user-section">
      <div className="section-title">User Details</div>
      <div className="user-form">
        <div className="form-group">
          <label htmlFor="owner">MushKit Owner</label>
          <input
            type="text"
            id="owner"
            value={user.owner || ""}
            disabled={!isEditing}
            onChange={handleInputChange}
          />
          {errors.owner && <span className="error-message">{errors.owner}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="contact">Contact Number</label>
          <input
            type="text"
            id="contact"
            value={user.contact || ""}
            disabled={!isEditing}
            onChange={handleInputChange}
          />
          {errors.contact && <span className="error-message">{errors.contact}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="affiliation">Affiliation</label>
          <input
            type="text"
            id="affiliation"
            value={user.affiliation || "N/A"}
            disabled={!isEditing}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={user.email || ""}
            disabled={!isEditing}
            onChange={handleInputChange}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="text"
            id="password"
            value={
              isEditing && passwordTouched
                ? tempPassword // Show unmasked password if editing and touched
                : maskPassword(user.password) // Mask the password if not touched
            }
            disabled={!isEditing}
            onChange={handleInputChange}
            onFocus={() => handleFocus("password")} 
            onBlur={() => handleBlur("password")} 
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="pin">MushKit PIN</label>
          <input
            type="text"
            id="pin"
            value={
              isEditing && pinTouched
                ? tempPin // Show unmasked PIN if editing and touched
                : maskPin(user.pin) // Mask the PIN if not touched
            }
            disabled={!isEditing}
            onChange={handleInputChange}
            onFocus={() => handleFocus("pin")} // Trigger on focus
            onBlur={() => handleBlur("pin")} // Trigger on blur
          />
          {errors.pin && <span className="error-message">{errors.pin}</span>}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsView;
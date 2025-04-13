import React from "react";
import "../../component styles/User Profile Details/UserDetailsView.css";

const UserDetailsView = ({ user, isEditing, onChange }) => {
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    onChange({ [id]: value });
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
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="text"
            id="password"
            value={user.password || ""}
            disabled={!isEditing}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="pin">MushKit PIN</label>
          <input
            type="text"
            id="pin"
            value={user.pin || ""}
            disabled={!isEditing}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDetailsView;

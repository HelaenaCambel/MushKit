import React from "react";
import "../../component styles/User Profile Details/UserDetailsView.css";

const UserDetailsView = ({ user }) => {
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
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact">Contact Number</label>
          <input
            type="text"
            id="contact"
            value={user.contact || ""}
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="affiliation">Affiliation</label>
          <input
            type="text"
            id="affiliation"
            value={user.affiliation || "N/A"}
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={user.email || ""}
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="text"
            id="password"
            value={user.password || ""}
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="pin">MushKit PIN</label>
          <input
            type="text"
            id="pin"
            value={user.pin || ""}
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default UserDetailsView;

import React from "react";
import SideNavBar from "../static/SideNavBar";
import "../component styles/UserProfile.css";

const UserProfile = () => {
  return (
    <div className="profile-container">
      <SideNavBar />
      <div>
        <h1>Profile</h1>

        <div className="details-section">
          <div className="section-title">User Details</div>
        </div>

        <div className="details-section">
          <div className="section-title">MushKit #1 Details</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
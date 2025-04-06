import React from "react";
import SideNavBar from "../static/SideNavBar";
import "../styles/UserProfile.css";

const UserProfile = () => {
  return (
    <div className="profile-container">
      <SideNavBar />
      <div>
        <h1>Profile</h1>
      </div>
    </div>
  );
};

export default UserProfile;
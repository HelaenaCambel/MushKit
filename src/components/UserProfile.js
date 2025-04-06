import React from "react";
import SideNavBar from "../static/SideNavBar";

const UserProfile = () => {
  return (
    <div className="dashboard-container" style={{ display: "flex" }}>
      <SideNavBar />
      <div className="dashboard-content" style={{ flex: 1, padding: "20px" }}>
        <h1>Profile</h1>
      </div>
    </div>
  );
};

export default UserProfile;
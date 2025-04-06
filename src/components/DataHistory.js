import React from "react";
import SideNavBar from "../static/SideNavBar";

const DataHistory = () => {
  return (
    <div className="dashboard-container" style={{ display: "flex" }}>
      <SideNavBar />
      <div className="dashboard-content" style={{ flex: 1, padding: "20px" }}>
        <h1>History</h1>
      </div>
    </div>
  );
};

export default DataHistory;
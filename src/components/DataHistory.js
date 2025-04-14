import React from "react";
import SideNavBar from "../static/SideNavBar";
import "../component styles/DataHistory.css";
import usePreventBackNavigation from "../hooks/usePreventBackNavigation";

const DataHistory = () => {
  usePreventBackNavigation();

  return (
    <div className="history-container">
      <SideNavBar />
      <div>
        <h1>History</h1>
      </div>
    </div>
  );
};

export default DataHistory;
import React, { useState } from "react";
import SideNavBar from "../static/SideNavBar";
import "../component styles/DataHistory.css";
import usePreventBackNavigation from "../hooks/usePreventBackNavigation";

const DataHistory = () => {
  usePreventBackNavigation();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="history-container">
      <SideNavBar onToggle={setIsSidebarExpanded} />
      <div>
        <div className={`history-header ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
          <h1>Data History</h1>
        </div>
      </div>
    </div>
  );
};

export default DataHistory;
import React, { useState } from "react";
import SideNavBar from "../static/SideNavBar";
import "../component styles/DataHistory.css";
import usePreventBackNavigation from "../hooks/usePreventBackNavigation";

const DataHistory = () => {
  usePreventBackNavigation();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const historyData = [
    {
      timestamp: "2025-04-17 10:00",
      temperature: "24.5°C",
      humidity: "78%",
      waterLevel: "High",
      lightStatus: "ON",
    },
    {
      timestamp: "2025-04-17 11:00",
      temperature: "25.1°C",
      humidity: "80%",
      waterLevel: "Medium",
      lightStatus: "OFF",
    }
  ];

  return (
    <div className="history-container">
      <SideNavBar onToggle={setIsSidebarExpanded} />
      <div>
        <div className={`history-header ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
          <h1>Data History</h1>
        </div>

        <div className="mushkit-section">
          <h2>MushKit #1</h2>
          <p><strong>kit_id:</strong> 0001</p>

          <table className="history-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Temperature</th>
                <th>Humidity</th>
                <th>Water Level</th>
                <th>Light Status</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.timestamp}</td>
                  <td>{entry.temperature}</td>
                  <td>{entry.humidity}</td>
                  <td>{entry.waterLevel}</td>
                  <td>{entry.lightStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataHistory;
import React, { useEffect, useState } from "react";
import SideNavBar from "../static/SideNavBar";
import "../component styles/DataHistory.css";
import usePreventBackNavigation from "../hooks/usePreventBackNavigation";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../database/firebase";

const DataHistory = () => {
  usePreventBackNavigation();
  const { user } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mushkits, setMushkits] = useState([]);

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
    },
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

  useEffect(() => {
    const fetchUserKits = async () => {
      if (!user?.uid) return;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        const kits = data.mushkits || [];
        setMushkits(kits);
      }
    };

    fetchUserKits();
  }, [user]);

  return (
    <div className="history-container">
      <SideNavBar onToggle={setIsSidebarExpanded} />
      <div>
        <div className={`history-header ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
          <h1>Data History</h1>
        </div>
        <div className="data-container">
          {mushkits.map((kit, index) => (
            <div key={index} className="mushkit-section">
              <h2>{kit.kit_name}</h2>
              <p>MushKit ID#{kit.kit_id}</p>

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
                  {historyData.map((entry, idx) => (
                    <tr key={idx}>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataHistory;
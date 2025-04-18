import React, { useEffect, useState } from "react";
import SideNavBar from "../static/SideNavBar";
import "../component styles/DataHistory.css";
import usePreventBackNavigation from "../hooks/usePreventBackNavigation";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../database/firebase";
import DataChart from "../charts/DataChart";
import historyData from "../database/historyData";

const ROWS_PER_PAGE = 10;

const DataHistory = () => {
  usePreventBackNavigation();
  const { user } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mushkits, setMushkits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

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

  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const currentRows = historyData.slice(startIndex, startIndex + ROWS_PER_PAGE);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (startIndex + ROWS_PER_PAGE < historyData.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

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
              <div className="mushkit-left">
                <div className="section-name">
                  <h2>{kit.kit_name}</h2>
                  <p>MushKit ID# {kit.kit_id}</p>
                </div>

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
                    {currentRows.map((entry, idx) => (
                      <tr key={idx}>
                        <td>{entry.timestamp}</td>
                        <td>{entry.temperature}</td>
                        <td>{entry.humidity}</td>
                        <td>{entry.waterLevel}</td>
                        <td>{entry.lightStatus}</td>
                      </tr>
                    ))}
                    {Array.from({ length: ROWS_PER_PAGE - currentRows.length }).map((_, idx) => (
                      <tr key={`empty-${idx}`}>
                        <td style={{ height: "21.6px" }}></td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="pagination-buttons">
                  <button onClick={handlePrevious} disabled={currentPage === 1}>
                    Previous
                  </button>
                  <span style={{ margin: "0 10px" }}>Page {currentPage}</span>
                  <button
                    onClick={handleNext}
                    disabled={startIndex + ROWS_PER_PAGE >= historyData.length}
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="mushkit-right"> 
                <DataChart historyData={currentRows} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataHistory;
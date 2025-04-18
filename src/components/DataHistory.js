import React, { useEffect, useState } from "react";
import SideNavBar from "../static/SideNavBar";
import "../component styles/DataHistory.css";
import usePreventBackNavigation from "../hooks/usePreventBackNavigation";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../database/firebase";
import DataChart from "../charts/DataChart";

const ROWS_PER_PAGE = 10;

const DataHistory = () => {
  usePreventBackNavigation();
  const { user } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mushkits, setMushkits] = useState([]);
  const [historyDataByKit, setHistoryDataByKit] = useState({});
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

        for (const kit of kits) {
          await fetchHistoryDataForKit(kit.kit_id);
        }
      }
    };

    const fetchHistoryDataForKit = async (kitId) => {
      const historyRef = collection(db, "sensorHistory", kitId, "readings");
      const snapshot = await getDocs(historyRef);
      const readings = snapshot.docs.map(doc => ({
        ...doc.data(),
        timestamp: formatTimestamp(doc.id) // convert ID to readable timestamp
      })).sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1)); // newest first

      setHistoryDataByKit(prev => ({ ...prev, [kitId]: readings }));
      setCurrentPage(prev => ({ ...prev, [kitId]: 1 }));
    };

    fetchUserKits();
  }, [user]);

  const formatTimestamp = (id) => {
    const year = id.substring(0, 4);
    const month = id.substring(4, 6);
    const day = id.substring(6, 8);
    const hour = id.substring(8, 10);
    const minute = id.substring(10, 12);
    
    const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
  
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, 
    };
    return date.toLocaleString('en-US', options);
  };

  const handlePrevious = (kitId) => {
    setCurrentPage(prev => ({
      ...prev,
      [kitId]: Math.max(1, prev[kitId] - 1)
    }));
  };

  const handleNext = (kitId, total) => {
    const maxPage = Math.ceil(total / ROWS_PER_PAGE);
    setCurrentPage(prev => ({
      ...prev,
      [kitId]: Math.min(prev[kitId] + 1, maxPage)
    }));
  };

  return (
    <div className="history-container">
      <SideNavBar onToggle={setIsSidebarExpanded} />
      <div>
        <div className={`history-header ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
          <h1>Data History</h1>
        </div>
        <div className="data-container">
          {mushkits.map((kit, index) => {
            const kitId = kit.kit_id;
            const historyData = historyDataByKit[kitId] || [];
            const page = currentPage[kitId] || 1;
            const startIndex = (page - 1) * ROWS_PER_PAGE;
            const currentRows = historyData.slice(startIndex, startIndex + ROWS_PER_PAGE);

            return (
              <div key={index} className="mushkit-section">
                <div className="mushkit-left">
                  <div className="section-name">
                    <h2>{kit.kit_name}</h2>
                    <p>MushKit ID# {kitId}</p>
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
                          <td>{entry.temperature}°C</td>
                          <td>{entry.humidity}%</td>
                          <td>{entry.waterStatus}</td>
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
                    <button onClick={() => handlePrevious(kitId)} disabled={page === 1}>
                      Previous
                    </button>
                    <span style={{ margin: "0 10px" }}>Page {page}</span>
                    <button
                      onClick={() => handleNext(kitId, historyData.length)}
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DataHistory;
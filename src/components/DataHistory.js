import React, { useEffect, useState } from "react";
import SideNavBar from "../static/SideNavBar";
import "../component styles/DataHistory.css";
import "../component styles/DataHistoryMedia.css";
import usePreventBackNavigation from "../hooks/usePreventBackNavigation";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../database/firebase";
import DataChart from "../charts/DataChart";

const ROWS_PER_PAGE = 10;

const DataHistory = () => {
  usePreventBackNavigation();
  const { user } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mushkits, setMushkits] = useState([]);
  const [historyDataByKit, setHistoryDataByKit] = useState({});
  const [currentPage, setCurrentPage] = useState({});

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribes = [];

    const fetchUserKitsAndSubscribe = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        const kits = data.mushkits || [];
        setMushkits(kits);

        kits.forEach((kit) => {
          const historyRef = collection(db, "sensorHistory", kit.kit_id, "readings");

          const unsubscribe = onSnapshot(historyRef, (snapshot) => {
            const uniquePerMinute = new Map();

            snapshot.docs.forEach((doc) => {
              const data = doc.data();
              const id = doc.id;

              const date = new Date(
                `${id.substring(0, 4)}-${id.substring(4, 6)}-${id.substring(6, 8)}T${id.substring(8, 10)}:${id.substring(10, 12)}:${id.substring(12, 14)}`
              );

              const key = date.toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });

              const existing = uniquePerMinute.get(key);
              if (!existing || date > new Date(existing.rawDate)) {
                uniquePerMinute.set(key, {
                  ...data,
                  timestamp: key,
                  rawDate: date.toISOString(),
                });
              }
            });

            const readings = Array.from(uniquePerMinute.values()).sort(
              (a, b) => new Date(b.rawDate) - new Date(a.rawDate)
            );

            setHistoryDataByKit((prev) => ({ ...prev, [kit.kit_id]: readings }));
            setCurrentPage((prev) => ({ ...prev, [kit.kit_id]: 1 }));
          });

          unsubscribes.push(unsubscribe);
        });
      }
    };

    fetchUserKitsAndSubscribe();

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [user]);

  const handlePrevious = (kitId) => {
    setCurrentPage((prev) => ({
      ...prev,
      [kitId]: Math.max(1, prev[kitId] - 1),
    }));
  };

  const handleNext = (kitId, total) => {
    const maxPage = Math.ceil(total / ROWS_PER_PAGE);
    setCurrentPage((prev) => ({
      ...prev,
      [kitId]: Math.min(prev[kitId] + 1, maxPage),
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
                          <td>{entry.temperature} °C</td>
                          <td>{entry.humidity} %</td>
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

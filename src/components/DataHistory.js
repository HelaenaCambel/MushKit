import React, { useEffect, useState } from "react";
import SideNavBar from "../static/SideNavBar";
import "../component styles/DataHistory.css";
import "../component styles/DataHistoryMedia.css";
import usePreventBackNavigation from "../hooks/usePreventBackNavigation";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, collection, onSnapshot, deleteDoc } from "firebase/firestore";
import { db } from "../database/firebase";
import DataChart from "../charts/DataChart";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver"; 
import { FaDownload, FaTrash } from "react-icons/fa";

const LoadingSpinner = () => (
  <div className="mushroom-loading">
    <img
      src="/mushroom.svg"
      alt="Loading spinner"
      className="loading-spinner"
    />
  </div>
);

const ROWS_PER_PAGE = 10;

const DataHistory = () => {
  usePreventBackNavigation();
  const { user } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mushkits, setMushkits] = useState([]);
  const [historyDataByKit, setHistoryDataByKit] = useState({});
  const [currentPage, setCurrentPage] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({});
  const [deletingProgress, setDeletingProgress] = useState({});
  const [isDeleting, setIsDeleting] = useState({});
  const [deletingDateRange, setDeletingDateRange] = useState({});
  const [averages, setAverages] = useState({});

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

        kits.forEach((kit, kitIndex) => {
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
                  id,
                });
              }
            });

            const readings = Array.from(uniquePerMinute.values()).sort(
              (a, b) => new Date(b.rawDate) - new Date(a.rawDate)
            );

            setHistoryDataByKit((prev) => ({ ...prev, [kit.kit_id]: readings }));
            setCurrentPage((prev) => ({ ...prev, [kit.kit_id]: 1 }));

            if (kitIndex === kits.length - 1) {
              setIsLoading(false);
            }
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

  const updateDateRange = (kitId, field, value) => {
    setDateRange((prev) => ({
      ...prev,
      [kitId]: {
        ...prev[kitId],
        [field]: value,
      },
    }));
  };  

  // Excel Download Handler
  const handleDownloadExcel = (kitId, kitName) => {
    const historyData = historyDataByKit[kitId];
    if (!historyData || historyData.length === 0) return;

    const fromDate = dateRange[kitId]?.from ? new Date(dateRange[kitId].from) : null;
    const toDate = dateRange[kitId]?.to ? new Date(dateRange[kitId].to + "T23:59:59") : null;

    const filteredData = historyData.filter((entry) => {
      const entryDate = new Date(entry.rawDate);
      return (!fromDate || entryDate >= fromDate) && (!toDate || entryDate <= toDate);
    });

    if (filteredData.length === 0) {
      alert("No data in selected range.");
      return;
    }

    const sheetData = filteredData.map((entry) => ({
      Timestamp: entry.timestamp,
      "Temperature in °C": entry.temperature,
      "Humidity in %": entry.humidity,
      "Water Level": entry.waterStatus,
      "Light Status": entry.lightStatus,
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data History");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `${kitName}_DataHistory_${dateRange[kitId]?.from || "all"}_to_${dateRange[kitId]?.to || "all"}.xlsx`);
  };  

  const handleDeleteHistory = async (kitId) => {
    const fromDateStr = dateRange[kitId]?.from;
    const toDateStr = dateRange[kitId]?.to;

    const fromDate = fromDateStr ? new Date(fromDateStr) : null;
    const toDate = toDateStr ? new Date(toDateStr + "T23:59:59") : null;

    if (!fromDate || !toDate) {
      alert("Please select a valid date range to delete.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete all entries in this date range? This cannot be undone.")) {
      return;
    }

    const history = historyDataByKit[kitId];
    if (!history || history.length === 0) return;

    const entriesToDelete = history.filter((entry) => {
      const entryDate = new Date(entry.rawDate);
      return entryDate >= fromDate && entryDate <= toDate;
    });

    if (entriesToDelete.length === 0) {
      alert("No entries found in the selected range.");
      return;
    }

    setIsDeleting((prev) => ({ ...prev, [kitId]: true }));
    setDeletingProgress((prev) => ({ ...prev, [kitId]: 0 }));
    setDeletingDateRange((prev) => ({
      ...prev,
      [kitId]: { from: fromDateStr, to: toDateStr }, // Save deletion-specific range
    }));

    try {
      for (let i = 0; i < entriesToDelete.length; i++) {
        const entry = entriesToDelete[i];
        const docRef = doc(db, "sensorHistory", kitId, "readings", entry.id);
        await deleteDoc(docRef);

        const progress = Math.round(((i + 1) / entriesToDelete.length) * 100);
        setDeletingProgress((prev) => ({ ...prev, [kitId]: progress }));
      }

      setHistoryDataByKit((prev) => ({
        ...prev,
        [kitId]: prev[kitId].filter((entry) => {
          const entryDate = new Date(entry.rawDate);
          return !(entryDate >= fromDate && entryDate <= toDate);
        }),
      }));

      alert("Selected history deleted successfully.");
    } catch (error) {
      console.error("Error deleting history:", error);
      alert("Failed to delete history.");
    } finally {
      setIsDeleting((prev) => ({ ...prev, [kitId]: false }));
      setDeletingDateRange((prev) => ({ ...prev, [kitId]: null })); 
    }
  };   

  const handleGetAverage = (kitId) => {
    const historyData = historyDataByKit[kitId];
    if (!historyData || historyData.length === 0) {
      alert("No data available.");
      return;
    }

    const from = dateRange[kitId]?.from ? new Date(dateRange[kitId].from) : null;
    const to = dateRange[kitId]?.to ? new Date(dateRange[kitId].to + "T23:59:59") : null;

    const filtered = historyData.filter((entry) => {
      const entryDate = new Date(entry.rawDate);
      return (!from || entryDate >= from) && (!to || entryDate <= to);
    });

    if (filtered.length === 0) {
      alert("No data in selected range.");
      return;
    }

    const avgTemp =
      filtered.reduce((sum, e) => sum + parseFloat(e.temperature), 0) /
      filtered.length;
    const avgHumid =
      filtered.reduce((sum, e) => sum + parseFloat(e.humidity), 0) /
      filtered.length;

    setAverages((prev) => ({
      ...prev,
      [kitId]: {
        temp: avgTemp.toFixed(2),
        humid: avgHumid.toFixed(2),
        message: null,
      },
    }));
  };  

  return (
    <div className="history-container">
      <SideNavBar onToggle={setIsSidebarExpanded} />
      <div>
        <div className={`history-header ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
          <h1>Data History</h1>
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
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
                              <td
                                style={{
                                  color:
                                    entry.temperature < 28
                                      ? "yellow"
                                      : entry.temperature <= 29.9
                                      ? "green"
                                      : "red",
                                }}
                              > {entry.temperature} °C </td>
                              <td
                                style={{
                                  color: entry.humidity < 90 ? "red" : "green",
                                }}
                              > {entry.humidity} %</td>
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

                      <div className="controls-row">
                        <div className="date-range-inputs">
                          <label>
                            From:
                            <input
                              type="date"
                              value={dateRange[kitId]?.from || ""}
                              onChange={(e) => updateDateRange(kitId, "from", e.target.value)}
                            />
                          </label>
                          <label>
                            To:
                            <input
                              type="date"
                              value={dateRange[kitId]?.to || ""}
                              onChange={(e) => updateDateRange(kitId, "to", e.target.value)}
                            />
                          </label>
                        </div>
                          
                        <button className="get-average-button" onClick={() => handleGetAverage(kitId)}>
                          Get Average
                        </button>

                        <button
                          className="download-btn"
                          onClick={() => handleDownloadExcel(kitId, kit.kit_name)}
                        >
                        <FaDownload style={{ fontSize: "15px", marginRight: "8px", marginTop: "1px" }} />
                        DataHistory
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteHistory(kitId)}
                        >
                          <FaTrash style={{ fontSize: "15px", marginRight: "8px", marginTop: "1px" }} />
                          Delete History
                        </button>
                      </div>

                      <div className="average-controls">
                        {averages[kitId]?.message ? (
                          <p className="average-message">{averages[kitId].message}</p>
                        ) : averages[kitId] ? (
                          <p className="average-result">
                            <strong>Average Temperature:</strong> {averages[kitId].temp} °C &nbsp;
                            <strong>Average Humidity:</strong> {averages[kitId].humid} %
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="mushkit-right">
                      <DataChart historyData={currentRows} />

                      {isDeleting[kitId] && (
                        <div className="delete-progress">
                          <p>Deleting data history from <strong>{deletingDateRange[kitId]?.from}</strong> to <strong>{deletingDateRange[kitId]?.to}</strong>...</p>
                          <div className="progress-bar-container">
                            <div
                              className="progress-bar-fill"
                              style={{ width: `${deletingProgress[kitId] || 0}%` }}
                            ></div>
                          </div>
                          <p>{deletingProgress[kitId] || 0}% complete</p>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DataHistory;
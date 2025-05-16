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
    <img src="/mushroom.svg" alt="Loading spinner" className="loading-spinner" />
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
  const [averages, setAverages] = useState({});

  // New state to track which kit graph modal is open (kitId or null)
  const [modalKitId, setModalKitId] = useState(null);

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

  // Pagination handlers
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

      alert("Selected history entries deleted successfully.");
    } catch (error) {
      alert("Error deleting history: " + error.message);
    } finally {
      setIsDeleting((prev) => ({ ...prev, [kitId]: false }));
      setDeletingProgress((prev) => ({ ...prev, [kitId]: 0 }));
    }
  };

  const calculateAverages = (data) => {
    if (!data || data.length === 0) return { avgTemp: 0, avgHumid: 0 };

    let sumTemp = 0;
    let sumHumid = 0;
    data.forEach((entry) => {
      sumTemp += entry.temperature || 0;
      sumHumid += entry.humidity || 0;
    });

    return {
      avgTemp: (sumTemp / data.length).toFixed(2),
      avgHumid: (sumHumid / data.length).toFixed(2),
    };
  };

  // Calculate averages for each kit when history updates
  useEffect(() => {
    const newAverages = {};
    for (const kitId in historyDataByKit) {
      newAverages[kitId] = calculateAverages(historyDataByKit[kitId]);
    }
    setAverages(newAverages);
  }, [historyDataByKit]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="data-history-page">
      <SideNavBar
        isExpanded={isSidebarExpanded}
        onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
      />
      <main className="data-history-main">
        {mushkits.length === 0 ? (
          <p>No MushKits found for this user.</p>
        ) : (
          mushkits.map(({ kit_name, kit_id }, index) => {
            const history = historyDataByKit[kit_id] || [];
            const page = currentPage[kit_id] || 1;
            const fromDate = dateRange[kit_id]?.from || "";
            const toDate = dateRange[kit_id]?.to || "";

            // Filter history by selected date range
            const filteredHistory = history.filter((entry) => {
              const entryDate = new Date(entry.rawDate);
              const from = fromDate ? new Date(fromDate) : null;
              const to = toDate ? new Date(toDate + "T23:59:59") : null;
              return (!from || entryDate >= from) && (!to || entryDate <= to);
            });

            const totalPages = Math.ceil(filteredHistory.length / ROWS_PER_PAGE);

            const pageData = filteredHistory.slice(
              (page - 1) * ROWS_PER_PAGE,
              page * ROWS_PER_PAGE
            );

            return (
              <section className="mushkit-section" key={kit_id}>
                <h2>{kit_name}</h2>

                <div className="averages">
                  <p>Avg Temperature: {averages[kit_id]?.avgTemp ?? "N/A"} °C</p>
                  <p>Avg Humidity: {averages[kit_id]?.avgHumid ?? "N/A"} %</p>
                </div>

                <div className="date-filter">
                  <label>
                    From:{" "}
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => updateDateRange(kit_id, "from", e.target.value)}
                    />
                  </label>
                  <label>
                    To:{" "}
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => updateDateRange(kit_id, "to", e.target.value)}
                    />
                  </label>
                </div>

                <div className="actions">
                  <button onClick={() => handleDownloadExcel(kit_id, kit_name)}>
                    <FaDownload /> Download Excel
                  </button>
                  <button
                    onClick={() => handleDeleteHistory(kit_id)}
                    disabled={isDeleting[kit_id]}
                  >
                    {isDeleting[kit_id] ? `Deleting ${deletingProgress[kit_id]}%` : <><FaTrash /> Delete History</>}
                  </button>

                  {/* New See Graph button */}
                  <button onClick={() => setModalKitId(kit_id)}>
                    See Graph
                  </button>
                </div>

                <div className="history-table-wrapper">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Temperature (°C)</th>
                        <th>Humidity (%)</th>
                        <th>Water Level</th>
                        <th>Light Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageData.length === 0 ? (
                        <tr>
                          <td colSpan="5">No data for the selected date range.</td>
                        </tr>
                      ) : (
                        pageData.map((entry) => (
                          <tr key={entry.id}>
                            <td>{entry.timestamp}</td>
                            <td>{entry.temperature}</td>
                            <td>{entry.humidity}</td>
                            <td>{entry.waterStatus}</td>
                            <td>{entry.lightStatus}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="pagination">
                  <button onClick={() => handlePrevious(kit_id)} disabled={page <= 1}>
                    Previous
                  </button>
                  <span>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => handleNext(kit_id, filteredHistory.length)}
                    disabled={page >= totalPages}
                  >
                    Next
                  </button>
                </div>
              </section>
            );
          })
        )}

        {/* Modal for graph */}
        {modalKitId && (
          <div className="modal-overlay" onClick={() => setModalKitId(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setModalKitId(null)}>
                &times;
              </button>
              <h3>Graph for {mushkits.find((kit) => kit.kit_id === modalKitId)?.kit_name}</h3>
              <DataChart data={historyDataByKit[modalKitId]} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DataHistory;

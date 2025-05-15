import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../database/firebase";
import { useAuth } from "../context/AuthContext";
import SideNavBar from "../static/SideNavBar";
import "../component styles/Dashboard.css";
import "../component styles/DashboardMedia.css";
import GaugeTemp from "../charts/GaugeTemp";
import GaugeHumid from "../charts/GaugeHumid";
import WaterLevel from "../dynamic/WaterLevel";
import GrowingLight from "../dynamic/GrowingLight";
import usePreventBackNavigation from "../hooks/usePreventBackNavigation";

const Dashboard = () => {
  usePreventBackNavigation();  
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const { user } = useAuth();

  const [mushkits, setMushkits] = useState([]);
  const [sensorDataByKit, setSensorDataByKit] = useState({});

  useEffect(() => {
    if (!user?.uid) return;

    const userRef = doc(db, "users", user.uid);

    const unsubscribeUser = onSnapshot(userRef, (userDoc) => {
      if (userDoc.exists()) {
        const data = userDoc.data();
        const kits = data.mushkits || [];
        setMushkits(kits);

        const unsubscribes = [];

        kits.forEach((kit) => {
          const sensorRef = doc(db, "sensorData", kit.kit_id);

          const unsubscribeSensor = onSnapshot(sensorRef, (sensorDoc) => {
            if (sensorDoc.exists()) {
              const sensor = sensorDoc.data();
              setSensorDataByKit((prevData) => ({
                ...prevData,
                [kit.kit_id]: {
                  temperature: sensor.temperature || 0,
                  humidity: sensor.humidity || 0,
                  waterStatus: sensor.waterStatus || "Unknown",
                  lightStatus: sensor.lightStatus || "Unknown",
                  timestamp: sensor.timestamp || "",
                },
              }));
            }
          });

          unsubscribes.push(unsubscribeSensor);
        });

        return () => {
          unsubscribes.forEach((unsubscribe) => unsubscribe());
        };
      }
    });

    return () => unsubscribeUser();
  }, [user]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Not Available";

    const date = new Date(timestamp);
    const optionsDate = { year: "numeric", month: "long", day: "numeric" };
    const optionsTime = { hour: "numeric", minute: "2-digit", hour12: true };

    return `${date.toLocaleDateString("en-US", optionsDate)} @ ${date.toLocaleTimeString("en-US", optionsTime)}`;
  };

  return (
    <div className="dashboard-container">
      <SideNavBar onToggle={setIsSidebarExpanded} />
      <div>
        <div className={`dashboard-header ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
          <h1>Dashboard</h1>
        </div>

        {mushkits.map((kit, index) => {
          const data = sensorDataByKit[kit.kit_id] || {};

          return (
            <div key={index} className="gauge-section">
              <div className="section-dashtitle">
                {kit.kit_name || `MushKit #${index + 1}`}
              </div>

              <div className="gauge-temp">
                <GaugeTemp value={data.temperature || 0} />
              </div>

              <div className="gauge-humid">
                <GaugeHumid value={data.humidity || 0} />
              </div>

              <div className="status-cell">
                <GrowingLight value={data.lightStatus} />
                <WaterLevel value={data.waterStatus} />
              </div>

              <div className="time-cell">
                <h3>Last Updated:</h3>
                <div className="time-text">
                  <p>{formatTimestamp(data.timestamp)}</p>
                  <p>MushKit ID# {kit.kit_id}</p>
                </div>
              </div>

              <div className="gauge-label"> <div className="temp-label"> Temperature </div> </div>
              <div className="gauge-label"> <div className="humid-label">  Humidity  </div> </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;

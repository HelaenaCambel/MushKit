import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../database/firebase";
import { useAuth } from "../context/AuthContext";
import SideNavBar from "../static/SideNavBar";
import "../component styles/Dashboard.css";
import GaugeTemp from "../charts/GaugeTemp";
import GaugeHumid from "../charts/GaugeHumid";
import WaterLevel from "../dynamic/WaterLevel"; 
import GrowingLight from "../dynamic/GrowingLight";
import usePreventBackNavigation from "../hooks/usePreventBackNavigation";

const Dashboard = () => {
  usePreventBackNavigation();
  const { user } = useAuth();

  const [mushkits, setMushkits] = useState([]);
  const [waterLevels, setWaterLevels] = useState([]);
  const [lightStatuses, setLightStatuses] = useState([]);

  useEffect(() => {
    const fetchMushKits = async () => {
      if (!user?.uid) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          const kits = data.mushkits || [];
          setMushkits(kits);
          setWaterLevels(kits.map(() => "Medium"));
          setLightStatuses(kits.map(() => "On"));
        }
      } catch (error) {
        console.error("Failed to fetch MushKit data:", error);
      }
    };

    fetchMushKits();
  }, [user]);

  return (
    <div className="dashboard-container">
      <SideNavBar />
      <div>
        <h1>Dashboard</h1>

        {mushkits.map((kit, index) => (
          <div key={index} className={`gauge-section${index + 1}`}>
            <div className="section-title">{kit.kit_name || `MushKit #${index + 1}`}</div>

            <div className="gauge-temp">
              <GaugeTemp value={20 + index * 3} label="C°" max={60} />
            </div>
            <div className="gauge-humid">
              <GaugeHumid value={60 + index * 5} label="%" max={100} />
            </div>

            <div className="spanned-cell">
              <WaterLevel
                value={waterLevels[index]}
                onChange={(newValue) => {
                  const updated = [...waterLevels];
                  updated[index] = newValue;
                  setWaterLevels(updated);
                }}
              />
              <GrowingLight
                value={lightStatuses[index]}
                onChange={(newValue) => {
                  const updated = [...lightStatuses];
                  updated[index] = newValue;
                  setLightStatuses(updated);
                }}
              />
            </div>

            <div className="gauge-label">Temperature</div>
            <div className="gauge-label">Humidity</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
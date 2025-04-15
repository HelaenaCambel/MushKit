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
  const [temp, setTemp] = useState(0);
  const [humid, setHumid] = useState(0);

  const [mushkits, setMushkits] = useState([]);
  const [waterLevels, setWaterLevels] = useState([]);
  const [lightStatus, setLightStatus] = useState([]);

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
        }
  
        const latestRef = doc(db, "sensorData", "latest");
        const latestDoc = await getDoc(latestRef);
  
        if (latestDoc.exists()) {
          const sensorData = latestDoc.data();
          const humidity = sensorData.humidity || 0;
          const temperature = sensorData.temperature || 0;
          const water = sensorData.waterStatus || "Unknown";
          const light = sensorData.lightStatus || "Unknown";
  
          setWaterLevels(Array(userDoc.data().mushkits.length).fill(water));
          setLightStatus(Array(userDoc.data().mushkits.length).fill(light));
          setTemp(temperature);
          setHumid(humidity);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
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
              <GaugeTemp value={temp} label="C°" max={60} />
            </div>
            <div className="gauge-humid">
              <GaugeHumid value={humid} label="%" max={100} />
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
                value={lightStatus[index]}
                onChange={(newValue) => {
                  const updated = [...lightStatus];
                  updated[index] = newValue;
                  setLightStatus(updated);
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
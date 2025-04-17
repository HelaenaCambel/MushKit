import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
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
    if (!user?.uid) return;
  
    const userRef = doc(db, "users", user.uid);
  
    const unsubscribeUser = onSnapshot(userRef, (userDoc) => {
      if (userDoc.exists()) {
        const data = userDoc.data();
        const kits = data.mushkits || [];
        setMushkits(kits);
  
        if (kits.length > 0) {
          const kitId = kits[0].kit_id;
          const sensorRef = doc(db, "sensorData", kitId);
  
          const unsubscribeSensor = onSnapshot(sensorRef, (sensorDoc) => {
            if (sensorDoc.exists()) {
              const sensorData = sensorDoc.data();
              const humidity = sensorData.humidity || 0;
              const temperature = sensorData.temperature || 0;
              const water = sensorData.waterStatus || "Unknown";
              const light = sensorData.lightStatus || "Unknown";
  
              setTemp(temperature);
              setHumid(humidity);
              setWaterLevels(Array(kits.length).fill(water));
              setLightStatus(Array(kits.length).fill(light));
            }
          });
  
          return () => unsubscribeSensor();
        }
      }
    });
    return () => unsubscribeUser();
  }, [user]);  

  return (
    <div className="dashboard-container">
      <SideNavBar />
      <div>
        <h1>Dashboard</h1>

        {mushkits.map((kit, index) => (
          <div key={index} className={`gauge-section`}>
            <div className="section-title">{kit.kit_name || `MushKit #${index + 1}`}</div>

            <div className="gauge-temp">
              <GaugeTemp value={temp} label="C°" max={60} />
            </div>
            <div className="gauge-humid">
              <GaugeHumid value={humid} label="%" max={100} />
            </div>

            <div className="spanned-cell">
              <WaterLevel value={waterLevels[index]} />
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
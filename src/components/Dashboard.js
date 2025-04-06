import React, { useState } from "react";
import SideNavBar from "../static/SideNavBar";
import "../component styles/Dashboard.css";
import GaugeTemp from "../charts/GaugeTemp";
import GaugeHumid from "../charts/GaugeHumid";
import WaterLevel from "../dynamic/WaterLevel"; 
import GrowingLight from "../dynamic/GrowingLight";

const Dashboard = () => {
  //For MushKit #1
  const [waterLevel1, setWaterLevel1] = useState("Medium");
  const [lightStatus1, setLightStatus1] = useState("On");

  //For MushKit #2
  const [waterLevel2, setWaterLevel2] = useState("Low");
  const [lightStatus2, setLightStatus2] = useState("Off");

  return (
    <div className="dashboard-container">
      <SideNavBar />
      <div>
        <h1>Dashboard</h1>

        <div className="gauge-section1">
          <div className="section-title">MushKit #1</div>

          <div className="gauge-temp">
            <GaugeTemp value={13} label="C°" max={60} />
          </div>
          <div className="gauge-humid">
            <GaugeHumid value={80} label="%" max={100} />
          </div>
          <div className="spanned-cell">
            <WaterLevel value={waterLevel1} onChange={setWaterLevel1} />
            <GrowingLight value={lightStatus1} onChange={setLightStatus1} />
          </div>

          <div className="gauge-label">Temperature</div>
          <div className="gauge-label">Humidity</div>
        </div>

        <div className="gauge-section2">
          <div className="section-title">MushKit #2</div>

          <div className="gauge-temp">
            <GaugeTemp value={23} label="C°" max={60} />
          </div>
          <div className="gauge-humid">
            <GaugeHumid value={70} label="%" max={100} />
          </div>
          <div className="spanned-cell">
            <WaterLevel value={waterLevel2} onChange={setWaterLevel2} />
            <GrowingLight value={lightStatus2} onChange={setLightStatus2} />
          </div>

          <div className="gauge-label">Temperature</div>
          <div className="gauge-label">Humidity</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React from "react";
import SideNavBar from "../static/SideNavBar";
import "../styles/Dashboard.css";
import GaugeTemp from "../charts/GaugeTemp";
import GaugeHumid from "../charts/GaugeHumid";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <SideNavBar />
      <div /*className="dashboard-content"*/>
        <h1>Dashboard</h1>

        <div className="gauge-section1">
          <h2>Temperature</h2>
          <GaugeTemp value={13} label="°C" max={60}/>
          
          <h2>Humidity</h2>
          <GaugeHumid value={80} label="%" max={100}/>
        </div>

        <div className="gauge-section2">
          <h2>Temperature</h2>
          <GaugeTemp value={20} label="°C" max={60}/>

          <h2>Humidity</h2>
          <GaugeHumid value={70} label="%" max={100}/>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
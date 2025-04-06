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
          <div className="kit-title">MushKit #1</div>

          {/* 1st Row */}
          <div className="gauge-temp">
            <GaugeTemp value={13} label="C°" max={60} />
          </div>
          <div className="gauge-humid">
            <GaugeHumid value={80} label="%" max={100} />
          </div>
          <div className="spanned-cell">
            <div className="status-item">
              <h3>Water Level Status</h3>
              <div className="water-level">
                <span>High</span>
                <span>Medium</span>
                <span>Low</span>
              </div>
            </div>

            <div className="peltier">
              <h3>Peltier Air Cooling Status</h3>
              <div className="peltier-status">
                <span>On</span>
                <span>Off</span>
              </div>
            </div>

            <div className="light">
              <h3>Growing Light Status</h3>
              <div className="light-status">
                <span>On</span>
                <span>Off</span>
              </div>
            </div>
          </div>

          {/* 2nd Row */}
          <div className="gauge-label">Temperature</div>
          <div className="gauge-label">Humidity</div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
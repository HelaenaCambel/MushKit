import React, { useState }from "react";
import SideNavBar from "../static/SideNavBar";
import "../styles/Dashboard.css";
import GaugeTemp from "../charts/GaugeTemp";
import GaugeHumid from "../charts/GaugeHumid";

const Dashboard = () => {
  //For MushKit #1
  const [waterLevel1, setWaterLevel1] = useState("Medium");
  const [lightStatus1, setLightStatus1] = useState("On");
  
  // For MushKit #2
  const [waterLevel2, setWaterLevel2] = useState("Low"); 
  const [lightStatus2, setLightStatus2] = useState("Off");
  
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
                <span 
                  className={waterLevel1 === "High" ? "active-high" : ""}
                  onClick={() => setWaterLevel1("High")}
                >
                  High
                </span>
                <span 
                  className={waterLevel1 === "Medium" ? "active-medium" : ""}
                  onClick={() => setWaterLevel1("Medium")}
                >
                  Medium
                </span>
                <span 
                  className={waterLevel1 === "Low" ? "active-low" : ""}
                  onClick={() => setWaterLevel1("Low")}
                >
                  Low
                </span>
              </div>
            </div>

            <div className="light">
              <h3>Growing Light Status</h3>
              <div className="light-status">
                <span 
                  className={lightStatus1 === "On" ? "active-on" : ""}
                  onClick={() => setLightStatus1("On")}
                >
                  On
                </span>
                <span 
                  className={lightStatus1 === "Off" ? "active-off" : ""}
                  onClick={() => setLightStatus1("Off")}
                >
                  Off
                </span>
              </div>
            </div>
          </div>

          {/* 2nd Row */}
          <div className="gauge-label">Temperature</div>
          <div className="gauge-label">Humidity</div>
        </div>

        <div className="gauge-section2">
          <div className="kit-title">MushKit #2</div>

          {/* 1st Row */}
          <div className="gauge-temp">
            <GaugeTemp value={23} label="C°" max={60} />
          </div>
          <div className="gauge-humid">
            <GaugeHumid value={70} label="%" max={100} />
          </div>
          <div className="spanned-cell">
            <div className="status-item">
              <h3>Water Level Status</h3>
              <div className="water-level">
                <span 
                  className={waterLevel2 === "High" ? "active-high" : ""}
                  onClick={() => setWaterLevel2("High")}
                >
                  High
                </span>
                <span 
                  className={waterLevel2 === "Medium" ? "active-medium" : ""}
                  onClick={() => setWaterLevel2("Medium")}
                >
                  Medium
                </span>
                <span 
                  className={waterLevel2 === "Low" ? "active-low" : ""}
                  onClick={() => setWaterLevel2("Low")}
                >
                  Low
                </span>
              </div>
            </div>

            <div className="light">
              <h3>Growing Light Status</h3>
              <div className="light-status">
                <span 
                  className={lightStatus2 === "On" ? "active-on" : ""}
                  onClick={() => setLightStatus2("On")}
                >
                  On
                </span>
                <span 
                  className={lightStatus2 === "Off" ? "active-off" : ""}
                  onClick={() => setLightStatus2("Off")}
                >
                  Off
                </span>
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
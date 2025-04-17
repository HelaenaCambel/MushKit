import React from "react";
import "../dynamic/status.css";

const GrowingLight = ({ value }) => {
  return (
    <div className="light">
      <h3>Growing Light Status</h3>
      <div className="light-status">
        <span className={value === "ON" ? "active-on" : ""}>On</span>
        <span className={value === "OFF" ? "active-off" : ""}>Off</span>
      </div>
    </div>
  );
};

export default GrowingLight;

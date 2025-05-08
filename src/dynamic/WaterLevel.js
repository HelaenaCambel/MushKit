import React from "react";
import "../dynamic/status.css";

const WaterLevel = ({ value }) => {
  return (
    <div className="water-level">
      <h3>Water Level Status</h3>
      <div className="water-status">
        <span className={value === "HIGH" ? "active-high" : ""}>High</span>
        <span className={value === "MEDIUM" ? "active-medium" : ""}>Medium</span>
        <span className={value === "LOW" ? "active-low" : ""}>Low</span>
      </div>
    </div>
  );
};

export default WaterLevel;

import React from "react";
import "../dynamic/status.css";

const WaterLevel = ({ value, onChange }) => {
  return (
    <div className="water-level">
      <h3>Water Level Status</h3>
      <div className="water-status">
        <span
          className={value === "High" ? "active-high" : ""}
          onClick={() => onChange("High")}
        >
          High
        </span>
        <span
          className={value === "Medium" ? "active-medium" : ""}
          onClick={() => onChange("Medium")}
        >
          Medium
        </span>
        <span
          className={value === "Low" ? "active-low" : ""}
          onClick={() => onChange("Low")}
        >
          Low
        </span>
      </div>
    </div>
  );
};

export default WaterLevel;
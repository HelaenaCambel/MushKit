import React from "react";
import "../dynamic/status.css";

const GrowingLight = ({ value, onChange }) => {
  return (
    <div className="light">
      <h3>Growing Light Status</h3>
      <div className="light-status">
        <span
          className={value === "ON" ? "active-on" : ""}
          onClick={() => onChange("On")}
        >
          On
        </span>
        <span
          className={value === "OFF" ? "active-off" : ""}
          onClick={() => onChange("Off")}
        >
          Off
        </span>
      </div>
    </div>
  );
};

export default GrowingLight;
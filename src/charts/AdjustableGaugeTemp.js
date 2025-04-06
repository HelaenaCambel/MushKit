import React, { useState } from "react";
import GaugeTemp from "./GaugeTemp";

const AdjustableGaugeTemp = () => {
  const [tempValue, setTempValue] = useState(23); // Default temperature

  return (
    <div className="gauge-wrapper">
      <GaugeTemp value={tempValue} />
      <input
        type="range"
        min="0"
        max="60"
        value={tempValue}
        onChange={(e) => setTempValue(Number(e.target.value))}
        className="gauge-slider"
      />
    </div>
  );
};

export default AdjustableGaugeTemp;

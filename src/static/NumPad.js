import React, { useState, useEffect, useCallback } from "react";
import "./NumPad.css";

const NumPad = ({ onPinSubmit, onPinInput, resetKey }) => {
  const [input, setInput] = useState("");

  useEffect(() => {
    setInput("");
  }, [resetKey]);

  useEffect(() => {
    onPinInput?.(input); // Pass input to parent
  }, [input, onPinInput]);

  const handleButtonClick = useCallback((value) => {
    if (input.length < 4) {
      setInput((prev) => prev + value);
    }
  }, [input]);

  const handleClear = useCallback(() => {
    setInput("");
  }, []);

  const handleSubmit = useCallback(() => {
    if (input.length === 4 && onPinSubmit) {
      onPinSubmit(input); 
    }
  }, [input, onPinSubmit]);  

  const handleKeyDown = useCallback((e) => {
    if (e.key >= "0" && e.key <= "9") {
      handleButtonClick(e.key);
    }
    if (e.key === "Enter" && input.length === 4) {
      handleSubmit(e);  // Enter triggers submit
    }
    if (e.key === "Backspace") {
      setInput((prev) => prev.slice(0, -1));
    }
  }, [handleButtonClick, handleSubmit, input]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="numpad-container">
      <div className="numpad-display">
        <input type="text" value={input} readOnly maxLength="4" />
      </div>
      <div className="numpad-grid">
        {[...Array(9).keys()].map((i) => (
          <button key={i} onClick={() => handleButtonClick((i + 1).toString())}>
            {i + 1}
          </button>
        ))}
        <button onClick={handleClear}>C</button>
        <button onClick={() => handleButtonClick("0")}>0</button>
        <button onClick={handleSubmit} disabled={input.length !== 4}>Enter</button>
      </div>
    </div>
  );
};

export default NumPad;

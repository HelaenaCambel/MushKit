import React from 'react';
import '../../component styles/Register Details/Submit.css'; 

const Submit = ({ onClick }) => {
  return (
    <div className="submit-container">
      <button type="submit" className="submit-button" onClick={onClick}>
        Submit
      </button>
    </div>
  );
};

export default Submit;

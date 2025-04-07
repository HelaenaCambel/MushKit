import React from 'react';
import '../../component styles/Register Details/Buttons.css'; 

const Buttons = ({ onSubmit, onAddMushKit }) => {
  return (
    <div className="form-buttons">
      <button
        type="button"
        onClick={onAddMushKit}
        className="add-mushkit-button"
      >
        Add MushKit
      </button>
      <button
        type="submit"
        onClick={onSubmit}
        className="submit-button"
      >
        Submit Details
      </button>
    </div>
  );
};

export default Buttons;

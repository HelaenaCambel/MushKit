import React from 'react';
import '../../component styles/Register Details/Buttons.css'; 
import '../../component styles/Register Details/ButtonsMedia.css'; 

const Buttons = ({ canAdd, onAddMushKit, canSubmit, isSubmitting }) => {
  return (
    <div className="regform-buttons">
      <div className="left-buttons">
        <button
          type="button"
          className="add-mushkit-button"
          disabled={!canAdd || isSubmitting}
          onClick={onAddMushKit}
        >
          Add MushKit
        </button>
      </div>
      
      <button
        type="submit"
        className="regsubmit-button"
        disabled={!canSubmit || isSubmitting}
      >
        {isSubmitting ? <div className="spinner" /> : "Submit Details"}
      </button>
    </div>
  );
};

export default Buttons;
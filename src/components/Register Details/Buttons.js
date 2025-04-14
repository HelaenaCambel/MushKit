import React from 'react';
import '../../component styles/Register Details/Buttons.css'; 

const Buttons = ({ canAdd, onAddMushKit, canRemove, onRemoveMushKit, canSubmit, isSubmitting }) => {
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

        <button
          type="button"
          className="remove-mushkit-button"
          disabled={!canRemove || isSubmitting}
          onClick={onRemoveMushKit}
        >
          Remove MushKit
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
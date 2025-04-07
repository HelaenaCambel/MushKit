import React from 'react';
import '../../component styles/Register Details/Buttons.css'; 

const Buttons = ({ onSubmit, onAddMushKit, onRemoveMushKit }) => {
  return (
    <div className="form-buttons">
      <div className='lef-buttons'>
        <button
          type="button"
          onClick={onAddMushKit}
          className="add-mushkit-button"
        >
          Add MushKit
        </button>

        <button
          type="button"
          onClick={onRemoveMushKit}
          className="remove-mushkit-button"
        >
          Remove MushKit
        </button>
      </div>
      
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

import React from 'react';
import '../../component styles/Register Details/Buttons.css'; 

const Buttons = ({ canAdd, onAddMushKit, canRemove, onRemoveMushKit, canSubmit, onSubmit}) => {
  return (
    <div className="form-buttons">
      <div className='lef-buttons'>
        <button
          type="button"
          className="add-mushkit-button"
          disabled={!canAdd}
          onClick={onAddMushKit}
        > Add MushKit
        </button>

        <button
          type="button"
          className="remove-mushkit-button"
          disabled={!canRemove}
          onClick={onRemoveMushKit}
        > Remove MushKit
        </button>
      </div>
      
      <button
        type="submit"
        className="submit-button"
        disabled={!canSubmit}
        onClick={onSubmit}
      > Submit Details
      </button>
    </div>
  );
};

export default Buttons;

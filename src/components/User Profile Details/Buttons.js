import React from 'react';
import '../../component styles/User Profile Details/Buttons.css';
import '../../component styles/User Profile Details/ButtonsMedia.css';

const Buttons = ({
  isEditing,
  onEditProfile,
  onSubmitChanges,
  onCancelEdit,
  onAddMushKit,
  canSubmit,
  canAdd,
}) => {
  return (
    <div className="form-buttons">
      {isEditing ? (
        <>
          <div className="mushkit-buttons">
            <button
              type="button"
              className="add-mushkit"
              disabled={!canAdd}
              onClick={onAddMushKit}
            >
              Add MushKit
            </button>
          </div>
          <div className="action-buttons">
            <button
              type="button"
              className="submit-button"
              disabled={!canSubmit}
              onClick={onSubmitChanges}
            >
              Save Changes
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={onCancelEdit}
            >
              Cancel Edit
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mushkit-buttons"></div> 
          <div className="action-buttons">
            <button
              type="button"
              className="edit-button"
              onClick={onEditProfile}
            >
              Edit Profile
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Buttons;
import React from 'react';
import '../../component styles/User Profile Details/Buttons.css';

const Buttons = ({ isEditing, onEditProfile, onSubmitChanges, canSubmit }) => {
  return (
    <div className="form-buttons">
      {isEditing ? (
        <button
          type="button"
          className="submit-button"
          disabled={!canSubmit}
          onClick={onSubmitChanges}
        >
          Save Changes
        </button>
      ) : (
        <button
          type="button"
          className="edit-button"
          onClick={onEditProfile}
        >
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default Buttons;
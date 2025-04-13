import React from 'react';
import '../../component styles/User Profile Details/Buttons.css';

const Buttons = ({ onEditProfile }) => {
  return (
    <div className="form-buttons">
      <div className="right-button-wrapper">
        <button
          type="button"
          className="edit-button"
          onClick={onEditProfile}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Buttons;

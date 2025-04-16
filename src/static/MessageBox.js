import React from 'react';
import "./MessageBox.css";

const MessageBox = ({ message, onClose, isLoading = false }) => {
  return (
    <div className="message-box-overlay">
      <div className="message-box">
        <p>{message}</p>
        <button
          onClick={onClose}
          className="close-button"
          disabled={isLoading}
        >
          {isLoading ? <div className="updating-spinner" /> : "OK"}
        </button>
      </div>
    </div>
  );
};

export default MessageBox;
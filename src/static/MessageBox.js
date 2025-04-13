import React from 'react';
import "./MessageBox.css"; 

const MessageBox = ({ message, onClose }) => {
  return (
    <div className="message-box-overlay">
      <div className="message-box">
        <p>{message}</p>
        <button onClick={onClose} className="close-button">OK</button>
      </div>
    </div>
  );
};

export default MessageBox;

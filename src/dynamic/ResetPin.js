import React, { useState } from "react";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../database/firebase";
import "./ResetPin.css";

const ResetPinBox = ({ email, onClose }) => {
  const [password, setPassword] = useState("");
  const [newPin, setNewPin] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email), where("password", "==", password));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, "users", userDoc.id), {
          pin: newPin,
        });
        setMessage("PIN successfully updated.");
        setTimeout(onClose, 2000);
      } else {
        setMessage("Invalid email or password.");
      }
    } catch (error) {
      console.error("Error updating PIN:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="reset-box-overlay">
      <div className="reset-box">
        <h3>Reset PIN</h3>
        <input
          type="email"
          placeholder="Email"
          value={email}
          disabled
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New PIN"
          value={newPin}
          onChange={(e) => setNewPin(e.target.value)}
        />
        <button className="reset-btn" onClick={handleReset}>Submit</button>
        {message && <p className="reset-message">{message}</p>}
        <button className="cancel-btn" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ResetPinBox;

import React, { useState } from "react";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../database/firebase";
import "./Reset.css";

const ResetPinBox = ({ email, onClose }) => {
  const [pin, setPin] = useState("");
  const [newPass, setNewPass] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email), where("pin", "==", pin));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, "users", userDoc.id), {
          password: newPass,
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
          type="pin"
          placeholder="PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />
        <button className="reset-btn" onClick={handleReset}>Submit</button>
        {message && <p className="reset-message">{message}</p>}
        <button className="cancel-btn" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ResetPinBox;

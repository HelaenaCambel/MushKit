import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../database/firebase";
import NumPad from "../static/NumPad";
import ResetPin from "../dynamic/ResetPin";
import "../component styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [showResetBox, setShowResetBox] = useState(false);
  const [pinKey, setPinKey] = useState(0); // used to reset NumPad
  const navigate = useNavigate();

  const handlePinSubmit = async (pin) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email), where("pin", "==", pin));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.log("Login successful!");
        setLoginAttempts(0);
        setErrorMsg("");
        setPinKey(prev => prev + 1); // force reset NumPad
        navigate("/home");
      } else {
        setLoginAttempts((prev) => prev + 1);
        setErrorMsg("Email and PIN doesn't match.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div>
      <div className="login-header">
        <h1>MushKit</h1>
      </div>

      <div className="login-container">
        <div className="login-form">
          <div className="input-container">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <h2>Enter PIN</h2>
          <NumPad key={pinKey} resetKey={pinKey} onSubmit={handlePinSubmit} />

          {errorMsg && loginAttempts < 3 && (
            <p className="login-error-msg">{errorMsg}</p>
          )}

          {loginAttempts >= 3 && (
            <div className="forgot-pin">
              <p>
                Forgot your PIN?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowResetBox(true);
                  }}
                >
                  Click here to reset PIN.
                </a>
              </p>
            </div>
          )}

          <div className="register-text">
            <p>
              Don't have a PIN yet?{" "}
              <a href="/register">Click here to register.</a>
            </p>
          </div>
        </div>
      </div>

      {showResetBox && (
        <ResetPin
          email={email}
          onClose={() => setShowResetBox(false)}
        />
      )}
    </div>
  );
};

export default Login;
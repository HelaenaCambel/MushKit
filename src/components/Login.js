import React, {useState }from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../database/firebase";
import NumPad from "../static/NumPad";
import "../component styles/Login.css"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handlePinSubmit = async (pin) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email), where("pin", "==", pin));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.log("Login successful!");
        navigate("/home");
      } else {
        alert("Invalid email or PIN. Please try again.");
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
          <NumPad onSubmit={handlePinSubmit} />

          <div className="forgot-pin">
            <p>
              Forgot your PIN?{" "}
              <a href="/reset">Click here to reset PIN.</a>
            </p>
          </div>

          <div className="register-text">
            <p>
              Don't have a PIN yet?{" "}
              <a href="/register">Click here to register.</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

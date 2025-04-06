import React from "react";
import NumPad from "../static/NumPad";
import "../styles/Login.css"; // Include styles for the login page

const Login = () => {
  const handlePinSubmit = (pin) => {
    console.log("Entered PIN:", pin);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Enter PIN</h2>
        <NumPad onSubmit={handlePinSubmit} />
        <div className="register-text">
          <p>
            Don't have a PIN yet?{" "}
            <a href="/register">Click here to register.</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

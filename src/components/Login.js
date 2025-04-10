import React from "react";
import NumPad from "../static/NumPad";
import "../component styles/Login.css"; 

const Login = () => {
  const handlePinSubmit = (pin) => {
    console.log("Entered PIN:", pin);
  };

  return (
    <div>
      <div className="login-header">
        <h1>MushKit</h1>
      </div>

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
    </div>
  );
};

export default Login;

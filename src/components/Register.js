import React from 'react';
import "../component styles/Register.css";
import UserDetails from './Register Details/UserDetails';
import MushKitDetails from './Register Details/MushKitDetails';

const Register = () => {
  return (
    <div>
      <div className="register-header">
        <h1>MushKit Register</h1>
        <div className="login-text">
          <p>
            Already have an account?{" "}
            <a href="/">
              <button className="login-button">Login here</button>
            </a>
          </p>
        </div>
      </div>

      <div className="details-section">
         <div className="section-title">User Details</div>
         <UserDetails />
      </div>

      <div className="details-section">
        <div className="section-title">MushKit Details</div>
        <MushKitDetails />
      </div>
    </div>
  );
};

export default Register
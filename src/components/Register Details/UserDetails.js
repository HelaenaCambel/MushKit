import React, { useState }from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import "../../component styles/Register Details/UserDetails.css";

function UserDetails() {
    const [showPassword, setShowPassword] = useState(false);
  
    const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <form className="user-details-form">
        <div className="form-group">
            <label htmlFor="owner">MushKit Owner</label>
            <input type="text" id="owner" name="owner" placeholder="Enter owner's name" />
        </div>

        <div className="form-group">
            <label htmlFor="contact">Contact Number</label>
            <input type="tel" id="contact" name="contact" placeholder="Enter contact number" />
        </div>

        <div className="form-group">
            <label htmlFor="affiliation">Affiliation</label>
            <input type="text" id="affiliation" name="affiliation" placeholder="Enter affiliation" />
        </div>

        <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" placeholder="Enter email" />
        </div>

        <div className="form-group password-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
            <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter password"
            />
            <span className="eye-icon" onClick={togglePassword}>
                {showPassword ? <FaEye /> : <FaEyeSlash /> }
            </span>
            </div>
        </div>

        <div className="form-group">
            <label htmlFor="pin">MushKit PIN</label>
            <input type="text" id="pin" name="pin" placeholder="Enter MushKit PIN" />
        </div>
    </form>
  );
}

export default UserDetails;

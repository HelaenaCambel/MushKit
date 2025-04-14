import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../database/firebase";
import Reset from "../dynamic/Reset";
import ValidationSchema from "../schema/ValidationSchema";
import "../component styles/Login.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [showResetBox, setShowResetBox] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleLogin = async () => {
    try {
      const loginSchema = ValidationSchema.pick(["email", "password"]);
      await loginSchema.validate({ email, password }, { abortEarly: false });
      setErrors({}); 

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email), where("password", "==", password));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.log("Login successful!");
        setLoginAttempts(0);
        setErrorMsg("");
        navigate("/profile", { state: { email } });
      } else {
        setLoginAttempts((prev) => prev + 1);
        setErrorMsg("Email and Password didn't match.");
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const fieldErrors = {};
        error.inner.forEach((err) => {
          fieldErrors[err.path] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        console.error("Error during login:", error);
        setErrors({ general: "Something went wrong. Please try again later." });
      }
    }
  };

  const handleFieldChange = (field, value) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);

    if (errors[field]) {
      setErrors((prev) => {
        const updatedErrors = { ...prev };
        delete updatedErrors[field];
        return updatedErrors;
      });
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
            <label htmlFor="email">
              Email
              {errors.email && (
                <span className="login-error-msg"> {errors.email} </span>
              )}
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
            />
          </div>

          <div className="input-container password-container">
            <label htmlFor="password">
              Password
              {errors.password && (
                <span className="login-error-msg"> {errors.password} </span>
              )}
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => handleFieldChange("password", e.target.value)}
              />
              <span className="password-toggle" onClick={togglePassword}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          <button className="login" onClick={handleLogin}>
            Login
          </button>

          {errorMsg && loginAttempts < 3 && (
            <p className="login-error-msg">{errorMsg}</p>
          )}

          {errors.general && (
            <p className="login-error-msg">{errors.general}</p>
          )}

          {loginAttempts >= 3 && (
            <p className="forgot-pass">
              Forgot your password?{" "}
              <button
                className="reset-button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowResetBox(true);
                }}
              >
                Reset password.
              </button>
            </p>
          )}

          <div className="register-text">
            <p>
              Don't have an account yet?{" "}
              <a href="/register">Click here to register.</a>
            </p>
          </div>
        </div>
      </div>

      {showResetBox && (
        <Reset
          email={email}
          onClose={() => setShowResetBox(false)}
        />
      )}
    </div>
  );
};

export default Login;
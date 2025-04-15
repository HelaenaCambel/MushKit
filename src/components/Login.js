import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../database/firebase";
import { useAuth } from "../context/AuthContext"; 
import Reset from "../dynamic/Reset";
import ValidationSchema from "../schema/ValidationSchema";
import "../component styles/Login.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import usePreventBackNavigation from "../hooks/usePreventBackNavigation";

const Login = ({isSubmitting}) => {
  usePreventBackNavigation();
  
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [showResetBox, setShowResetBox] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true); 
  
    try {
      const loginSchema = ValidationSchema.pick(["email", "password"]);
      await loginSchema.validate({ email, password }, { abortEarly: false });
      setErrors({});
  
      await signInWithEmailAndPassword(auth, email, password);
      setLoginAttempts(0);
      setErrorMsg("");
  
      setUser({ email });
      navigate("/home", { replace: true });
    } catch (error) {
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        setLoginAttempts((prev) => prev + 1);
        setErrorMsg("Email and Password didn't match.");
      } else if (error.name === "ValidationError") {
        const newErrors = {};
        error.inner.forEach((e) => {
          newErrors[e.path] = e.message;
        });
        setErrors(newErrors);
      } else {
        console.error("Error during login:", error);
        setErrors({ general: "Something went wrong. Please try again later." });
      }
    } finally {
      setLoading(false);
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();      
          }}
        >
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

            <button className="login" onClick={handleLogin} type="submit" disabled={loading}>
              {loading ? <div className="login-spinner" /> : "Login"}
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
        </form>
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

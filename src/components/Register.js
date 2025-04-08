import React, { useState } from 'react';
import { useFormik } from 'formik';
import ValidationSchema from '../schema/ValidationSchema';
import "../component styles/Register.css";
import UserDetails from './Register Details/UserDetails';
import MushKitDetails from './Register Details/MushKitDetails';
import Buttons from './Register Details/Buttons';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showWifiPassword, setShowWifiPassword] = useState(false);
  const [mushKits, setMushKits] = useState([0]);

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleWifiPassword = () => setShowWifiPassword((prev) => !prev);

  const formik = useFormik({
    initialValues: {
      owner: '',
      contact: '',
      affiliation: '',
      email: '',
      password: '',
      pin: '',
      kit_name: '',
      wifi_ssid: '',
      wifi_pass: '',
    },
    validationSchema: ValidationSchema,
    onSubmit: (values) => {
      console.log('Submitted values:', values);
    },
  });
  
  const isFirstMushKitComplete =
  formik.values.kit_name.trim() !== '' &&
  formik.values.wifi_ssid.trim() !== '' &&
  formik.values.wifi_pass.trim() !== '' &&
  !formik.errors.kit_name &&
  !formik.errors.wifi_ssid &&
  !formik.errors.wifi_pass;

  const handleAddMushKit = () => {
    console.log("Add MushKit clicked");
    setMushKits(prev => [...prev, prev.length]);
  };

  const handleRemoveMushKit = () => {
    if (mushKits.length > 1) {
      setMushKits(prev => prev.slice(0, -1));
    }
  };

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

      <form className='register-form' onSubmit={formik.handleSubmit}>
        <div className="details-section-user">
          <div className="section-title">User Details</div>
          <UserDetails
            formik={formik}
            showPassword={showPassword}
            togglePassword={togglePassword}
          />
        </div>

        <div className="details-section-mushkit">
          <div className="section-title">MushKit Details</div>
          {mushKits.map((_, index) => (
            <MushKitDetails
              formik={formik}
              showWifiPassword={showWifiPassword}
              toggleWifiPassword={toggleWifiPassword}
            />
          ))}
        </div>

        <Buttons 
          canAdd={isFirstMushKitComplete}
          onAddMushKit={handleAddMushKit}
          canRemove={mushKits.length > 1}
          onRemoveMushKit={handleRemoveMushKit}
          canSubmit={formik.isValid && formik.dirty}
          onSubmit={formik.handleSubmit}
        />
      </form>
    </div>
  );
};

export default Register
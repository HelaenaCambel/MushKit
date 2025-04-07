import React from 'react';
import "../../component styles/Register Details/MushKitDetails.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function MushKitDetails( {formik, showWifiPassword, toggleWifiPassword} ) {
  return (
    <div className="mushkit-details-form">
      <div className="form-group">
        <label htmlFor="kit_name"> MushKit Name </label>
        <input
          type="text"
          id="kit_name"
          name="kit_name"
          placeholder="Enter MushKit name"
          value={formik.values.kit_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.kit_name && formik.errors.kit_name ? (
          <div className="error">{formik.errors.kit_name}</div>
        ) : null}
      </div>

      <div className="form-group span-2-3">
        <label htmlFor="wifi_ssid"> SSID (Wi-Fi Name) </label>
        <input
          type="text"
          id="wifi_ssid"
          name="wifi_ssid"
          placeholder="Enter Wi-Fi's name/SSID"
          value={formik.values.wifi_ssid}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.wifi_ssid && formik.errors.wifi_ssid ? (
          <div className="error">{formik.errors.wifi_ssid}</div>
        ) : null}
      </div>

      <div className="form-group password-group span-4-5">
        <label htmlFor="wifi_pass"> Wi-Fi Password</label>
        <div className="password-wrapper">
          <input
            type={showWifiPassword ? 'text' : 'password'}
            id="wifi_pass"
            name="wifi_pass"
            placeholder="Enter Wi-Fi password"
            value={formik.values.wifi_pass}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <span className="eye-icon" onClick={toggleWifiPassword}>
            {showWifiPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        {formik.touched.wifi_pass && formik.errors.wifi_pass ? (
          <div className="error">{formik.errors.wifi_pass}</div>
        ) : null}
      </div>      
    </div>
  )
}

export default MushKitDetails
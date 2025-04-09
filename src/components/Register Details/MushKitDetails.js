import React from 'react';
import "../../component styles/Register Details/MushKitDetails.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function MushKitDetails({ formik, index, showWifiPassword, toggleWifiPassword }) {
  const getField = (field) => `mushkits[${index}].${field}`;

  return (
    <div className="mushkit-details-form">
      <div className="form-group">
        <label htmlFor={getField("kit_name")}>MushKit Name</label>
        <input
          type="text"
          id={`kit_name_${index}`}
          name={getField("kit_name")}
          placeholder="Enter MushKit name"
          value={formik.values.mushkits[index].kit_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.mushkits?.[index]?.kit_name && formik.errors.mushkits?.[index]?.kit_name && (
          <div className="error">{formik.errors.mushkits[index].kit_name}</div>
        )}
      </div>

      <div className="form-group span-2-3">
        <label htmlFor={getField("wifi_ssid")}>SSID (Wi-Fi Name)</label>
        <input
          type="text"
          id={`wifi_ssid_${index}`}
          name={getField("wifi_ssid")}
          placeholder="Enter Wi-Fi's name/SSID"
          value={formik.values.mushkits[index].wifi_ssid}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.mushkits?.[index]?.wifi_ssid && formik.errors.mushkits?.[index]?.wifi_ssid && (
          <div className="error">{formik.errors.mushkits[index].wifi_ssid}</div>
        )}
      </div>

      <div className="form-group password-group span-4-5">
        <label htmlFor={getField("wifi_pass")}>Wi-Fi Password</label>
        <div className="password-wrapper">
          <input
            type={showWifiPassword ? 'text' : 'password'}
            id={`wifi_pass_${index}`}
            name={getField("wifi_pass")}
            placeholder="Enter Wi-Fi password"
            value={formik.values.mushkits[index].wifi_pass}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <span className="eye-icon" onClick={toggleWifiPassword}>
            {showWifiPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        {formik.touched.mushkits?.[index]?.wifi_pass && formik.errors.mushkits?.[index]?.wifi_pass && (
          <div className="error">{formik.errors.mushkits[index].wifi_pass}</div>
        )}
      </div>
    </div>
  );
}

export default MushKitDetails;

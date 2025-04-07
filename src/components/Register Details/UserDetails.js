import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import "../../component styles/Register Details/UserDetails.css";

function UserDetails( {formik, showPassword, togglePassword} ) {
  return (
    <div className="user-details-form">
      <div className="form-group">
        <label htmlFor="owner">MushKit Owner</label>
        <input
          type="text"
          id="owner"
          name="owner"
          placeholder="Enter owner's name"
          value={formik.values.owner}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.owner && formik.errors.owner ? (
          <div className="error">{formik.errors.owner}</div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="contact">Contact Number</label>
        <input
          type="tel"
          id="contact"
          name="contact"
          placeholder="Enter contact number"
          value={formik.values.contact}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.contact && formik.errors.contact ? (
          <div className="error">{formik.errors.contact}</div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="affiliation">Affiliation</label>
        <input
          type="text"
          id="affiliation"
          name="affiliation"
          placeholder="Enter affiliation"
          value={formik.values.affiliation}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="error">{formik.errors.email}</div>
        ) : null}
      </div>

      <div className="form-group password-group">
        <label htmlFor="password">Password</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            placeholder="Enter password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <span className="eye-icon" onClick={togglePassword}>
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        {formik.touched.password && formik.errors.password ? (
          <div className="error">{formik.errors.password}</div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="pin">MushKit PIN</label>
        <input
          type="text"
          id="pin"
          name="pin"
          placeholder="Enter MushKit PIN"
          value={formik.values.pin}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.pin && formik.errors.pin ? (
          <div className="error">{formik.errors.pin}</div>
        ) : null}
      </div>
    </div>
  );
}

export default UserDetails;

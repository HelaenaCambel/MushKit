import React from 'react';
import "../../component styles/Register Details/MushKitDetails.css";
import "../../component styles/Register Details/MushKitDetailsMedia.css";
import { MdDelete } from 'react-icons/md';

function MushKitDetails({ formik, index, showWifiPassword, toggleWifiPassword, remove, mushkitCount }) {
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

      <div className="form-group">
        <label htmlFor={getField("kit_id")}>MushKit ID No.</label>
        <input
          type="text"
          id={`kit_id_${index}`}
          name={getField("kit_id")}
          placeholder="Enter MushKit ID No."
          value={formik.values.mushkits[index].kit_id}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.mushkits?.[index]?.kit_id && formik.errors.mushkits?.[index]?.kit_id && (
          <div className="error">{formik.errors.mushkits[index].kit_id}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor={getField("temp_threshold")}>Temperature Threshold</label>
        <input
          type="text"
          id={`temp_threshold_${index}`}
          name={getField("temp_threshold")}
          placeholder="Enter Temperature Threshold"
          value={formik.values.mushkits[index].temp_threshold}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.mushkits?.[index]?.temp_threshold && formik.errors.mushkits?.[index]?.temp_threshold && (
          <div className="error">{formik.errors.mushkits[index].temp_threshold}</div>
        )}
      </div>

      <div className="form-group password-group">
        <label htmlFor={getField("humid_threshold")}>Humidity Threshold</label>
        <input
          type='text'
          id={`humid_threshold_${index}`}
          name={getField("humid_threshold")}
          placeholder="Enter Humidity Threshold"
          value={formik.values.mushkits[index].humid_threshold}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.mushkits?.[index]?.humid_threshold && formik.errors.mushkits?.[index]?.humid_threshold && (
          <div className="error">{formik.errors.mushkits[index].humid_threshold}</div>
        )}
      </div>

      <div
        className={`regremove-icon ${mushkitCount === 1 ? "regremove-icon-disabled" : ""}`}
        onClick={mushkitCount === 1 ? undefined : () => remove(index)}
      >
        <MdDelete size={28} />
      </div>   
    </div>
  );
}

export default MushKitDetails;

import React from "react";
import "../../component styles/User Profile Details/MushKitDetailsView.css";

const MushKitDetailsView = ({ mushkits, isEditing, onChange, errors }) => {
  const handleInputChange = (index, field, value) => {
    const updatedMushkits = [...mushkits];
    updatedMushkits[index] = {
      ...updatedMushkits[index],
      [field]: value,
    };
    onChange(updatedMushkits);
  };

  return (
    <div className="mushkit-section">
      <div className="section-title">MushKit Details</div>
      <div className="mushkit-form">
        {mushkits.map((kit, index) => (
          <React.Fragment key={index}>
            <div className="form-group">
              <label htmlFor={`kit_name_${index}`}>Kit Name</label>
              <input
                type="text"
                id={`kit_name_${index}`}
                value={kit.kit_name || ""}
                disabled={!isEditing}
                onChange={(e) =>
                  handleInputChange(index, "kit_name", e.target.value)
                }
              />
              {errors.kit_name && <span className="error-message">{errors.kit_name}</span>}
            </div>

            <div className="form-group span-2-3">
              <label htmlFor={`wifi_ssid_${index}`}>Wi-Fi SSID</label>
              <input
                type="text"
                id={`wifi_ssid_${index}`}
                value={kit.wifi_ssid || ""}
                disabled={!isEditing}
                onChange={(e) =>
                  handleInputChange(index, "wifi_ssid", e.target.value)
                }
              />
              {errors.wifi_ssid && <span className="error-message">{errors.wifi_ssid}</span>}
            </div>

            <div className="form-group span-4-5">
              <label htmlFor={`wifi_pass_${index}`}>Wi-Fi Password</label>
              <input
                type="text"
                id={`wifi_pass_${index}`}
                value={kit.wifi_pass || ""}
                disabled={!isEditing}
                onChange={(e) =>
                  handleInputChange(index, "wifi_pass", e.target.value)
                }
              />
              {errors.wifi_pass && <span className="error-message">{errors.wifi_pass}</span>}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MushKitDetailsView;
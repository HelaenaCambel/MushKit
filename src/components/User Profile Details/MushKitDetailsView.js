import React from "react";
import "../../component styles/User Profile Details/MushKitDetailsView.css";
import "../../component styles/User Profile Details/MushKitDetailsViewMedia.css";
import { MdDelete } from "react-icons/md";

const MushKitDetailsView = ({ mushkits, isEditing, onChange, canRemove, onRemove, errors }) => {
  const handleInputChange = (index, field, value) => {
    const updatedMushkits = [...mushkits];
    updatedMushkits[index] = {
      ...updatedMushkits[index],
      [field]: value,
    };
    onChange(updatedMushkits);
  };

  const handleRemoveClick = (index) => {
    if (onRemove && mushkits.length > 1) {
      onRemove(index);
    }
  };

  return (
    <div className="mushkit-section">
      <div className={isEditing ? "mushkit-form-edit" : "mushkit-form-view"}>
        <div
          className={`section-mushtitle ${isEditing ? "span-5" : "span-4"}`}
        >
          MushKit Details
        </div>
        {mushkits.map((kit, index) => (
          <React.Fragment key={index}>
            <div className="form-group">
              <label htmlFor={`kit_name_${index}`}>MushKit Name</label>
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

            <div className="form-group">
              <label htmlFor={`kit_id_${index}`}>MushKit ID No.</label>
              <input
                type="text"
                id={`kit_id_${index}`}
                value={kit.kit_id || ""}
                disabled={!isEditing || (kit.kit_id && !kit.justAdded)}
                onChange={(e) =>
                  handleInputChange(index, "kit_id", e.target.value)
                }
              />
              {kit.kit_id && errors[`mushkits[${index}].kit_id`] && (
                <span className="error-message">
                  {errors[`mushkits[${index}].kit_id`]}
                </span>
              )}
            </div>

            <div className="form-group">
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

            <div className="form-group">
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

            {isEditing && (
              <div
                className={`remove-icon ${mushkits.length === 1 ? "remove-icon-disabled" : ""}`}
                onClick={mushkits.length === 1 ? undefined : () => handleRemoveClick(index)}
              >
                <MdDelete size={28} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MushKitDetailsView;
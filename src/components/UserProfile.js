import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../database/firebase";
import SideNavBar from "../static/SideNavBar";
import UserDetailsView from "../components/User Profile Details/UserDetailsView";
import MushKitDetailsView from "../components/User Profile Details/MushKitDetailsView";
import Buttons from "../components/User Profile Details/Buttons";
import NumPad from "../static/NumPad";
import "../component styles/UserProfile.css";
import ValidationSchema from "../schema/ValidationSchema";
import MessageBox from "../static/MessageBox";

const UserProfile = () => {
  const location = useLocation();
  const userEmail = location.state?.email;

  const [userData, setUserData] = useState(null);
  const [editedUserData, setEditedUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [userDocId, setUserDocId] = useState(null);
  const [errors, setErrors] = useState({});
  const [showNumPad, setShowNumPad] = useState(false);
  const [pinMatched, setPinMatched] = useState(false);
  const [showMessageBox, setShowMessageBox] = useState(false);  

  const handleCancelEdit = () => {
    setEditedUserData({ ...userData });
    setIsEditing(false);
    setCanSubmit(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (userEmail) {
        try {
          const q = query(collection(db, "users"), where("email", "==", userEmail));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const data = userDoc.data();
            setUserData(data);
            setEditedUserData(data);
            setUserDocId(userDoc.id);
          } else {
            console.warn("No user found with this email.");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      }
    };

    fetchUser();
  }, [userEmail]);

  const handleEditProfile = () => {
    setEditedUserData({ ...userData });
    setIsEditing(true);
    setCanSubmit(false);
  };

  const handleSubmitChanges = useCallback(() => {
    if (pinMatched) {
      if (!userDocId) return;
  
      updateDoc(doc(db, "users", userDocId), editedUserData)
        .then(() => {
          setUserData(editedUserData);
          setIsEditing(false);
          setCanSubmit(false);
          setPinMatched(false);
          setShowMessageBox(true); 
        })
        .catch((error) => {
          console.error("Error updating Firestore:", error);
        });
    } else {
      setShowNumPad(true);
    }
  }, [pinMatched, userDocId, editedUserData]);  // Add dependencies here

  const handleAddMushKit = () => {
    const newMushKit = { kit_name: "", wifi_ssid: "", wifi_pass: "" };
    setEditedUserData((prev) => ({
      ...prev,
      mushkits: [...(prev.mushkits || []), newMushKit],
    }));
  };

  const handleRemoveMushKit = () => {
    const currentKits = editedUserData.mushkits || [];
    if (currentKits.length > 1) {
      const updatedKits = currentKits.slice(0, -1);
      setEditedUserData((prev) => ({ ...prev, mushkits: updatedKits }));
    }
  };

  useEffect(() => {
    if (!userData || !editedUserData) return;

    const validateData = async () => {
      try {
        await ValidationSchema.validate(editedUserData, {
          abortEarly: false,
          context: { mushkits: editedUserData.mushkits },
        });
        setErrors({});
        const hasChanges = JSON.stringify(userData) !== JSON.stringify(editedUserData);
        setCanSubmit(hasChanges);
      } catch (err) {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
        setCanSubmit(false);
      }
    };

    validateData();
  }, [editedUserData, userData]);

  const handlePinSubmit = (pin) => {
    if (userData.pin === pin) {
      setPinMatched(true);
      setShowNumPad(false);
      setShowMessageBox(true);  // Show message box immediately after PIN match
    } else {
      alert("Incorrect PIN. Please try again.");
    }
  };   

  return (
    <div className="profile-container">
      <SideNavBar />
      <div className="profile-content">
        <h1>Profile</h1>
        {userData ? (
          <>
            <UserDetailsView
              user={editedUserData}
              isEditing={isEditing}
              onChange={(updatedUser) =>
                setEditedUserData((prev) => ({ ...prev, ...updatedUser }))}
              errors={errors}
            />
            <MushKitDetailsView
              mushkits={editedUserData.mushkits || []}
              isEditing={isEditing}
              onChange={(updatedKits) =>
                setEditedUserData((prev) => ({ ...prev, mushkits: updatedKits }))}
              errors={errors}
            />
            <Buttons
              isEditing={isEditing}
              onEditProfile={handleEditProfile}
              onSubmitChanges={handleSubmitChanges}
              onCancelEdit={handleCancelEdit}
              onAddMushKit={handleAddMushKit}
              onRemoveMushKit={handleRemoveMushKit}
              canSubmit={canSubmit}
              canAdd={isEditing}
              canRemove={isEditing && editedUserData.mushkits?.length > 1}
            />
          </>
        ) : (
          <p>Loading user data...</p>
        )}

        {showNumPad && (
          <div className="numPad-modal">
            <div className="numPad-content">
              <h2>Please enter your PIN</h2>
              <NumPad onPinSubmit={handlePinSubmit} />
              <button
                className="close-modal"
                onClick={() => {
                  setShowNumPad(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showMessageBox && (
          <MessageBox
            message="Profile updated successfully."
            onClose={() => setShowMessageBox(false)}
          />
        )}

      </div>
    </div>
  );
};

export default UserProfile;
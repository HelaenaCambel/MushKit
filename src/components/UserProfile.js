import React, { useEffect, useState, useCallback } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../database/firebase";
import SideNavBar from "../static/SideNavBar";
import UserDetailsView from "../components/User Profile Details/UserDetailsView";
import MushKitDetailsView from "../components/User Profile Details/MushKitDetailsView";
import Buttons from "../components/User Profile Details/Buttons";
import NumPad from "../static/NumPad";
import MessageBox from "../static/MessageBox";
import ValidationSchema from "../schema/ValidationSchema";
import { useAuth } from "../context/AuthContext";
import usePreventBackNavigation from "../hooks/usePreventBackNavigation";
import "../component styles/UserProfile.css";

const UserProfile = () => {
  usePreventBackNavigation();
  const { user } = useAuth();
  
  const [userData, setUserData] = useState(null);
  const [editedUserData, setEditedUserData] = useState(null);
  const [userDocId, setUserDocId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [showNumPad, setShowNumPad] = useState(false);
  const [pinMatched, setPinMatched] = useState(false);
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for user data

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        console.log("User is not authenticated."); 
        return;
      }
  
      if (!user.uid) {
        console.log("No user UID found.");
        return;
      }
  
      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
  
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("User data fetched:", userData);
          setUserData(userData);
          setEditedUserData(userData);
          setUserDocId(userDoc.id);
        } else {
          console.warn("No user document found for UID:", user.uid);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false); 
      }
    };
  
    if (user) {
      fetchUser();
    }
  }, [user]); 
  
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
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
        setCanSubmit(false);
      }
    };

    validateData();
  }, [editedUserData, userData]);

  const handleEditProfile = () => {
    setIsEditing(true);
    setCanSubmit(false);
    setEditedUserData({ ...userData });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCanSubmit(false);
    setEditedUserData({ ...userData });
  };

  const handleAddMushKit = () => {
    const newMushKit = { kit_name: "", wifi_ssid: "", wifi_pass: "" };
    setEditedUserData((prev) => ({
      ...prev,
      mushkits: [...(prev.mushkits || []), newMushKit],
    }));
  };

  const handleRemoveMushKit = () => {
    const kits = editedUserData.mushkits || [];
    if (kits.length > 1) {
      setEditedUserData((prev) => ({
        ...prev,
        mushkits: kits.slice(0, -1),
      }));
    }
  };

  const handleSubmitChanges = useCallback(() => {
    if (!userDocId) return;

    if (pinMatched) {
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
          alert("Error updating profile. Please try again later.");
        });
    } else {
      setShowNumPad(true);
    }
  }, [pinMatched, userDocId, editedUserData]);

  const handlePinSubmit = (pin) => {
    if (userData?.pin === pin) {
      setPinMatched(true);
      setShowNumPad(false);
      handleSubmitChanges();
    } else {
      alert("Incorrect PIN. Please try again.");
    }
  };

  return (
    <div className="profile-container">
      <SideNavBar />
      <div className="profile-content">
        <h1>Profile</h1>

        {loading ? (
          <p>Loading user data...</p> // Show loading message while data is being fetched
        ) : (
          <>
            {userData ? (
              <>
                <UserDetailsView
                  user={editedUserData}
                  isEditing={isEditing}
                  onChange={(updatedUser) =>
                    setEditedUserData((prev) => ({ ...prev, ...updatedUser }))
                  }
                  errors={errors}
                />

                <MushKitDetailsView
                  mushkits={editedUserData.mushkits || []}
                  isEditing={isEditing}
                  onChange={(updatedKits) =>
                    setEditedUserData((prev) => ({ ...prev, mushkits: updatedKits }))
                  }
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
                  canRemove={isEditing && editedUserData?.mushkits?.length > 1}
                />
              </>
            ) : (
              <p>No user data available</p> // Show message if no user data found
            )}
          </>
        )}

        {showNumPad && (
          <div className="numPad-modal">
            <div className="numPad-content">
              <h2>Please enter your PIN</h2>
              <NumPad onPinSubmit={handlePinSubmit} />
              <button className="close-modal" onClick={() => setShowNumPad(false)}>
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

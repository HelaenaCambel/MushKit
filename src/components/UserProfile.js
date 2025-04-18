import React, { useEffect, useState, useCallback } from "react";
import { doc, getDoc, updateDoc, getDocs, collection } from "firebase/firestore";
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

const LoadingSpinner = () => (
  <div className="mushroom-loading">
    <img
      src="/mushroom.svg"
      alt="Loading spinner"
      className="loading-spinner"
    />
  </div>
);

const UserProfile = () => {
  usePreventBackNavigation();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
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
  const [messageBoxContent, setMessageBoxContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [canAddMushKit, setCanAddMushKit] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.uid) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setTimeout(() => {
            setUserData(data);
            setEditedUserData(data);
            setUserDocId(user.uid);
            setIsLoading(false);
          }, 500);
        } else {
          console.warn("User document not found.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
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

  useEffect(() => {
    if (!editedUserData?.mushkits?.length) {
      setCanAddMushKit(true);
      return;
    }
  
    const latestKitIndex = editedUserData.mushkits.length - 1;
    const latestKit = editedUserData.mushkits?.[latestKitIndex];
  
    if (!latestKit) {
      setCanAddMushKit(false);
      return;
    }
  
    const requiredFields = ["kit_name", "wifi_ssid", "wifi_pass"];
  
    const isComplete = requiredFields.every(
      (field) => latestKit[field]?.trim() !== ""
    );
  
    const hasErrors = requiredFields.some(
      (field) => !!errors[`mushkits[${latestKitIndex}].${field}`]
    );
  
    setCanAddMushKit(isComplete && !hasErrors);
  }, [editedUserData, errors]);  

  const handleEditProfile = () => {
    setIsEditing(true);
    setEditedUserData({ ...userData });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedUserData({ ...userData });
    setErrors({});
    setCanSubmit(false);
  };

  const handleAddMushKit = () => {
    setEditedUserData((prev) => ({
      ...prev,
      mushkits: [
        ...(prev.mushkits || []),
        { kit_name: "", wifi_ssid: "", wifi_pass: "", kit_id: "", justAdded: true },
      ],
    }));
  };
  
  const handleRemoveMushKit = () => {
    if ((editedUserData.mushkits || []).length > 1) {
      setEditedUserData((prev) => ({
        ...prev,
        mushkits: prev.mushkits.slice(0, -1),
      }));
    }
  };

  const handleSubmitChanges = useCallback(async () => {
    if (!userDocId) return;
  
    // Check for kit_id errors first
    const usersSnapshot = await getDocs(collection(db, "users"));
    const existingKitIds = [];
    const latestKit = editedUserData.mushkits[editedUserData.mushkits.length - 1];
  
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.mushkits && Array.isArray(userData.mushkits)) {
        userData.mushkits.forEach(kit => {
          if (kit.kit_id && doc.id !== userDocId) { 
            existingKitIds.push(kit.kit_id);
          }
        });
      }
    });
  
    const currentKitId = latestKit?.kit_id.trim();
    const isKitIdFilled = currentKitId.length > 0;
  
    if (isKitIdFilled && editedUserData.mushkits.some((kit, index) => index !== editedUserData.mushkits.length - 1 && kit.kit_id.trim() === currentKitId)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`mushkits[${editedUserData.mushkits.length - 1}].kit_id`]: `MushKit ID# ${currentKitId} is already used in your profile.`,
      }));
      setCanSubmit(false);  // Disable Save Changes due to kit_id error
      return;
    }
  
    if (isKitIdFilled && existingKitIds.includes(currentKitId)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`mushkits[${editedUserData.mushkits.length - 1}].kit_id`]: `MushKit ID# ${currentKitId} is already used by another user.`,
      }));
      setCanSubmit(false);  // Disable Save Changes due to kit_id error
      return;
    }
  
    const sensorDocRef = doc(db, "sensorData", currentKitId);
    const sensorDocSnap = await getDoc(sensorDocRef);
  
    if (isKitIdFilled && !sensorDocSnap.exists()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`mushkits[${editedUserData.mushkits.length - 1}].kit_id`]: `MushKit ID# ${currentKitId} is not yet available.`,
      }));
      setCanSubmit(false);  // Disable Save Changes due to kit_id error
      return;
    }
  
    // Check pin after kit_id error check
    if (pinMatched) {
      const cleanedData = {
        ...editedUserData,
        mushkits: editedUserData.mushkits.map((kit) => {
          const { justAdded, ...rest } = kit;
          return rest;
        }),
      };
  
      setIsUpdating(true);
      setMessageBoxContent("Profile updating...");
      setShowMessageBox(true);
  
      updateDoc(doc(db, "users", userDocId), cleanedData)
        .then(() => {
          setUserData(cleanedData);
          setEditedUserData(cleanedData);
          setIsEditing(false);
          setCanSubmit(false);
          setPinMatched(false);
  
          setTimeout(() => {
            setMessageBoxContent("Profile updated successfully.");
            setIsUpdating(false);
          }, 1000);
        })
        .catch((error) => {
          console.error("Error updating profile:", error);
          alert("Failed to update profile.");
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
      alert("Incorrect PIN.");
    }
  };

  return (
    <div className="profile-container">
      <SideNavBar onToggle={setIsSidebarExpanded} />
      <div className="profile-content">
        <div className={`profile-header ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
          <h1>User Profile</h1>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : !userData ? (
          <LoadingSpinner />
        ) : (
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
              canAdd={isEditing && canAddMushKit}
              canRemove={isEditing && editedUserData?.mushkits?.length > 1}
            />
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
            message={messageBoxContent}
            isLoading={isUpdating}
            onClose={() => {
              setShowMessageBox(false);
              setShowNumPad(false);
            }}
          />               
        )}
      </div>
    </div>
  );
};

export default UserProfile;
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../database/firebase";
import SideNavBar from "../static/SideNavBar";
import UserDetailsView from "../components/User Profile Details/UserDetailsView";
import MushKitDetailsView from "../components/User Profile Details/MushKitDetailsView";
import Buttons from "../components/User Profile Details/Buttons";
import "../component styles/UserProfile.css";

const UserProfile = () => {
  const location = useLocation();
  const userEmail = location.state?.email;

  const [userData, setUserData] = useState(null);
  const [editedUserData, setEditedUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [userDocId, setUserDocId] = useState(null);

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
            setUserDocId(userDoc.id); // Store doc ID for updates
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

  const handleSubmitChanges = async () => {
    if (!userDocId) return;

    try {
      await updateDoc(doc(db, "users", userDocId), editedUserData);
      setUserData(editedUserData); 
      setIsEditing(false);
      setCanSubmit(false);
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  };

  const handleAddMushKit = () => {
    const newMushKit = { kit_name: "", wifi_ssid: "", wifi_pass: "" }; // Default empty kit
    setEditedUserData((prev) => ({
      ...prev,
      mushkits: [...(prev.mushkits || []), newMushKit]
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
    const hasChanges = JSON.stringify(userData) !== JSON.stringify(editedUserData);
    setCanSubmit(hasChanges); 
  }, [editedUserData, userData]);

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
                setEditedUserData((prev) => ({ ...prev, ...updatedUser }))
              }
            />
            <MushKitDetailsView
              mushkits={editedUserData.mushkits || []}
              isEditing={isEditing}
              onChange={(updatedKits) =>
                setEditedUserData((prev) => ({ ...prev, mushkits: updatedKits }))
              }
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
      </div>
    </div>
  );
};

export default UserProfile;

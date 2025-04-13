import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../database/firebase";
import SideNavBar from "../static/SideNavBar";
import UserDetailsView from "../components/User Profile Details/UserDetailsView";
import MushKitDetailsView from "../components/User Profile Details/MushKitDetailsView";
import "../component styles/UserProfile.css";

const UserProfile = () => {
  const location = useLocation();
  const userEmail = location.state?.email;  
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (userEmail) {
        try {
          const q = query(collection(db, "users"), where("email", "==", userEmail));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            setUserData(userDoc.data());
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

  return (
    <div className="profile-container">
      <SideNavBar />
      <div className="profile-content">
        <h1>Profile</h1>
        {userData ? (
          <>
            <UserDetailsView user={userData} />
            <MushKitDetailsView mushkits={userData.mushkits || []} />
          </>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

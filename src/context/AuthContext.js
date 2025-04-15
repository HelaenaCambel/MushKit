import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../database/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);            
  const [userData, setUserData] = useState(null);      
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.uid) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.warn("No user data found for", currentUser.uid);
            setUserData(null);
          }
        } catch (err) {
          console.error("Error loading user data:", err);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, userData, setUserData, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
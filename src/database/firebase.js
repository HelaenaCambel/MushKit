// src/database/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDTLV_cBbQOCWOzPdGir1T9Dzu7bhctiKQ",
  authDomain: "mushkit-c3234.firebaseapp.com",
  databaseURL: "https://mushkit-c3234-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mushkit-c3234",
  storageBucket: "mushkit-c3234.firebasestorage.app",
  messagingSenderId: "652140384480",
  appId: "1:652140384480:web:eb0b57772f07658c3cc085",
  measurementId: "G-4CWWERTFK7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
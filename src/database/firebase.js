import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDezWcudzYDvUGVXxJfLYxYaqK9WdOuubk",
  authDomain: "mushkit-df43f.firebaseapp.com",
  databaseURL: "https://mushkit-df43f-default-rtdb.asia-southeast1.firebasedatabase.app", 
  projectId: "mushkit-df43f",
  storageBucket: "mushkit-df43f.appspot.com", 
  messagingSenderId: "927547852345",
  appId: "1:927547852345:web:438b9068b8a373ff822fe8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
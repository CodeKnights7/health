import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  query, 
  where,
  arrayUnion,
  getDocs,
  arrayRemove,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB755Mte-m7gkhNBUcG4klF6ha6GVxIVrw",
  authDomain: "medicalplus-28201.firebaseapp.com",
  projectId: "medicalplus-28201",
  storageBucket: "medicalplus-28201.appspot.com",
  messagingSenderId: "844682006497",
  appId: "1:844682006497:web:d3362327f4b94894124ca0",
  measurementId: "G-7SXL1SYKH3",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export {
  db,
  auth,
  updateProfile,
  collection,
  getDoc,
  onAuthStateChanged,
  query, 
  where,
  signInWithEmailAndPassword,
  doc,
  setDoc,
  createUserWithEmailAndPassword,
  updateDoc,
  signOut,
  arrayUnion,
  getDocs,
  arrayRemove,
};

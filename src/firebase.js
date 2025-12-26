import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArFhWm3XzTxgsqjWbsF9tlfZwG3mI1ya0",
  authDomain: "storiesbyfoot-login.firebaseapp.com",
  projectId: "storiesbyfoot-login",
  storageBucket: "storiesbyfoot-login.firebasestorage.app",
  messagingSenderId: "148627008256",
  appId: "1:148627008256:web:9801db88740465a068e1e5",
  measurementId: "G-LBM7GG8WQT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and set persistence
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

// Initialize Firestore for user roles, approval workflows, and content management
const db = getFirestore(app);

export { app, auth, db };

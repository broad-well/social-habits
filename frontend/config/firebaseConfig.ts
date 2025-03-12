import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Initialize Firebase
const firebaseConfig = {
  // https://firebase.google.com/support/guides/security-checklist#understand-api-keys
  // "API keys for Firebase services are not secret"
  apiKey: "AIzaSyBar6IBdWQWBHn-FOIS_oVrrCssN8vcDDA",
  authDomain: "cohabit-app-1fb32.firebaseapp.com",
  projectId: "cohabit-app-1fb32",
  storageBucket: "cohabit-app-1fb32.firebasestorage.app",
  messagingSenderId: "884027047581",
  appId: "1:884027047581:web:62e3362afb734206185e74",
  measurementId: "G-ETX9KB9R90",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

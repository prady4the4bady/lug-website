// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// IMPORTANT: Replace with your actual Firebase project configuration
const firebaseConfig = {
  "projectId": "linux-user-group-420pp",
  "appId": "1:357891612710:web:aa2b06ef35b507cbd506e7",
  "storageBucket": "linux-user-group-420pp.appspot.com",
  "apiKey": "AIzaSyCQFYrhX1A-ADl8oehKn6ddQDpWynG15nE",
  "authDomain": "linux-user-group-420pp.firebaseapp.com",
  "messagingSenderId": "357891612710"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { app, auth };

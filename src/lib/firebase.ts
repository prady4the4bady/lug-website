// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// IMPORTANT: Replace with your actual Firebase project configuration
const firebaseConfig = {
  "apiKey": "AIzaSyCQFYrhX1A-ADl8oehKn6ddQDpWynG15nE",
  "authDomain": "linux-user-group-420pp.firebaseapp.com",
  "projectId": "linux-user-group-420pp",
  "storageBucket": "linux-user-group-420pp.appspot.com",
  "messagingSenderId": "357891612710",
  "appId": "1:357891612710:web:aa2b06ef35b507cbd506e7"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

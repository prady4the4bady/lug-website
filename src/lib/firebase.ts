// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration.
// This object is used to connect your application to your Firebase project.
const firebaseConfig = {
  "apiKey": "AIzaSyCQFYrhX1A-ADl8oehKn6ddQDpWynG15nE",
  "authDomain": "linux-user-group-420pp.firebaseapp.com",
  "projectId": "linux-user-group-420pp",
  "storageBucket": "linux-user-group-420pp.appspot.com",
  "messagingSenderId": "357891612710",
  "appId": "1:357891612710:web:aa2b06ef35b507cbd506e7"
};

// Initialize Firebase.
// This check prevents re-initializing the app on every hot-reload.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Get references to the Firebase services you want to use.
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export the initialized services so they can be used throughout your app.
export { app, auth, db, storage };

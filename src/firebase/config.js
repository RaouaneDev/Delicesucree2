import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAAJLSGvD5sVfeuPaKL_z6iOT5m5U0Ye6E",
  authDomain: "patisserie1-efe23.firebaseapp.com",
  projectId: "patisserie1-efe23",
  storageBucket: "patisserie1-efe23.firebasestorage.app",
  messagingSenderId: "101587695899",
  appId: "1:101587695899:web:9d539646c1c4e4dc40fbbe",
  measurementId: "G-S65HGYV05G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Erreur de persistance:", error);
  });

export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;

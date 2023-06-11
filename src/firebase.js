import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyD5HEVI08w5e4xzJoIvdlgBCkwzg7PpPvY",
  authDomain: "podcastplatformreact.firebaseapp.com",
  projectId: "podcastplatformreact",
  storageBucket: "podcastplatformreact.appspot.com",
  messagingSenderId: "955635784112",
  appId: "1:955635784112:web:da4c191b5b6f4914d81e75",
  measurementId: "G-3XQ1W4PW8B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export {auth, db, storage};

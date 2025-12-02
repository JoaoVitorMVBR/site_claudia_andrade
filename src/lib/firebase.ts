// lib/firebase.ts
import { FirebaseError, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Substitua pelos seus valores (ou use .env)
const firebaseConfig = {
    apiKey: "AIzaSyC4rNO0ooz1QfhrIseApD9jtGVbEV_-tc0",
    authDomain: "site-claudia-andrade.firebaseapp.com",
    projectId: "site-claudia-andrade",
    storageBucket: "site-claudia-andrade.firebasestorage.app",
    messagingSenderId: "895446203973",
    appId: "1:895446203973:web:20262ec60e34607b626d2c",
    measurementId: "G-BXKH27KXW3"
  };  

const app            = initializeApp(firebaseConfig);
export const db      = getFirestore(app);
export const storage = getStorage(app);
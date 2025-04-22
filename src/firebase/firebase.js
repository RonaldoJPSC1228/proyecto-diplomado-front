// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyChUA4A3G88wJ3hLQ6wbz4mXLgqzQRl1kY",
  authDomain: "proyecto-backend-diplomado.firebaseapp.com",
  projectId: "proyecto-backend-diplomado",
  storageBucket: "proyecto-backend-diplomado.firebasestorage.app",
  messagingSenderId: "494001041009",
  appId: "1:494001041009:web:79ffc99fbe170b79f875d0",
  measurementId: "G-94M0ELH8MN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };


// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Importa Firebase Storage

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyChUA4A3G88wJ3hLQ6wbz4mXLgqzQRl1kY",
  authDomain: "proyecto-backend-diplomado.firebaseapp.com",
  projectId: "proyecto-backend-diplomado",
  storageBucket: "proyecto-backend-diplomado.firebasestorage.app", // No cambies esto
  messagingSenderId: "494001041009",
  appId: "1:494001041009:web:79ffc99fbe170b79f875d0",
  measurementId: "G-94M0ELH8MN"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Inicializa Firebase Storage

// Exporta lo necesario
export { auth, db, storage }; // Asegúrate de exportar 'storage'

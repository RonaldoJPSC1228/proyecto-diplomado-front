import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebase"; // Ajusta la ruta
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function AdminRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().rol === "admin") {
          setIsAdmin(true);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) return null;

  return isAdmin ? children : <Navigate to="/" />;
}

export default AdminRoute;
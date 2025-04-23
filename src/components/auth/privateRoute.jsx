// src/components/PrivateRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

function PrivateRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) return null; // o un spinner

  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;

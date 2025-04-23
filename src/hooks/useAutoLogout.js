// src/hooks/useAutoLogout.js
import { useEffect, useRef } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function useAutoLogout(timeout = 60 * 60 * 1000) {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      await signOut(auth);
      Swal.fire("Sesión cerrada", "Cerramos tu sesión por inactividad", "info");
      navigate("/");
    }, timeout);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const events = ["mousemove", "keydown", "click", "scroll"];
        events.forEach((e) => window.addEventListener(e, resetTimer));
        resetTimer();

        return () => {
          events.forEach((e) => window.removeEventListener(e, resetTimer));
          if (timerRef.current) clearTimeout(timerRef.current);
        };
      }
    });

    return () => unsubscribe();
  }, []);
}

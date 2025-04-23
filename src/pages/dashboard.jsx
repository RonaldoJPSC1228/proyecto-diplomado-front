import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        if (data.rol !== "admin") {
          Swal.fire("Acceso denegado", "No tienes permisos", "warning");
          navigate("/login"); // o a "/"
          return;
        }

        setUserData(data);
      } else {
        Swal.fire("Error", "Usuario no encontrado en la base de datos", "error");
        navigate("/inicio");
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard Admin</h2>
      </div>

      {userData ? (
        <div className="card p-4 shadow-sm">
          <h4>Bienvenido, {userData.nombre} 👑</h4>
          <p><strong>Correo:</strong> {userData.email}</p>
          <p><strong>Rol:</strong> {userData.rol}</p>
        </div>
      ) : (
        <p>Cargando datos del administrador...</p>
      )}
    </div>
  );
}

export default Dashboard;

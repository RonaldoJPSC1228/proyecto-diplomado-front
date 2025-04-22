// src/pages/auth/Register.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Register({ onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Usamos el hook para la redirección

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      return Swal.fire("Campos vacíos", "Por favor completa todos los campos.", "warning");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Almacenamos los datos del usuario en Firestore
      await setDoc(doc(db, "users", user.uid), {
        nombre: name,
        email: user.email,
        rol: "usuario"
      });

      Swal.fire("Cuenta creada", "Tu cuenta ha sido registrada", "success");
      
      // Redirigimos al usuario al dashboard después del registro exitoso
      navigate("/dashboard"); // Cambia la ruta según tu estructura de navegación
    } catch (error) {
      // Manejo de errores detallado
      let errorMessage = "Ocurrió un error. Intenta nuevamente más tarde.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este correo electrónico ya está registrado.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "La contraseña es demasiado débil.";
      }
      Swal.fire("Error", errorMessage, "error");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5" style={{ height: "100vh", backgroundColor: "#f4f7fc" }}>
      <div className="login-container p-4 rounded shadow-sm" style={{ backgroundColor: "white", maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Registro</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Nombre completo</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ingresa tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Registrarse</button>
          <div className="text-center mt-3">
            <a href="#" className="text-decoration-none" onClick={(e) => { e.preventDefault(); onSwitch(); }}>
              ¿Ya tienes una cuenta? Inicia sesión
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;

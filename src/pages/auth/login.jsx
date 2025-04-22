// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return Swal.fire("Campos vacíos", "Por favor completa todos los campos.", "warning");
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Swal.fire("Éxito", "Inicio de sesión exitoso", "success");
      navigate("/dashboard"); // Redirige a la página del dashboard
    } catch (error) {
      // Manejo de errores más detallado
      let errorMessage = "Ocurrió un error. Intenta nuevamente más tarde.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "Usuario no encontrado. Verifica tu correo electrónico.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Contraseña incorrecta.";
      }
      Swal.fire("Error", errorMessage, "error");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5" style={{ height: "100vh", backgroundColor: "#f4f7fc" }}>
      <div className="login-container p-4 rounded shadow-sm" style={{ backgroundColor: "white", maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit" className="btn btn-primary w-100">Iniciar sesión</button>
          <div className="text-center mt-3">
            <Link to="/register" className="text-decoration-none">
              ¿No tienes cuenta? Regístrate
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

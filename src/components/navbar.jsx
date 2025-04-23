import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null); // 'admin' o 'usuario'
  const [loading, setLoading] = useState(true); // Se utilizará para indicar si estamos esperando la autenticación.

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setRole(userSnap.data().rol);
        }
      } else {
        setRole(null);
      }
      setLoading(false); // Cuando se obtenga la respuesta, ya no estamos cargando.
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Swal.fire("Sesión cerrada", "Hasta pronto 👋", "info");
      navigate("/");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  if (loading) return null; // Mientras estamos esperando, no renderizamos nada del navbar.

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {/* Ítems comunes */}
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio <i className="fas fa-house"></i></Link>
            </li>

            {/* Solo para admins */}
            {role === "admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Dashboard <i className="fas fa-cogs"></i></Link>
              </li>
            )}

            {/* Ítems comunes */}
            <li className="nav-item">
              <Link className="nav-link" to="/">Tienda <i className="fas fa-shop"></i></Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">Descuentos <i className="fas fa-chart-line"></i></Link>
            </li>

            {/* Mostrar carrito solo si el usuario está logueado y no es admin */}
            {role !== null && role !== "admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/cart">Carrito <i className="fas fa-cart-plus"></i></Link>
              </li>
            )}

            {/* Mostrar login/register si no hay sesión */}
            {role === null ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Iniciar Sesión</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Registrarse</Link>
                </li>
              </>
            ) : (
              // Si hay sesión, mostrar botón de logout
              <li className="nav-item">
                <button className="nav-link btn btn-danger" onClick={handleLogout}>Cerrar sesión</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

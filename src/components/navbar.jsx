import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { useEffect, useState, useRef } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null); // 'admin' o 'usuario'
  const [loading, setLoading] = useState(true); // Se utilizará para indicar si estamos esperando la autenticación.
  const [showLogout, setShowLogout] = useState(false); // Estado para controlar la visibilidad del menú de logout
  const dropdownRef = useRef(null); // Referencia al contenedor del menú desplegable

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

  // Función para manejar el clic fuera del dropdown para cerrarlo
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowLogout(false);
    }
  };

  // Detectamos clics fuera del dropdown para cerrarlo
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard <i className="fas fa-cogs"></i></Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/products">Productos <i className="fas fa-box"></i></Link>
                </li>
              </>
            )}

            {/* Ítems comunes */}
            <li className="nav-item">
              <Link className="nav-link" to="/tienda">Tienda <i class="fas fa-shop"></i></Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">Descuentos <i class="fas fa-chart-line"></i></Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">Tienda <i className="fas fa-shop"></i></Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">Descuentos <i className="fas fa-chart-line"></i></Link>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto">
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
              // Si hay sesión, mostrar ícono de usuario
              <li className="nav-item dropdown" ref={dropdownRef}>
                <button
                  className="nav-link btn btn-link dropdown-toggle"
                  onClick={() => setShowLogout(!showLogout)} // Alterna la visibilidad del menú
                >
                  <i className="fas fa-user"></i> {/* Ícono de usuario */}
                </button>

                {/* Menú desplegable de logout */}
                {showLogout && (
                  <div className="dropdown-menu dropdown-menu-end show">
                    <button className="dropdown-item text-danger bg-light" onClick={handleLogout}>
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

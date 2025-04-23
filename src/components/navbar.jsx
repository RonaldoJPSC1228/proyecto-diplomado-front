import { Link } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        {/* Botón de colapso para móviles */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú de navegación */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio <i class="fas fa-house"></i></Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tienda">Tienda <i class="fas fa-shop"></i></Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">Descuentos <i class="fas fa-chart-line"></i></Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Iniciar Sesion <i class="fas fa-user"></i></Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/register">Registrarse <i class="fas fa-user"></i></Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Cerrar Sesion <i class="fas fa-user"></i></Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">Carrito <i class="fas fa-cart-plus"></i></Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

// src/components/navbar.jsx
// import React from 'react';
// import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom

// function Navbar() {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-light">
//       <div className="container">
//         <Link className="navbar-brand" to="/">Mi E-commerce</Link>
//         <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
//           <span className="navbar-toggler-icon"></span>
//         </button>
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav ml-auto">
//             <li className="nav-item">
//               <Link className="nav-link" to="/">Home</Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link" to="/login">Login</Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link" to="/register">Register</Link>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;



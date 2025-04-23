import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-center" style={{ height: "80vh" }}>
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <p className="fs-3">¡Ups! Página no encontrada.</p>
      <p className="lead">La página que estás buscando no existe o fue movida.</p>
      <Link to="/" className="btn btn-primary mt-3">
        Volver al inicio
      </Link>
    </div>
  );
}

export default NotFound;

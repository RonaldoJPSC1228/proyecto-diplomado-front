import React, { useEffect, useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase"; // Ajusta si tu ruta es distinta

function Tienda() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todos");

  // Obtener productos de Firebase
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "items"));
        const productosData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((p) => p.estado === 1); // Solo productos activos

        setProductos(productosData);
      } catch (error) {
        console.error("Error al obtener productos de Firebase:", error);
      }
    };

    obtenerProductos();
  }, []);

  // Función de formato de precios
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(amount);
  };

  // Filtrar productos de forma eficiente
  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const coincideCategoria =
        categoria === "Todos" || p.categoria === categoria;
      const coincideBusqueda = p.nombre
        ?.toLowerCase()
        .includes(busqueda.toLowerCase());
      return coincideCategoria && coincideBusqueda;
    });
  }, [productos, busqueda, categoria]);

  // Extraer categorías únicas de los productos
  const categorias = useMemo(() => {
    return [
      "Todos",
      ...new Set(productos.map((p) => p.categoria).filter(Boolean)),
    ];
  }, [productos]);

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-4">🛍️ Tienda</h2>

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-3">
          <select
            className="form-select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            {categorias.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Productos */}
      <div className="row g-4">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => (
            <div key={producto.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={producto.imagen_url}
                  className="card-img-top"
                  alt={producto.nombre}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-truncate">{producto.nombre}</h5>
                  <p className="text-muted small">{producto.categoria}</p>
                  <p className="fw-bold fs-5">
                    {producto.descuento > 0 ? (
                      <>
                        <p className="text-muted text-decoration-line-through mb-0">
                          {formatCurrency(Number(producto.precio))}
                        </p>
                        <p className="fw-bold fs-5 text-danger mb-0">
                          {formatCurrency(
                            Number(producto.precio) * (1 - producto.descuento / 100)
                          )}
                        </p>
                      </>
                    ) : (
                      <p className="fw-bold fs-5 text-dark mb-0">
                        {formatCurrency(Number(producto.precio))}
                      </p>
                    )}
                  </p>

                  <a
                    href={`https://wa.me/573001112233?text=Hola! Estoy interesado en: ${encodeURIComponent(
                      producto.nombre
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success mt-auto"
                  >
                    Comprar por WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No se encontraron productos.</p>
        )}
      </div>
    </div>
  );
}

export default Tienda;

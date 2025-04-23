// src/pages/Tienda.jsx
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Tienda() {
  const productosIniciales = [
    { id: 1, nombre: "Camiseta React", categoria: "Ropa", precio: 25, imagen: "https://m.media-amazon.com/images/I/81ERMazfqjL._AC_UY1000_.jpg" },
    { id: 2, nombre: "Sudadera Python", categoria: "Ropa", precio: 40, imagen: "https://shoppinginibiza.com/184084-home_default/champion-sudadera-beige-306497-ninoa.jpg" },
    { id: 3, nombre: "Taza Code", categoria: "Accesorios", precio: 12, imagen: "https://m.media-amazon.com/images/I/61CC0D3fhRL._AC_UF894,1000_QL80_.jpg" },
    { id: 4, nombre: "Sticker Pack", categoria: "Accesorios", precio: 5, imagen: "https://www.sunbum.com/cdn/shop/products/05_SB_2022_StickerPack_PDP_R1V1_720x.jpg?v=1704411843" },
    { id: 5, nombre: "Mouse Ergonómico", categoria: "Electrónica", precio: 20, imagen: "https://exitocol.vtexassets.com/arquivos/ids/20875942/mouse-ergonomico-inalambrico-usb-vertical.jpg?v=638400902677930000" },
    { id: 6, nombre: "Teclado Mecánico", categoria: "Electrónica", precio: 60, imagen: "https://symcomputadores.com/wp-content/uploads/2025/01/TECLADO-GAMER-TKL-SWITCH-AZUL-1.png" },
  ];

  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todos");

  const categorias = ["Todos", ...new Set(productosIniciales.map(p => p.categoria))];

  const productosFiltrados = productosIniciales.filter(p => {
    const coincideCategoria = categoria === "Todos" || p.categoria === categoria;
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

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
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Productos */}
      <div className="row g-4">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map(producto => (
            <div key={producto.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={producto.imagen}
                  className="card-img-top"
                  alt={producto.nombre}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-truncate">{producto.nombre}</h5>
                  <p className="text-muted small">{producto.categoria}</p>
                  <p className="fw-bold text-danger fs-5">${producto.precio}</p>
                  <a
                    href={`https://wa.me/573001112233?text=Hola! Estoy interesado en: ${encodeURIComponent(producto.nombre)}`}
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

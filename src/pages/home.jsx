// src/pages/Home.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Home() {
  const productos = [
    {
      id: 1,
      nombre: "Camiseta React",
      descripcion: "Diseño moderno, ideal para devs.",
      precio: 25,
      imagen: "https://via.placeholder.com/400x300?text=Camiseta+React"
    },
    {
      id: 2,
      nombre: "Hoodie JavaScript",
      descripcion: "Perfecto para clima frío y coders pro.",
      precio: 45,
      imagen: "https://via.placeholder.com/400x300?text=Hoodie+JS"
    },
    {
      id: 3,
      nombre: "Gorra Frontend",
      descripcion: "Estilo casual para tu día a día.",
      precio: 15,
      imagen: "https://via.placeholder.com/400x300?text=Gorra+Frontend"
    }
  ];

  return (
    <div className="container py-5 mt-5" style={{ backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <h1 className="text-center mb-5 fw-bold" style={{ color: "#1f2937" }}>
        Explora nuestros productos
      </h1>
      <div className="row g-4">
        {productos.map((producto) => (
          <div className="col-md-4" key={producto.id}>
            <div className="card h-100 shadow border-0">
              <img
                src={producto.imagen}
                className="card-img-top"
                alt={producto.nombre}
                style={{ objectFit: "cover", height: "250px" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{producto.nombre}</h5>
                <p className="card-text text-muted">{producto.descripcion}</p>
                <div className="mt-auto">
                  <p className="fw-bold fs-5 mb-3">${producto.precio} USD</p>
                  <a
                    href={`https://wa.me/573001112233?text=Hola! Estoy interesado en el producto: ${encodeURIComponent(producto.nombre)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success w-100"
                  >
                    Comprar por WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;

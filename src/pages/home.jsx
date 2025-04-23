// src/pages/Home.jsx
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Home() {
  const generarDescuento = () => {
    return Math.floor(Math.random() * 81) + 10; // genera entre 10% y 90%
  };

  const productosIniciales = [
    {
      id: 1,
      nombre: "Camiseta React",
      descripcion: "Moderna y cómoda",
      precio: 25,
      imagen: "https://m.media-amazon.com/images/I/81ERMazfqjL._AC_UY1000_.jpg",
      destacado: true,
    },
    {
      id: 2,
      nombre: "Sudadera Python",
      descripcion: "Ideal para devs",
      precio: 40,
      imagen:
        "https://shoppinginibiza.com/184084-home_default/champion-sudadera-beige-306497-ninoa.jpg",
      destacado: true,
    },
    {
      id: 3,
      nombre: "Taza mas cara del mundo",
      descripcion: "Para tus mañanas coders",
      precio: 12,
      imagen:
        "https://i1.wp.com/www.periodismo.com/wp-content/subid/The-Munch-coffee-750x563.jpg?zoom=1.25&resize=630%2C473&ssl=1",
      destacado: true,
    },
    {
      id: 4,
      nombre: "Taza Code",
      descripcion: "Para tus mañanas coders",
      precio: 12,
      imagen:
        "https://m.media-amazon.com/images/I/61CC0D3fhRL._AC_UF894,1000_QL80_.jpg",
      destacado: true,
    },
    {
      id: 5,
      nombre: "Sticker Pack",
      descripcion: "Decora tu laptop",
      precio: 5,
      imagen:
        "https://www.sunbum.com/cdn/shop/products/05_SB_2022_StickerPack_PDP_R1V1_720x.jpg?v=1704411843",
      destacado: false,
    },
    {
      id: 6,
      nombre: "Mouse Ergonómico",
      descripcion: "Con descuento limitado",
      precio: 20,
      imagen:
        "https://exitocol.vtexassets.com/arquivos/ids/20875942/mouse-ergonomico-inalambrico-usb-vertical.jpg?v=638400902677930000",
      destacado: false,
    },
    {
      id: 7,
      nombre: "Auriculares Dev",
      descripcion: "Focus Mode On",
      precio: 30,
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDQybkdTNdxqB46eQuS_RQ0k60ZLwTqMyuSg&s",
      destacado: false,
    },
    {
      id: 8,
      nombre: "Agenda Programador",
      descripcion: "Organiza tus ideas",
      precio: 18,
      imagen:
        "https://http2.mlstatic.com/D_NQ_NP_948327-MCO73649602653_122023-O.webp",
      destacado: false,
    },
    {
      id: 9,
      nombre: "Teclado Mecánico",
      descripcion: "Clicks satisfactorios",
      precio: 60,
      imagen:
        "https://symcomputadores.com/wp-content/uploads/2025/01/TECLADO-GAMER-TKL-SWITCH-AZUL-1.png",
      destacado: false,
    },
    {
      id: 10,
      nombre: "Pantalla pc",
      descripcion: "Ten mas espacion",
      precio: 18,
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrB4Tz73kIrH2zX88dcCPPY8FzcGztI2CIHA&s",
      destacado: false,
    },
    {
      id: 11,
      nombre: "Silla Gamer",
      descripcion: "Para largas sesiones",
      precio: 150,
      imagen:
        "https://infoshopcorp.com/wp-content/uploads/2024/12/SD-265-RGB-1.png",
      destacado: false,
    },
    {
      id: 12,
      nombre: "Mesa Gamer",
      descripcion: "Para largas sesiones",
      precio: 150,
      imagen:
        "https://maderkit.vtexassets.com/arquivos/ids/165826-800-auto?v=638189001665270000&width=800&height=auto&aspect=true",
      destacado: false,
    },
  ].map((p) => ({ ...p, descuento: generarDescuento() }));
  const [productos, setProductos] = useState(productosIniciales);

  const toggleDestacado = (id) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, destacado: !p.destacado } : p))
    );
  };

  const renderSeccion = (titulo, productosFiltrados, bgColor) => (
    <div className={`py-5 ${bgColor}`}>
      <div className="container">
        <h2 className="mb-4 fw-bold text-center text-uppercase">{titulo}</h2>
        <div className="row g-4 justify-content-center">
          {productosFiltrados.map((producto) => (
            <div
              key={producto.id}
              className="col-12 col-sm-6 col-md-4 col-lg-3"
            >
              <div
                className={`card h-100 shadow-sm border-0 position-relative ${
                  producto.destacado ? "border border-warning border-2" : ""
                }`}
              >
                <img
                  src={producto.imagen}
                  className="card-img-top"
                  alt={producto.nombre}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                {producto.descuento && (
                  <div className="position-absolute top-0 end-0 bg-danger text-white p-1 px-2 rounded-bottom-start small fw-bold">
                    -{producto.descuento}%
                  </div>
                )}

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-truncate">
                    {producto.nombre}
                  </h5>
                  <p className="card-text small text-muted">
                    {producto.descripcion}
                  </p>
                  <p className="fw-bold fs-5 text-danger">${producto.precio}</p>
                  <a
                    href={`https://wa.me/573001112233?text=Hola! Estoy interesado en: ${encodeURIComponent(
                      producto.nombre
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-success mb-2"
                  >
                    Comprar por WhatsApp
                  </a>
                  <button
                    onClick={() => toggleDestacado(producto.id)}
                    className={`btn btn-sm ${
                      producto.destacado ? "btn-warning" : "btn-outline-warning"
                    }`}
                  >
                    {producto.destacado
                      ? "Quitar de destacados"
                      : "Agregar a destacados"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-5 pt-4" style={{ backgroundColor: "#f5f5f5" }}>
      {renderSeccion(
        "⭐ Productos Destacados",
        productos.filter((p) => p.destacado),
        "bg-white"
      )}
      {renderSeccion(
        "🔥 Ofertas Especiales",
        productos.slice(4, 8),
        "bg-light"
      )}
      {renderSeccion("💎 Productos Populares", productos.slice(8), "bg-white")}
    </div>
  );
}

export default Home;

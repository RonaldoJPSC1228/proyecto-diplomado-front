import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";

function Home() {
  const [productos, setProductos] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // NUEVO: Estado para rol admin

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);

        try {
          const userQuery = query(
            collection(db, "users"),
            where("uid", "==", user.uid)
          );
          const userDocs = await getDocs(userQuery);

          if (!userDocs.empty) {
            const userData = userDocs.docs[0].data();
            setIsAdmin(userData.rol === "admin");
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error verificando rol:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const productosCol = collection(db, "items");
      const q = query(productosCol, where("estado", "==", 1));
      const productosSnapshot = await getDocs(q);
      const productosList = productosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        descuento: doc.data().descuento || 0,
        destacado: doc.data().destacado || false,
      }));
      setProductos(productosList);
    };

    fetchProducts();
  }, []);

  const toggleDestacado = async (id) => {
    const productoRef = doc(db, "items", id);
    const producto = productos.find((p) => p.id === id);

    try {
      await updateDoc(productoRef, {
        destacado: !producto.destacado,
      });

      setProductos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, destacado: !p.destacado } : p))
      );
    } catch (error) {
      console.error("Error al actualizar producto destacado:", error);
    }
  };

  const productosDestacados = productos.filter((p) => p.destacado);
  const productosNoDestacados = productos.filter((p) => !p.destacado);

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
                  src={producto.imagen_url}
                  className="card-img-top"
                  alt={producto.nombre}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                {producto.descuento > 0 && (
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
                  {producto.descuento > 0 ? (
                    <>
                      <p className="text-muted text-decoration-line-through mb-0">
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                        }).format(Number(producto.precio))}
                      </p>
                      <p className="fw-bold fs-5 text-danger mb-0">
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                        }).format(
                          Number(producto.precio) *
                            (1 - producto.descuento / 100)
                        )}
                      </p>
                    </>
                  ) : (
                    <p className="fw-bold fs-5 text-dark mb-0">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                      }).format(Number(producto.precio))}
                    </p>
                  )}
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

                  {/* Solo ADMIN puede ver este botón */}
                  {isAuthenticated && isAdmin && (
                    <button
                      onClick={() => toggleDestacado(producto.id)}
                      className={`btn btn-sm ${
                        producto.destacado
                          ? "btn-warning"
                          : "btn-outline-warning"
                      }`}
                    >
                      {producto.destacado
                        ? "Quitar de destacados"
                        : "Agregar a destacados"}
                    </button>
                  )}
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
      {renderSeccion("⭐ Productos Destacados", productosDestacados, "bg-white")}
      {renderSeccion("🔥 Ofertas Especiales", productosNoDestacados.slice(0, 4), "bg-light")}
      {renderSeccion("💎 Productos Populares", productosNoDestacados.slice(4), "bg-white")}
    </div>
  );
}

export default Home;

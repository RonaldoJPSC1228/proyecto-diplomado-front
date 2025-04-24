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
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function Home() {
  const [productos, setProductos] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);  // Estado del usuario
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);

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
        setUser(null);
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

  const handleAddToCart = (producto) => {
    if (!user) {
      navigate("/login");
      return;
    }
  
    const precio = Number(producto.precio);
    let storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = storedCart.find((item) => item.id === producto.id);
  
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      storedCart.push({ ...producto, price: precio, quantity: 1 });
    }
  
    localStorage.setItem("cart", JSON.stringify(storedCart));
  
    // Actualizar el contador en el Navbar
    updateCartCount();
  
    Swal.fire({
      icon: 'success',
      title: '¡Producto agregado!',
      text: `"${producto.nombre}" se ha añadido al carrito.`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const updateCartCount = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = storedCart.reduce((total, item) => total + item.quantity, 0);
  
    // Actualizar el contador global (en algún lugar accesible del Navbar o el layout principal)
    if (window && window.updateCartBadge) {
      window.updateCartBadge(cartCount); // Usamos window para actualizar el contador globalmente
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

                  {/* Botón de agregar al carrito */}
                  {!isAdmin && (
                    <button
                      onClick={() => handleAddToCart(producto)}
                      className="btn btn-success mb-2"
                    >
                      Agregar al carrito
                    </button>
                  )}

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

                  {/* Botón de "Ver Detalles" visible solo para usuarios no admin */}
                  {!isAdmin && (
                    <button
                      onClick={() => navigate(`/products/${producto.id}`)} // Redirige a la página de detalles del producto
                      className="btn btn-info mt-2"
                    >
                      Ver detalles
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
      {renderSeccion("💎 Productos Populares", productosNoDestacados.slice(4, 8), "bg-white")}
    </div>
  );
}

export default Home;

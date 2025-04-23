import React, { useEffect, useState, useMemo } from "react";
import { collection, getDocs, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Tienda() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todos");

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

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

  // Detectar usuario y obtener rol
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userDoc = await getDocs(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().rol); // <-- se usa "rol", no "role"
        }
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(amount);
  };

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

  const handleAddToCart = (producto) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (role === "admin") {
      alert("Los administradores no pueden agregar productos al carrito.");
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
    alert("Producto agregado al carrito");
  };

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
              <div className="card h-100 shadow-sm border-0 position-relative">
                {/* Descuento */}
                {producto.descuento > 0 && (
                  <div className="position-absolute top-0 end-0 bg-danger text-white p-1 px-2 rounded-bottom-start small fw-bold">
                    -{producto.descuento}%
                  </div>
                )}

                <img
                  src={producto.imagen_url}
                  className="card-img-top"
                  alt={producto.nombre}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-truncate">{producto.nombre}</h5>
                  <p className="text-muted small">{producto.categoria}</p>

                  {/* Descripción del producto */}
                  <p className="card-text text-truncate" style={{ fontSize: "0.9rem" }}>
                    {producto.descripcion}
                  </p>

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

                  {/* Solo mostrar botón si no es admin */}
                  {role !== "admin" && (
                    <button
                      onClick={() => handleAddToCart(producto)}
                      className="btn btn-success mt-auto"
                    >
                      Agregar al carrito
                    </button>
                  )}
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

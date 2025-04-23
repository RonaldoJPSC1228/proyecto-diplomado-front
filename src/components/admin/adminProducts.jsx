// src/admin/AdminProducts.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

function AdminProducts() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productosCol = collection(db, "items");
      const q = query(productosCol, where("estado", "==", 1)); // Solo productos activos
      const productosSnapshot = await getDocs(q);
      const productosList = productosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(productosList);
    };

    fetchProducts();
  }, []);

  const toggleDestacado = async (id, destacado) => {
    const productoRef = doc(db, "items", id);
    await updateDoc(productoRef, {
      destacado: !destacado,
    });
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Gestión de Productos</h2>
      <div className="row">
        {productos.map((producto) => (
          <div key={producto.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card shadow-sm border-0">
              <img
                src={producto.imagen_url}
                className="card-img-top"
                alt={producto.nombre}
                style={{ height: "180px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{producto.nombre}</h5>
                <p className="card-text">{producto.descripcion}</p>
                <p className="fw-bold">${producto.precio}</p>
                <button
                  onClick={() => toggleDestacado(producto.id, producto.destacado)}
                  className={`btn btn-sm ${producto.destacado ? "btn-warning" : "btn-outline-warning"}`}
                >
                  {producto.destacado ? "Quitar de destacados" : "Agregar a destacados"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProducts;

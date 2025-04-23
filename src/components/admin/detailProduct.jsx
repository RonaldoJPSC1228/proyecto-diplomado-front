import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

const DetailProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const productRef = doc(db, "items", id);
      const docSnap = await getDoc(productRef);

      if (docSnap.exists()) {
        setProduct(docSnap.data());
      } else {
        console.log("Producto no encontrado");
      }
    };

    fetchProduct();
  }, [id]);

  const handleBack = () => {
    navigate("/products"); // Redirige a la página de productos
  };

  if (!product) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <div className="container mt-4">
        <h2>{product.nombre}</h2>
        <img
          src={product.imagen_url || "default_image_url.jpg"}
          alt={product.nombre}
          className="img-fluid"
          style={{ maxWidth: "100%", height: "auto", objectFit: "cover" }}
        />
        <div className="col-md-6 mt-2">
          <p>Descripción: {product.descripcion}</p>
          <p>Precio: ${product.precio}</p>
          <p>Categoría: {product.categoria}</p>
          <p>
            Descuento: {product.descuento ? `${product.descuento}%` : "N/A"}
          </p>
          <p>Estado: {product.estado}</p>
        </div>
      {/* Botón de regresar */}
      <button className="btn btn-secondary mt-2" onClick={handleBack}>
        Regresar
      </button>
      </div>
    </div>
  );
};

export default DetailProduct;

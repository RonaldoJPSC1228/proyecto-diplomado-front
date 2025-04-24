import React, { useEffect, useState } from "react"; 
import { db, auth } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

const DetailProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserRole(docSnap.data().rol);
        }
      } else {
        setUserRole(null);
      }
    });

    const fetchProduct = async () => {
      const productRef = doc(db, "items", id);
      const docSnap = await getDoc(productRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const discount = parseFloat(data.descuento); // Aseguramos que el descuento sea un número
        const price = parseFloat(data.precio); // Aseguramos que el precio sea un número
        const discountedPrice = discount ? price - (price * discount / 100) : price; // Aplicamos el descuento si existe

        setProduct({ ...data, discountedPrice });
      } else {
        console.log("Producto no encontrado");
      }
    };

    fetchProduct();
    return () => unsubscribe(); // Limpiamos el suscriptor
  }, [id]);

  const handleBack = () => {
    navigate(userRole === "admin" ? "/products" : "/tienda");
  };

  if (!product) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <img
              src={product.imagen_url || "default_image_url.jpg"}
              alt={product.nombre}
              className="card-img-top"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
            <div className="card-body">
              <h2 className="card-title">{product.nombre}</h2>
              <p className="card-text">{product.descripcion}</p>

              {/* Mostrar precio con descuento si existe */}
              {product.descuento > 0 ? (
                <>
                  <p className="text-muted text-decoration-line-through mb-0">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                    }).format(Number(product.precio))}
                  </p>
                  <p className="fw-bold fs-5 text-danger mb-0">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                    }).format(
                      Number(product.precio) * (1 - product.descuento / 100)
                    )}
                  </p>
                </>
              ) : (
                <p className="fw-bold fs-5 text-dark mb-0">
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                  }).format(Number(product.precio))}
                </p>
              )}

              <p className="text-muted">Categoría: {product.categoria}</p>
              <p className="text-success">
                Descuento: {product.descuento ? `${product.descuento}%` : "N/A"}
              </p>

              {/* Solo mostrar el estado si el usuario es admin */}
              {userRole === "admin" && (
                <p className="text-warning">Estado: {product.estado}</p>
              )}

            </div>
          </div>
        </div>

        <div className="col-md-4">
          <button
            className="btn btn-secondary btn-lg w-100 mt-4"
            onClick={handleBack}
          >
            Regresar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;

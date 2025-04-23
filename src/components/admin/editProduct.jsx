import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import Swal from "sweetalert2";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    descuento: "",
    // estado: 0,
    imagen_url: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, "items", id);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          const productData = productSnap.data();
          setProduct((prev) => ({
            ...prev,
            ...productData,
            estado: productData.estado,
          }));
        } else {
          Swal.fire("Error", "Producto no encontrado", "error");
          navigate("/products");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Hubo un problema al cargar el producto", "error");
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: 
        name === "precio" || name === "descuento" || name === "estado" 
          ? Number(value) 
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productRef = doc(db, "items", id);
      await updateDoc(productRef, product);
      Swal.fire("Actualizado", "Producto actualizado correctamente", "success");
      navigate("/products");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo actualizar el producto", "error");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Editar Producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            name="nombre"
            className="form-control"
            value={product.nombre || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            name="descripcion"
            className="form-control"
            value={product.descripcion || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Precio</label>
          <input
            type="number"
            name="precio"
            className="form-control"
            value={product.precio || ""}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Categoría</label>
          <input
            type="text"
            name="categoria"
            className="form-control"
            value={product.categoria || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descuento (%)</label>
          <input
            type="number"
            name="descuento"
            className="form-control"
            value={product.descuento || ""}
            onChange={handleChange}
            min="0"
            max="100"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Imagen (URL)</label>
          <input
            type="text"
            name="imagen_url"
            className="form-control"
            value={product.imagen_url || ""}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Estado</label>
          <select
            name="estado"
            className="form-control"
            value={product.estado}
            onChange={handleChange}
          >
            <option value={0}>Inactivo</option>
            <option value={1}>Activo</option>
            <option value={2}>Eliminado</option>
          </select>
        </div>
        <button type="submit" className="btn btn-success me-2">
          Actualizar Producto
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/products")}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default EditProduct;

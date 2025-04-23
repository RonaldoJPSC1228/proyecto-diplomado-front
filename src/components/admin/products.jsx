import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Products = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      const itemsCollection = collection(db, "items");
      const itemsSnapshot = await getDocs(itemsCollection);
      const itemsList = itemsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(itemsList);
      setLoading(false);
    };

    fetchItems();
  }, []);

  const handleCreateProduct = () => {
    navigate("/products/create");
  };

  const handleViewDetails = (id) => {
    navigate(`/products/${id}`);
  };

  const handleDeleteProduct = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Este producto será marcado como eliminado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        const productRef = doc(db, "items", id);
        await updateDoc(productRef, { estado: 2 }); // Estado 2 = Eliminado

        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, estado: 2 } : item
          )
        );

        Swal.fire(
          "Eliminado",
          "El producto ha sido marcado como eliminado.",
          "success"
        );
      } catch (error) {
        console.error("Error al cambiar estado a eliminado:", error);
        Swal.fire(
          "Error",
          "Hubo un problema al eliminar el producto.",
          "error"
        );
      }
    }
  };

  const handleToggleFeatured = async (id, isFeatured) => {
    const productRef = doc(db, "items", id);
    try {
      await updateDoc(productRef, { destacado: !isFeatured });

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, destacado: !isFeatured } : item
        )
      );

      Swal.fire(
        isFeatured ? "Destacado quitado" : "Producto destacado",
        `El producto ha sido ${isFeatured ? "desmarcado como destacado" : "marcado como destacado"}`,
        "success"
      );
    } catch (error) {
      console.error("Error al actualizar el estado de destacado:", error);
      Swal.fire("Error", "Hubo un problema al actualizar el producto.", "error");
    }
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(Number(value));

  const itemsFiltrados = items.filter((item) =>
    item.nombre.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div>
      <p>Cargando productos...</p>
    </div>
  );

  return (
    <div className="container justify-content-center mt-4">
      <h2>Productos Disponibles</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary ms-3" onClick={handleCreateProduct}>
          Crear Producto <i className="fas fa-add"></i>
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>P. Desct</th>
            <th>Categoría</th>
            <th>Descuento</th>
            <th>Destacado</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {itemsFiltrados.map((item) => {
            const precioConDescuento = item.descuento
              ? item.precio - item.precio * (item.descuento / 100)
              : item.precio;

            return (
              <tr key={item.id}>
                <td>{item.nombre}</td>
                <td>{item.descripcion}</td>
                <td>{formatPrice(item.precio)}</td>
                <td>{formatPrice(precioConDescuento)}</td>
                <td>{item.categoria}</td>
                <td>{item.descuento ? `${item.descuento}%` : "N/A"}</td>
                <td>
                  <button
                    className="btn btn-link"
                    onClick={() => handleToggleFeatured(item.id, item.destacado)}
                  >
                    <i
                      className={`${
                        item.destacado ? "fas fa-heart" : "far fa-heart"
                      }`}
                      style={{ color: item.destacado ? "red" : "gray" }}
                    ></i>
                  </button>
                </td>
                <td>
                  {item.estado === 1
                    ? "Activo"
                    : item.estado === 0
                    ? "Inactivo"
                    : "Eliminado"}
                </td>
                <td className="d-flex gap-2">
                  <button
                    className="btn btn-info"
                    onClick={() => handleViewDetails(item.id)}
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => navigate(`/products/${item.id}/edit`)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteProduct(item.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Products;

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import Swal from 'sweetalert2';

const Products = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate(); // Usamos useNavigate para redirigir
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      const itemsCollection = collection(db, 'items');
      const itemsSnapshot = await getDocs(itemsCollection);
      const itemsList = itemsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(itemsList);
      setLoading(false); // Deja de cargar una vez que los datos están listos
    };

    fetchItems();
  }, []);

  const handleCreateProduct = () => {
    navigate('/products/create'); // Redirige a la vista de crear producto
  };

  const handleViewDetails = (id) => {
    navigate(`/products/${id}`); // Redirige al detalle del producto
  };

  const handleDeleteProduct = async (id) => {
    // Confirmar eliminación con SweetAlert
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este producto será eliminado permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        // Eliminar producto de Firestore
        const productDoc = doc(db, 'items', id);
        await deleteDoc(productDoc);

        // Actualizar el estado para eliminar el producto de la lista
        setItems(items.filter(item => item.id !== id));

        Swal.fire(
          'Eliminado',
          'El producto ha sido eliminado.',
          'success'
        );
      } catch (error) {
        Swal.fire(
          'Error',
          'Hubo un problema al eliminar el producto.',
          'error'
        );
      }
    }
  };

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div className="container justify-content-center mt-4">
      <h2>Productos Disponibles</h2>

      {/* Botón para redirigir a la vista de crear producto */}
      <button className="btn btn-primary mb-3" onClick={handleCreateProduct}>
      Crear Producto <i className="fas fa-add"></i>
      </button>

      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Descuento</th>
            <th>Estado</th>
            <th>Acciones</th> {/* Columna de acciones */}
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.nombre}</td>
              <td>{item.descripcion}</td>
              <td>{item.precio}</td>
              <td>{item.categoria}</td>
              <td>{item.descuento ? `${item.descuento}%` : 'N/A'}</td>
              <td>{item.estado === 1 ? 'Activo' : item.estado === 0 ? 'Inactivo' : 'Eliminado'}</td>
              <td>
                <button 
                  className="btn btn-info me-2"
                  onClick={() => handleViewDetails(item.id)} // Acción para ver detalles
                >
                  <i className="fas fa-eye"></i>
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleDeleteProduct(item.id)} // Acción para eliminar producto
                >
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;

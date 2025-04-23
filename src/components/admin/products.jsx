import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase'; 
import { collection, getDocs } from 'firebase/firestore';
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

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div className="container justify-content-center mt-4">
      <h2>Productos Disponibles</h2>

      {/* Botón para redirigir a la vista de crear producto */}
      <button className="btn btn-primary mb-3" onClick={handleCreateProduct}>
        Crear Producto
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
                  className="btn btn-info"
                  onClick={() => handleViewDetails(item.id)} // Acción para ver detalles
                >
                  Ver Detalles
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

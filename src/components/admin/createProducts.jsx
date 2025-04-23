import React, { useState } from 'react';
import { db } from '../../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [estado, setEstado] = useState(1); // Estado por defecto: 1 (activo)
  const [descuento, setDescuento] = useState('');
  const [imagenUrl, setImagenUrl] = useState(''); // URL de la imagen
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newProduct = {
        nombre,
        descripcion,
        precio,
        categoria,
        estado,
        descuento: descuento || 0, // Si no hay descuento, se guarda como 0
        imagen_url: imagenUrl, // Guardamos la URL de la imagen
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };

      // Agregar producto a la base de datos
      const productsRef = collection(db, 'items');
      await addDoc(productsRef, newProduct);

      navigate('/products'); // Redirige a la lista de productos
    } catch (error) {
      console.error('Error al crear producto:', error);
    }
  };

  const handleCancel = () => {
    navigate('/products'); // Redirige a la vista de productos
  };

  return (
    <div className="container justify-content-center mt-4">
      <h2>Crear Producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required // Campo obligatorio
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required // Campo obligatorio
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Precio</label>
          <input
            type="number"
            className="form-control"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required // Campo obligatorio
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Categoría</label>
          <input
            type="text"
            className="form-control"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required // Campo obligatorio
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descuento (%)</label>
          <input
            type="number"
            className="form-control"
            value={descuento}
            onChange={(e) => setDescuento(e.target.value)}
            required // Campo obligatorio
          />
        </div>
        <div className="mb-3">
          <label className="form-label">URL de la imagen</label>
          <input
            type="url"
            className="form-control"
            value={imagenUrl}
            onChange={(e) => setImagenUrl(e.target.value)}
            required // Campo obligatorio
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Estado</label>
          <select
            className="form-control"
            value={estado}
            onChange={(e) => setEstado(Number(e.target.value))} // Convertir a número (1, 0, 2)
            required // Campo obligatorio
          >
            <option value={1}>Activo</option>
            <option value={0}>Inactivo</option>
            <option value={2}>Eliminado</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Crear Producto
        </button>
        <button type="button" className="btn btn-secondary ms-3" onClick={handleCancel}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;

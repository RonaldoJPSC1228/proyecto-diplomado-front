import React, { useEffect, useState } from 'react';
import { db } from "../../firebase/firebase"; // Configuración de Firebase
import { collection, getDocs } from "firebase/firestore"; // Métodos de Firestore

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersCollection = collection(db, "orders");
        const ordersSnapshot = await getDocs(ordersCollection);
        const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersList);
      } catch (error) {
        console.error("Error al obtener las órdenes:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center">Compras Realizadas</h2>
      <div className="table-responsive mt-4">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">ID de la Orden</th>
              <th scope="col">Telefono</th>
              <th scope="col">Dirección</th>
              <th scope="col">Método de Pago</th>
              <th scope="col">Total</th>
              <th scope="col">Productos</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.telefono}</td>
                <td>{order.direccion}</td>
                <td>{order.metodoPago}</td>
                <td>
                  {/* Formatear el total al formato colombiano */}
                  {Number(order.total).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                </td>
                <td>
                  {/* Mostrar los productos con sus cantidades y precios */}
                  {order.products.map((product, index) => (
                    <div key={index}>
                      <strong>{product.nombre}</strong> - {product.quantity} x 
                      ${Number(product.precio).toFixed(2)} {/* Asegurarse de que el precio sea numérico */}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;

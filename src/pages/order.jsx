import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

function Order() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderDoc = doc(db, "orders", orderId);
        const orderSnapshot = await getDoc(orderDoc);
        if (orderSnapshot.exists()) {
          setOrder(orderSnapshot.data());
        } else {
          console.error("Orden no encontrada");
        }
      } catch (error) {
        console.error("Error al obtener la orden:", error);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) {
    return <div>Cargando...</div>;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(amount);
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm p-4 mb-4 bg-light">
        <h4 className="text-center">Detalles de Compra</h4>
        <p className="text-center text-muted">Tu pedido ha sido procesado con éxito. Nos pondremos en contacto contigo pronto para recibir más detalles.</p>

        <div className="row mt-4">
          <div className="col-md-6">
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <th scope="row">Dirección</th>
                  <td>{order.direccion}</td>
                </tr>
                <tr>
                  <th scope="row">Teléfono</th>
                  <td>{order.telefono}</td>
                </tr>
                <tr>
                  <th scope="row">Método de pago</th>
                  <td>{order.metodoPago}</td>
                </tr>
                <tr>
                  <th scope="row">Fecha de la orden</th>
                  <td>{new Date(order.createdAt.seconds * 1000).toLocaleDateString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="col-md-6">
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <th scope="row">Total</th>
                  <td className="text-end">{formatCurrency(order.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Precio Unitario</th>
              <th scope="col">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((item, index) => (
              <tr key={index}>
                <td>{item.nombre}</td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(Number(item.precio))}</td>
                <td>{formatCurrency(Number(item.precio) * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-center text-primary">Guarda este comprobante</p>
        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={() => window.location.href = '/'}>
            Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  );
}

export default Order;

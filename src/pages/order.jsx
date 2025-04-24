import React from 'react'

function Order() {
    return (
      <div className="container mt-5">
        <h2>¡Gracias por tu compra!</h2>
        <p>Tu pedido ha sido procesado con éxito. Nos pondremos en contacto contigo pronto para recibir mas detalles.</p>
        <button className="btn btn-primary" onClick={() => window.location.href = '/'}>
          Volver a la tienda
        </button>
      </div>
    );
  }
  
  export default Order;
  
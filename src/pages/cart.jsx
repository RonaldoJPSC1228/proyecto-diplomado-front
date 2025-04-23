import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    const newTotal = storedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(newTotal);
  }, []);

  const handleRemoveItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="container flex-grow">
        <h2 className="mt-5">Tu carrito está vacío</h2>
        <Link to="/" className="btn btn-primary mt-3">Volver a la tienda</Link>
      </div>
    );
  }

  return (
    <div className="container flex-grow">
      <h2 className="mt-5">Carrito de compras</h2>
      <div className="table-responsive">
        <table className="table mt-4">
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Precio</th>
              <th scope="col">Total</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleRemoveItem(item.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <h3>Total: ${total.toFixed(2)}</h3>
        <button className="btn btn-success" onClick={handleCheckout}>
          Proceder al pago
        </button>
      </div>
    </div>
  );
}

export default Cart;

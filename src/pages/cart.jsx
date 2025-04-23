import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    const newTotal = storedCart.reduce((acc, item) => {
      const precioConDescuento =
        item.descuento > 0
          ? Number(item.precio) * (1 - item.descuento / 100)
          : Number(item.precio);
      return acc + precioConDescuento * item.quantity; // Calcular total
    }, 0);
    setTotal(newTotal);
  }, []);

  const handleRemoveItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (id, newQuantity) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Recalcular el total después de actualizar la cantidad
    const newTotal = updatedCart.reduce((acc, item) => {
      const precioConDescuento =
        item.descuento > 0
          ? Number(item.precio) * (1 - item.descuento / 100)
          : Number(item.precio);
      return acc + precioConDescuento * item.quantity;
    }, 0);
    setTotal(newTotal);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="container bg-dark text-white rounded p-4"
          style={{ maxWidth: "320px" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <span className="badge bg-warning text-dark">0 items</span>
          </div>

          <div className="text-center d-flex flex-column align-items-center gap-4">
            <div
              className="bg-info bg-opacity-25 rounded-circle d-flex justify-content-center align-items-center"
              style={{ width: "60px", height: "60px" }}
            >
              <i className="fas fa-shopping-cart text-info fs-4"></i>
            </div>
            <h3 className="fs-5 fw-semibold mb-0">¡Tú carrito esta vacío!</h3>
            <Link to="/" className="btn btn-success">
              Ir a comprar
            </Link>
          </div>
        </div>
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
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => {
              // Calculamos el precio con descuento
              const precioConDescuento =
                item.descuento > 0
                  ? Number(item.precio) * (1 - item.descuento / 100)
                  : Number(item.precio);
              const totalItem = precioConDescuento * item.quantity;

              return (
                <tr key={item.id}>
                  <td>{item.nombre}</td>
                  <td style={{ width: "20%" }}>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value))
                      }
                      className="form-control form-control-sm"
                      style={{ maxWidth: "70px" }}
                    />
                  </td>
                  <td>
                    ${precioConDescuento.toFixed(2)}{" "}
                    {/* Precio con descuento */}
                  </td>
                  <td>${totalItem.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <i class="fas fa-times"></i>

                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <h3>Total: ${total.toFixed(2)}</h3>{" "}
        {/* Total con descuento ya calculado */}
        <button className="btn btn-success" onClick={handleCheckout}>
          Proceder al pago
        </button>
      </div>
    </div>
  );
}

export default Cart;

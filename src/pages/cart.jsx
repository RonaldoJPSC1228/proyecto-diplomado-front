import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
  }).format(amount);
};

function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0); // Nuevo estado para total de artículos
  const navigate = useNavigate();

  // Obtener el carrito del localStorage y recalcular total
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    // Calcular el total y total de productos
    const newTotal = storedCart.reduce((acc, item) => {
      const precioConDescuento =
        item.descuento > 0
          ? Number(item.precio) * (1 - item.descuento / 100)
          : Number(item.precio);
      return acc + precioConDescuento * item.quantity;
    }, 0);
    setTotal(newTotal);

    // Calcular el total de productos en el carrito
    const totalItems = storedCart.reduce((acc, item) => acc + item.quantity, 0);
    setTotalItems(totalItems);  // Asignamos el total de artículos
  }, []);

  // Función para manejar la eliminación de productos del carrito
  const handleRemoveItem = (id) => {
    Swal.fire({
      title: "¿Eliminar producto?",
      text: "¿Estás seguro de que deseas eliminar este producto del carrito?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCart = cart.filter((item) => item.id !== id);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));

        // Recalcular total
        const newTotal = updatedCart.reduce((acc, item) => {
          const precioConDescuento =
            item.descuento > 0
              ? Number(item.precio) * (1 - item.descuento / 100)
              : Number(item.precio);
          return acc + precioConDescuento * item.quantity;
        }, 0);
        setTotal(newTotal);

        // Recalcular total de artículos
        const totalItems = updatedCart.reduce((acc, item) => acc + item.quantity, 0);
        setTotalItems(totalItems);

        Swal.fire("Eliminado", "El producto fue eliminado del carrito.", "success");
      }
    });
  };

  // Función para proceder al pago (Checkout)
  const handleCheckout = () => {
    if (cart.length === 0) {
      Swal.fire("Carrito vacío", "Agrega productos al carrito antes de proceder", "warning");
    } else {
      navigate("/checkout");
    }
  };

  // Si el carrito está vacío
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
            <h3 className="fs-5 fw-semibold mb-0">¡Tú carrito está vacío!</h3>
            <Link to="/" className="btn btn-success">
              Ir a comprar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Renderizamos el carrito con productos
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
                  <td>{formatCurrency(precioConDescuento)}</td>
                  <td>{formatCurrency(totalItem)}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <h3>Total: {formatCurrency(total)}</h3>
        <button className="btn btn-success" onClick={handleCheckout}>
          Proceder al pago
        </button>
      </div>
    </div>
  );
}

export default Cart;

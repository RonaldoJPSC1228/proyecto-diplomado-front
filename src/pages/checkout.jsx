import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Checkout() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    direccion: "",
    telefono: "",
    metodoPago: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleConfirmPurchase = () => {
    if (!formData.direccion || !formData.telefono || !formData.metodoPago) {
      Swal.fire("Error", "Por favor, complete todos los campos.", "error");
      return;
    }

    setLoading(true);

    // Simulamos un proceso de pago exitoso con un timeout
    setTimeout(() => {
      // Borrar el carrito del localStorage
      localStorage.removeItem("cart");

      // Mostrar mensaje de éxito
      Swal.fire("Compra exitosa", "Gracias por tu compra", "success").then(() => {
        // Redirigir a la página de agradecimientos
        navigate("/order");
      });
    }, 2000);
  };

  return (
    <div className="container mt-5">
      <h2>Confirmar Compra</h2>

      <div className="mt-4">
        <div className="mb-3">
          <label htmlFor="direccion" className="form-label">
            Dirección
          </label>
          <input
            type="text"
            className="form-control"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="telefono" className="form-label">
            Teléfono
          </label>
          <input
            type="number"
            className="form-control"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="metodoPago" className="form-label">
            Método de pago
          </label>
          <select
            className="form-select"
            id="metodoPago"
            name="metodoPago"
            value={formData.metodoPago}
            onChange={handleInputChange}
          >
            <option value="">Seleccione un método de pago</option>
            <option value="tarjeta">Tarjeta de crédito/débito</option>
            <option value="paypal">PayPal</option>
            <option value="efectivo">Efectivo</option>
          </select>
        </div>

        <div className="mt-4">
          <button
            className="btn btn-success"
            onClick={handleConfirmPurchase}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Confirmar Compra"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

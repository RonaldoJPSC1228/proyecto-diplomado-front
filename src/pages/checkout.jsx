import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { db, auth } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

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

  const handleConfirmPurchase = async () => {
    if (!formData.direccion || !formData.telefono || !formData.metodoPago) {
      Swal.fire("Error", "Por favor, complete todos los campos.", "error");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Swal.fire("Error", "Debes iniciar sesión para realizar una compra.", "error");
      return;
    }

    // console.log("Usuario autenticado:", user.uid);

    setLoading(true);

    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      const total = cart.reduce((acc, item) => {
        const precio = Number(item.precio);
        const descuento = Number(item.descuento) || 0;
        const precioConDescuento = precio * (1 - descuento / 100);
        return acc + precioConDescuento * item.quantity;
      }, 0);

      const orderData = {
        uid: user.uid,
        products: cart,
        total: total,
        direccion: formData.direccion,
        telefono: formData.telefono,
        metodoPago: formData.metodoPago,
        createdAt: new Date(),
      };
      
      // Log para verificar si el uid está correcto
    //   console.log("Creando orden con UID:", user.uid);
      
      try {
        const orderRef = await addDoc(collection(db, "orders"), orderData);
        localStorage.removeItem("cart");
        Swal.fire("Compra exitosa", "Gracias por tu compra", "success").then(() => {
          navigate(`/order/${orderRef.id}`);
        });
      } catch (error) {
        console.error("Error al guardar la orden:", error);
        Swal.fire("Error", "Hubo un problema al procesar tu compra. Intenta nuevamente.", "error");
      }
      

      const orderRef = await addDoc(collection(db, "orders"), orderData);
      localStorage.removeItem("cart");

      Swal.fire("Compra exitosa", "Gracias por tu compra", "success").then(() => {
        navigate(`/order/${orderRef.id}`);
      });
    } catch (error) {
      console.error("Error al guardar la orden:", error);
      Swal.fire("Error", "Hubo un problema al procesar tu compra. Intenta nuevamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Confirmar Compra</h2>
      <div className="mt-4">
        <div className="mb-3">
          <label htmlFor="direccion" className="form-label">Dirección</label>
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
          <label htmlFor="telefono" className="form-label">Teléfono</label>
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
          <label htmlFor="metodoPago" className="form-label">Método de pago</label>
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

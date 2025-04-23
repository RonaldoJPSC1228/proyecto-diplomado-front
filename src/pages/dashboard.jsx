import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaBox, FaUsers, FaShoppingCart, FaChartBar, FaPlusCircle } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        if (data.rol !== "admin") {
          Swal.fire("Acceso denegado", "No tienes permisos", "warning");
          navigate("/login");
          return;
        }

        setUserData(data);
        fetchStats();
        fetchRecentActivities();
      } else {
        Swal.fire("Error", "Usuario no encontrado en la base de datos", "error");
        navigate("/inicio");
      }
    };

    const fetchStats = async () => {
      const productsRef = collection(db, "items");
      const usersRef = collection(db, "users");
      const ordersRef = collection(db, "orders");

      const productSnapshot = await getDocs(productsRef);
      const userSnapshot = await getDocs(usersRef);
      const orderSnapshot = await getDocs(ordersRef);

      setStats({
        products: productSnapshot.size,
        users: userSnapshot.size,
        orders: orderSnapshot.size,
      });
    };

    const fetchRecentActivities = async () => {
      // Simulación de actividades recientes
      setRecentActivities([
        { message: "Nuevo pedido de Juan", date: "2025-04-22" },
        { message: "Producto 'Camisa Roja' agregado", date: "2025-04-21" },
        { message: "Cliente registrado: María Pérez", date: "2025-04-20" },
      ]);
    };

    fetchUserData();
  }, [navigate]);

  // Gráfico de pedidos, productos y usuarios
  const chartData = {
    labels: ["Productos", "Usuarios", "Pedidos"],
    datasets: [
      {
        label: "Estadísticas",
        data: [stats.products, stats.users, stats.orders],
        fill: false,
        borderColor: "#FF5722",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="container mt-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard Administrador 🛒</h2>
      </div>

      {/* User Info Card */}
      {userData ? (
        <>
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="card p-4 shadow-sm">
                <h4>Bienvenido, {userData.nombre} 👑</h4>
                {/* <p>
                  <strong>Correo:</strong> {userData.email}
                </p> */}
                {/* <p>
                  <strong>Rol:</strong> {userData.rol}
                </p> */}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-md-6 mb-4">
              <div className="card p-4 shadow-sm text-center">
                <FaBox size={40} color="#4CAF50" />
                <h5>Productos</h5>
                <p>{stats.products}</p>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card p-4 shadow-sm text-center">
                <FaUsers size={40} color="#2196F3" />
                <h5>Clientes</h5>
                <p>{stats.users}</p>
              </div>
            </div>
            {/* <div className="col-md-4 mb-4">
              <div className="card p-4 shadow-sm text-center">
                <FaShoppingCart size={40} color="#FF5722" />
                <h5>Pedidos</h5>
                <p>{stats.orders}</p>
              </div>
            </div> */}
          </div>

          {/* Stats Chart */}
          {/* <div className="card p-4 shadow-sm mb-4">
            <h5 className="text-center">Estadísticas de Ventas</h5>
            <Line data={chartData} />
          </div> */}

          {/* Recent Activities Section */}
          {/* <div className="row">
            <div className="col-md-12">
              <div className="card p-4 shadow-sm">
                <h5>Actividades Recientes</h5>
                <ul className="list-group">
                  {recentActivities.map((activity, index) => (
                    <li key={index} className="list-group-item">
                      {activity.message} <small className="text-muted">({activity.date})</small>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div> */}
        </>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
}

export default Dashboard;

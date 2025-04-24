import React, { useEffect, useState } from 'react';
import { db } from "../../firebase/firebase"; // Configuración de Firebase
import { collection, getDocs } from "firebase/firestore"; // Métodos de Firestore

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users"); // Suponiendo que tus usuarios están en la colección 'users'
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center">Usuarios Registrados</h2>
      <div className="table-responsive mt-4">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">ID de Usuario</th>
              <th scope="col">Correo Electrónico</th>
              <th scope="col">Nombre</th>
              <th scope="col">Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              // Verificar si 'createdAt' existe antes de acceder a 'seconds'
              const creationDate = user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : "Fecha no disponible";
              return (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.nombre || "No disponible"}</td>
                  <td>{user.rol}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;

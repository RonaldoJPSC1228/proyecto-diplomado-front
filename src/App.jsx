import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

import Home from "./pages/home";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import AutoLogoutWrapper from "./components/auth/autoLogoutWrapper";

import AdminRoute from "./components/admin/adminRoute";
import Dashboard from "./pages/dashboard";
import Products from "./components/admin/products";
import CreateProduct from "./components/admin/createProducts";
import DetailProduct from "./components/admin/detailProduct";

import PrivateRoute from "./components/auth/privateRoute";
import Cart from "./pages/cart";

import NotFound from "./pages/notFound";
import EditProduct from "./components/admin/editProduct";

function App() {
  return (
    <Router>
      <AutoLogoutWrapper />

      <div className="d-flex flex-column min-vh-100">
        {/* Navbar siempre visible */}
        <Navbar />

        {/* El main ocupa el espacio restante y asegura que el footer esté abajo */}
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} /> {/* Muestra los productos destacados y normales */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route
              path="/dashboard"
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/products"
              element={
                <AdminRoute>
                  <Products /> {/* Admin puede gestionar productos */}
                </AdminRoute>
              }
            />
            <Route
              path="/products/create"
              element={
                <AdminRoute>
                  <CreateProduct /> {/* Admin puede crear productos */}
                </AdminRoute>
              }
            />
            <Route
              path="/products/:id"
              element={
                <AdminRoute>
                  <DetailProduct /> {/* Admin puede ver detalles del producto */}
                </AdminRoute>
              }
            />
            <Route
              path="/products/:id/edit"
              element={
                <AdminRoute>
                  <EditProduct /> {/* Admin puede editar productos */}
                </AdminRoute>
              }
            />

            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <Cart /> {/* Solo usuarios logueados pueden ver el carrito */}
                </PrivateRoute>
              }
            />

            <Route path="*" element={<NotFound />} /> {/* Ruta no encontrada */}
          </Routes>
        </div>

        {/* Footer siempre en la parte inferior */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
